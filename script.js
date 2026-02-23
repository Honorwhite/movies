/**
 * CineTrack Core Application
 * Rewritten for performance and UI stability
 */

const CONFIG = {
    TMDB_KEY: '4a9f3fe6b13e66b0dd355b7318b7e0e4',
    BASE_IMG: 'https://image.tmdb.org/t/p/w500',
    HERO_IMG: 'https://image.tmdb.org/t/p/original',
    SUPABASE_URL: 'https://gbdqycgclxhblhhjhpbm.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHF5Y2djbHhoYmxoaGpocGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Njk2MjMsImV4cCI6MjA4MzA0NTYyM30.85TIwLzahIY30zRlY_y2afw_eziDaYLhXWCCh1HZu5I'
};

class CineTrack {
    constructor() {
        this.state = {
            user: null,
            watched: [],
            watchlist: [],
            trending: [],
            search: [],
            ignored: [],
            page: 1,
            isSearching: false,
            isLoading: false,
            currentView: 'search',
            player: {
                id: null,
                type: 'movie',
                season: 1,
                episode: 1
            },
            sortStates: {
                watched: { field: '', direction: 'desc' },
                watchlist: { field: '', direction: 'desc' }
            }
        };

        this.init();
    }

    async init() {
        console.log('CineTrack Initializing...');
        this.setupEventListeners();
        this.checkAuth();
        this.initInfiniteScroll();

        // Load initial data in background
        if (this.state.user) {
            await this.loadMovieData();
            this.fetchTrending();
        }

        // Hide loader
        setTimeout(() => {
            document.getElementById('appLoader').classList.add('hidden');
        }, 800);
    }

