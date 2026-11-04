// Watch page: details, collections, seasons/episodes, player
// These methods are attached to CineTrack in js/app.js.
class PlayerMethods {
    async playMovie(id, type = 'movie', pushState = true) {
        const recent = this.state.recentlyPlayed.find(r => r.id === id);
        let startSeason = 1;
        let startEpisode = 1;

        if (type === 'tv' && recent) {
            startSeason = recent.season || 1;
            startEpisode = recent.episode || 1;
        }

        this.state.player = {
            id,
            type,
            season: startSeason,
            episode: startEpisode,
            source: this.state.settings.autoSource ? 'vidcore' : (localStorage.getItem('ct_default_source') || 'vidcore')
        };

        // Switch to watch view
        this.switchView('watch', pushState, { movieId: id, mediaType: type });

        // Show loading state in player
        const iframe = document.getElementById('moviePlayer');
        if (iframe) iframe.src = '';

        try {
            // Fetch detailed info with credits in user's UI language
            const apiLang = this.state.settings.language === 'tr' ? 'tr-TR' : 'en-US';
            const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${CONFIG.TMDB_KEY}&language=${apiLang}&append_to_response=credits`);
            const data = await res.json();

            // If Turkish overview is empty, fallback to English overview
            if (!data.overview && apiLang !== 'en-US') {
                try {
                    const enRes = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                    const enData = await enRes.json();
                    if (enData.overview) data.overview = enData.overview;
                } catch (e) { }
            }

            this.state.currentMovieData = data;

            // Populate Header Title & Meta
            const titleEl = document.getElementById('watchMovieTitle');
            if (titleEl) titleEl.textContent = data.original_title || data.original_name || data.title || data.name;

            const scoreHtml = data.vote_average > 0
                ? `<span><i class="fas fa-star" style="color:var(--star);"></i> ${data.vote_average.toFixed(1)}</span>`
                : '';
            const metaHtml = `
                <span><i class="fas fa-calendar"></i> ${(data.release_date || data.first_air_date || '').split('-')[0]}</span>
                <span><i class="fas fa-clock"></i> ${data.runtime ? data.runtime + ' min' : (data.episode_run_time ? data.episode_run_time[0] + ' min' : '')}</span>
                ${scoreHtml}
            `;
            const metaEl = document.getElementById('watchMovieMeta');
            if (metaEl) metaEl.innerHTML = metaHtml;

            // Render Extra Details, Cast List, and Bento Info
            this.renderWatchDetails(data, type);

            // Handle TV specific parts
            const tvArea = document.getElementById('tvSelectorArea');
            if (type === 'tv') {
                tvArea.style.display = 'flex';
                await this.fetchTvMeta(id);
            } else {
                tvArea.style.display = 'none';
            }

            // Handle Collection/Franchise
            const collectionArea = document.getElementById('collectionArea');
            if (type === 'movie' && data.belongs_to_collection) {
                await this.fetchCollection(data.belongs_to_collection.id);
            } else {
                collectionArea.style.display = 'none';
            }

            // Set source chip active
            document.querySelectorAll('.source-chip').forEach(chip => {
                const sourceAttr = chip.getAttribute('onclick');
                if (sourceAttr) {
                    chip.classList.toggle('active', sourceAttr.includes(`'${this.state.player.source}'`));
                }
            });

            this.updateWatchActionsUI();
            this.updatePlayerSrc();
        } catch (e) {
            console.error('Play error:', e);
        }
    }

    async fetchCollection(collectionId) {
        const collectionArea = document.getElementById('collectionArea');
        const collectionGrid = document.getElementById('collectionGrid');
        const collectionTitle = document.getElementById('collectionTitle');

        try {
            const res = await fetch(`https://api.themoviedb.org/3/collection/${collectionId}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();

            if (!data.parts || data.parts.length === 0) {
                collectionArea.style.display = 'none';
                return;
            }

            collectionArea.style.display = 'flex';
            const lang = this.state.settings.language;
            const countText = `${data.parts.length} ${lang === 'tr' ? 'Film' : 'Movies'}`;
            collectionTitle.innerHTML = `<span style="display:flex;align-items:center;gap:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><i class="fas fa-layer-group"></i> <span>${data.name}</span></span><span class="collection-count-badge">${countText}</span>`;

            // Sort by release date
            data.parts.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));

