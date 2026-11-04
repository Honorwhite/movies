// Sharing the watchlist with a link (?share=<id>). The shared copy lives in the
// shared_lists table (see supabase/share.sql) and is refreshed whenever the
// watchlist is saved, so the link always shows the current list.
// These methods are attached to CineTrack in js/app.js.
class ShareMethods {
    shareUrl(id) {
        return `${location.origin}${location.pathname}?share=${encodeURIComponent(id)}`;
    }

    newShareId() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        const bytes = crypto.getRandomValues(new Uint8Array(12));
        return Array.from(bytes, b => chars[b % chars.length]).join('');
    }

    // Only what the shared page needs: no watch dates, episode progress or settings
    sharedListContent() {
        return {
            username: this.state.user,
            updated_at: Date.now(),
            items: (this.state.watchlist || []).map(item => ({
                id: item.id,
                type: this.isTvItem(item) ? 'tv' : 'movie',
                title: item.title || item.name || '',
                poster: item.poster_path || '',
                year: (item.release_date || item.first_air_date || '').slice(0, 4),
                vote: item.vote_average ? Number(item.vote_average.toFixed(1)) : null
            }))
        };
    }

    async pushSharedList() {
        const shareId = this.state.settings.shareId;
        if (!shareId || !this.state.uid) return false;
        const { error } = await sb.from('shared_lists').upsert({
            id: shareId,
            owner: this.state.uid,
            content: this.sharedListContent(),
            updated_at: new Date().toISOString()
        });
        if (error) console.warn('Shared list update failed:', error);
        return !error;
    }

    // Called after every cloud save; waits for a quiet moment so rapid changes cause one write
    scheduleSharedListUpdate() {
        if (!this.state.settings.shareId) return;
        clearTimeout(this._shareTimer);
        this._shareTimer = setTimeout(() => this.pushSharedList(), 2000);
    }

    async shareWatchlist() {
        const tr = this.state.settings.language === 'tr';
        if (!this.state.settings.shareId) {
            this.state.settings.shareId = this.newShareId();
            const ok = await this.pushSharedList();
            if (!ok) {
                this.state.settings.shareId = null;
                alert(tr ? 'Paylaşım bağlantısı oluşturulamadı. Lütfen daha sonra tekrar deneyin.' : 'Could not create the share link. Please try again later.');
                return;
            }
            this.syncWithCloud();
            this.renderShareSettings();
        }

        const url = this.shareUrl(this.state.settings.shareId);
        const title = tr ? `${this.state.user} – İzleme Listesi` : `${this.state.user}'s Watchlist`;
        if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (e) {
                if (e.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            this.showToast(tr ? 'Paylaşım bağlantısı kopyalandı' : 'Share link copied', 'fa-link');
        } catch (e) {
            prompt(tr ? 'Paylaşım bağlantınız:' : 'Your share link:', url);
        }
    }

    async stopSharing() {
        const tr = this.state.settings.language === 'tr';
        const shareId = this.state.settings.shareId;
        if (!shareId) return;
        if (!confirm(tr ? 'Paylaşım bağlantısı kapatılsın mı? Bağlantıyı açan herkes artık listeyi göremez.' : 'Turn off the share link? Anyone with the link will no longer see your list.')) return;
        const { error } = await sb.from('shared_lists').delete().eq('id', shareId);
        if (error) {
            alert(tr ? 'Paylaşım kapatılamadı, lütfen tekrar deneyin.' : 'Could not turn off sharing, please try again.');
            return;
        }
        clearTimeout(this._shareTimer);
        this.state.settings.shareId = null;
        this.syncWithCloud();
        this.renderShareSettings();
        this.showToast(tr ? 'Paylaşım kapatıldı' : 'Sharing turned off', 'fa-link-slash');
    }

    renderShareSettings() {
        const tr = this.state.settings.language === 'tr';
        const active = !!this.state.settings.shareId;
        const desc = document.getElementById('shareDesc');
        const stop = document.getElementById('stopShareItem');
        if (desc) {
            desc.textContent = active
                ? (tr ? 'Paylaşım açık · bağlantıyı tekrar kopyala' : 'Sharing is on · copy the link again')
                : (tr ? 'İzlenecekler listen için bir bağlantı oluştur' : 'Create a link to your watchlist');
        }
        if (stop) stop.style.display = active ? '' : 'none';
    }

    // ---------- Visitor side ----------
    // Returns true when the page was opened with ?share=…; the normal app then does not start.
    async openSharedListFromUrl() {
        const shareId = new URLSearchParams(location.search).get('share');
        if (!shareId) return false;

        const tr = this.state.settings.language === 'tr';
        document.getElementById('authOverlay').style.display = 'none';
        document.body.classList.add('shared-mode');

        const page = document.createElement('div');
        page.id = 'sharedPage';
        page.className = 'shared-page';
        page.innerHTML = `<div class="shared-loading"><div class="loader-spinner"></div></div>`;
        document.body.appendChild(page);
        document.getElementById('appLoader').classList.add('hidden');

        const { data, error } = await sb.rpc('get_shared_list', { p_id: shareId });
        const appUrl = `${location.origin}${location.pathname}`;
        const cta = `<a class="shared-cta" href="${appUrl}"><i class="fas fa-play"></i> ${tr ? 'CineTrack\'te kendi listeni oluştur' : 'Make your own list on CineTrack'}</a>`;

        if (error || !data) {
            page.innerHTML = `
                <div class="shared-empty">
                    <i class="fas fa-link-slash"></i>
                    <h2>${tr ? 'Liste bulunamadı' : 'List not found'}</h2>
                    <p>${tr ? 'Bu bağlantı hatalı ya da paylaşım kapatılmış.' : 'This link is wrong or sharing was turned off.'}</p>
                    ${cta}
                </div>`;
            return true;
        }

        const items = data.items || [];
        document.title = tr ? `${data.username} – İzleme Listesi | CineTrack` : `${data.username}'s Watchlist | CineTrack`;
        page.innerHTML = `
            <header class="shared-header">
                <span class="brand-badge-icon"><i class="fas fa-play"></i></span>
                <div>
                    <h1>${tr ? `${this.escapeHtml(data.username)} adlı kişinin izleme listesi` : `${this.escapeHtml(data.username)}'s watchlist`}</h1>
                    <p>${items.length} ${tr ? 'yapım' : 'titles'} · ${tr ? 'güncellendi' : 'updated'} ${new Date(data.updated_at).toLocaleDateString(tr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </header>
            <div class="shared-grid">
                ${items.map(it => `
                    <a class="shared-card" href="https://www.themoviedb.org/${it.type === 'tv' ? 'tv' : 'movie'}/${Number(it.id)}" target="_blank" rel="noopener">
                        ${it.poster ? `<img src="${CONFIG.BASE_IMG}${this.escapeHtml(it.poster)}" alt="" loading="lazy">` : '<div class="shared-noimg"><i class="fas fa-film"></i></div>'}
                        <div class="shared-card-info">
                            <strong>${this.escapeHtml(it.title)}</strong>
                            <span>${this.escapeHtml(it.year)}${it.type === 'tv' ? (tr ? ' · Dizi' : ' · TV') : ''}${it.vote ? ` · <i class="fas fa-star"></i> ${Number(it.vote)}` : ''}</span>
                        </div>
                    </a>`).join('')}
            </div>
            ${items.length ? '' : `<p class="shared-empty-note">${tr ? 'Bu liste şu an boş.' : 'This list is empty.'}</p>`}
            <div class="shared-footer">${cta}</div>`;
        return true;
    }
}
