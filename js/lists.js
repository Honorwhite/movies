// Watched / watchlist: adding, removing, filtering, sorting
// These methods are attached to CineTrack in js/app.js.
class ListsMethods {
    async toggleList(listType, id, mediaType = 'movie') {
        const numId = Number(id);
        const list = this.state[listType];
        if (!list) return;

        const index = list.findIndex(item => Number(item.id) === numId || item.id == id);

        if (index > -1) {
            // Already in this list: remove it (toggle off)
            const removedItem = list[index];
            list.splice(index, 1);
            // If removed from watched and it's a TV show, clear marked episodes
            const isTv = mediaType === 'tv' || (!removedItem?.title && !!removedItem?.name);
            if (listType === 'watched' && isTv) {
                this.unmarkAllEpisodesWatched(id);
            }
        } else {
            // Fetch basic details to save
            let movie = null;
            try {
                const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                if (res.ok) {
                    movie = await res.json();
                }
            } catch (e) {
                console.warn('TMDB fetch failed in toggleList:', e);
            }

            if (!movie) {
                // Fallback to existing data if present in other list or current player
                const otherListKey = listType === 'watched' ? 'watchlist' : 'watched';
                const existing = this.state[otherListKey]?.find(item => Number(item.id) === numId || item.id == id);
                if (existing) {
                    movie = { ...existing };
                } else if (this.state.player && (this.state.player.id === id || this.state.player.id == id) && this.state.currentMovieData) {
                    movie = { ...this.state.currentMovieData };
                } else {
                    movie = { id: numId, title: '', media_type: mediaType };
                }
            }

            movie.media_type = mediaType;
            list.push(movie);

            // If a TV show's main title is marked as watched, automatically mark all currently released episodes as watched!
            if (listType === 'watched' && mediaType === 'tv') {
                await this.markAllCurrentEpisodesWatched(id, movie);
            }

            // Mutual exclusion: son tıklanan seçeneği al, diğerini kaldır
            if (listType === 'watched') {
                // Added to watched -> remove from watchlist if present
                const wIdx = this.state.watchlist.findIndex(item => Number(item.id) === numId || item.id == id);
                if (wIdx > -1) {
                    this.state.watchlist.splice(wIdx, 1);
                }
            } else if (listType === 'watchlist') {
                // Added to watchlist -> remove from watched if present
                const wIdx = this.state.watched.findIndex(item => Number(item.id) === numId || item.id == id);
                if (wIdx > -1) {
                    const removedItem = this.state.watched[wIdx];
                    this.state.watched.splice(wIdx, 1);
                    const isTv = mediaType === 'tv' || (!removedItem?.title && !!removedItem?.name);
                    if (isTv) {
                        this.unmarkAllEpisodesWatched(id);
                    }
                }
            }
        }

        this.saveMovieData();

        // Update all matching cards across the DOM
        const cards = document.querySelectorAll(`.movie-card[data-id="${id}"]`);
        cards.forEach(card => {
            if (listType === 'ignored' && this.isInList('ignored', id)) {
                card.classList.add('fade-out');
                setTimeout(() => card.remove(), 300);
                return;
            }
            const isAdded = this.isInList('watched', id) || this.isInList('watchlist', id);
            card.classList.toggle('is-added', isAdded);

            const watchedBtn = card.querySelector(`[onclick*="watched"]`);
            const watchlistBtn = card.querySelector(`[onclick*="watchlist"]`);

            if (watchedBtn) watchedBtn.classList.toggle('active', this.isInList('watched', id));
            if (watchlistBtn) watchlistBtn.classList.toggle('active', this.isInList('watchlist', id));
        });

        if (this.state.currentView === 'watched') this.renderUserList('watched');
        if (this.state.currentView === 'watchlist') this.renderUserList('watchlist');
        this.renderWatchlistSpotlightBanner();

        if (this.state.player && (this.state.player.id === id || this.state.player.id == id)) {
            this.updateWatchActionsUI();
        }

        // If collection grid exists and we are in watch view, update buttons in it
        const colGrid = document.getElementById('collectionGrid');
        if (colGrid && this.state.currentView === 'watch') {
            const card = colGrid.querySelector(`.col-movie-card[onclick*="(${id},"]`);
            if (card) {
                const watchedBtn = card.querySelector(`.col-action-btn[onclick*="'watched'"]`);
                const watchlistBtn = card.querySelector(`.col-action-btn[onclick*="'watchlist'"]`);
                if (watchedBtn) watchedBtn.classList.toggle('active', this.isInList('watched', id));
                if (watchlistBtn) watchlistBtn.classList.toggle('active', this.isInList('watchlist', id));
            }
        }

        this.renderStats();
    }

