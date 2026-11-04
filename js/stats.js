// Watch statistics: totals on the list pages and the insights panel (chart, top genres)
// These methods are attached to CineTrack in js/app.js.
class StatsMethods {
    renderStats() {
        this.renderDetailedStats('watched', 'watchedStats');
        this.renderDetailedStats('watchlist', 'watchlistStats');
        this.renderDetailedStats('watched', 'statsSummary');
        this.renderInsights();
    }

    isTvItem(item) {
        return item.media_type === 'tv' || (!item.title && !!item.name) || (Array.isArray(item.seasons) || !!item.number_of_seasons);
    }

    // Minutes per episode. TMDB often leaves episode_run_time empty, so fall back
    // to the length of the latest/next episode before using a 45 minute estimate.
    episodeRuntime(item) {
        if (item.episode_runtimes) {
            const known = Object.values(item.episode_runtimes).flat().filter(n => n > 0);
            if (known.length) return Math.round(known.reduce((a, b) => a + b, 0) / known.length);
        }
        const runtimes = (item.episode_run_time || []).filter(n => n > 0);
        if (runtimes.length) return Math.round(runtimes.reduce((a, b) => a + b, 0) / runtimes.length);
        return (item.last_episode_to_air && item.last_episode_to_air.runtime)
            || (item.next_episode_to_air && item.next_episode_to_air.runtime)
            || 45;
    }

    // Length of one episode ('S_E' key): the real runtime when loaded, else the average
    episodeMinutes(item, key) {
        const [s, e] = key.split('_').map(Number);
        const rt = item.episode_runtimes && item.episode_runtimes[s] && item.episode_runtimes[s][e - 1];
        return rt || this.episodeRuntime(item);
    }

    watchedEpisodeMinutes(item) {
        const record = this.state.watchedEpisodes && this.state.watchedEpisodes[item.id];
        if (!record || !Array.isArray(record.episodes)) return 0;
        return record.episodes.reduce((sum, key) => sum + this.episodeMinutes(item, key), 0);
    }

    allEpisodeMinutes(item, fallbackEps) {
        if (item.episode_runtimes) {
            const avg = this.episodeRuntime(item);
            return Object.values(item.episode_runtimes).flat().reduce((sum, rt) => sum + (rt || avg), 0);
        }
        return fallbackEps * this.episodeRuntime(item);
    }

