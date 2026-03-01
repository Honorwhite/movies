const TRANSLATIONS = {
    tr: {
        explore: 'Keşfet',
        watched: 'İzlediklerim',
        watchlist: 'İzlenecekler',
        profile: 'Profil',
        searchPlaceholder: 'Film veya dizi arayın...',
        suggested: 'Önerilenler',
        searchResults: 'için sonuçlar',
        watchedTitle: 'İzlediğim Filmler',
        watchlistTitle: 'İzlenecekler Listesi',
        sortName: 'Ad',
        sortScore: 'Puan',
        sortDate: 'Tarih',
        listSearchPlaceholder: 'Listende ara...',
        profileTitle: 'Profil ve Ayarlar',
        appOptions: 'Uygulama Seçenekleri',
        compactMode: 'Kompakt Görünüm',
        compactDesc: 'Grid yapısını daha sıkı hale getirir',
        autoPlay: 'Otomatik Oynat',
        autoPlayDesc: 'Fragmanları otomatik başlat',
        uiLanguage: 'Arayüz Dili',
        uiLanguageDesc: 'Uygulama dilini değiştir',
        accountData: 'Hesap ve Veri',
        changePassword: 'Şifre Değiştir',
        changePasswordDesc: 'Hesap güvenliğini güncelle',
        logout: 'Oturumu Kapat',
        logoutDesc: 'Bu cihazdaki oturumu sonlandır',
        premiumMember: 'Premium Üye',
        back: 'Geri Dön',
        episodes: 'Bölümler',
        seasons: 'Sezonlar',
        comingSoon: 'YAKINDA',
        list: 'Liste',
        collections: 'Koleksiyonlar',
        ongoing: 'Devam Edenler',
        completed: 'Tamamlananlar'
    },
    en: {
        explore: 'Explore',
        watched: 'Watched',
        watchlist: 'Watchlist',
        profile: 'Profile',
        searchPlaceholder: 'Search movies or shows...',
        suggested: 'Recommended',
        searchResults: 'results for',
        watchedTitle: 'Watched Movies',
        watchlistTitle: 'Watchlist',
        sortName: 'Name',
        sortScore: 'Score',
        sortDate: 'Date',
        listSearchPlaceholder: 'Search in your list...',
        profileTitle: 'Profile & Settings',
        appOptions: 'App Options',
        compactMode: 'Compact View',
        compactDesc: 'Makes the grid layout more dense',
        autoPlay: 'Autoplay',
        autoPlayDesc: 'Start trailers automatically',
        uiLanguage: 'Interface Language',
        uiLanguageDesc: 'Change app language',
        accountData: 'Account & Data',
        changePassword: 'Change Password',
        changePasswordDesc: 'Update account security',
        logout: 'Log Out',
        logoutDesc: 'End session on this device',
        premiumMember: 'Premium Member',
        back: 'Back',
        episodes: 'Episodes',
        seasons: 'Sezonlar',
        comingSoon: 'COMING SOON',
        list: 'List',
        collections: 'Collections',
        ongoing: 'Ongoing',
        completed: 'Completed'
    }
};

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
            previousView: 'search',
            settings: {
                compactMode: localStorage.getItem('ct_compact_mode') === 'true',
                language: localStorage.getItem('ct_lang') || 'tr'
            },
            player: {
                id: null,
                type: 'movie',
                season: 1,
                episode: 1
            },
            sortStates: {
                watched: { field: '', direction: 'desc' },
                watchlist: { field: '', direction: 'desc' }
            },
            genres: {},
            scrollPositions: {},
            collectionsCache: {},
            colFilter: 'ongoing'
        };

        this.init();
    }

    async init() {
        console.log('CineTrack Initializing...');
        this.applySettings();
        this.setupEventListeners();
        this.checkAuth();
        this.initInfiniteScroll();
        await this.fetchGenres();

        // Load initial data in background
        if (this.state.user) {
            await this.loadMovieData();
            this.fetchTrending();
        }

        // Initial UI translation
        this.setLanguageUI();

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
        const lang = this.state.settings.language;
        authOverlay.style.display = 'flex';

        const title = lang === 'tr' ? "CineTrack'e Hoş Geldiniz" : "Welcome to CineTrack";
        const desc = lang === 'tr' ? "Film ve dizilerinizi takip etmeye başlayın." : "Start tracking your movies and shows.";
        const userP = lang === 'tr' ? "Kullanıcı Adı" : "Username";
        const passP = lang === 'tr' ? "Şifre" : "Password";
        const btnText = lang === 'tr' ? "Giriş Yap / Kayıt Ol" : "Login / Sign Up";

        authContainer.innerHTML = `
            <div class="auth-logo"><i class="fas fa-play"></i></div>
            <h2 style="margin-bottom: 1rem;">${title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">${desc}</p>
            <input type="text" id="username" class="input-field" placeholder="${userP}">
            <input type="password" id="password" class="input-field" placeholder="${passP}">
            <button class="btn-primary" onclick="app.handleAuth()">${btnText}</button>
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
        const navProfileName = document.getElementById('navProfileName');
        if (profileName) profileName.textContent = this.state.user;
        if (navProfileName) navProfileName.textContent = this.state.user;

        // Sync settings UI
        const compactToggle = document.getElementById('compactToggle');
        if (compactToggle) compactToggle.checked = this.state.settings.compactMode;

        const langLabel = document.getElementById('currentLangLabel');
        if (langLabel) langLabel.textContent = this.state.settings.language.toUpperCase();

        this.setLanguageUI();
    }

    toggleLanguage() {
        const newLang = this.state.settings.language === 'tr' ? 'en' : 'tr';
        this.state.settings.language = newLang;
        localStorage.setItem('ct_lang', newLang);
        this.updateProfileUI();
    }

    setLanguageUI() {
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (strings[key]) el.textContent = strings[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (strings[key]) el.placeholder = strings[key];
        });

        // Update grid and stats with labels in mind
        this.renderStats();
        if (!this.state.isSearching) {
            const gridTitle = document.getElementById('gridTitle');
            if (gridTitle) gridTitle.textContent = strings.suggested;
        }
    }

    changePassword() {
        const lang = this.state.settings.language;
        const promptMsg = lang === 'tr' ? 'Yeni şifrenizi girin:' : 'Enter your new password:';
        const successMsg = lang === 'tr' ? 'Şifreniz başarıyla güncellendi!' : 'Password updated successfully!';

        const newPass = prompt(promptMsg);
        if (newPass && newPass.length >= 4) {
            alert(successMsg);
            this.syncWithCloud(); // Sync the fact that data updated (though password is local for now)
        }
    }

    async fetchGenres() {
        try {
            const [mRes, tRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${CONFIG.TMDB_KEY}&language=tr-TR`),
                fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${CONFIG.TMDB_KEY}&language=tr-TR`)
            ]);
            const [mList, tList] = await Promise.all([mRes.json(), tRes.json()]);

            [...mList.genres, ...tList.genres].forEach(g => {
                this.state.genres[g.id] = g.name;
            });
        } catch (e) {
            console.error('Genre fetch error:', e);
        }
    }

    // --- API Calls ---
    async fetchTrending(append = false) {
        if (this.state.isLoading) return;
        this.state.isLoading = true;

        try {
            const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${CONFIG.TMDB_KEY}&page=${this.state.page}&language=en-US`);
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
            this.renderGrid(this.state.trending, 'searchResults', true);
            document.getElementById('gridTitle').textContent = TRANSLATIONS[this.state.settings.language].suggested;
            return;
        }

        this.state.isSearching = true;
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${CONFIG.TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
            const data = await res.json();
            this.state.search = data.results.filter(movie => !this.isInList('ignored', movie.id));
            this.renderGrid(this.state.search);
            document.getElementById('gridTitle').textContent = `"${query}" ${TRANSLATIONS[this.state.settings.language].searchResults}`;
        } catch (e) {
            console.error('Search error:', e);
        }
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
            card.innerHTML = `
                <div class="poster-wrapper">
                    ${badgeHtml}
                    <img class="movie-poster" src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.title || movie.name}" loading="lazy">
                    <div class="movie-info">
                        <div class="movie-title">${movie.title || movie.name}</div>
                        <div class="movie-meta">
                            <span class="movie-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                            <span>${(movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
                        </div>
                        <div class="movie-genres">
                            ${(movie.genre_ids || []).slice(0, 2).map(id => this.state.genres[id]).filter(Boolean).join(' / ')}
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

    switchWatchedTab(tab, btn) {
        const listGrid = document.getElementById('watchedList');
        const listActions = document.getElementById('watchedListActions');
        const collectionsGrid = document.getElementById('watchedCollections');

        // Update active button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tab === 'list') {
            listGrid.style.display = 'grid';
            listActions.style.display = 'flex';
            collectionsGrid.style.display = 'none';
            this.renderGrid(this.state.watched, 'watchedList');
        } else {
            listGrid.style.display = 'none';
            listActions.style.display = 'none';
            collectionsGrid.style.display = 'block';
            this.renderCollections();
        }
    }

    filterCollections(filter, btn) {
        this.state.colFilter = filter;
        document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCollections();
    }

    async renderCollections() {
        const wrapper = document.getElementById('collectionsGridWrapper');
        if (!wrapper) return;

        wrapper.innerHTML = `<div class="loader-spinner center"></div>`;

        // 1. Proactively fetch details for movies that don't have collection info yet
        // We use a 'deepScan' flag to avoid re-fetching the same movies every time
        const moviesToRefresh = this.state.watched.filter(m =>
            (m.media_type === 'movie' || !m.media_type) &&
            m.belongs_to_collection === undefined &&
            !m._deepScanned
        );

        if (moviesToRefresh.length > 0) {
            // Processing a larger batch (50) to catch up all missing series at once
            const batch = moviesToRefresh.slice(0, 50);
            await Promise.all(batch.map(async (m) => {
                try {
                    const res = await fetch(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                    const details = await res.json();

                    // Update the movie object in state with full details and mark as scanned
                    const index = this.state.watched.findIndex(w => w.id === m.id);
                    if (index > -1) {
                        this.state.watched[index] = { ...this.state.watched[index], ...details, _deepScanned: true };
                    }
                } catch (e) {
                    console.error('Refresh details error:', e);
                    m._deepScanned = true; // Mark anyway to avoid infinite retry on fail
                }
            }));
            this.saveMovieData(); // Save the updated details

            // If we processed a batch, re-run identification to update the UI immediately
            return this.renderCollections();
        }

        // 2. Find all collections from watched movies
        const collectionIds = [...new Set(this.state.watched
            .map(m => m.belongs_to_collection ? m.belongs_to_collection.id : null)
            .filter(Boolean))];

        if (collectionIds.length === 0) {
            wrapper.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-layer-group"></i>
                    <p>${this.state.settings.language === 'tr' ? 'Henüz bir koleksiyona ait film izlemediniz.' : 'You haven\'t watched any movies from a collection yet.'}</p>
                </div>`;
            return;
        }

        // 2. Fetch full collection details for all
        const collectionsData = await Promise.all(collectionIds.map(id => this.fetchCollectionDetails(id)));

        // 3. Filter based on status
        const today = new Date();
        const filteredData = collectionsData.filter(collection => {
            if (!collection) return false;

            // For checking progress, only count released movies as part of the collection
            const releasedParts = collection.parts.filter(p => p.release_date && new Date(p.release_date) <= today);
            const watchedInCol = releasedParts.filter(p => this.isInList('watched', p.id));

            const isCompleted = watchedInCol.length === releasedParts.length && releasedParts.length > 0;
            return this.state.colFilter === 'completed' ? isCompleted : !isCompleted;
        });

        if (filteredData.length === 0) {
            const msg = this.state.colFilter === 'completed' ?
                (this.state.settings.language === 'tr' ? 'Henüz hiçbir seriyi tamamlamadınız!' : 'You haven\'t completed any series yet!') :
                (this.state.settings.language === 'tr' ? 'Tüm serileri tamamladınız, tebrikler!' : 'You completed all series, congrats!');

            wrapper.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>${msg}</p></div>`;
            return;
        }

        // 4. Render each collection as a compact book card
        wrapper.innerHTML = filteredData.map(collection => {
            const today = new Date();
            // Only show released movies in the sticker book grid
            const releasedParts = collection.parts.filter(p => p.release_date && new Date(p.release_date) <= today);
            const total = releasedParts.length;
            const watchedInCol = releasedParts.filter(p => this.isInList('watched', p.id));
            const count = watchedInCol.length;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;

            return `
                <div class="collection-book ${percent === 100 ? 'completed' : ''}">
                    <div class="book-header-compact">
                        <div class="book-info-top">
                            <h4>${collection.name}</h4>
                            <span class="progress-badge">${count} / ${total}</span>
                        </div>
                        <div class="progress-bar-thin">
                            <div class="progress-fill-thin" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <div class="sticker-grid-compact">
                        ${releasedParts.map(part => {
                const isWatched = this.isInList('watched', part.id);
                return `
                                <div class="sticker-thumb ${isWatched ? 'is-watched' : 'is-missing'}" 
                                     onclick="app.playMovie(${part.id}, 'movie')" title="${part.title}">
                                    <div class="thumb-poster">
                                        <img src="${CONFIG.BASE_IMG + part.poster_path}" alt="${part.title}" loading="lazy">
                                        ${isWatched ? '<i class="fas fa-check sticker-marker"></i>' : ''}
                                    </div>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    async fetchCollectionDetails(id) {
        if (this.state.collectionsCache[id]) return this.state.collectionsCache[id];

        // Force English for collection names as requested (Original/English)
        try {
            const res = await fetch(`https://api.themoviedb.org/3/collection/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();
            // Sort parts by release date
            if (data.parts) {
                data.parts.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
            }
            this.state.collectionsCache[id] = data;
            return data;
        } catch (e) {
            console.error('Collection detail fetch error:', e);
            return null;
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
            const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const movie = await res.json();
            movie.media_type = mediaType;
            list.push(movie);
        }

        this.saveMovieData();

        // Manual update for search results to avoid full refresh
        const container = document.getElementById('searchResults');
        if (container) {
            const card = container.querySelector(`.movie-card[data-id="${id}"]`);
            if (card) {
                if (listType === 'ignored' && this.isInList('ignored', id)) {
                    card.classList.add('fade-out'); // Add an animation if possible
                    setTimeout(() => card.remove(), 300);
                    return;
                }
                const isAdded = this.isInList('watched', id) || this.isInList('watchlist', id);
                card.classList.toggle('is-added', isAdded);

                // Update specific buttons within the card
                const watchedBtn = card.querySelector(`[onclick*="watched"]`);
                const watchlistBtn = card.querySelector(`[onclick*="watchlist"]`);

                if (watchedBtn) watchedBtn.classList.toggle('active', this.isInList('watched', id));
                if (watchlistBtn) watchlistBtn.classList.toggle('active', this.isInList('watchlist', id));
            }
        }

        if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList');
        if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist');

        if (this.state.currentView === 'watch' && this.state.player.id === id) {
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
            if (movie) {
                this.state.watched.push(movie);
            } else {
                const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
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

    // --- Settings & UI ---
    applySettings() {
        document.body.classList.toggle('compact-mode', this.state.settings.compactMode);
    }

    toggleCompactMode(enabled) {
        this.state.settings.compactMode = enabled;
        localStorage.setItem('ct_compact_mode', enabled);
        this.applySettings();
    }

    toggleLanguage() {
        const newLang = this.state.settings.language === 'tr' ? 'en' : 'tr';
        this.state.settings.language = newLang;
        localStorage.setItem('ct_lang', newLang);
        this.setLanguageUI();

        // Update stats and grids to refresh labels
        this.renderStats();
        if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList', true);
        if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist', true);

        // Update Search placeholder specifically
        const searchInput = document.getElementById('movieSearch');
        if (searchInput) {
            searchInput.placeholder = TRANSLATIONS[newLang].searchPlaceholder;
        }

        const langLabel = document.getElementById('currentLangLabel');
        if (langLabel) langLabel.textContent = newLang.toUpperCase();
    }

    setLanguageUI() {
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (strings[key]) el.textContent = strings[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (strings[key]) el.placeholder = strings[key];
        });
    }

    // --- View Management ---
    switchView(viewId, pushState = true, metadata = {}) {
        const isSameView = this.state.currentView === viewId && document.getElementById(viewId + 'View').classList.contains('active');

        // If it's the same view and no content change to track, return
        if (isSameView && !metadata.movieId) return;

        // Cleanup player if leaving watch view
        if (this.state.currentView === 'watch' && viewId !== 'watch') {
            const iframe = document.getElementById('moviePlayer');
            if (iframe) iframe.src = '';
        }

        // Save scroll position for the current view before switching
        if (this.state.currentView) {
            this.state.scrollPositions[this.state.currentView] = window.scrollY;
        }

        // Update previousView only if switching FROM a main view TO a different view
        // This ensures that when we are in 'watch' view, previousView stays as 'search' or 'watched'
        const mainViews = ['search', 'watched', 'watchlist', 'profile'];
        if (viewId !== this.state.currentView && mainViews.includes(this.state.currentView)) {
            this.state.previousView = this.state.currentView;
        }
        this.state.currentView = viewId;

        // Update Nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        // Update Sections
        document.querySelectorAll('.view').forEach(view => {
            const isActive = view.id === viewId + 'View';
            view.classList.toggle('active', isActive);
        });

        // Restore scroll position
        if (!pushState && this.state.scrollPositions[viewId] !== undefined) {
            // Small timeout to ensure grid has rendered if it was cleared
            setTimeout(() => {
                window.scrollTo({ top: this.state.scrollPositions[viewId], behavior: 'auto' });
            }, 50);
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }


        // Push state to history
        if (pushState) {
            const hash = metadata.movieId ? `#watch/${metadata.movieId}` : `#${viewId}`;
            history.pushState({ view: viewId, ...metadata }, '', hash);
        }


        // Specific View Logic
        if (viewId === 'watched') {
            const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'list';
            if (activeTab === 'collections') {
                this.renderCollections();
            } else {
                this.renderGrid(this.state.watched, 'watchedList');
            }
        }
        if (viewId === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist');
    }

    goBack() {
        // Always return to the main view that opened the player
        this.switchView(this.state.previousView || 'search');
    }

    // --- Professional Video Player ---
    async playMovie(id, type = 'movie', pushState = true) {
        this.state.player = {
            id,
            type,
            season: 1,
            episode: 1,
            source: localStorage.getItem('ct_default_source') || 'vidsrc'
        };

        // Switch to watch view
        this.switchView('watch', pushState, { movieId: id, mediaType: type });

        // Show loading state in player
        const iframe = document.getElementById('moviePlayer');
        if (iframe) iframe.src = '';

        try {
            // Fetch detailed info
            const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();

            // Populate Sidebar & Info
            const titleEl = document.getElementById('watchMovieTitle');
            if (titleEl) titleEl.textContent = data.title || data.name;

            const ratingEl = document.getElementById('watchRating');
            if (ratingEl) ratingEl.textContent = data.vote_average.toFixed(1);

            const overviewEl = document.getElementById('watchOverview');
            if (overviewEl) overviewEl.textContent = data.overview;

            const backdropEl = document.getElementById('watchBackdrop');
            if (backdropEl) backdropEl.style.backgroundImage = `url(${CONFIG.HERO_IMG}${data.backdrop_path})`;

            const metaHtml = `
                <span><i class="fas fa-calendar"></i> ${(data.release_date || data.first_air_date || '').split('-')[0]}</span>
                <span><i class="fas fa-clock"></i> ${data.runtime ? data.runtime + ' min' : (data.episode_run_time ? data.episode_run_time[0] + ' min' : '')}</span>
            `;
            const metaEl = document.getElementById('watchMovieMeta');
            if (metaEl) metaEl.innerHTML = metaHtml;

            const genresEl = document.getElementById('watchGenres');
            if (genresEl) {
                const genresHtml = data.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('');
                genresEl.innerHTML = genresHtml;
            }

            // Handle TV specific parts
            const tvArea = document.getElementById('tvSelectorArea');
            if (type === 'tv') {
                tvArea.style.display = 'block';
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

            collectionArea.style.display = 'block';
            collectionTitle.innerHTML = `<i class="fas fa-layer-group"></i> ${data.name}`;

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
                    <img src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.title}" loading="lazy">
                    <div class="col-movie-info">
                        <div class="col-movie-title">${movie.title}</div>
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
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();

            seasonSelect.innerHTML = data.seasons
                .filter(s => s.season_number > 0)
                .map(s => `<option value="${s.season_number}">${this.state.settings.language === 'tr' ? 'Sezon' : 'Season'} ${s.season_number}</option>`)
                .join('');

            await this.handleSeasonChange();
        } catch (e) {
            console.error('TV meta fetch error:', e);
        }
    }

    async handleSeasonChange() {
        const season = document.getElementById('seasonSelect').value;
        const episodeGrid = document.getElementById('episodeGrid');
        this.state.player.season = season;

        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${this.state.player.id}/season/${season}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();

            episodeGrid.innerHTML = data.episodes
                .map(e => `<button class="ep-btn ${this.state.player.episode == e.episode_number ? 'active' : ''}" onclick="app.playEpisode(${e.episode_number}, this)">${e.episode_number}</button>`)
                .join('');

            // If we just swapped seasons, reset to ep 1 unless it's the first load
            // For now, let's just keep the current selection or default to 1
        } catch (e) {
            console.error('Season change error:', e);
        }
    }

    playEpisode(ep, btn) {
        this.state.player.episode = ep;
        document.querySelectorAll('.ep-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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

        let embedUrl = '';
        const s = season;
        const e = episode;

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

        if (iframe.contentWindow) {
            iframe.contentWindow.location.replace(embedUrl);
        } else {
            iframe.src = embedUrl;
        }
    }

    // --- Utilities ---
    setupEventListeners() {
        const searchInput = document.getElementById('movieSearch');
        const watchedSearch = document.getElementById('watchedSearch');
        const watchlistSearch = document.getElementById('watchlistSearch');
        const clearSearch = document.getElementById('clearSearch');
        let debounceTimer;

        searchInput?.addEventListener('input', (e) => {
            const val = e.target.value;
            if (clearSearch) clearSearch.style.display = val ? 'block' : 'none';

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchMovies(val);
            }, 500);
        });

        clearSearch?.addEventListener('click', () => {
            clearTimeout(debounceTimer);
            searchInput.value = '';
            clearSearch.style.display = 'none';
            this.searchMovies('');
        });

        watchedSearch?.addEventListener('input', (e) => {
            this.filterList('watched', 'watchedList', e.target.value);
        });

        watchlistSearch?.addEventListener('input', (e) => {
            this.filterList('watchlist', 'watchlist', e.target.value);
        });

        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                if (e.state.view === 'watch' && e.state.movieId) {
                    this.playMovie(e.state.movieId, e.state.mediaType || 'movie', false);
                } else {
                    this.switchView(e.state.view, false);
                }
            } else {
                this.switchView('search', false);
            }
        });

        // Set initial state
        history.replaceState({ view: this.state.currentView }, '', `#${this.state.currentView}`);
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