            this.renderCollectionGrid(data.parts);
        } catch (e) {
            console.error('Collection fetch error:', e);
            collectionArea.style.display = 'none';
        }
    }

    renderCollectionGrid(movies) {
        const grid = document.getElementById('collectionGrid');
        if (!grid) return;

        const lang = this.state.settings.language;
        const tr_watched = lang === 'tr' ? 'İzledim' : 'Watched';
        const tr_watchlist = lang === 'tr' ? 'Sırada' : 'Watchlist';

        grid.innerHTML = movies.map(movie => {
            const isWatched = this.isInList('watched', movie.id);
            const isWatchlist = this.isInList('watchlist', movie.id);
            const isCurrent = movie.id === this.state.player.id;

            return `
                <div class="col-movie-card ${isCurrent ? 'current' : ''}" onclick="app.playMovie(${movie.id}, 'movie')">
                    <img src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.original_title || movie.title}" loading="lazy">
                    <div class="col-movie-info">
                        <div class="col-movie-title">${movie.original_title || movie.title}</div>
                        <div class="col-movie-year">${(movie.release_date || '').split('-')[0]}</div>
                        <div class="col-movie-actions">
                            <button class="col-action-btn ${isWatched ? 'active' : ''}" 
                                onclick="event.stopPropagation(); app.toggleList('watched', ${movie.id}, 'movie')" title="${tr_watched}">
                                <i class="fas fa-check"></i> <span>${tr_watched}</span>
                            </button>
                            <button class="col-action-btn ${isWatchlist ? 'active' : ''}" 
                                onclick="event.stopPropagation(); app.toggleList('watchlist', ${movie.id}, 'movie')" title="${tr_watchlist}">
                                <i class="fas fa-bookmark"></i> <span>${tr_watchlist}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderWatchDetails(data, type) {
        const container = document.getElementById('watchDetails');
        if (!container) return;

        const lang = this.state.settings.language;
        const isTr = lang === 'tr';
        const isTv = type === 'tv';

        // 1. Overview text
        const overview = data.overview || (isTr ? 'Bu yapım için henüz bir özet veya açıklama bulunmuyor.' : 'No overview available for this title.');

        // 2. Credits: Cast & Directors/Creators
        const credits = data.credits || {};
        const castList = credits.cast || [];
        const crewList = credits.crew || [];

        let directorOrCreator = '';
        if (isTv) {
            const creators = (data.created_by || []).map(c => c.name).join(', ');
            directorOrCreator = creators || (crewList.find(c => c.job === 'Executive Producer')?.name || '—');
        } else {
            const directors = crewList.filter(c => c.job === 'Director').map(c => c.name).join(', ');
            directorOrCreator = directors || '—';
        }

        // 3. Score
        const score = (typeof data.vote_average === 'number' && data.vote_average > 0)
            ? data.vote_average.toFixed(1)
            : '—';

        // 4. Duration
        let duration = '—';
        if (data.runtime) {
            const h = Math.floor(data.runtime / 60);
            const m = data.runtime % 60;
            duration = h > 0 ? `${h}s ${m}dk` : `${m} dk`;
        } else if (data.episode_run_time && data.episode_run_time.length > 0) {
            duration = `~${data.episode_run_time[0]} ${isTr ? 'dk / bölüm' : 'min / ep'}`;
        }

        // 5. Release Date
        const releaseDate = data.release_date || data.first_air_date || '';
        const year = releaseDate ? releaseDate.split('-')[0] : '—';

        // 6. Genres
        const genresHtml = (data.genres || [])
            .map(g => `<span class="detail-genre-chip">${g.name}</span>`)
            .join('');

        // 7. Cast Cards (up to 18 actors)
        const castHtml = castList.slice(0, 18).map(c => {
            const avatarHtml = c.profile_path
                ? `<img src="${CONFIG.BASE_IMG + c.profile_path}" alt="${c.name}" loading="lazy">`
                : `<div class="cast-avatar-fallback"><i class="fas fa-user"></i></div>`;
            return `
                <div class="cast-card">
                    <div class="cast-avatar">
                        ${avatarHtml}
                    </div>
                    <div class="cast-info">
                        <div class="cast-name" title="${c.name}">${c.name}</div>
                        <div class="cast-character" title="${c.character || ''}">${c.character || ''}</div>
                    </div>
                </div>
            `;
        }).join('');

        // 8. Status translation
        let statusText = data.status || '—';
        if (isTr) {
            if (data.status === 'Released') statusText = 'Vizyonda / Yayınlandı';
            else if (data.status === 'Ended') statusText = 'Tamamlandı (Final)';
            else if (data.status === 'Returning Series') statusText = 'Devam Ediyor';
            else if (data.status === 'Post Production') statusText = 'Yapım Aşamasında';
            else if (data.status === 'In Production') statusText = 'Çekim Aşamasında';
            else if (data.status === 'Planned') statusText = 'Planlanan';
        }

        // 9. Financials (for movies)
        let budgetStr = '';
        if (data.budget && data.budget > 0) {
            budgetStr = `$${(data.budget / 1000000).toFixed(1)}M`;
        }
        let revenueStr = '';
        if (data.revenue && data.revenue > 0) {
            revenueStr = `$${(data.revenue / 1000000).toFixed(1)}M`;
        }

        container.innerHTML = `
            <div class="details-section overview-section">
                <div class="details-section-header">
                    <h3><i class="fas fa-align-left"></i> ${isTr ? 'Özet ve Hikaye' : 'Overview'}</h3>
                </div>
                <p class="details-overview-text">${overview}</p>
            </div>

            ${castHtml ? `
            <div class="details-section cast-section">
                <div class="details-section-header">
                    <h3><i class="fas fa-users"></i> ${isTr ? 'Oyuncu Kadrosu' : 'Cast'}</h3>
                    <span class="details-section-sub">${castList.length} ${isTr ? 'Oyuncu' : 'Actors'}</span>
                </div>
                <div class="cast-scroll-wrapper">
                    <div class="cast-scroll">
                        ${castHtml}
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="details-section info-section">
                <div class="details-section-header">
                    <h3><i class="fas fa-circle-info"></i> ${isTr ? 'Ek Bilgiler ve Künye' : 'Details & Info'}</h3>
                </div>
                <div class="details-bento-grid">
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-video"></i> ${isTv ? (isTr ? 'Yaratıcı' : 'Creator') : (isTr ? 'Yönetmen' : 'Director')}</span>
                        <span class="bento-value">${directorOrCreator}</span>
                    </div>
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-tags"></i> ${isTr ? 'Türler' : 'Genres'}</span>
                        <div class="bento-tags">${genresHtml || '—'}</div>
                    </div>
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-star"></i> ${isTr ? 'Puan & Oy' : 'Rating & Votes'}</span>
                        <span class="bento-value"><i class="fas fa-star" style="color:var(--star);"></i> ${score} <small class="bento-sub">(${data.vote_count || 0} ${isTr ? 'oy' : 'votes'})</small></span>
                    </div>
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-clock"></i> ${isTr ? 'Süre' : 'Duration'}</span>
                        <span class="bento-value">${duration}</span>
                    </div>
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-calendar-day"></i> ${isTr ? 'Çıkış Tarihi' : 'Release Date'}</span>
                        <span class="bento-value">${releaseDate || year}</span>
                    </div>
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-signal"></i> ${isTr ? 'Durum' : 'Status'}</span>
                        <span class="bento-value">${statusText}</span>
                    </div>
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-globe"></i> ${isTr ? 'Orijinal Başlık & Dil' : 'Original Title & Lang'}</span>
                        <span class="bento-value">${data.original_title || data.original_name || '—'} (${(data.original_language || '').toUpperCase()})</span>
                    </div>
                    ${budgetStr ? `
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-coins"></i> ${isTr ? 'Bütçe' : 'Budget'}</span>
                        <span class="bento-value">${budgetStr}</span>
                    </div>
                    ` : ''}
                    ${revenueStr ? `
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-money-bill-trend-up"></i> ${isTr ? 'Hasılat' : 'Box Office'}</span>
                        <span class="bento-value">${revenueStr}</span>
                    </div>
                    ` : ''}
                    ${data.production_companies && data.production_companies.length > 0 ? `
                    <div class="bento-info-card">
                        <span class="bento-label"><i class="fas fa-building"></i> ${isTr ? 'Yapım Şirketleri' : 'Production'}</span>
                        <span class="bento-value">${data.production_companies.slice(0, 3).map(p => p.name).join(', ')}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    handleWatchAction(type) {
        const { id, type: mediaType } = this.state.player;
        this.toggleList(type, id, mediaType);
    }

    updateWatchActionsUI() {
        const id = this.state.player.id;
        const lang = this.state.settings.language;

        const watchedBtn = document.getElementById('watchToggleWatched');
        const watchlistBtn = document.getElementById('watchToggleWatchlist');

        if (watchedBtn) {
            const isAdded = this.isInList('watched', id);
            watchedBtn.classList.toggle('active', isAdded);
            watchedBtn.querySelector('span').textContent = isAdded
                ? (lang === 'tr' ? 'İzledim ✓' : 'Watched ✓')
                : (lang === 'tr' ? 'İzledim' : 'Watched');
        }

        if (watchlistBtn) {
            const isAdded = this.isInList('watchlist', id);
            watchlistBtn.classList.toggle('active', isAdded);
            watchlistBtn.querySelector('span').textContent = isAdded
                ? (lang === 'tr' ? 'Sırada ✓' : 'Watchlist ✓')
                : (lang === 'tr' ? 'Sırada' : 'Watchlist');
        }
    }

    async fetchTvMeta(id) {
        const seasonSelect = document.getElementById('seasonSelect');
        const lang = this.state.currentMovieData?.original_language || 'en';
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${CONFIG.TMDB_KEY}&language=${lang}`);
            const data = await res.json();

            const validSeasons = (data.seasons || []).filter(s => s.season_number > 0);
            if (validSeasons.length === 0) return;

            // Determine target season & episode: start from next episode after last watched
            const showRecord = this.state.watchedEpisodes?.[id];
            let targetSeason = 1;
            let targetEpisode = 1;

            if (showRecord?.lastWatched) {
                const lastS = Number(showRecord.lastWatched.season);
                const lastE = Number(showRecord.lastWatched.episode);
                const currentSeasonMeta = validSeasons.find(s => s.season_number === lastS);

                if (currentSeasonMeta && lastE < currentSeasonMeta.episode_count) {
                    targetSeason = lastS;
                    targetEpisode = lastE + 1;
                } else if (currentSeasonMeta && lastE >= currentSeasonMeta.episode_count) {
                    const nextSeasonMeta = validSeasons.find(s => s.season_number > lastS);
                    if (nextSeasonMeta) {
                        targetSeason = nextSeasonMeta.season_number;
                        targetEpisode = 1;
                    } else {
                        targetSeason = lastS;
                        targetEpisode = lastE;
                    }
                } else {
                    targetSeason = lastS;
                    targetEpisode = lastE + 1;
                }
            } else {
                const recent = this.state.recentlyPlayed?.find(r => r.id === id);
                if (recent) {
                    targetSeason = recent.season || 1;
                    targetEpisode = recent.episode || 1;
                }
            }

            this.state.player.season = targetSeason;
            this.state.player.episode = targetEpisode;

            seasonSelect.innerHTML = validSeasons
                .map(s => `<option value="${s.season_number}" ${s.season_number == targetSeason ? 'selected' : ''}>${this.state.settings.language === 'tr' ? 'Sezon' : 'Season'} ${s.season_number}</option>`)
                .join('');
            seasonSelect.value = targetSeason;

            await this.handleSeasonChange(false);
        } catch (e) {
            console.error('TV meta fetch error:', e);
        }
    }

    async handleSeasonChange(isManualChange = false) {
        const season = document.getElementById('seasonSelect').value;
        const episodeGrid = document.getElementById('episodeGrid');
        this.state.player.season = season;

        if (isManualChange) {
            this.state.player.episode = 1;
        }

        const lang = this.state.currentMovieData?.original_language || 'en';
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${this.state.player.id}/season/${season}?api_key=${CONFIG.TMDB_KEY}&language=${lang}`);
            const data = await res.json();

            const uiLang = this.state.settings.language;
            episodeGrid.innerHTML = (data.episodes || [])
                .map(e => {
                    const isWatched = this.isEpisodeWatched(this.state.player.id, season, e.episode_number);
                    const isActive = this.state.player.episode == e.episode_number;
                    const tooltip = isWatched
                        ? (uiLang === 'tr' ? 'İzlendi (Geri al)' : 'Watched (Undo)')
                        : (uiLang === 'tr' ? 'İzlendi olarak işaretle' : 'Mark as watched');

                    return `
                        <div class="ep-row ${isActive ? 'active' : ''} ${isWatched ? 'is-watched' : ''}">
                            <button class="ep-btn ${isActive ? 'active' : ''}" 
                                    onclick="app.playEpisode(${e.episode_number}, this)">
                                <span class="ep-num">${e.episode_number}</span>
                                <span class="ep-name">${e.name}</span>
                                ${isWatched ? '<span class="ep-watched-tag"><i class="fas fa-check"></i></span>' : ''}
                            </button>
                            <button class="ep-watched-check ${isWatched ? 'watched' : ''}" 
                                    onclick="event.stopPropagation(); app.toggleEpisodeWatched(${this.state.player.id}, ${season}, ${e.episode_number}, this)"
                                    title="${tooltip}">
                                <i class="fas ${isWatched ? 'fa-check-circle' : 'fa-check'}"></i>
                            </button>
                        </div>
                    `;
                })
                .join('');

            // Scroll active episode into view
            const activeRow = episodeGrid.querySelector('.ep-row.active');
            if (activeRow) {
                activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }

            if (isManualChange) {
                this.updatePlayerSrc();
            }
        } catch (e) {
            console.error('Season change error:', e);
        }
    }

    playEpisode(ep, btn) {
        this.state.player.episode = ep;
        document.querySelectorAll('.ep-row').forEach(r => r.classList.remove('active'));
        document.querySelectorAll('.ep-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.closest('.ep-row')?.classList.add('active');
        this.updatePlayerSrc();
    }

    updateSource(source, btn) {
        this.state.player.source = source;
        document.querySelectorAll('.source-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        localStorage.setItem('ct_default_source', source);
        this.updatePlayerSrc();
    }

    updatePlayerSrc() {
        const iframe = document.getElementById('moviePlayer');
        const { id, type, season, episode, source } = this.state.player;

        // Save recently played
        if (this.state.currentMovieData && this.state.currentMovieData.id === id) {
            const meta = this.state.currentMovieData;
            let list = this.state.recentlyPlayed.filter(r => r.id !== id);
            list.unshift({
                id, type, season, episode,
                timestamp: Date.now(),
                title: meta.original_title || meta.original_name || meta.title || meta.name || '',
                poster_path: meta.poster_path || ''
            });
            if (list.length > 30) list = list.slice(0, 30);
            this.state.recentlyPlayed = list;
            this.saveRecentlyPlayed();
            if (this.state.currentView === 'search') this.renderRecentlyPlayed();
        }

        let embedUrl = '';
        const s = season;
        const e = episode;

        const autoPlayParam = this.state.settings.autoPlay ? 'autoplay=1&autoPlay=true' : 'autoplay=0&autoPlay=false';

        if (source === 'vidfast') {
            embedUrl = type === 'movie'
                ? `https://vidfast.pro/movie/${id}`
                : `https://vidfast.pro/tv/${id}/${s}/${e}`;
            const connector = embedUrl.includes('?') ? '&' : '?';
            embedUrl += `${connector}${autoPlayParam}`;
            if (this.state.settings.autoTurkishSub) embedUrl += `&sub_lang=tr`;
        } else if (source === 'vidsrc') {
            embedUrl = type === 'movie'
                ? `https://vsembed.ru/embed/movie/${id}?quality=1080`
                : `https://vsembed.ru/embed/tv/${id}/${s}/${e}?quality=1080`;
            embedUrl += `&${autoPlayParam}`;
            if (this.state.settings.autoTurkishSub) embedUrl += '&sub_lang=tur&ds_lang=tr';
        } else if (source === 'videasy') {
            embedUrl = type === 'movie'
                ? `https://player.videasy.net/movie/${id}`
                : `https://player.videasy.net/tv/${id}/${s}/${e}`;
            const connector = embedUrl.includes('?') ? '&' : '?';
            embedUrl += `${connector}${autoPlayParam}`;
            if (this.state.settings.autoTurkishSub) embedUrl += `&sub_lang=tr`;
        } else if (source === 'vidcore') {
            const theme = '6366f1';
            let baseParams = `${autoPlayParam}&title=true&poster=true&theme=${theme}&fullscreenButton=true&chromecast=true&quality=1080`;
            if (this.state.settings.autoTurkishSub) baseParams += '&sub=tr';
            if (type === 'movie') {
                embedUrl = `https://vidcore.net/movie/${id}?${baseParams}`;
            } else {
                embedUrl = `https://vidcore.net/tv/${id}/${s}/${e}?${baseParams}&nextButton=true&autoNext=true`;
            }
        }

        if (iframe) {
            iframe.src = embedUrl;
        }
    }
}