    // Fetches every episode's runtime once per show (all seasons in one TMDB request,
    // 20 seasons per request). Shows still airing are refreshed weekly.
    async loadEpisodeRuntimes() {
        if (this._loadingRuntimes || !this.state.user) return;
        this._loadingRuntimes = true;
        const WEEK = 7 * 86400000;
        const now = Date.now();
        const unique = new Map();
        [...(this.state.watched || []), ...(this.state.watchlist || [])].forEach(i => {
            if (this.isTvItem(i)) unique.set(String(i.id), i);
        });
        const todo = [...unique.values()].filter(i => !i.episode_runtimes
            || (i.status !== 'Ended' && i.status !== 'Canceled' && now - (i._runtimesAt || 0) > WEEK));

        let changed = false;
        try {
            for (let n = 0; n < todo.length; n += 4) {
                await Promise.all(todo.slice(n, n + 4).map(async item => {
                    try {
                        let seasons = (item.seasons || []).map(s => s.season_number).filter(s => s > 0);
                        if (!seasons.length && item.number_of_seasons) {
                            seasons = Array.from({ length: item.number_of_seasons }, (_, k) => k + 1);
                        }
                        if (!seasons.length) return;
                        const map = {};
                        for (let c = 0; c < seasons.length; c += 20) {
                            const append = seasons.slice(c, c + 20).map(s => `season/${s}`).join(',');
                            const res = await fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US&append_to_response=${append}`);
                            if (!res.ok) return;
                            const data = await res.json();
                            seasons.slice(c, c + 20).forEach(s => {
                                const season = data[`season/${s}`];
                                if (season && Array.isArray(season.episodes)) {
                                    const list = [];
                                    season.episodes.forEach(ep => { list[ep.episode_number - 1] = ep.runtime || null; });
                                    map[s] = Array.from(list, v => v ?? null);
                                }
                            });
                        }
                        if (Object.keys(map).length) {
                            item.episode_runtimes = map;
                            item._runtimesAt = now;
                            changed = true;
                        }
                    } catch (e) {
                        console.warn('Episode runtimes failed for', item.id, e);
                    }
                }));
            }
        } finally {
            this._loadingRuntimes = false;
        }
        if (changed) {
            this.saveMovieData();
            this.renderStats();
        }
    }

    renderDetailedStats(listKey, containerId) {
        const list = this.state[listKey];
        const isWatchlist = listKey === 'watchlist';
        const isWatched = listKey === 'watched';

        let stats = { movies: 0, tv: 0, episodes: 0, totalMinutes: 0, missingRuntime: 0 };

        (list || []).forEach(item => {
            const isTv = this.isTvItem(item);
            const isMovie = !isTv;
            if (isMovie) {
                stats.movies++;
                if (item.runtime) stats.totalMinutes += item.runtime;
                else stats.missingRuntime++;
            } else {
                stats.tv++;
                const watchedCount = this.getWatchedEpisodeCount(item.id);
                const fallbackEps = item.number_of_episodes || (item.seasons ? item.seasons.reduce((acc, s) => acc + (s.season_number > 0 ? (s.episode_count || 0) : 0), 0) : 0);
                const runtime = this.episodeRuntime(item);

                if (isWatchlist) {
                    // Deduct marked watched episodes from watchlist total
                    const totalAvailable = fallbackEps > 0 ? fallbackEps : (watchedCount > 0 ? watchedCount : 0);
                    if (totalAvailable === 0) stats.missingRuntime++;
                    const remainingEps = Math.max(0, totalAvailable - watchedCount);
                    stats.episodes += remainingEps;
                    stats.totalMinutes += item.episode_runtimes
                        ? Math.max(0, this.allEpisodeMinutes(item, totalAvailable) - this.watchedEpisodeMinutes(item))
                        : remainingEps * runtime;
                } else if (isWatched) {
                    // For completed watched list: use tracked episodes, otherwise fallbackEps
                    const epsCount = watchedCount > 0 ? watchedCount : (fallbackEps > 0 ? fallbackEps : 0);
                    stats.episodes += epsCount;
                    stats.totalMinutes += watchedCount > 0 ? this.watchedEpisodeMinutes(item) : this.allEpisodeMinutes(item, epsCount);

                    // If watchedCount was 0 (e.g. legacy marked TV show), trigger background batch marking.
                    // The real watch date is unknown, so these episodes stay undated in the chart.
                    if (watchedCount === 0 && !this._legacyMarking?.[item.id]) {
                        if (!this._legacyMarking) this._legacyMarking = {};
                        this._legacyMarking[item.id] = true;
                        this.markAllCurrentEpisodesWatched(item.id, item, { dated: false }).then(() => {
                            this.renderStats();
                        });
                    }
                }
            }
        });

        // If rendering 'watched' stats, ADD watched episodes from series currently in the watchlist
        if (isWatched) {
            (this.state.watchlist || []).forEach(item => {
                if (this.isTvItem(item)) {
                    const watchedCount = this.getWatchedEpisodeCount(item.id);
                    if (watchedCount > 0 && !this.isInList('watched', item.id)) {
                        stats.episodes += watchedCount;
                        stats.totalMinutes += this.watchedEpisodeMinutes(item);
                        stats.tv++;
                    }
                }
            });
        }

        const lang = this.state.settings.language;
        const container = document.getElementById(containerId);
        if (container) {
            const missingNote = stats.missingRuntime > 0
                ? `<div class="stat-sub">${lang === 'tr' ? `${stats.missingRuntime} yapımın süresi bilinmiyor` : `${stats.missingRuntime} without runtime`}</div>`
                : '';
            container.innerHTML = `
                <div class="stat-item">
                    <div class="stat-main">
                        <span class="stat-value">${stats.movies}</span>
                        <span class="stat-label">${lang === 'tr' ? 'Film' : 'Movies'}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-main">
                        <span class="stat-value">${stats.tv}</span>
                        <span class="stat-label">${lang === 'tr' ? 'Dizi' : 'Shows'}</span>
                    </div>
                    <div class="stat-sub">${stats.episodes} ${lang === 'tr' ? 'Bölüm' : 'Episodes'}</div>
                </div>
                <div class="stat-item primary">
                    <div class="stat-main">
                        <span class="stat-value">${this.formatMinutes(stats.totalMinutes)}</span>
                        <span class="stat-label">${lang === 'tr' ? 'Toplam Süre' : 'Total Time'}</span>
                    </div>
                    ${missingNote}
                </div>
            `;
        }
    }

    formatMinutes(minutes) {
        const tr = this.state.settings.language === 'tr';
        const m = Math.round(minutes || 0);
        if (m < 60) return `${m} ${tr ? 'dk' : 'min'}`;
        const hours = Math.floor(m / 60);
        const rest = m % 60;
        // Beyond 100 hours the minutes are noise
        if (hours >= 100) return `${hours.toLocaleString(tr ? 'tr-TR' : 'en-US')} ${tr ? 'sa' : 'h'}`;
        return rest ? `${hours} ${tr ? 'sa' : 'h'} ${rest} ${tr ? 'dk' : 'min'}` : `${hours} ${tr ? 'sa' : 'h'}`;
    }

    // --- Insights (İstatistikler tab) ---

    // Every watched movie and episode with its watch date and length.
    collectWatchEvents() {
        const events = [];
        let undated = 0;

        (this.state.watched || []).forEach(item => {
            if (this.isTvItem(item)) return;
            if (item.watched_at) events.push({ ts: item.watched_at, minutes: item.runtime || 0 });
            else undated++;
        });

        const allItems = [...(this.state.watched || []), ...(this.state.watchlist || [])];
        Object.entries(this.state.watchedEpisodes || {}).forEach(([showId, record]) => {
            if (!record || !Array.isArray(record.episodes)) return;
            const show = allItems.find(i => String(i.id) === String(showId));
            if (!show) return;
            record.episodes.forEach(ep => {
                const ts = (record.times && record.times[ep]) || record.datedAt || null;
                if (ts) events.push({ ts, minutes: this.episodeMinutes(show, ep) });
                else undated++;
            });
        });

        return { events, undated };
    }

    setInsightsMode(mode) {
        this.state.insightsMode = mode;
        this.renderInsights();
    }

    async loadTurkishGenreNames() {
        if (this.state.genresTr || this._loadingGenresTr) return;
        this._loadingGenresTr = true;
        try {
            const lists = await Promise.all(['movie', 'tv'].map(t =>
                fetch(`https://api.themoviedb.org/3/genre/${t}/list?api_key=${CONFIG.TMDB_KEY}&language=tr-TR`).then(r => r.json())
            ));
            const map = {};
            lists.forEach(l => (l.genres || []).forEach(g => { map[g.id] = g.name; }));
            this.state.genresTr = map;
            this.renderInsights();
        } catch (e) {
            console.warn('Turkish genre names could not be loaded:', e);
        } finally {
            this._loadingGenresTr = false;
        }
    }

    genreName(id, fallback) {
        if (this.state.settings.language === 'tr' && this.state.genresTr && this.state.genresTr[id]) {
            return this.state.genresTr[id];
        }
        return this.state.genres[id] || fallback || '';
    }

    renderInsights() {
        const container = document.getElementById('statsInsights');
        if (!container) return;
        const tr = this.state.settings.language === 'tr';
        const mode = this.state.insightsMode || 'month';
        if (tr && !this.state.genresTr) this.loadTurkishGenreNames();

        // ---- Chart buckets ----
        const { events, undated } = this.collectWatchEvents();
        const now = new Date();
        const buckets = [];
        if (mode === 'month') {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                buckets.push({
                    key: `${d.getFullYear()}-${d.getMonth()}`,
                    label: d.toLocaleDateString(tr ? 'tr-TR' : 'en-US', { month: 'short' }),
                    title: d.toLocaleDateString(tr ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' }),
                    minutes: 0
                });
            }
        } else {
            const years = events.map(e => new Date(e.ts).getFullYear());
            const first = years.length ? Math.min(...years) : now.getFullYear();
            for (let y = Math.max(first, now.getFullYear() - 9); y <= now.getFullYear(); y++) {
                buckets.push({ key: String(y), label: String(y), title: String(y), minutes: 0 });
            }
        }
        const byKey = Object.fromEntries(buckets.map(b => [b.key, b]));
        events.forEach(e => {
            const d = new Date(e.ts);
            const key = mode === 'month' ? `${d.getFullYear()}-${d.getMonth()}` : String(d.getFullYear());
            if (byKey[key]) byKey[key].minutes += e.minutes;
        });
        const maxMinutes = Math.max(1, ...buckets.map(b => b.minutes));
        const periodTotal = buckets.reduce((a, b) => a + b.minutes, 0);

        const barsHtml = buckets.map(b => {
            const pct = Math.round((b.minutes / maxMinutes) * 100);
            const value = b.minutes ? this.formatMinutes(b.minutes) : '';
            return `
                <div class="ins-bar-col" title="${b.title}: ${b.minutes ? value : (tr ? 'kayıt yok' : 'nothing')}">
                    <span class="ins-bar-value">${value}</span>
                    <div class="ins-bar-track"><div class="ins-bar" style="height:${b.minutes ? Math.max(pct, 3) : 0}%"></div></div>
                    <span class="ins-bar-label">${b.label}</span>
                </div>`;
        }).join('');

        const undatedNote = undated > 0
            ? `<p class="ins-note"><i class="fas fa-circle-info"></i> ${tr
                ? `${undated} film/bölüm grafikte yok: izleme tarihi bu özellik eklenmeden önce kaydedilmiyordu.`
                : `${undated} movies/episodes are not in the chart: watch dates were not recorded before this feature.`}</p>`
            : '';

        // ---- Top genres ----
        const counts = {};
        const items = [
            ...(this.state.watched || []),
            ...(this.state.watchlist || []).filter(i => this.isTvItem(i) && this.getWatchedEpisodeCount(i.id) > 0)
        ];
        items.forEach(item => {
            const ids = (item.genres && item.genres.length)
                ? item.genres.map(g => ({ id: g.id, name: g.name }))
                : (item.genre_ids || []).map(id => ({ id, name: '' }));
            ids.forEach(g => {
                if (!counts[g.id]) counts[g.id] = { id: g.id, name: g.name, count: 0 };
                counts[g.id].count++;
            });
        });
        const top = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 6);
        const topMax = top.length ? top[0].count : 1;
        const genresHtml = top.length
            ? top.map(g => `
                <div class="ins-genre-row">
                    <span class="ins-genre-name">${this.escapeHtml(this.genreName(g.id, g.name))}</span>
                    <div class="ins-genre-track"><div class="ins-genre-bar" style="width:${Math.round((g.count / topMax) * 100)}%"></div></div>
                    <span class="ins-genre-count">${g.count}</span>
                </div>`).join('')
            : `<p class="ins-note">${tr ? 'Henüz izlenen yok.' : 'Nothing watched yet.'}</p>`;

        container.innerHTML = `
            <div class="ins-card ins-chart-card">
                <div class="ins-card-head">
                    <div>
                        <h3>${tr ? 'İzleme Geçmişi' : 'Watch History'}</h3>
                        <span class="ins-sub">${mode === 'month'
                            ? (tr ? 'Son 12 ay' : 'Last 12 months')
                            : (tr ? 'Yıllara göre' : 'By year')} · ${this.formatMinutes(periodTotal)}</span>
                    </div>
                    <div class="ins-toggle">
                        <button class="${mode === 'month' ? 'active' : ''}" onclick="app.setInsightsMode('month')">${tr ? 'Aylık' : 'Monthly'}</button>
                        <button class="${mode === 'year' ? 'active' : ''}" onclick="app.setInsightsMode('year')">${tr ? 'Yıllık' : 'Yearly'}</button>
                    </div>
                </div>
                <div class="ins-bars">${barsHtml}</div>
                ${undatedNote}
            </div>
            <div class="ins-card ins-genres-card">
                <div class="ins-card-head">
                    <div>
                        <h3>${tr ? 'En Çok İzlenen Türler' : 'Top Genres'}</h3>
                        <span class="ins-sub">${tr ? 'Yapım sayısına göre' : 'By number of titles'}</span>
                    </div>
                </div>
                ${genresHtml}
            </div>
        `;
    }
}