    // --- Auth & Storage ---
    checkAuth() {
        const savedUser = localStorage.getItem('ct_active_user');
        if (savedUser) {
            this.state.user = savedUser;
            this.updateProfileUI();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        const authOverlay = document.getElementById('authOverlay');
        const authContainer = document.getElementById('authContainer');
        authOverlay.style.display = 'flex';
        authContainer.innerHTML = `
            <div class="auth-logo"><i class="fas fa-play"></i></div>
            <h2 style="margin-bottom: 1rem;">CineTrack'e Hoş Geldiniz</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Film ve dizilerinizi takip etmeye başlayın.</p>
            <input type="text" id="username" class="input-field" placeholder="Kullanıcı Adı">
            <input type="password" id="password" class="input-field" placeholder="Şifre">
            <button class="btn-primary" onclick="app.handleAuth()">Giriş Yap / Kayıt Ol</button>
        `;
    }

    async handleAuth() {
        const user = document.getElementById('username').value.trim();
        if (user.length < 3) return alert('Kullanıcı adı çok kısa');

        this.state.user = user;
        localStorage.setItem('ct_active_user', user);
        document.getElementById('authOverlay').style.display = 'none';
        this.updateProfileUI();
        await this.loadMovieData();
        this.fetchTrending();
    }

    logout() {
        localStorage.removeItem('ct_active_user');
        location.reload();
    }

    updateProfileUI() {
        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = this.state.user;
    }

    // --- API Calls ---
    async fetchTrending(append = false) {
        if (this.state.isLoading) return;
        this.state.isLoading = true;

        try {
            const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${CONFIG.TMDB_KEY}&page=${this.state.page}`);
            const data = await res.json();

            // Filter out duplicates based on ID
            const newResults = data.results.filter(movie =>
                !this.state.trending.some(existing => existing.id === movie.id)
            );

            if (append) {
                this.state.trending = [...this.state.trending, ...newResults];
                this.renderGrid(newResults); // Only append new ones to DOM
            } else {
                this.state.trending = newResults;
                this.renderGrid(this.state.trending, 'searchResults', true); // Clear and render
            }

            this.state.page++;
        } catch (e) {
            console.error('Trending fetch error:', e);
        } finally {
            this.state.isLoading = false;
        }
    }

    async searchMovies(query) {
        if (!query) {
            this.state.isSearching = false;
            this.state.page = 1;
            this.renderGrid(this.state.trending);
            document.getElementById('gridTitle').textContent = 'Önerilenler';
            return;
        }

        this.state.isSearching = true;
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${CONFIG.TMDB_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            this.state.search = data.results.filter(movie => !this.isInList('ignored', movie.id));
            this.renderGrid(this.state.search);
            document.getElementById('gridTitle').textContent = `"${query}" için sonuçlar`;
        } catch (e) {
            console.error('Search error:', e);
        }
    }



    renderGrid(movies, containerId = 'searchResults', clear = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        movies.forEach(movie => {
            if (!movie.poster_path || this.isInList('ignored', movie.id)) return;

            const isAdded = this.isInList('watched', movie.id) || this.isInList('watchlist', movie.id);

            // Only hide from discovery (trending) section, not search results
            if (containerId === 'searchResults' && !this.state.isSearching && isAdded) return;

            let footerHtml = '';
            const mType = movie.media_type || 'movie';

            if (containerId === 'searchResults') {
                footerHtml = `
                    <button class="action-btn-flat ${this.isInList('watched', movie.id) ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleList('watched', ${movie.id}, '${mType}')" title="İzledim">
                        <i class="fas fa-check"></i> <span>İzledim</span>
                    </button>
                    <button class="action-btn-flat ${this.isInList('watchlist', movie.id) ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleList('watchlist', ${movie.id}, '${mType}')" title="Sırada">
                        <i class="fas fa-bookmark"></i> <span>Sırada</span>
                    </button>
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.toggleList('ignored', ${movie.id}, '${mType}')" title="Gizle">
                        <i class="fas fa-eye-slash"></i> <span>Gizle</span>
                    </button>
                `;
            } else if (containerId === 'watchlist') {
                footerHtml = `
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.moveToWatched(${movie.id}, '${mType}')" title="İzledim">
                        <i class="fas fa-check"></i> <span>İzledim</span>
                    </button>
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.toggleList('watchlist', ${movie.id}, '${mType}')" title="Kaldır">
                        <i class="fas fa-trash"></i> <span>Kaldır</span>
                    </button>
                `;
            } else if (containerId === 'watchedList') {
                footerHtml = `
                    <button class="action-btn-flat" onclick="event.stopPropagation(); app.toggleList('watched', ${movie.id}, '${mType}')" title="Kaldır">
                        <i class="fas fa-trash"></i> <span>Kaldır</span>
                    </button>
                `;
            }

            const card = document.createElement('div');
            card.className = `movie-card ${isAdded && containerId === 'searchResults' ? 'is-added' : ''}`;
            card.innerHTML = `
                <div class="poster-wrapper">
                    <img class="movie-poster" src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.title || movie.name}" loading="lazy">
                    <div class="movie-info">
                        <div class="movie-title">${movie.title || movie.name}</div>
                        <div class="movie-meta">
                            <span class="movie-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                            <span>${(movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    ${footerHtml}
                </div>
            `;

            card.onclick = () => this.playMovie(movie.id, movie.media_type || 'movie');
            fragment.appendChild(card);
        });

        if (clear || this.state.isSearching || containerId !== 'searchResults') {
            container.innerHTML = '';
        }
        container.appendChild(fragment);
    }

    renderStats() {
        this.renderDetailedStats('watched', 'watchedStats');
        this.renderDetailedStats('watchlist', 'watchlistStats');
    }

    renderDetailedStats(listKey, containerId) {
        const list = this.state[listKey];
        const stats = list.reduce((acc, item) => {
            const isMovie = item.media_type === 'movie' || item.title;
            if (isMovie) {
                acc.movies++;
                acc.totalMinutes += item.runtime || 0;
            } else {
                acc.tv++;
                acc.episodes += item.number_of_episodes || 0;
                const runtime = item.episode_run_time ? (item.episode_run_time[0] || 0) : 0;
                acc.totalMinutes += (item.number_of_episodes || 0) * runtime;
            }
            return acc;
        }, { movies: 0, tv: 0, episodes: 0, totalMinutes: 0 });

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="stat-item">
                    <div class="stat-main">
                        <span class="stat-value">${stats.movies}</span>
                        <span class="stat-label">Film</span>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-main">
                        <span class="stat-value">${stats.tv}</span>
                        <span class="stat-label">Dizi</span>
                    </div>
                    <div class="stat-sub">${stats.episodes} Bölüm</div>
                </div>
                <div class="stat-item primary">
                    <div class="stat-main">
                        <span class="stat-value">${this.formatMinutes(stats.totalMinutes)}</span>
                        <span class="stat-label">Toplam Süre</span>
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

    // --- List Management ---
    async toggleList(listType, id, mediaType = 'movie') {
        const list = this.state[listType];
        const index = list.findIndex(item => item.id === id);

        if (index > -1) {
            list.splice(index, 1);
        } else {
            // Fetch basic details to save
            const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}`);
            const movie = await res.json();
            movie.media_type = mediaType;
            list.push(movie);
        }

