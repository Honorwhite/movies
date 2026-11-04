// TV episode tracking
// These methods are attached to CineTrack in js/app.js.
class EpisodesMethods {
    isEpisodeWatched(showId, season, episode) {
        if (!this.state.watchedEpisodes) return false;
        const showRecord = this.state.watchedEpisodes[showId];
        if (!showRecord || !Array.isArray(showRecord.episodes)) return false;
        return showRecord.episodes.includes(`${season}_${episode}`);
    }

    getWatchedEpisodeCount(showId) {
        if (!this.state.watchedEpisodes) return 0;
        const showRecord = this.state.watchedEpisodes[showId];
        if (!showRecord || !Array.isArray(showRecord.episodes)) return 0;
        return showRecord.episodes.length;
    }

    computeLastWatchedEpisode(episodesArray) {
        if (!episodesArray || episodesArray.length === 0) return null;
        let maxSeason = 0;
        let maxEpisode = 0;
        for (const key of episodesArray) {
            const [s, e] = key.split('_').map(Number);
            if (s > maxSeason || (s === maxSeason && e > maxEpisode)) {
                maxSeason = s;
                maxEpisode = e;
            }
        }
        return maxSeason > 0 ? { season: maxSeason, episode: maxEpisode, timestamp: Date.now() } : null;
    }

    toggleEpisodeWatched(showId, season, episode, btnEl) {
        if (!this.state.watchedEpisodes) this.state.watchedEpisodes = {};
        if (!this.state.watchedEpisodes[showId]) {
            this.state.watchedEpisodes[showId] = { episodes: [], lastWatched: null };
        }

        const showRecord = this.state.watchedEpisodes[showId];
        if (!Array.isArray(showRecord.episodes)) showRecord.episodes = [];
        const epKey = `${season}_${episode}`;
        const idx = showRecord.episodes.indexOf(epKey);
        let isNowWatched = false;

        if (idx > -1) {
            // Uncheck episode
            showRecord.episodes.splice(idx, 1);
            isNowWatched = false;
            showRecord.lastWatched = this.computeLastWatchedEpisode(showRecord.episodes);
        } else {
            // Check episode as watched
            showRecord.episodes.push(epKey);
            isNowWatched = true;
            showRecord.lastWatched = { season: Number(season), episode: Number(episode), timestamp: Date.now() };
        }

        // Update UI of the row immediately
        if (btnEl) {
            const row = btnEl.closest('.ep-row');
            if (row) row.classList.toggle('is-watched', isNowWatched);
            btnEl.classList.toggle('watched', isNowWatched);
            const icon = btnEl.querySelector('i');
            if (icon) {
                icon.className = isNowWatched ? 'fas fa-check-circle' : 'fas fa-check';
            }
            const lang = this.state.settings.language;
            btnEl.title = isNowWatched
                ? (lang === 'tr' ? 'İzlendi (Geri al)' : 'Watched (Undo)')
                : (lang === 'tr' ? 'İzlendi olarak işaretle' : 'Mark as watched');

            const epBtn = row?.querySelector('.ep-btn');
            if (epBtn) {
                let tag = epBtn.querySelector('.ep-watched-tag');
                if (isNowWatched && !tag) {
                    tag = document.createElement('span');
                    tag.className = 'ep-watched-tag';
                    tag.innerHTML = '<i class="fas fa-check"></i>';
                    epBtn.appendChild(tag);
                } else if (!isNowWatched && tag) {
                    tag.remove();
                }
            }
        }

        this.saveWatchedEpisodes();
        this.renderStats();
    }

    saveWatchedEpisodes() {
        if (!this.state.user) return;
        localStorage.setItem(`ct_${this.state.user}_watchedEpisodes`, JSON.stringify(this.state.watchedEpisodes));
        this.syncWithCloud();
    }

    async markAllCurrentEpisodesWatched(showId, tvData = null) {
        let data = tvData;
        if (!data || !data.seasons || !Array.isArray(data.seasons) || !data.seasons.length) {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                if (res.ok) {
                    data = await res.json();
                }
            } catch (e) {
                console.error('Failed to fetch TV details for episode marking:', e);
            }
        }

        if (!data) return;

