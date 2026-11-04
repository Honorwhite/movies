// New-episode reminders for the shows you follow.
// Runs when the app opens (at most every few hours). A static site cannot push
// notifications while it is closed, so browser notifications appear only while
// CineTrack is open in a tab.
// These methods are attached to CineTrack in js/app.js.
class RemindersMethods {
    reminderKey(name) {
        return `ct_${this.state.user}_${name}`;
    }

    readReminderStore(name, fallback) {
        try {
            return JSON.parse(localStorage.getItem(this.reminderKey(name))) ?? fallback;
        } catch (e) {
            return fallback;
        }
    }

    // Followed = in İzlediklerim, or in İzlenecekler with at least one watched episode; not finished airing
    followedShows() {
        const shows = [
            ...(this.state.watched || []),
            ...(this.state.watchlist || []).filter(i => this.getWatchedEpisodeCount(i.id) > 0)
        ].filter(i => this.isTvItem(i) && i.status !== 'Ended' && i.status !== 'Canceled');
        const unique = new Map();
        shows.forEach(s => unique.set(String(s.id), s));
        return [...unique.values()];
    }

    async checkNewEpisodes(force = false) {
        if (!this.state.user || this._checkingEpisodes) return;
        const CHECK_EVERY_MS = 6 * 3600 * 1000;
        const lastCheck = Number(localStorage.getItem(this.reminderKey('epCheckAt')) || 0);
        if (!force && Date.now() - lastCheck < CHECK_EVERY_MS) {
            this.renderNewEpisodes();
            return;
        }

        this._checkingEpisodes = true;
        const seen = this.readReminderStore('epSeen', {});
        const pending = this.readReminderStore('epNew', []);
        const fresh = [];
        const today = new Date().toISOString().slice(0, 10);

        try {
            const shows = this.followedShows();
            for (let i = 0; i < shows.length; i += 5) {
                await Promise.all(shows.slice(i, i + 5).map(async show => {
                    try {
                        const res = await fetch(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                        if (!res.ok) return;
                        const data = await res.json();
                        show.status = data.status;
                        show.last_episode_to_air = data.last_episode_to_air;
                        show.next_episode_to_air = data.next_episode_to_air;

                        const ep = data.last_episode_to_air;
                        if (!ep || !ep.air_date || ep.air_date > today) return;
                        const epKey = `${ep.season_number}_${ep.episode_number}`;
                        const id = String(show.id);

                        // First check for a show only records where it stands, so turning
                        // this on does not flood you with every episode you are behind on.
                        if (seen[id] === undefined || seen[id] === epKey) { seen[id] = epKey; return; }
                        seen[id] = epKey;
                        if (this.isEpisodeWatched(show.id, ep.season_number, ep.episode_number)) return;

                        fresh.push({
                            id: show.id,
                            name: data.name || show.name,
                            poster_path: data.poster_path || show.poster_path,
                            season: ep.season_number,
                            episode: ep.episode_number,
                            episodeName: ep.name || '',
                            air_date: ep.air_date
                        });
                    } catch (e) {
                        console.warn('Episode check failed for', show.id, e);
                    }
                }));
            }
        } finally {
            this._checkingEpisodes = false;
        }

        // Newest first; one entry per show
        const merged = [...fresh, ...pending.filter(p => !fresh.some(f => f.id === p.id))];
        localStorage.setItem(this.reminderKey('epSeen'), JSON.stringify(seen));
        localStorage.setItem(this.reminderKey('epNew'), JSON.stringify(merged));
        localStorage.setItem(this.reminderKey('epCheckAt'), String(Date.now()));

        this.renderNewEpisodes();
        if (fresh.length) this.notifyNewEpisodes(fresh);
    }

    notifyNewEpisodes(items) {
        const tr = this.state.settings.language === 'tr';
        const label = (it) => `${it.name} · S${it.season} B${it.episode}`;
        this.showToast(tr
            ? `${items.length === 1 ? label(items[0]) : items.length + ' dizide'} yeni bölüm çıktı`
            : `New episode${items.length === 1 ? ': ' + label(items[0]) : 's in ' + items.length + ' shows'}`, 'fa-bell');

        if (!this.state.settings.episodeNotifications || !('Notification' in window) || Notification.permission !== 'granted') return;
        items.slice(0, 5).forEach(it => {
            try {
                const n = new Notification(tr ? `Yeni bölüm: ${it.name}` : `New episode: ${it.name}`, {
                    body: `${tr ? 'Sezon' : 'Season'} ${it.season}, ${tr ? 'Bölüm' : 'Episode'} ${it.episode}${it.episodeName ? ' – ' + it.episodeName : ''}`,
                    icon: it.poster_path ? `${CONFIG.BASE_IMG}${it.poster_path}` : undefined,
                    tag: `ct-ep-${it.id}`
                });
                n.onclick = () => { window.focus(); this.openNewEpisode(it.id); n.close(); };
            } catch (e) {
                console.warn('Notification failed:', e);
            }
        });
    }

    renderNewEpisodes() {
        const box = document.getElementById('newEpisodesBanner');
        if (!box || !this.state.user) return;
        const tr = this.state.settings.language === 'tr';
        // Drop entries the user has since marked as watched
        const pending = this.readReminderStore('epNew', []).filter(p => !this.isEpisodeWatched(p.id, p.season, p.episode));
        localStorage.setItem(this.reminderKey('epNew'), JSON.stringify(pending));

        if (!pending.length) {
            box.style.display = 'none';
            box.innerHTML = '';
            return;
        }
        box.style.display = '';
        box.innerHTML = `
            <div class="new-ep-head">
                <h3><i class="fas fa-bell"></i> ${tr ? 'Yeni Bölümler' : 'New Episodes'}</h3>
                <button class="new-ep-clear" onclick="app.dismissNewEpisodes()">${tr ? 'Temizle' : 'Clear'}</button>
            </div>
            <div class="new-ep-list">
                ${pending.map(p => `
                    <div class="new-ep-item" onclick="app.openNewEpisode(${Number(p.id)})">
                        ${p.poster_path ? `<img src="${CONFIG.BASE_IMG}${p.poster_path}" alt="" loading="lazy">` : '<div class="new-ep-noimg"><i class="fas fa-tv"></i></div>'}
                        <div class="new-ep-info">
                            <strong>${this.escapeHtml(p.name)}</strong>
                            <span>${tr ? 'S' : 'S'}${p.season} · ${tr ? 'B' : 'E'}${p.episode}${p.episodeName ? ' – ' + this.escapeHtml(p.episodeName) : ''}</span>
                            <small>${new Date(p.air_date).toLocaleDateString(tr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long' })}</small>
                        </div>
                        <button class="new-ep-x" title="${tr ? 'Kaldır' : 'Dismiss'}" onclick="event.stopPropagation(); app.dismissNewEpisodes(${Number(p.id)})"><i class="fas fa-times"></i></button>
                    </div>`).join('')}
            </div>`;
    }

    dismissNewEpisodes(id = null) {
        const pending = this.readReminderStore('epNew', []);
        const rest = id === null ? [] : pending.filter(p => p.id !== id);
        localStorage.setItem(this.reminderKey('epNew'), JSON.stringify(rest));
        this.renderNewEpisodes();
    }

    openNewEpisode(id) {
        this.dismissNewEpisodes(id);
        this.playMovie(id, 'tv');
    }

    async toggleEpisodeNotifications(enabled) {
        const tr = this.state.settings.language === 'tr';
        const toggle = document.getElementById('episodeNotifToggle');
        if (enabled) {
            if (!('Notification' in window)) {
                alert(tr ? 'Bu tarayıcı bildirimleri desteklemiyor.' : 'This browser does not support notifications.');
                enabled = false;
            } else if (Notification.permission !== 'granted') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    alert(tr
                        ? 'Bildirim izni verilmedi. Tarayıcı ayarlarından bu site için bildirimlere izin verebilirsiniz. Yeni bölümler yine de Keşfet sayfasında görünür.'
                        : 'Notification permission was not granted. You can allow it in your browser settings. New episodes still show on the Discover page.');
                    enabled = false;
                }
            }
        }
        if (toggle) toggle.checked = enabled;
        this.state.settings.episodeNotifications = enabled;
        localStorage.setItem('ct_episode_notifications', enabled);
        this.syncWithCloud();
        if (enabled) this.checkNewEpisodes(true);
    }
}
