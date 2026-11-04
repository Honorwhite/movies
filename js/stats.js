// Watch statistics
// These methods are attached to CineTrack in js/app.js.
class StatsMethods {
    renderStats() {
        this.renderDetailedStats('watched', 'watchedStats');
        this.renderDetailedStats('watchlist', 'watchlistStats');
    }

    renderDetailedStats(listKey, containerId) {
        const list = this.state[listKey];
        const isWatchlist = listKey === 'watchlist';
        const isWatched = listKey === 'watched';

        let stats = { movies: 0, tv: 0, episodes: 0, totalMinutes: 0 };

        (list || []).forEach(item => {
            const isTv = item.media_type === 'tv' || (!item.title && !!item.name) || (Array.isArray(item.seasons) || !!item.number_of_seasons);
            const isMovie = !isTv;
            if (isMovie) {
                stats.movies++;
                stats.totalMinutes += item.runtime || 0;
            } else {
                stats.tv++;
                const watchedCount = this.getWatchedEpisodeCount(item.id);
                const fallbackEps = item.number_of_episodes || (item.seasons ? item.seasons.reduce((acc, s) => acc + (s.season_number > 0 ? (s.episode_count || 0) : 0), 0) : 0);
                const runtime = (item.episode_run_time && item.episode_run_time[0]) || item.runtime || 45;

                if (isWatchlist) {
                    // Deduct marked watched episodes from watchlist total
                    const totalAvailable = fallbackEps > 0 ? fallbackEps : (watchedCount > 0 ? watchedCount : 0);
                    const remainingEps = Math.max(0, totalAvailable - watchedCount);
                    stats.episodes += remainingEps;
                    stats.totalMinutes += remainingEps * runtime;
                } else if (isWatched) {
                    // For completed watched list: use tracked episodes, otherwise fallbackEps
                    const epsCount = watchedCount > 0 ? watchedCount : (fallbackEps > 0 ? fallbackEps : 0);
                    stats.episodes += epsCount;
                    stats.totalMinutes += epsCount * runtime;

                    // If watchedCount was 0 (e.g. legacy marked TV show), trigger background batch marking
                    if (watchedCount === 0 && !this._legacyMarking?.[item.id]) {
                        if (!this._legacyMarking) this._legacyMarking = {};
                        this._legacyMarking[item.id] = true;
                        this.markAllCurrentEpisodesWatched(item.id, item).then(() => {
                            this.renderStats();
                        });
                    }
                }
            }
        });

        // If rendering 'watched' stats, ADD watched episodes from series currently in the watchlist
        if (isWatched) {
            (this.state.watchlist || []).forEach(item => {
                const isTv = item.media_type === 'tv' || (!item.title && !!item.name) || (Array.isArray(item.seasons) || !!item.number_of_seasons);
                if (isTv) {
                    const watchedCount = this.getWatchedEpisodeCount(item.id);
                    if (watchedCount > 0 && !this.isInList('watched', item.id)) {
                        const runtime = (item.episode_run_time && item.episode_run_time[0]) || item.runtime || 45;
                        stats.episodes += watchedCount;
                        stats.totalMinutes += watchedCount * runtime;
                        stats.tv++;
                    }
                }
            });
        }

        const lang = this.state.settings.language;
        const container = document.getElementById(containerId);
        if (container) {
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
                </div>
            `;
        }
    }

    formatMinutes(minutes) {
        if (minutes < 60) return `${minutes} dk`;
        const hours = Math.floor(minutes / 60);
        return `${hours} sa`;
    }
}
