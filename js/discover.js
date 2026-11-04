// Discover page: TMDB genres, trending, search, catalogs, result grid
// These methods are attached to CineTrack in js/app.js.
class DiscoverMethods {
    async fetchGenres() {
        try {
            const [mRes, tRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${CONFIG.TMDB_KEY}&language=en-US`),
                fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${CONFIG.TMDB_KEY}&language=en-US`)
            ]);
            const [mList, tList] = await Promise.all([mRes.json(), tRes.json()]);

            [...mList.genres, ...tList.genres].forEach(g => {
                this.state.genres[g.id] = g.name;
            });
        } catch (e) {
            console.error('Genre fetch error:', e);
        }
    }

    async fetchTrending(append = false) {
        if (this.state.isLoading) return;
        this.state.isLoading = true;

        try {
            let newResults = [];

            if (this.state.currentCatalog) {
                // Fetch specific catalog with pagination
                const catalog = CATALOGS.find(c => c.id === this.state.currentCatalog);
                if (catalog) {
                    const connector = catalog.endpoint.includes('?') ? '&' : '?';
                    const url = `https://api.themoviedb.org/3/${catalog.endpoint}${connector}api_key=${CONFIG.TMDB_KEY}&page=${this.state.page}&language=en-US`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.results) {
                        newResults = data.results.map(m => ({ ...m, media_type: m.media_type || catalog.type }));
                    }
                }
            } else {
                // Fetch popular movies and TV shows for mixed suggested feed
                const [mRes, tRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${CONFIG.TMDB_KEY}&sort_by=popularity.desc&vote_count.gte=1500&with_original_language=en|fr|de|it|es|ko|ja&page=${this.state.page}&language=en-US`),
                    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${CONFIG.TMDB_KEY}&sort_by=popularity.desc&vote_count.gte=1000&with_original_language=en|fr|de|it|es|ko|ja&page=${this.state.page}&language=en-US`)
                ]);

                const [mData, tData] = await Promise.all([mRes.json(), tRes.json()]);

                const movies = (mData.results || []).map(m => ({ ...m, media_type: 'movie' }));
                const tv = (tData.results || []).map(t => ({ ...t, media_type: 'tv' }));

                const interleaved = [];
                const maxLen = Math.max(movies.length, tv.length);
                for (let i = 0; i < maxLen; i++) {
                    if (movies[i]) interleaved.push(movies[i]);
                    if (tv[i]) interleaved.push(tv[i]);
                }
                newResults = interleaved;
            }

            // Filter out existing trending results to avoid duplicates in DOM
            const filteredResults = newResults.filter(item =>
                !this.state.trending.some(existing => existing.id === item.id)
            );

            if (append) {
                this.state.trending = [...this.state.trending, ...filteredResults];
                this.renderGrid(filteredResults);
            } else {
                this.state.trending = filteredResults;
                this.renderGrid(this.state.trending, 'searchResults', true);
            }

            this.state.page++;
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            this.state.isLoading = false;
        }
    }

    async searchMovies(query) {
        if (!query) {
            this.state.isSearching = false;
            this.state.page = 1;
            this.renderGrid(this.state.trending, 'searchResults', true);
            document.getElementById('gridTitle').textContent = TRANSLATIONS[this.state.settings.language].suggested;
            this.renderRecentlyPlayed();
            this.renderWatchlistSpotlightBanner();
            return;
        }

        this.state.isSearching = true;
        this.renderWatchlistSpotlightBanner();
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${CONFIG.TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
            const data = await res.json();
            this.state.search = data.results.filter(movie => !this.isInList('ignored', movie.id));
            this.renderGrid(this.state.search);
            document.getElementById('gridTitle').textContent = `"${query}" ${TRANSLATIONS[this.state.settings.language].searchResults}`;

            // Clear catalog selection on search
            this.state.currentCatalog = null;
            this.renderCatalogs();
            this.renderRecentlyPlayed();
            this.renderWatchlistSpotlightBanner();
        } catch (e) {
            console.error('Search error:', e);
        }
    }

    renderCatalogs() {
        const container = document.getElementById('genreChips');
        if (!container) return;

        const lang = this.state.settings.language;

        container.innerHTML = CATALOGS.map(cat => `
            <button class="chip ${this.state.currentCatalog === cat.id ? 'active' : ''}" 
                    onclick="app.fetchCatalog('${cat.id}')">
                <i class="fas ${cat.icon}"></i>
                <span>${cat[lang]}</span>
            </button>
        `).join('');
    }

    async fetchCatalog(catalogId) {
        if (this.state.isLoading) return;

        // If clicking the same active catalog, toggle back to trending mixed feed
        if (this.state.currentCatalog === catalogId) {
            this.state.currentCatalog = null;
        } else {
            this.state.currentCatalog = catalogId;
        }

        this.state.page = 1;
        this.state.trending = [];
        this.state.isSearching = false;

        const lang = this.state.settings.language;
        const catalog = CATALOGS.find(c => c.id === this.state.currentCatalog);
        document.getElementById('gridTitle').textContent = catalog ? catalog[lang] : TRANSLATIONS[lang].suggested;

        this.renderCatalogs();
        this.renderRecentlyPlayed();
        this.renderWatchlistSpotlightBanner();

        // Clear search input
        const searchInput = document.getElementById('movieSearch');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('clearSearch');
        if (clearBtn) clearBtn.style.display = 'none';

        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.fetchTrending(false);
    }

    renderGrid(movies, containerId = 'searchResults', clear = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        const lang = this.state.settings.language;

        movies.forEach(movie => {
            if (!movie.poster_path || this.isInList('ignored', movie.id)) return;

            const isAdded = this.isInList('watched', movie.id) || this.isInList('watchlist', movie.id);

            // Only hide from discovery (trending) section, not search results
            if (containerId === 'searchResults' && !this.state.isSearching && isAdded) return;

            let footerHtml = '';
            const mType = movie.media_type || 'movie';

            // Check if unreleased
            const releaseDate = movie.release_date || movie.first_air_date;
            const isUnreleased = releaseDate && new Date(releaseDate) > new Date();
            const badgeHtml = isUnreleased ? `<div class="movie-badge">${TRANSLATIONS[lang].comingSoon}</div>` : '';

            if (containerId === 'searchResults') {
                const tr_watched = lang === 'tr' ? 'İzledim' : 'Watched';
                const tr_watchlist = lang === 'tr' ? 'Sırada' : 'Watchlist';
                const tr_hide = lang === 'tr' ? 'Gizle' : 'Hide';

                footerHtml = `
                    <button class="action-btn-flat ${this.isInList('watched', movie.id) ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleList('watched', ${movie.id}, '${mType}')" title="${tr_watched}">
                        <i class="fas fa-check"></i> <span>${tr_watched}</span>
                    </button>
                    <button class="action-btn-flat ${this.isInList('watchlist', movie.id) ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleList('watchlist', ${movie.id}, '${mType}')" title="${tr_watchlist}">
                        <i class="fas fa-bookmark"></i> <span>${tr_watchlist}</span>
                    </button>
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.toggleList('ignored', ${movie.id}, '${mType}')" title="${tr_hide}">
                        <i class="fas fa-eye-slash"></i> <span>${tr_hide}</span>
                    </button>
                `;
            } else if (containerId === 'watchlist') {
                const tr_watched = lang === 'tr' ? 'İzledim' : 'Watched';
                const tr_remove = lang === 'tr' ? 'Kaldır' : 'Remove';

                footerHtml = `
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.moveToWatched(${movie.id}, '${mType}')" title="${tr_watched}">
                        <i class="fas fa-check"></i> <span>${tr_watched}</span>
                    </button>
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.toggleList('watchlist', ${movie.id}, '${mType}')" title="${tr_remove}">
                        <i class="fas fa-trash"></i> <span>${tr_remove}</span>
                    </button>
                `;
            } else if (containerId === 'watchedList') {
                const tr_remove = lang === 'tr' ? 'Kaldır' : 'Remove';
                footerHtml = `
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.toggleList('watched', ${movie.id}, '${mType}')" title="${tr_remove}">
                        <i class="fas fa-trash"></i> <span>${tr_remove}</span>
                    </button>
                `;
            }

            const card = document.createElement('div');
            card.className = `movie-card ${isAdded ? 'is-added' : ''} ${isUnreleased ? 'is-unreleased' : ''}`;
            card.dataset.id = movie.id;
            const scoreText = (typeof movie.vote_average === 'number' && movie.vote_average > 0)
                ? movie.vote_average.toFixed(1)
                : '—';
            card.innerHTML = `
                <div class="poster-wrapper">
                    ${badgeHtml}
                    <img class="movie-poster" src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.original_title || movie.original_name || movie.title || movie.name}" loading="lazy">
                    <div class="movie-info">
                        <div class="movie-title">${movie.original_title || movie.original_name || movie.title || movie.name}</div>
                        <div class="movie-meta">
                            <span class="movie-rating"><i class="fas fa-star"></i> ${scoreText}</span>
                            <span>${(movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
                        </div>
                        <div class="movie-genres">
                            ${((movie.genres && movie.genres.length > 0)
                                ? movie.genres.slice(0, 2).map(g => typeof g === 'object' ? (g.name || g.tr || g.en) : g).filter(Boolean)
                                : (movie.genre_ids || []).slice(0, 2).map(id => this.state.genres[id]).filter(Boolean)
                            ).join(' / ')}
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    ${footerHtml}
                </div>
            `;

            card.onclick = () => {
                if (isUnreleased) return;
                this.playMovie(movie.id, movie.media_type || 'movie');
            };
            fragment.appendChild(card);
        });

        if (clear || this.state.isSearching || containerId !== 'searchResults') {
            container.innerHTML = '';
        }
        container.appendChild(fragment);
    }

    initInfiniteScroll() {
        const trigger = document.getElementById('loadMoreTrigger');
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.state.isSearching && !this.state.isLoading && this.state.currentView === 'search') {
                this.fetchTrending(true);
            }
        }, { threshold: 0.1 });

        if (trigger) observer.observe(trigger);
    }
}