    async moveToWatched(id, mediaType = 'movie') {
        const movie = this.state.watchlist.find(m => m.id === id);
        // Remove from watchlist
        this.state.watchlist = this.state.watchlist.filter(m => m.id !== id);
        // Add to watched if not exists
        if (!this.isInList('watched', id)) {
            let targetMovie = movie;
            if (movie) {
                // If the movie had a 0 rating or missing rating or missing episodes, fetch fresh details upon moving
                if (!movie.vote_average || movie.vote_average === 0 || (mediaType === 'tv' && !movie.number_of_episodes)) {
                    try {
                        const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                        if (res.ok) {
                            const fresh = await res.json();
                            fresh.media_type = mediaType;
                            targetMovie = fresh;
                        }
                    } catch (e) {
                        console.warn('Error fetching details in moveToWatched:', e);
                    }
                }
                this.state.watched.push(targetMovie);
            } else {
                const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                const data = await res.json();
                data.media_type = mediaType;
                targetMovie = data;
                this.state.watched.push(data);
            }

            // If it's a TV show, automatically mark all currently released episodes as watched
            if (mediaType === 'tv') {
                await this.markAllCurrentEpisodesWatched(id, targetMovie);
            }
        }

        this.saveMovieData();
        this.renderUserList('watchlist');
        if (this.state.currentView === 'watched') this.renderUserList('watched');
        this.renderStats();
        this.renderWatchlistSpotlightBanner();
    }

    ensureListIntegrity() {
        if (!Array.isArray(this.state.watchlist)) this.state.watchlist = [];
        if (!Array.isArray(this.state.watched)) this.state.watched = [];

        let cleaned = false;

        // Deduplicate watchlist by id
        const seenWatchlist = new Set();
        const initialWatchlistLen = this.state.watchlist.length;
        this.state.watchlist = this.state.watchlist.filter(item => {
            if (!item || item.id == null) return false;
            const key = String(item.id);
            if (seenWatchlist.has(key)) return false;
            seenWatchlist.add(key);
            return true;
        });
        if (this.state.watchlist.length !== initialWatchlistLen) cleaned = true;

        // "izlenecekteyse izlenene koymayalım" - Remove from watched if present in watchlist
        const seenWatched = new Set();
        const initialWatchedLen = this.state.watched.length;
        this.state.watched = this.state.watched.filter(item => {
            if (!item || item.id == null) return false;
            const key = String(item.id);
            // If already in watchlist, do not put in watched
            if (seenWatchlist.has(key)) return false;
            // Also deduplicate watched itself
            if (seenWatched.has(key)) return false;
            seenWatched.add(key);
            return true;
        });
        if (this.state.watched.length !== initialWatchedLen) cleaned = true;

        return cleaned;
    }

    isInList(listType, id) {
        if (!this.state[listType]) return false;
        const numId = Number(id);
        return this.state[listType].some(item => Number(item.id) === numId || item.id == id);
    }

    saveMovieData() {
        localStorage.setItem(`ct_${this.state.user}_watched`, JSON.stringify(this.state.watched));
        localStorage.setItem(`ct_${this.state.user}_watchlist`, JSON.stringify(this.state.watchlist));
        localStorage.setItem(`ct_${this.state.user}_ignored`, JSON.stringify(this.state.ignored));
        this.syncWithCloud();
    }

