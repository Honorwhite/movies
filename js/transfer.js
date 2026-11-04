// CSV export of both lists, and import from Letterboxd, IMDb or a CineTrack CSV
// These methods are attached to CineTrack in js/app.js.
class TransferMethods {
    // ---------- Export ----------
    exportCsv() {
        const tr = this.state.settings.language === 'tr';
        const header = ['list', 'type', 'tmdb_id', 'imdb_id', 'title', 'original_title', 'year', 'tmdb_rating', 'runtime_min', 'watched_episodes', 'watched_at'];
        const rows = [header];
        ['watched', 'watchlist'].forEach(listKey => {
            (this.state[listKey] || []).forEach(item => {
                const isTv = this.isTvItem(item);
                const date = item.release_date || item.first_air_date || '';
                rows.push([
                    listKey,
                    isTv ? 'tv' : 'movie',
                    item.id,
                    item.imdb_id || '',
                    item.title || item.name || '',
                    item.original_title || item.original_name || '',
                    date.slice(0, 4),
                    item.vote_average ? item.vote_average.toFixed(1) : '',
                    isTv ? this.episodeRuntime(item) : (item.runtime || ''),
                    isTv ? this.getWatchedEpisodeCount(item.id) : '',
                    item.watched_at ? new Date(item.watched_at).toISOString().slice(0, 10) : ''
                ]);
            });
        });

        const csv = rows.map(r => r.map(v => {
            const s = String(v ?? '');
            return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(',')).join('\r\n');

        // BOM so Excel opens Turkish characters correctly
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cinetrack-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.showToast(tr ? `${rows.length - 1} kayıt indirildi` : `${rows.length - 1} rows exported`, 'fa-file-csv');
    }

    // ---------- Import ----------
    startImport(target) {
        if (this._importing) return;
        this._importTarget = target;
        const input = document.getElementById('importFile');
        input.value = '';
        input.click();
    }

    parseCsv(text) {
        text = text.replace(/^﻿/, '');
        const rows = [];
        let row = [], field = '', inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (inQuotes) {
                if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
                else if (c === '"') inQuotes = false;
                else field += c;
            } else if (c === '"') inQuotes = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n' || c === '\r') {
                if (c === '\r' && text[i + 1] === '\n') i++;
                row.push(field); field = '';
                if (row.some(v => v !== '')) rows.push(row);
                row = [];
            } else field += c;
        }
        row.push(field);
        if (row.some(v => v !== '')) rows.push(row);
        if (!rows.length) return [];
        const header = rows[0].map(h => h.trim());
        return rows.slice(1).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] || '').trim()])));
    }

    // 'YYYY-MM-DD' -> timestamp at local noon (avoids landing on the previous day)
    parseImportDate(value) {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
        return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12).getTime() : null;
    }

    // Turns rows of any supported export into { title, year, imdbId, tmdbId, type, watchedAt }
    normalizeImportRows(rows) {
        if (!rows.length) return { format: null, entries: [] };
        const cols = Object.keys(rows[0]);
        const has = c => cols.includes(c);

        if (has('tmdb_id') && has('type')) {
            return {
                format: 'CineTrack',
                entries: rows.map(r => ({
                    title: r.title, year: r.year, tmdbId: Number(r.tmdb_id), type: r.type === 'tv' ? 'tv' : 'movie',
                    watchedAt: this.parseImportDate(r.watched_at), list: r.list
                }))
            };
        }
        if (has('Const')) {
            return {
                format: 'IMDb',
                entries: rows.filter(r => /^tt\d+$/.test(r.Const)).map(r => ({
                    title: r.Title || r['Original Title'], year: r.Year, imdbId: r.Const,
                    type: /tv|series|mini/i.test(r['Title Type'] || '') ? 'tv' : 'movie',
                    watchedAt: this.parseImportDate(r['Date Rated'] || r.Created || r['Date Added'])
                }))
            };
        }
        if (has('Name') && has('Year')) {
            return {
                format: 'Letterboxd',
                entries: rows.filter(r => r.Name).map(r => ({
                    title: r.Name, year: r.Year, type: 'movie',
                    watchedAt: this.parseImportDate(r['Watched Date'] || r.Date)
                }))
            };
        }
        return { format: null, entries: [] };
    }

    async resolveImportEntry(entry) {
        const key = CONFIG.TMDB_KEY;
        if (entry.tmdbId) return { id: entry.tmdbId, type: entry.type };
        if (entry.imdbId) {
            const res = await fetch(`https://api.themoviedb.org/3/find/${entry.imdbId}?api_key=${key}&external_source=imdb_id`);
            if (!res.ok) return null;
            const data = await res.json();
            if (data.movie_results && data.movie_results[0]) return { id: data.movie_results[0].id, type: 'movie' };
            if (data.tv_results && data.tv_results[0]) return { id: data.tv_results[0].id, type: 'tv' };
            return null;
        }
        const search = async (withYear) => {
            const yearParam = withYear && entry.year ? `&year=${encodeURIComponent(entry.year)}` : '';
            const res = await fetch(`https://api.themoviedb.org/3/search/${entry.type}?api_key=${key}&query=${encodeURIComponent(entry.title)}${yearParam}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.results && data.results[0] ? { id: data.results[0].id, type: entry.type } : null;
        };
        return (await search(true)) || (entry.year ? await search(false) : null);
    }

    async handleImportFile(file) {
        if (!file) return;
        const tr = this.state.settings.language === 'tr';
        const fallbackTarget = this._importTarget === 'watchlist' ? 'watchlist' : 'watched';

        let parsed;
        try {
            parsed = this.normalizeImportRows(this.parseCsv(await file.text()));
        } catch (e) {
            console.error('CSV read failed:', e);
            parsed = { format: null, entries: [] };
        }
        if (!parsed.format || !parsed.entries.length) {
            alert(tr
                ? 'Bu dosya tanınmadı. Letterboxd (watched.csv, watchlist.csv, diary.csv), IMDb (ratings / watchlist) veya CineTrack CSV dosyası seçin.'
                : 'File not recognised. Choose a Letterboxd (watched.csv, watchlist.csv, diary.csv), IMDb (ratings / watchlist) or CineTrack CSV file.');
            return;
        }

        this._importing = true;
        const result = { added: 0, skipped: 0, notFound: [] };
        const seen = new Set();
        let done = 0;
        const total = parsed.entries.length;
        const progress = () => this.showToast(
            tr ? `${parsed.format} içe aktarılıyor… ${done}/${total}` : `Importing from ${parsed.format}… ${done}/${total}`,
            'fa-spinner fa-spin'
        );
        progress();

        const work = async (entry) => {
            // CineTrack's own export says which list each row belongs to
            const target = (entry.list === 'watched' || entry.list === 'watchlist') ? entry.list : fallbackTarget;
            try {
                const ref = await this.resolveImportEntry(entry);
                if (!ref) { result.notFound.push(entry.title); return; }
                const dedupeKey = `${ref.type}_${ref.id}`;
                if (seen.has(dedupeKey) || this.isInList('watched', ref.id) || this.isInList('watchlist', ref.id)) {
                    result.skipped++;
                    return;
                }
                seen.add(dedupeKey);

                const res = await fetch(`https://api.themoviedb.org/3/${ref.type}/${ref.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                if (!res.ok) { result.notFound.push(entry.title); return; }
                const item = await res.json();
                item.media_type = ref.type;
                if (target === 'watched') {
                    // Undated rows stay out of the history chart instead of all landing on today
                    if (entry.watchedAt) item.watched_at = entry.watchedAt;
                    this.state.watched.push(item);
                    if (ref.type === 'tv') {
                        await this.markAllCurrentEpisodesWatched(ref.id, item, { dated: !!entry.watchedAt, at: entry.watchedAt, save: false });
                    }
                } else {
                    this.state.watchlist.push(item);
                }
                result.added++;
            } catch (e) {
                console.warn('Import failed for', entry.title, e);
                result.notFound.push(entry.title);
            } finally {
                done++;
                if (done % 5 === 0 || done === total) progress();
            }
        };

        // A few requests at a time keeps TMDB's rate limit happy
        const queue = [...parsed.entries];
        await Promise.all(Array.from({ length: 4 }, async () => {
            while (queue.length) await work(queue.shift());
        }));

        this._importing = false;
        this.saveWatchedEpisodes();
        this.saveMovieData();
        this.loadEpisodeRuntimes();
        this.renderStats();
        if (this.state.currentView === 'watched') this.renderUserList('watched');
        if (this.state.currentView === 'watchlist') this.renderUserList('watchlist');
        this.renderWatchlistSpotlightBanner();

        this.showToast(tr
            ? `${result.added} eklendi · ${result.skipped} zaten listede · ${result.notFound.length} bulunamadı`
            : `${result.added} added · ${result.skipped} already in lists · ${result.notFound.length} not found`, 'fa-file-import');

        if (result.notFound.length) {
            const names = result.notFound.slice(0, 15).join('\n• ');
            const more = result.notFound.length > 15 ? `\n… +${result.notFound.length - 15}` : '';
            alert((tr ? 'TMDB\'de bulunamayanlar:\n• ' : 'Not found on TMDB:\n• ') + names + more);
        }
    }
}