        const today = new Date().toISOString().split('T')[0];
        const validSeasons = (data.seasons || []).filter(s => s.season_number > 0);
        const watchedEps = [];

        let lastSeasonNum = 1;
        let lastEpNum = 1;

        if (data.last_episode_to_air) {
            lastSeasonNum = Number(data.last_episode_to_air.season_number);
            lastEpNum = Number(data.last_episode_to_air.episode_number);

            validSeasons.forEach(s => {
                const sNum = Number(s.season_number);
                const epCount = Number(s.episode_count) || 0;

                if (sNum < lastSeasonNum) {
                    // Bu sezonun tüm bölümleri çıkmıştır
                    for (let ep = 1; ep <= epCount; ep++) {
                        watchedEps.push(`${sNum}_${ep}`);
                    }
                } else if (sNum === lastSeasonNum) {
                    // Bu sezonda sadece çıkmış olan son bölüme kadar ekle
                    for (let ep = 1; ep <= Math.min(lastEpNum, epCount); ep++) {
                        watchedEps.push(`${sNum}_${ep}`);
                    }
                }
                // sNum > lastSeasonNum ise henüz çıkmamış bölümlerdir, eklenmez!
            });
        } else {
            // last_episode_to_air yoksa air_date kontrolü yap
            validSeasons.forEach(s => {
                const sNum = Number(s.season_number);
                const epCount = Number(s.episode_count) || 0;
                if (!s.air_date || s.air_date <= today || data.status === 'Ended' || data.status === 'Canceled') {
                    for (let ep = 1; ep <= epCount; ep++) {
                        watchedEps.push(`${sNum}_${ep}`);
                    }
                    lastSeasonNum = sNum;
                    lastEpNum = epCount;
                }
            });
        }

        if (!this.state.watchedEpisodes) this.state.watchedEpisodes = {};
        this.state.watchedEpisodes[showId] = {
            episodes: watchedEps,
            lastWatched: {
                season: lastSeasonNum,
                episode: lastEpNum,
                timestamp: Date.now()
            },
            markedAt: Date.now()
        };

        this.saveWatchedEpisodes();

        // Eğer izleme sayfasında bu dizi açıksa DOM'daki bölüm tiklerini hemen güncelle
        if (this.state.currentView === 'watch' && this.state.player.id === showId) {
            document.querySelectorAll('#episodeGrid .ep-row').forEach(row => {
                const checkBtn = row.querySelector('.ep-watched-check');
                const epBtn = row.querySelector('.ep-btn');
                const epNum = epBtn?.querySelector('.ep-num')?.textContent?.trim();
                const season = this.state.player.season;
                const isEpWatched = watchedEps.includes(`${season}_${epNum}`);

                row.classList.toggle('is-watched', isEpWatched);
                if (checkBtn) {
                    checkBtn.classList.toggle('watched', isEpWatched);
                    const icon = checkBtn.querySelector('i');
                    if (icon) icon.className = isEpWatched ? 'fas fa-check-circle' : 'fas fa-check';
                }
                if (epBtn) {
                    let tag = epBtn.querySelector('.ep-watched-tag');
                    if (isEpWatched && !tag) {
                        tag = document.createElement('span');
                        tag.className = 'ep-watched-tag';
                        tag.innerHTML = '<i class="fas fa-check"></i>';
                        epBtn.appendChild(tag);
                    } else if (!isEpWatched && tag) {
                        tag.remove();
                    }
                }
            });
        }
    }

    unmarkAllEpisodesWatched(showId) {
        if (!this.state.watchedEpisodes) return;
        if (this.state.watchedEpisodes[showId]) {
            delete this.state.watchedEpisodes[showId];
            this.saveWatchedEpisodes();
        }

        // Eğer izleme sayfasında bu dizi açıksa DOM'daki bölüm tiklerini kaldır
        if (this.state.currentView === 'watch' && this.state.player.id === showId) {
            document.querySelectorAll('#episodeGrid .ep-row').forEach(row => {
                row.classList.remove('is-watched');
                const checkBtn = row.querySelector('.ep-watched-check');
                if (checkBtn) {
                    checkBtn.classList.remove('watched');
                    const icon = checkBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-check';
                }
                const tag = row.querySelector('.ep-watched-tag');
                if (tag) tag.remove();
            });
        }
    }
}