        this.saveMovieData();
        this.renderGrid(this.state.trending, 'searchResults', true); // Refresh current view
        if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList');
        if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist');
        this.renderStats();
    }

    async moveToWatched(id, mediaType = 'movie') {
        const movie = this.state.watchlist.find(m => m.id === id);
        // Remove from watchlist
        this.state.watchlist = this.state.watchlist.filter(m => m.id !== id);
        // Add to watched if not exists
        if (!this.isInList('watched', id)) {
            if (movie) {
                this.state.watched.push(movie);
            } else {
                const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}`);
                const data = await res.json();
                data.media_type = mediaType;
                this.state.watched.push(data);
            }
        }

        this.saveMovieData();
        this.renderGrid(this.state.watchlist, 'watchlist', true);
        this.renderStats();
    }

    isInList(listType, id) {
        return this.state[listType].some(item => item.id === id);
    }

    saveMovieData() {
        localStorage.setItem(`ct_${this.state.user}_watched`, JSON.stringify(this.state.watched));
        localStorage.setItem(`ct_${this.state.user}_watchlist`, JSON.stringify(this.state.watchlist));
        localStorage.setItem(`ct_${this.state.user}_ignored`, JSON.stringify(this.state.ignored));
        this.syncWithCloud();
    }

    async loadMovieData() {
        const prefix = `ct_${this.state.user}_`;
        const legacyPrefix = `user_${this.state.user}_`;

        // 1. Try new local storage
        let watched = localStorage.getItem(prefix + 'watched');
        let watchlist = localStorage.getItem(prefix + 'watchlist');
        let ignored = localStorage.getItem(prefix + 'ignored');

        // 2. Fallback to legacy local storage if empty
        if (!watched) {
            watched = localStorage.getItem(legacyPrefix + 'watched_list');
            if (watched) localStorage.setItem(prefix + 'watched', watched);
        }
        if (!watchlist) {
            watchlist = localStorage.getItem(legacyPrefix + 'watchlist_list');
            if (watchlist) localStorage.setItem(prefix + 'watchlist', watchlist);
        }
        if (!ignored) {
            ignored = localStorage.getItem(legacyPrefix + 'ignored_list');
            if (ignored) localStorage.setItem(prefix + 'ignored', ignored);
        }

        this.state.watched = watched ? JSON.parse(watched) : [];
        this.state.watchlist = watchlist ? JSON.parse(watchlist) : [];
        this.state.ignored = ignored ? JSON.parse(ignored) : [];

        // 3. Fetch from Cloud to ensure latest data
        await this.fetchFromCloud();

        this.renderStats();
        if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList', true);
        if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist', true);
    }

    async fetchFromCloud() {
        if (!this.state.user) return;

        try {
            const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/movie_tracker?id=eq.user_${this.state.user}`, {
                headers: {
                    'apikey': CONFIG.SUPABASE_KEY,
                    'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    const cloudData = data[0].content;

                    // Simple merge or overwrite based on lastUpdated if available, 
                    // but here we prioritize cloud since user said they are reset locally.
                    this.state.watched = cloudData.watched || [];
                    this.state.watchlist = cloudData.watchlist || [];
                    this.state.ignored = cloudData.ignored || [];

                    // Save back to local to prevent "empty list" on next load
                    localStorage.setItem(`ct_${this.state.user}_watched`, JSON.stringify(this.state.watched));
                    localStorage.setItem(`ct_${this.state.user}_watchlist`, JSON.stringify(this.state.watchlist));
                    localStorage.setItem(`ct_${this.state.user}_ignored`, JSON.stringify(this.state.ignored));

                    console.log('Data restored from Supabase');
                }
            }
        } catch (e) {
            console.error('Failed to fetch from cloud:', e);
        }
    }

    // --- View Management ---
    switchView(viewId) {
        this.state.currentView = viewId;

        // Update Nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        // Update Sections
        document.querySelectorAll('.view').forEach(view => {
            view.classList.toggle('active', view.id === viewId + 'View');
        });

        // Specific View Logic
        if (viewId === 'watched') this.renderGrid(this.state.watched, 'watchedList');
        if (viewId === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist');

        window.scrollTo(0, 0);
    }

    // --- Video Player ---
    async playMovie(id, type = 'movie') {
        const modal = document.getElementById('playerModal');
        const tvSelectors = document.getElementById('tvSelectors');

        this.state.player = { id, type, season: 1, episode: 1 };

        if (type === 'tv') {
            tvSelectors.style.display = 'flex';
            await this.fetchTvMeta(id);
        } else {
            tvSelectors.style.display = 'none';
        }

        this.updatePlayerSrc();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    async fetchTvMeta(id) {
        const seasonSelect = document.getElementById('seasonSelect');
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${CONFIG.TMDB_KEY}`);
            const data = await res.json();

            seasonSelect.innerHTML = data.seasons
                .filter(s => s.season_number > 0)
                .map(s => `<option value="${s.season_number}">Sezon ${s.season_number}</option>`)
                .join('');

            await this.handleSeasonChange();
        } catch (e) {
            console.error('TV meta fetch error:', e);
        }
    }

    async handleSeasonChange() {
        const season = document.getElementById('seasonSelect').value;
        const episodeSelect = document.getElementById('episodeSelect');
        this.state.player.season = season;

        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${this.state.player.id}/season/${season}?api_key=${CONFIG.TMDB_KEY}`);
            const data = await res.json();

            episodeSelect.innerHTML = data.episodes
                .map(e => `<option value="${e.episode_number}">Bölüm ${e.episode_number}</option>`)
                .join('');

            this.state.player.episode = 1;
            this.updatePlayerSrc();
        } catch (e) {
            console.error('Season change error:', e);
        }
    }

    updatePlayerSrc() {
        const iframe = document.getElementById('moviePlayer');
        const source = document.getElementById('sourceSelect').value;
        const { id, type, season, episode } = this.state.player;

        // Update local state if it's TV
        if (type === 'tv') {
            this.state.player.season = document.getElementById('seasonSelect').value;
            this.state.player.episode = document.getElementById('episodeSelect').value;
        }

        let embedUrl = '';
        const s = this.state.player.season;
        const e = this.state.player.episode;

        if (source === 'vidfast') {
            embedUrl = type === 'movie'
                ? `https://vidfast.pro/movie/${id}`
                : `https://vidfast.pro/tv/${id}/${s}/${e}`;
        } else if (source === 'vidsrc') {
            embedUrl = type === 'movie'
                ? `https://vidsrc.xyz/embed/movie/${id}`
                : `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`;
        } else if (source === 'videasy') {
            embedUrl = type === 'movie'
                ? `https://player.videasy.net/movie/${id}`
                : `https://player.videasy.net/tv/${id}/${s}/${e}`;
        }

        iframe.src = embedUrl;
    }

    closePlayer() {
        const modal = document.getElementById('playerModal');
        const iframe = document.getElementById('moviePlayer');
        iframe.src = '';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // --- Utilities ---
    setupEventListeners() {
        const searchInput = document.getElementById('movieSearch');
        const watchedSearch = document.getElementById('watchedSearch');
        const watchlistSearch = document.getElementById('watchlistSearch');
        let debounceTimer;

        searchInput?.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchMovies(e.target.value);
            }, 500);
        });

        watchedSearch?.addEventListener('input', (e) => {
            this.filterList('watched', 'watchedList', e.target.value);
        });

        watchlistSearch?.addEventListener('input', (e) => {
            this.filterList('watchlist', 'watchlist', e.target.value);
        });
    }

    filterList(listKey, containerId, query) {
        const list = this.state[listKey];
        if (!query) {
            this.renderGrid(list, containerId, true);
            return;
        }

        const filtered = list.filter(item => {
            const title = (item.title || item.name || '').toLowerCase();
            return title.includes(query.toLowerCase());
        });

        this.renderGrid(filtered, containerId, true);
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
                valA = (a.title || a.name || '').toLowerCase();
                valB = (b.title || b.name || '').toLowerCase();
            } else if (field === 'release_date') {
                valA = a.release_date || a.first_air_date || '';
                valB = b.release_date || b.first_air_date || '';
            }

            if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
            return 0;
        });

        this.renderGrid(list, containerId, true);
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

    initInfiniteScroll() {
        const trigger = document.getElementById('loadMoreTrigger');
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.state.isSearching && !this.state.isLoading && this.state.currentView === 'search') {
                this.fetchTrending(true);
            }
        }, { threshold: 0.1 });

        if (trigger) observer.observe(trigger);
    }

    async syncWithCloud() {
        if (!this.state.user) return;

        try {
            await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/movie_tracker`, {
                method: 'POST',
                headers: {
                    'apikey': CONFIG.SUPABASE_KEY,
                    'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({
                    id: `user_${this.state.user}`,
                    content: {
                        watched: this.state.watched,
                        watchlist: this.state.watchlist,
                        ignored: this.state.ignored,
                        lastUpdated: Date.now()
                    }
                })
            });
        } catch (e) {
            console.warn('Cloud sync failed:', e);
        }
    }
}

// Global instance for onclick handlers
const app = new CineTrack();
window.app = app;