    async refreshZeroRatings(targetListKey = null) {
        if (this._isRefreshingRatings) return;
        this._isRefreshingRatings = true;

        try {
            const listsToScan = targetListKey ? [targetListKey] : ['watchlist', 'watched'];
            let anyUpdated = false;
            const now = Date.now();

            for (const listKey of listsToScan) {
                const list = this.state[listKey];
                if (!list || !Array.isArray(list)) continue;

                // Find items that have vote_average === 0, null, or undefined
                const candidates = list.filter(m => {
                    const score = typeof m.vote_average === 'number' ? m.vote_average : 0;
                    if (score > 0) return false;
                    // Check once every 4 hours max to preserve network bandwidth
                    if (m._lastRatingChecked && (now - m._lastRatingChecked < 4 * 3600 * 1000)) return false;
                    return true;
                });

                if (candidates.length === 0) continue;

                // Batch in groups of 5
                const chunkSize = 5;
                for (let i = 0; i < candidates.length; i += chunkSize) {
                    const chunk = candidates.slice(i, i + chunkSize);
                    await Promise.all(chunk.map(async (movie) => {
                        movie._lastRatingChecked = Date.now();
                        try {
                            const mType = movie.media_type || (movie.title ? 'movie' : 'tv');
                            const res = await fetch(`https://api.themoviedb.org/3/${mType}/${movie.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                            if (!res.ok) return;

                            const data = await res.json();
                            let itemUpdated = false;

                            if (typeof data.vote_average === 'number' && data.vote_average > 0) {
                                movie.vote_average = data.vote_average;
                                movie.vote_count = data.vote_count || movie.vote_count;
                                itemUpdated = true;
                            }
                            if (data.release_date && data.release_date !== movie.release_date) {
                                movie.release_date = data.release_date;
                                itemUpdated = true;
                            }
                            if (data.first_air_date && data.first_air_date !== movie.first_air_date) {
                                movie.first_air_date = data.first_air_date;
                                itemUpdated = true;
                            }
                            if (data.status && data.status !== movie.status) {
                                movie.status = data.status;
                                itemUpdated = true;
                            }
                            if (data.runtime && !movie.runtime) {
                                movie.runtime = data.runtime;
                                itemUpdated = true;
                            }
                            if (data.genres && (!movie.genres || movie.genres.length === 0)) {
                                movie.genres = data.genres;
                                itemUpdated = true;
                            }
                            if (data.genre_ids && (!movie.genre_ids || movie.genre_ids.length === 0)) {
                                movie.genre_ids = data.genre_ids;
                                itemUpdated = true;
                            }

                            if (itemUpdated) {
                                anyUpdated = true;
                                // Dynamically update card on screen if currently rendered
                                const card = document.querySelector(`.movie-card[data-id="${movie.id}"]`);
                                if (card) {
                                    const ratingEl = card.querySelector('.movie-rating');
                                    if (ratingEl && movie.vote_average > 0) {
                                        ratingEl.innerHTML = `<i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}`;
                                    }
                                    const releaseDate = movie.release_date || movie.first_air_date;
                                    const isUnreleased = releaseDate && new Date(releaseDate) > new Date();
                                    if (!isUnreleased) {
                                        card.classList.remove('is-unreleased');
                                        const badge = card.querySelector('.movie-badge');
                                        if (badge) badge.remove();
                                    }
                                }
                            }
                        } catch (err) {
                            console.warn(`Error refreshing rating for ID ${movie.id}:`, err);
                        }
                    }));
                }
            }

            if (anyUpdated) {
                this.saveMovieData();
                this.renderStats();
                // If user sorted the active view by score, refresh grid ordering
                if (this.state.currentView === 'watchlist' && this.state.sortStates?.watchlist?.field === 'vote_average') {
                    this.sortList('watchlist', 'vote_average', 'watchlist');
                } else if (this.state.currentView === 'watched' && this.state.sortStates?.watched?.field === 'vote_average') {
                    this.sortList('watched', 'vote_average', 'watchedList');
                }
            }
        } finally {
            this._isRefreshingRatings = false;
        }
    }

    itemMatchesGenre(item, genreId) {
        if (!genreId || genreId === 'all') return true;
        const cat = LIST_GENRES_CONFIG.find(c => c.id === genreId);
        if (!cat) return true;

        const targetIds = cat.genre_ids || [];
        const targetKeywords = [
            cat.tr.toLowerCase(),
            cat.en.toLowerCase(),
            cat.id.toLowerCase()
        ];

        // 1. Direct genre_ids array check
        if (Array.isArray(item.genre_ids) && item.genre_ids.some(id => targetIds.includes(Number(id)))) {
            return true;
        }

        // 2. Direct genres array check (objects, ids, or strings)
        if (Array.isArray(item.genres)) {
            for (const g of item.genres) {
                if (typeof g === 'object' && g !== null) {
                    if (g.id && targetIds.includes(Number(g.id))) return true;
                    if (g.name && targetKeywords.some(kw => g.name.toLowerCase().includes(kw))) return true;
                } else if (typeof g === 'number' && targetIds.includes(g)) {
                    return true;
                } else if (typeof g === 'string') {
                    const gLower = g.toLowerCase();
                    if (targetKeywords.some(kw => gLower.includes(kw))) return true;
                }
            }
        }

        // 3. Fallback check using this.state.genres map for item.genre_ids
        if (Array.isArray(item.genre_ids) && this.state.genres) {
            for (const id of item.genre_ids) {
                const name = (this.state.genres[id] || '').toLowerCase();
                if (name && targetKeywords.some(kw => name.includes(kw))) return true;
            }
        }

        // 4. Fallback check if item has single genre property (string)
        if (typeof item.genre === 'string') {
            const gLower = item.genre.toLowerCase();
            if (targetKeywords.some(kw => gLower.includes(kw))) return true;
        }

        return false;
    }

    renderListGenreChips(listKey) {
        const containerId = listKey === 'watched' ? 'watchedGenreFilter' : 'watchlistGenreFilter';
        const container = document.getElementById(containerId);
        if (!container) return;

        const list = this.state[listKey] || [];
        const activeGenre = (this.state.listFilters && this.state.listFilters[listKey]?.genre) || 'all';
        const lang = this.state.settings.language || 'tr';

        // Count items per category
        const counts = { all: list.length };
        LIST_GENRES_CONFIG.forEach(cat => {
            if (cat.id === 'all') return;
            let c = 0;
            list.forEach(item => {
                if (this.itemMatchesGenre(item, cat.id)) c++;
            });
            counts[cat.id] = c;
        });

        // Sort categories: 'all' always first, then categories with count > 0 (descending), then count == 0
        const sortedCats = [...LIST_GENRES_CONFIG].sort((a, b) => {
            if (a.id === 'all') return -1;
            if (b.id === 'all') return 1;
            const countA = counts[a.id] || 0;
            const countB = counts[b.id] || 0;
            if (countA > 0 && countB === 0) return -1;
            if (countB > 0 && countA === 0) return 1;
            if (countA !== countB) return countB - countA;
            return 0;
        });

        container.innerHTML = sortedCats.map(cat => {
            const count = counts[cat.id] || 0;
            const isActive = activeGenre === cat.id;
            const label = cat[lang] || cat.tr;
            return `
                <button class="chip ${isActive ? 'active' : ''} ${count === 0 && cat.id !== 'all' ? 'zero-count' : ''}" 
                        onclick="app.setListGenreFilter('${listKey}', '${cat.id}')">
                    <i class="fas ${cat.icon}"></i>
                    <span>${label}</span>
                    <span class="chip-count">${count}</span>
                </button>
            `;
        }).join('');
    }

    setListGenreFilter(listKey, genreId) {
        if (!this.state.listFilters) {
            this.state.listFilters = {
                watched: { genre: 'all', query: '' },
                watchlist: { genre: 'all', query: '' }
            };
        }
        const current = this.state.listFilters[listKey].genre;
        if (current === genreId && genreId !== 'all') {
            this.state.listFilters[listKey].genre = 'all';
        } else {
            this.state.listFilters[listKey].genre = genreId;
        }

        this.renderUserList(listKey);
    }

    renderUserList(listKey) {
        const containerId = listKey === 'watched' ? 'watchedList' : 'watchlist';
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!this.state.listFilters) {
            this.state.listFilters = {
                watched: { genre: 'all', query: '' },
                watchlist: { genre: 'all', query: '' }
            };
        }

        const filterState = this.state.listFilters[listKey];
        const rawList = this.state[listKey] || [];

        // 1. Filter by category
        let filtered = rawList.filter(item => this.itemMatchesGenre(item, filterState.genre));

        // 2. Filter by search query if any
        if (filterState.query && filterState.query.trim()) {
            const q = filterState.query.trim().toLowerCase();
            filtered = filtered.filter(item => {
                const title = (item.original_title || item.original_name || item.title || item.name || '').toLowerCase();
                return title.includes(q);
            });
        }

        // Render genre chips so counters reflect latest counts & active state
        this.renderListGenreChips(listKey);

        if (filtered.length === 0) {
            const isTr = this.state.settings.language === 'tr';
            const catObj = LIST_GENRES_CONFIG.find(c => c.id === filterState.genre);
            const catName = catObj ? (catObj[this.state.settings.language] || catObj.tr) : '';

            const emptyMsg = filterState.genre !== 'all'
                ? (isTr ? `"${catName}" kategorisinde henüz film veya dizi bulunmuyor.` : `No movies or TV shows found in the "${catName}" category.`)
                : (filterState.query
                    ? (isTr ? 'Aramanıza uygun içerik bulunamadı.' : 'No results found matching your search.')
                    : (isTr ? 'Bu liste henüz boş.' : 'This list is currently empty.'));

            const resetBtnText = isTr ? 'Tüm Kategorileri Göster' : 'Show All Categories';

            container.innerHTML = `
                <div class="list-empty-state">
                    <div class="empty-icon-wrap"><i class="fas fa-film"></i></div>
                    <div class="empty-title">${isTr ? 'İçerik Bulunamadı' : 'No Content Found'}</div>
                    <p class="empty-desc">${emptyMsg}</p>
                    ${filterState.genre !== 'all' ? `
                        <button class="empty-reset-btn" onclick="app.setListGenreFilter('${listKey}', 'all')">
                            <i class="fas fa-layer-group"></i> <span>${resetBtnText}</span>
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        this.renderGrid(filtered, containerId, true);
    }

    filterList(listKey, containerId, query) {
        if (!this.state.listFilters) {
            this.state.listFilters = {
                watched: { genre: 'all', query: '' },
                watchlist: { genre: 'all', query: '' }
            };
        }
        this.state.listFilters[listKey].query = query || '';
        this.renderUserList(listKey);
    }

    sortList(listKey, field, containerId) {
        const list = this.state[listKey];
        if (!list || list.length === 0) return;

        const sortState = this.state.sortStates[listKey];

        if (sortState.field === field) {
            sortState.direction = sortState.direction === 'desc' ? 'asc' : 'desc';
        } else {
            sortState.field = field;
            sortState.direction = (field === 'title') ? 'asc' : 'desc';
        }

        this.updateSortButtons(listKey, field, sortState.direction);

        list.sort((a, b) => {
            let valA = a[field] || '';
            let valB = b[field] || '';

            if (field === 'title') {
                valA = (a.original_title || a.original_name || a.title || a.name || '').toLowerCase();
                valB = (b.original_title || b.original_name || b.title || b.name || '').toLowerCase();
            } else if (field === 'release_date') {
                valA = a.release_date || a.first_air_date || '';
                valB = b.release_date || b.first_air_date || '';
            }

            if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
            return 0;
        });

        this.renderUserList(listKey);
    }

    updateSortButtons(listKey, field, direction) {
        const sectionId = listKey === 'watched' ? 'watchedView' : 'watchlistView';
        const section = document.getElementById(sectionId);
        if (!section) return;

        const buttons = section.querySelectorAll('.sort-btn');
        buttons.forEach(btn => {
            // Find field in the onclick string
            const isMatch = btn.getAttribute('onclick').includes(`'${field}'`);

            if (isMatch) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                if (field === 'title') {
                    icon.className = direction === 'asc' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up';
                } else if (field === 'vote_average') {
                    icon.className = direction === 'desc' ? 'fas fa-sort-numeric-down-alt' : 'fas fa-sort-numeric-up';
                } else if (field === 'release_date') {
                    icon.className = direction === 'desc' ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up';
                }
            } else {
                btn.classList.remove('active');
                // Reset other icons to generic ones
                const icon = btn.querySelector('i');
                if (btn.getAttribute('onclick').includes("'title'")) icon.className = 'fas fa-sort-alpha-down';
                if (btn.getAttribute('onclick').includes("'vote_average'")) icon.className = 'fas fa-star';
                if (btn.getAttribute('onclick').includes("'release_date'")) icon.className = 'fas fa-calendar-alt';
            }
        });
    }
}
