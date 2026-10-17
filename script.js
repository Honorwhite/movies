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
        autoPlayDesc: 'Filmi otomatik başlat',
        uiLanguage: 'Arayüz Dili',
        uiLanguageDesc: 'Uygulama dilini değiştir',
        accountData: 'Hesap ve Veri',
        changePassword: 'Şifre Değiştir',
        changePasswordDesc: 'Hesap güvenliğini güncelle',
        logout: 'Oturumu Kapat',
        logoutDesc: 'Bu cihazdaki oturumu sonlandır',
        premiumMember: 'PREMIUM ÜYE',
        back: 'Geri Dön',
        episodes: 'Bölümler',
        seasons: 'Sezonlar',
        comingSoon: 'YAKINDA',
        list: 'Liste',
        collections: 'Koleksiyonlar',
        completed: 'Tamamlananlar',
        recentlyWatched: 'Son İzlenenler',
        autoTurkishSub: 'Otomatik Türkçe Altyazı',
        autoTurkishSubDesc: 'Altyazıyı otomatik Türkçe seçer',
        autoSource: 'Otomatik Kaynak Seçimi',
        autoSourceDesc: 'Her zaman ilk kaynağı öncelikli seçer',
        tvMode: 'TV Modu',
        tvModeDesc: 'Kumanda ile kullanım için optimize eder',
        loginTitle: 'Giriş Yap',
        signupTitle: 'Kayıt Ol',
        loginDesc: 'Kaldığınız yerden devam edin.',
        signupDesc: 'Yeni bir hesap oluşturun.',
        username: 'Kullanıcı Adı',
        password: 'Şifre',
        confirmPassword: 'Şifreyi Onayla',
        loginBtn: 'Giriş Yap',
        signupBtn: 'Kayıt Ol',
        noAccount: 'Hesabınız yok mu? ',
        hasAccount: 'Zaten hesabınız var mı? ',
        shortUsername: 'Kullanıcı adı en az 3 karakter olmalıdır.',
        shortPassword: 'Şifre en az 4 karakter olmalıdır.',
        passwordMismatch: 'Şifreler eşleşmiyor!',
        userExists: 'Bu kullanıcı adı zaten alınmış!',
        invalidCredentials: 'Kullanıcı adı veya şifre hatalı!',
        spotlightBadge: 'İzlenecekler Listenden',
        spotlightHook: 'Bu Akşam Ne İzlesem?',
        spotlightWatchBtn: 'Hemen İzle',
        spotlightShuffleBtn: 'Başka Öner',
        spotlightWatchedBtn: 'İzledim',
        spotlightOtherPicks: 'Listenden Diğer Öneriler',
        spotlightTypeMovie: 'Film',
        spotlightTypeTv: 'Dizi'
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
        completed: 'Completed',
        recentlyWatched: 'Recently Watched',
        autoTurkishSub: 'Auto Turkish Subtitles',
        autoTurkishSubDesc: 'Automatically selects Turkish subtitles',
        autoSource: 'Auto Source Selection',
        autoSourceDesc: 'Always prioritizes the first source',
        tvMode: 'TV Mode',
        tvModeDesc: 'Optimizes for remote control use',
        loginTitle: 'Log In',
        signupTitle: 'Sign Up',
        loginDesc: 'Pick up where you left off.',
        signupDesc: 'Create a new account.',
        username: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        loginBtn: 'Log In',
        signupBtn: 'Sign Up',
        noAccount: "Don't have an account? ",
        hasAccount: 'Already have an account? ',
        shortUsername: 'Username must be at least 3 characters.',
        shortPassword: 'Password must be at least 4 characters.',
        passwordMismatch: 'Passwords do not match!',
        userExists: 'This username is already taken!',
        invalidCredentials: 'Invalid username or password!',
        spotlightBadge: 'From Your Watchlist',
        spotlightHook: 'What To Watch Tonight?',
        spotlightWatchBtn: 'Watch Now',
        spotlightShuffleBtn: 'Suggest Another',
        spotlightWatchedBtn: 'Watched',
        spotlightOtherPicks: 'Other Picks from List',
        spotlightTypeMovie: 'Movie',
        spotlightTypeTv: 'TV Series'
    }
};

const CONFIG = {
    TMDB_KEY: '4a9f3fe6b13e66b0dd355b7318b7e0e4',
    BASE_IMG: 'https://image.tmdb.org/t/p/w500',
    HERO_IMG: 'https://image.tmdb.org/t/p/original',
    SUPABASE_URL: 'https://gbdqycgclxhblhhjhpbm.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHF5Y2djbHhoYmxoaGpocGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Njk2MjMsImV4cCI6MjA4MzA0NTYyM30.85TIwLzahIY30zRlY_y2afw_eziDaYLhXWCCh1HZu5I'
};

const CATALOGS = [
    { id: 'imdb_top', tr: 'IMDB Top', en: 'IMDB Top', icon: 'fa-star', type: 'movie', endpoint: 'discover/movie?sort_by=vote_average.desc&vote_count.gte=10000' },
    { id: 'horror', tr: 'Korku Klasikleri', en: 'Horror Classics', icon: 'fa-ghost', type: 'movie', endpoint: 'discover/movie?with_genres=27&primary_release_date.lte=1999-12-31&sort_by=vote_average.desc&vote_count.gte=1000' },
    { id: 'popular_tv', tr: 'Popüler Diziler', en: 'Popular TV', icon: 'fa-tv', type: 'tv', endpoint: 'discover/tv?sort_by=popularity.desc&vote_count.gte=1000' },
    { id: 'action', tr: 'Aksiyon', en: 'Action', icon: 'fa-fire', type: 'movie', endpoint: 'discover/movie?with_genres=28&sort_by=popularity.desc' },
    { id: 'sci_fi', tr: 'Bilim Kurgu', en: 'Sci-Fi', icon: 'fa-robot', type: 'movie', endpoint: 'discover/movie?with_genres=878&sort_by=popularity.desc' },
    { id: 'comedy', tr: 'Komedi', en: 'Comedy', icon: 'fa-laugh-beam', type: 'movie', endpoint: 'discover/movie?with_genres=35&sort_by=popularity.desc' },
    { id: 'drama', tr: 'Dram', en: 'Drama', icon: 'fa-theater-masks', type: 'movie', endpoint: 'discover/movie?with_genres=18&sort_by=popularity.desc' },
    { id: 'adventure', tr: 'Macera', en: 'Adventure', icon: 'fa-mountain', type: 'movie', endpoint: 'discover/movie?with_genres=12&sort_by=popularity.desc' },
    { id: 'mystery', tr: 'Gizem', en: 'Mystery', icon: 'fa-mask', type: 'movie', endpoint: 'discover/movie?with_genres=9648&sort_by=popularity.desc' },
    { id: 'thriller', tr: 'Gerilim', en: 'Thriller', icon: 'fa-user-secret', type: 'movie', endpoint: 'discover/movie?with_genres=53&sort_by=popularity.desc' },
    { id: 'animation', tr: 'Animasyon', en: 'Animation', icon: 'fa-film', type: 'movie', endpoint: 'discover/movie?with_genres=16&sort_by=popularity.desc' }
];


class KeyboardManager {
    constructor(app) {
        this.app = app;
        this.focusedIndex = -1;
        this.navigableElements = [];
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    init() {
        window.addEventListener('keydown', this.handleKeyDown);
        this.refreshNavigableElements();
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.clearFocus();
    }

    refreshNavigableElements() {
        const view = document.querySelector('.view.active');
        const authOverlay = document.getElementById('authOverlay');
        const isAuthVisible = authOverlay && authOverlay.style.display !== 'none';

        if (!view && !isAuthVisible) return;

        let elements = [];

        if (isAuthVisible) {
            elements = [...authOverlay.querySelectorAll('input, button')];
        } else {
            // Collect all interactive elements in the current view + global nav
            elements = [
                ...document.querySelectorAll('.nav-btn'),
                ...view.querySelectorAll('input, button, .movie-card, .chip, .source-chip, .ep-btn, .col-movie-card, select')
            ];
        }

        this.navigableElements = elements.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
        });

        // If nothing is focused, focus the first element
        if (this.focusedIndex === -1 && elements.length > 0) {
            this.setFocus(0);
        }
    }

    handleKeyDown(e) {
        if (!this.app.state.settings.tvMode) return;

        // Skip keyboard nav if typing in an input (unless it's ArrowDown/Up to leave input)
        if (document.activeElement.tagName === 'INPUT' && !['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
            return;
        }

        this.refreshNavigableElements();

        switch (e.key) {
            case 'ArrowRight':
                this.moveFocus(1);
                e.preventDefault();
                break;
            case 'ArrowLeft':
                this.moveFocus(-1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.moveFocusGrid('down');
                e.preventDefault();
                break;
            case 'ArrowUp':
                this.moveFocusGrid('up');
                e.preventDefault();
                break;
            case 'Enter':
                this.clickFocused();
                e.preventDefault();
                break;
            case 'Escape':
            case 'Backspace':
                if (this.app.state.currentView === 'watch') {
                    this.app.goBack();
                } else if (this.app.state.currentView !== 'search') {
                    this.app.switchView('search');
                }
                e.preventDefault();
                break;
        }
    }

    moveFocus(delta) {
        let next = this.focusedIndex + delta;
        if (next < 0) next = 0;
        if (next >= this.navigableElements.length) next = this.navigableElements.length - 1;
        this.setFocus(next);
    }

    moveFocusGrid(direction) {
        if (this.focusedIndex === -1) return this.setFocus(0);

        const currentRect = this.navigableElements[this.focusedIndex].getBoundingClientRect();
        const currentCenter = currentRect.left + currentRect.width / 2;

        let bestMatch = -1;
        let bestDistance = Infinity;

        this.navigableElements.forEach((el, index) => {
            if (index === this.focusedIndex) return;

            const rect = el.getBoundingClientRect();
            const center = rect.left + rect.width / 2;

            if (direction === 'down' && rect.top >= currentRect.bottom - 5) {
                const dist = Math.abs(center - currentCenter) + (rect.top - currentRect.bottom);
                if (dist < bestDistance) {
                    bestDistance = dist;
                    bestMatch = index;
                }
            } else if (direction === 'up' && rect.bottom <= currentRect.top + 5) {
                const dist = Math.abs(center - currentCenter) + (currentRect.top - rect.bottom);
                if (dist < bestDistance) {
                    bestDistance = dist;
                    bestMatch = index;
                }
            }
        });

        if (bestMatch !== -1) {
            this.setFocus(bestMatch);
        } else if (direction === 'up') {
            // If we can't go up anymore in the view, try focusing the nav
            const navBtns = document.querySelectorAll('.nav-btn');
            if (navBtns.length > 0) {
                const firstNavBtn = Array.from(this.navigableElements).findIndex(el => el.classList.contains('nav-btn'));
                if (firstNavBtn !== -1) this.setFocus(firstNavBtn);
            }
        }
    }

    setFocus(index) {
        this.clearFocus();
        this.focusedIndex = index;
        const el = this.navigableElements[index];
        if (el) {
            el.classList.add('focused');
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearFocus() {
        this.navigableElements.forEach(el => el.classList.remove('focused'));
    }

    clickFocused() {
        if (this.focusedIndex !== -1) {
            const el = this.navigableElements[this.focusedIndex];
            el.click();

            // Re-refresh after click as view might have changed
            setTimeout(() => this.refreshNavigableElements(), 100);
        }
    }
}

class CineTrack {
    constructor() {
        this.state = {
            user: null,
            watched: [],
            watchlist: [],
            trending: [],
            search: [],
            ignored: [],
            watchedEpisodes: {},
            recentlyPlayed: [],
            spotlightPicks: [],
            spotlightActiveIndex: 0,
            page: 1,
            isSearching: false,
            isLoading: false,
            currentView: 'search',
            previousView: 'search',
            settings: {
                compactMode: localStorage.getItem('ct_compact_mode') === 'true',
                language: localStorage.getItem('ct_lang') || 'tr',
                autoTurkishSub: localStorage.getItem('ct_auto_tr_sub') === 'true',
                autoSource: localStorage.getItem('ct_auto_source') === 'true',
                tvMode: localStorage.getItem('ct_tv_mode') === 'true',
                autoPlay: localStorage.getItem('ct_auto_play') !== 'false'
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
            colFilter: 'ongoing',
            currentCatalog: null,
            universeFilter: 'all',
            universeSearchQuery: '',
            activeUniverseModalId: null,
            activeModalTag: 'all'
        };

        this.init();
    }

    async init() {
        console.log('CineTrack Initializing...');
        localStorage.removeItem('ct_synced_universe_items');
        this.checkDisclaimerState();
        this.applySettings();
        this.setupEventListeners();
        await this.checkAuth();
        this.initInfiniteScroll();
        await this.fetchGenres();
        this.renderCatalogs();

        // Load initial data in background
        if (this.state.user) {
            this.loadMovieData(); // No await here to speed up startup
            this.fetchTrending();
        }

        // Initial UI translation
        this.setLanguageUI();

        // Hide loader much faster
        setTimeout(() => {
            document.getElementById('appLoader').classList.add('hidden');
        }, 300);
    }

    // --- Auth & Storage ---
    async checkAuth() {
        const savedUser = localStorage.getItem('ct_active_user');
        if (savedUser) {
            this.state.user = savedUser;

            // Ensure legacy user exists in system_users cloud list
            const users = await this.getCloudUsers();
            const userKey = savedUser.toLowerCase();
            const existingUser = users.find(u => u.username.toLowerCase() === userKey);
            if (!existingUser) {
                users.push({
                    username: savedUser,
                    password: '1234',
                    avatar: 'fas fa-user-circle'
                });
                await this.saveCloudUsers(users);
            }

            this.updateProfileUI();
        } else {
            this.showLogin();
        }
    }

    async getCloudUsers() {
        try {
            const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/movie_tracker?id=eq.system_users`, {
                headers: {
                    'apikey': CONFIG.SUPABASE_KEY,
                    'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0 && data[0].content && data[0].content.users) {
                    return data[0].content.users;
                }
            }
        } catch (e) {
            console.error('Failed to fetch system_users from cloud:', e);
        }
        return [];
    }

    async saveCloudUsers(usersList) {
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
                    id: 'system_users',
                    content: {
                        users: usersList,
                        lastUpdated: Date.now()
                    }
                })
            });
        } catch (e) {
            console.error('Failed to save system_users to cloud:', e);
        }
    }

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem('ct_users') || '{}');
        } catch (e) {
            return {};
        }
    }

    showLogin(mode = 'login') {
        const authOverlay = document.getElementById('authOverlay');
        const authContainer = document.getElementById('authContainer');
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];
        authOverlay.style.display = 'flex';

        if (mode === 'login') {
            authContainer.innerHTML = `
                <form onsubmit="event.preventDefault(); app.handleAuth('login', event)">
                    <div class="auth-logo"><i class="fas fa-play"></i></div>
                    <h2 style="margin-bottom: 0.5rem;">${strings.loginTitle}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">${strings.loginDesc}</p>
                    <input type="text" id="username" class="input-field" placeholder="${strings.username}" required>
                    <input type="password" id="password" class="input-field" placeholder="${strings.password}" required>
                    <button type="submit" class="btn-primary">${strings.loginBtn}</button>
                    <div class="auth-toggle-link" onclick="app.showLogin('signup')">
                        ${strings.noAccount}<span>${strings.signupBtn}</span>
                    </div>
                </form>
            `;
        } else {
            authContainer.innerHTML = `
                <form onsubmit="event.preventDefault(); app.handleAuth('signup', event)">
                    <div class="auth-logo"><i class="fas fa-play"></i></div>
                    <h2 style="margin-bottom: 0.5rem;">${strings.signupTitle}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">${strings.signupDesc}</p>
                    <input type="text" id="username" class="input-field" placeholder="${strings.username}" required>
                    <input type="password" id="password" class="input-field" placeholder="${strings.password}" required>
                    <input type="password" id="password_confirm" class="input-field" placeholder="${strings.confirmPassword}" required>
                    <button type="submit" class="btn-primary">${strings.signupBtn}</button>
                    <div class="auth-toggle-link" onclick="app.showLogin('login')">
                        ${strings.hasAccount}<span>${strings.loginBtn}</span>
                    </div>
                </form>
            `;
        }

        if (this.keyboardManager && this.state.settings.tvMode) {
            this.keyboardManager.focusedIndex = -1;
            this.keyboardManager.refreshNavigableElements();
        }
    }

    async handleAuth(mode = 'login', event = null) {
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];

        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');

        if (!usernameEl || !passwordEl) return;

        const user = usernameEl.value.trim();
        const password = passwordEl.value;

        if (user.length < 3) {
            alert(strings.shortUsername);
            return;
        }
        if (password.length < 4) {
            alert(strings.shortPassword);
            return;
        }

        // Disable button during network requests
        const submitBtn = event && event.target ? (event.target.tagName === 'FORM' ? event.target.querySelector('button[type="submit"]') : event.target) : null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = lang === 'tr' ? 'Lütfen bekleyin...' : 'Please wait...';
        }

        const users = await this.getCloudUsers();
        const userKey = user.toLowerCase();
        const existingUser = users.find(u => u.username.toLowerCase() === userKey);

        if (mode === 'signup') {
            const passwordConfirmEl = document.getElementById('password_confirm');
            if (!passwordConfirmEl) {
                this.resetAuthBtn(event, mode, lang);
                return;
            }
            const passwordConfirm = passwordConfirmEl.value;

            if (password !== passwordConfirm) {
                alert(strings.passwordMismatch);
                this.resetAuthBtn(event, mode, lang);
                return;
            }

            if (existingUser) {
                alert(strings.userExists);
                this.resetAuthBtn(event, mode, lang);
                return;
            }

            users.push({
                username: user,
                password: password,
                avatar: 'fas fa-user-circle'
            });

            await this.saveCloudUsers(users);
        } else {
            if (!existingUser) {
                alert(strings.invalidCredentials);
                this.resetAuthBtn(event, mode, lang);
                return;
            }

            if (existingUser.password !== password) {
                alert(strings.invalidCredentials);
                this.resetAuthBtn(event, mode, lang);
                return;
            }
        }

        this.state.user = user;
        localStorage.setItem('ct_active_user', user);

        // Also cache locally
        const localUsers = this.getUsers();
        localUsers[userKey] = password;
        localStorage.setItem('ct_users', JSON.stringify(localUsers));

        document.getElementById('authOverlay').style.display = 'none';
        this.updateProfileUI();
        await this.loadMovieData();
        this.fetchTrending();

        if (this.state.settings.tvMode && this.keyboardManager) {
            this.keyboardManager.focusedIndex = -1;
            this.keyboardManager.refreshNavigableElements();
        }
    }

    resetAuthBtn(event, mode, lang) {
        const submitBtn = event && event.target ? (event.target.tagName === 'FORM' ? event.target.querySelector('button[type="submit"]') : event.target) : null;
        if (submitBtn) {
            submitBtn.disabled = false;
            if (mode === 'signup') {
                submitBtn.textContent = TRANSLATIONS[lang].signupBtn;
            } else {
                submitBtn.textContent = TRANSLATIONS[lang].loginBtn;
            }
        }
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

        const autoSubToggle = document.getElementById('autoSubToggle');
        if (autoSubToggle) autoSubToggle.checked = this.state.settings.autoTurkishSub;

        const autoSourceToggle = document.getElementById('autoSourceToggle');
        if (autoSourceToggle) autoSourceToggle.checked = this.state.settings.autoSource;

        const tvModeToggle = document.getElementById('tvModeToggle');
        if (tvModeToggle) tvModeToggle.checked = this.state.settings.tvMode;

        const autoPlayToggle = document.getElementById('autoPlayToggle');
        if (autoPlayToggle) autoPlayToggle.checked = this.state.settings.autoPlay;

        this.applySettings();
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

        this.renderCatalogs();
    }

    async changePassword() {
        const lang = this.state.settings.language;
        const promptMsg = lang === 'tr' ? 'Yeni şifrenizi girin:' : 'Enter your new password:';
        const successMsg = lang === 'tr' ? 'Şifreniz başarıyla güncellendi!' : 'Password updated successfully!';
        const shortPassMsg = lang === 'tr' ? 'Şifre en az 4 karakter olmalıdır.' : 'Password must be at least 4 characters.';

        const newPass = prompt(promptMsg);
        if (!newPass) return;
        if (newPass.length < 4) {
            alert(shortPassMsg);
            return;
        }

        if (this.state.user) {
            const users = await this.getCloudUsers();
            const userKey = this.state.user.toLowerCase();
            const existingUser = users.find(u => u.username.toLowerCase() === userKey);
            if (existingUser) {
                existingUser.password = newPass;
                await this.saveCloudUsers(users);

                // Also update local cache
                const localUsers = this.getUsers();
                localUsers[userKey] = newPass;
                localStorage.setItem('ct_users', JSON.stringify(localUsers));

                alert(successMsg);
                this.syncWithCloud();
            }
        }
    }

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

    // --- API Calls ---
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



    setUniverseFilter(filter, btn) {
        this.state.universeFilter = filter;
        document.querySelectorAll('.universe-pills-nav .u-pill').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderUniversesPage(false);
    }

    handleUniverseSearch(query) {
        this.state.universeSearchQuery = (query || '').trim().toLowerCase();
        this.renderUniversesPage(false);
    }

    async renderUniversesPage(showLoader = true) {
        const grid = document.getElementById('universesGrid');
        if (!grid) return;

        if (showLoader && !grid.children.length) {
            grid.innerHTML = `<div class="loader-spinner center"></div>`;
        }

        const isTr = this.state.settings.language === 'tr';

        // 1. Proactively deep scan movies in watched list that are missing collection info
        const moviesToScan = this.state.watched.filter(m =>
            (m.media_type === 'movie' || !m.media_type) &&
            m.belongs_to_collection === undefined &&
            !m._deepScanned
        );
        if (moviesToScan.length > 0) {
            const batch = moviesToScan.slice(0, 30);
            await Promise.all(batch.map(async (m) => {
                try {
                    const res = await fetch(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                    const details = await res.json();
                    const index = this.state.watched.findIndex(w => Number(w.id) === Number(m.id));
                    if (index > -1) {
                        this.state.watched[index] = { ...this.state.watched[index], ...details, _deepScanned: true };
                    }
                } catch (e) {
                    m._deepScanned = true;
                }
            }));
            this.saveMovieData();
        }

        // 2. Discover collection IDs from watched movies
        const seenColIds = new Set();
        const collectionIds = [];
        this.state.watched.forEach(m => {
            if (m.belongs_to_collection && m.belongs_to_collection.id && !seenColIds.has(m.belongs_to_collection.id)) {
                seenColIds.add(m.belongs_to_collection.id);
                collectionIds.push(m.belongs_to_collection.id);
            }
        });

        // 3. Fetch full collection details for all discovered collections in parallel
        if (collectionIds.length > 0) {
            await Promise.all(collectionIds.map(id => this.fetchCollectionDetails(id)));
        }

        // 4. Build user franchise objects with actual items from cache
        const userFranchises = [];
        const today = new Date();
        for (const colId of collectionIds) {
            const colData = this.state.collectionsCache[colId];
            if (!colData || !colData.parts || colData.parts.length === 0) continue;

            const releasedParts = colData.parts.filter(p => p.release_date && new Date(p.release_date) <= today);
            const partsToUse = releasedParts.length > 0 ? releasedParts : colData.parts;

            const items = partsToUse.map(p => ({
                id: p.id,
                media_type: 'movie',
                title: p.title || p.original_title,
                year: (p.release_date || '').substring(0, 4),
                release_date: p.release_date,
                score: Math.round((p.vote_average || 0) * 10) / 10,
                poster_path: p.poster_path,
                backdrop_path: p.backdrop_path,
                overview: p.overview || '',
                tag: isTr ? 'Film' : 'Movie'
            }));

            userFranchises.push({
                id: `col-${colId}`,
                colId: colId,
                category: 'franchise',
                name: colData.name,
                nameEn: colData.name,
                creator: isTr ? 'Film Serisi' : 'Movie Franchise',
                tagline: colData.overview || (isTr ? `${colData.name} serisinin tüm yapımları.` : `All titles from ${colData.name}.`),
                accent: '#3b82f6',
                icon: 'fa-film',
                badge: isTr ? 'İzlediğim Seri' : 'Watched Franchise',
                backdrop: colData.backdrop_path,
                poster_path: colData.poster_path,
                items: items,
                isFranchise: true
            });
        }

        // 5. Combine curated universes and user franchises
        const universes = (window.CURATED_UNIVERSES || []).map(u => ({
            ...u,
            items: [...(u.items || [])]
        }));
        const combinedUniverses = [...universes, ...userFranchises];

        // 6. Robust watched matching (by ID, Title, and TV episodes)
        const allWatchedIds = new Set(this.state.watched.map(w => Number(w.id)));
        const allWatchedTitles = new Set(
            this.state.watched.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );

        const isItemWatched = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchedIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            if (t && allWatchedTitles.has(t)) return true;
            if ((it.media_type === 'tv' || it.type === 'tv') && this.state.watchedEpisodes && this.state.watchedEpisodes[it.id]) {
                const eps = Object.values(this.state.watchedEpisodes[it.id]);
                if (eps.some(Boolean)) return true;
            }
            return false;
        };

        // 7. Overall stats across all universes
        let totalWatchedProductions = 0;
        let completedUniversesCount = 0;

        combinedUniverses.forEach(u => {
            const items = u.items || [];
            if (items.length > 0) {
                const watchedInU = items.filter(it => isItemWatched(it));
                totalWatchedProductions += watchedInU.length;
                if (watchedInU.length === items.length) {
                    completedUniversesCount++;
                }
            }
        });

        const statsStrip = document.getElementById('universesStatsStrip');
        if (statsStrip) {
            statsStrip.innerHTML = `
                <div class="u-stat-card">
                    <div class="u-stat-icon" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd;">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="u-stat-info">
                        <span class="u-stat-num">${combinedUniverses.length}</span>
                        <span class="u-stat-lbl">${isTr ? 'Koleksiyon' : 'Collections'}</span>
                    </div>
                </div>
                <div class="u-stat-card">
                    <div class="u-stat-icon" style="background: rgba(34, 197, 94, 0.2); color: #4ade80;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="u-stat-info">
                        <span class="u-stat-num">${totalWatchedProductions}</span>
                        <span class="u-stat-lbl">${isTr ? 'İzlenen' : 'Watched'}</span>
                    </div>
                </div>
                <div class="u-stat-card">
                    <div class="u-stat-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="u-stat-info">
                        <span class="u-stat-num">${completedUniversesCount}</span>
                        <span class="u-stat-lbl">${isTr ? 'Tamamlanan' : 'Completed'}</span>
                    </div>
                </div>
            `;
        }

        // 8. Apply category filter
        const catFilter = this.state.universeFilter || 'all';
        let filtered = combinedUniverses.filter(u => {
            if (catFilter === 'all') return true;
            return u.category === catFilter;
        });

        // 9. Apply search filter
        const q = this.state.universeSearchQuery;
        if (q) {
            filtered = filtered.filter(u => {
                const name = (u.name || '').toLowerCase();
                const nameEn = (u.nameEn || '').toLowerCase();
                const creator = (u.creator || '').toLowerCase();
                const tagline = (u.tagline || '').toLowerCase();
                const hasItemMatch = (u.items || []).some(it => (it.title || '').toLowerCase().includes(q));
                return name.includes(q) || nameEn.includes(q) || creator.includes(q) || tagline.includes(q) || hasItemMatch;
            });
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 4rem 1rem;">
                    <i class="fas fa-search" style="font-size: 2.5rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; color: var(--text-muted);">
                        ${isTr ? 'Aradığınız kriterlere uygun evren veya koleksiyon bulunamadı.' : 'No universes or collections found matching your search.'}
                    </p>
                </div>
            `;
            return;
        }

        // 10. Render Cards
        grid.innerHTML = filtered.map(u => {
            const items = u.items || [];
            const total = items.length;
            if (total === 0) return '';

            const watchedItems = items.filter(it => isItemWatched(it));
            const watchedCount = watchedItems.length;
            const percent = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
            const isCompleted = percent === 100 && total > 0;

            const bgImg = u.backdrop ? (CONFIG.BASE_IMG + u.backdrop) : (items[0] && items[0].backdrop_path ? CONFIG.BASE_IMG + items[0].backdrop_path : (u.poster_path ? CONFIG.BASE_IMG + u.poster_path : ''));
            const accent = u.accent || '#8b5cf6';
            const icon = u.icon || 'fa-layer-group';
            const displayName = isTr ? (u.name || u.nameEn) : (u.nameEn || u.name);
            const displayTagline = isTr ? (u.tagline || u.taglineEn) : (u.taglineEn || u.tagline);

            // Mini posters preview (first 5)
            const previewItems = items.slice(0, 5);
            const remainingCount = total - previewItems.length;

            return `
                <div class="universe-card" 
                     style="--u-accent: ${accent}; --u-accent-glow: ${accent}44;" 
                     onclick="app.openUniverseModal('${u.id}')">
                    <div class="u-card-backdrop" style="background-image: url('${bgImg}')"></div>
                    <div class="u-card-overlay"></div>
                    
                    <div class="u-card-content">
                        <div>
                            <div class="u-card-top">
                                <span class="u-badge">
                                    <i class="fas ${icon}"></i> ${u.badge || (u.category === 'director' ? 'Yönetmen' : 'Evren')}
                                </span>
                                ${isCompleted ? `
                                    <span class="u-trophy-badge">
                                        <i class="fas fa-trophy"></i> ${isTr ? 'Tamamlandı' : 'Completed'}
                                    </span>
                                ` : ''}
                            </div>

                            <div class="u-card-middle">
                                <h3 class="u-card-title">${displayName}</h3>
                                <div class="u-card-creator">
                                    <i class="fas fa-user-pen" style="font-size: 0.75rem;"></i> ${u.creator || ''}
                                </div>
                                <p class="u-card-tagline">${displayTagline || ''}</p>
                            </div>
                        </div>

                        <div>
                            <div class="u-card-progress-box">
                                <div class="u-progress-header">
                                    <span class="u-progress-count">${watchedCount} / ${total} ${isTr ? 'İzlendi' : 'Watched'}</span>
                                    <span class="u-progress-percent">%${percent}</span>
                                </div>
                                <div class="u-progress-bar-bg">
                                    <div class="u-progress-bar-fill" style="width: ${percent}%;"></div>
                                </div>
                            </div>

                            <div class="u-posters-strip">
                                ${previewItems.map(item => {
                const isW = isItemWatched(item);
                const posterUrl = item.poster_path ? (CONFIG.BASE_IMG + item.poster_path) : '';
                return `
                                        <div class="u-mini-poster ${isW ? 'watched' : ''}" title="${item.title}">
                                            ${posterUrl ? `<img src="${posterUrl}" alt="${item.title}" loading="lazy">` : ''}
                                        </div>
                                    `;
            }).join('')}
                                ${remainingCount > 0 ? `
                                    <div class="u-posters-more">+${remainingCount}</div>
                                ` : ''}
                            </div>

                            <div class="u-card-bottom">
                                <span class="u-explore-btn">
                                    ${isTr ? 'Koleksiyonu İncele' : 'Explore Collection'} <i class="fas fa-arrow-right"></i>
                                </span>
                                <span class="u-total-count-tag">
                                    ${total} ${isTr ? 'Yapım' : 'Titles'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async openUniverseModal(universeId) {
        const modal = document.getElementById('universeDetailModal');
        const content = document.getElementById('universeModalContent');
        if (!modal || !content) return;

        const isTr = this.state.settings.language === 'tr';
        this.state.activeUniverseModalId = universeId;
        this.state.activeModalTag = 'all';

        // 1. Find the universe
        let universe = (window.CURATED_UNIVERSES || []).find(u => u.id === universeId);

        // If not found in curated, check dynamic franchises
        if (!universe && universeId.startsWith('col-')) {
            const colId = parseInt(universeId.replace('col-', ''));
            const colData = await this.fetchCollectionDetails(colId);
            if (colData) {
                const today = new Date();
                const releasedParts = (colData.parts || []).filter(p => p.release_date && new Date(p.release_date) <= today);
                const partsToUse = releasedParts.length > 0 ? releasedParts : (colData.parts || []);

                universe = {
                    id: universeId,
                    colId: colId,
                    category: 'franchise',
                    name: colData.name,
                    nameEn: colData.name,
                    creator: isTr ? 'Film Serisi' : 'Movie Franchise',
                    tagline: colData.overview || (isTr ? `${colData.name} serisinin tüm yapımları.` : `All titles in ${colData.name}.`),
                    accent: '#3b82f6',
                    icon: 'fa-film',
                    badge: isTr ? 'Film Serisi' : 'Movie Franchise',
                    backdrop: colData.backdrop_path,
                    items: partsToUse.map(p => ({
                        id: p.id,
                        media_type: 'movie',
                        title: p.title,
                        year: (p.release_date || '').substring(0, 4),
                        release_date: p.release_date,
                        score: Math.round((p.vote_average || 0) * 10) / 10,
                        poster_path: p.poster_path,
                        backdrop_path: p.backdrop_path,
                        overview: p.overview,
                        tag: isTr ? 'Film' : 'Movie'
                    }))
                };
            }
        }

        if (!universe) return;

        this.currentModalUniverse = universe;
        this.renderModalContent();

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    renderModalContent() {
        const content = document.getElementById('universeModalContent');
        if (!content || !this.currentModalUniverse) return;

        const universe = this.currentModalUniverse;
        const isTr = this.state.settings.language === 'tr';
        const allWatchedIds = new Set(this.state.watched.map(w => Number(w.id)));
        const allWatchedTitles = new Set(
            this.state.watched.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );
        const allWatchlistIds = new Set(this.state.watchlist.map(w => Number(w.id)));
        const allWatchlistTitles = new Set(
            this.state.watchlist.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );

        const isItemWatched = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchedIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            if (t && allWatchedTitles.has(t)) return true;
            if ((it.media_type === 'tv' || it.type === 'tv') && this.state.watchedEpisodes && this.state.watchedEpisodes[it.id]) {
                const eps = Object.values(this.state.watchedEpisodes[it.id]);
                if (eps.some(Boolean)) return true;
            }
            return false;
        };

        const isItemWatchlist = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchlistIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            return !!(t && allWatchlistTitles.has(t));
        };

        const items = universe.items || [];
        const total = items.length;
        const watchedCount = items.filter(it => isItemWatched(it)).length;
        const unwatchedNotWatchlist = items.filter(it => !isItemWatched(it) && !isItemWatchlist(it));
        const unwatchedNotWatchlistCount = unwatchedNotWatchlist.length;
        const missingCount = total - watchedCount;
        const percent = total > 0 ? Math.round((watchedCount / total) * 100) : 0;

        const bgImg = universe.backdrop ? (CONFIG.BASE_IMG + universe.backdrop) : '';
        const accent = universe.accent || '#8b5cf6';
        const displayName = isTr ? (universe.name || universe.nameEn) : (universe.nameEn || universe.name);
        const displayTagline = isTr ? (universe.tagline || universe.taglineEn) : (universe.taglineEn || universe.tagline);

        // Tags for filtering inside the modal
        const distinctTags = [...new Set(items.map(it => it.tag).filter(Boolean))];

        // Filter modal items based on activeModalTag
        const currentTag = this.state.activeModalTag || 'all';
        let displayedItems = items;
        if (currentTag === 'watched') {
            displayedItems = items.filter(it => isItemWatched(it));
        } else if (currentTag === 'unwatched') {
            displayedItems = items.filter(it => !isItemWatched(it));
        } else if (currentTag !== 'all') {
            displayedItems = items.filter(it => it.tag === currentTag);
        }

        content.innerHTML = `
            <div class="u-modal-hero" style="--modal-accent: ${accent}; --modal-accent-glow: ${accent}44;">
                <div class="u-modal-hero-bg" style="background-image: url('${bgImg}')"></div>
                <div class="u-modal-hero-gradient"></div>

                <div class="u-modal-hero-content">
                    <span class="u-badge" style="margin-bottom: 0.8rem;">
                        <i class="fas ${universe.icon || 'fa-layer-group'}"></i> ${universe.badge || ''}
                    </span>
                    <h2 class="u-modal-title">${displayName}</h2>
                    <div class="u-modal-subtitle">
                        <i class="fas fa-user-pen"></i> ${universe.creator || ''}
                    </div>
                    <p class="u-modal-desc">${displayTagline || ''}</p>

                    <div class="u-modal-hero-bar">
                        <div class="u-modal-progress-strip">
                            <div>
                                <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 3px;">
                                    ${watchedCount} / ${total} ${isTr ? 'İzlendi' : 'Watched'} (%${percent})
                                </div>
                                <div class="u-progress-bar-bg" style="width: 140px; height: 6px;">
                                    <div class="u-progress-bar-fill" style="width: ${percent}%;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="u-modal-actions">
                            ${watchedCount === total && total > 0 ? `
                                <div class="u-trophy-badge" style="padding: 0.65rem 1.3rem; font-size: 0.85rem;">
                                    <i class="fas fa-trophy"></i> <span>${isTr ? 'Tüm Seri Tamamlandı! 🏆' : 'Entire Series Completed! 🏆'}</span>
                                </div>
                            ` : unwatchedNotWatchlistCount > 0 ? `
                                <button id="addMissingWatchlistBtn" class="u-action-btn u-action-btn-primary" 
                                        onclick="app.addMissingUniverseToWatchlist('${universe.id}')">
                                    <i class="fas fa-plus-circle"></i> 
                                    <span>${isTr ? `Eksikleri İzleneceklere Ekle (${unwatchedNotWatchlistCount})` : `Add Missing to Watchlist (${unwatchedNotWatchlistCount})`}</span>
                                </button>
                            ` : `
                                <div class="u-action-btn is-done">
                                    <i class="fas fa-check-double"></i> 
                                    <span>${isTr ? 'Tüm Eksikler İzleneceklerde ✓' : 'All Missing in Watchlist ✓'}</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>

            <div class="u-modal-body" style="--modal-accent: ${accent}; --modal-accent-glow: ${accent}44;">
                <div class="u-modal-controls">
                    <div class="u-modal-filter-pills">
                        <button class="u-m-pill ${currentTag === 'all' ? 'active' : ''}" 
                                onclick="app.setModalTagFilter('all')">
                            ${isTr ? 'Tümü' : 'All'} (${total})
                        </button>
                        <button class="u-m-pill ${currentTag === 'unwatched' ? 'active' : ''}" 
                                onclick="app.setModalTagFilter('unwatched')">
                            ${isTr ? 'İzlenmeyenler' : 'Unwatched'} (${missingCount})
                        </button>
                        <button class="u-m-pill ${currentTag === 'watched' ? 'active' : ''}" 
                                onclick="app.setModalTagFilter('watched')">
                            ${isTr ? 'İzlenenler' : 'Watched'} (${watchedCount})
                        </button>
                        ${distinctTags.map(tag => `
                            <button class="u-m-pill ${currentTag === tag ? 'active' : ''}" 
                                    onclick="app.setModalTagFilter('${tag}')">
                                ${tag}
                            </button>
                        `).join('')}
                    </div>

                    <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">
                        ${displayedItems.length} ${isTr ? 'Yapım Gösteriliyor' : 'Titles Shown'}
                    </div>
                </div>

                <div class="u-modal-items-grid">
                    ${displayedItems.map(item => {
            const isWatched = isItemWatched(item);
            const inWatchlist = isItemWatchlist(item);
            const posterUrl = item.poster_path ? (CONFIG.BASE_IMG + item.poster_path) : '';
            const mType = item.media_type || item.type || 'movie';

            return `
                            <div class="u-item-card">
                                <div class="u-item-poster-wrap">
                                    ${posterUrl ? `<img src="${posterUrl}" alt="${item.title}" loading="lazy">` : ''}
                                    ${isWatched ? `
                                        <div class="u-item-watched-badge">
                                            <i class="fas fa-check"></i> ${isTr ? 'İzlendi' : 'Watched'}
                                        </div>
                                    ` : ''}
                                    ${item.tag ? `
                                        <div class="u-item-tag-badge">${item.tag}</div>
                                    ` : ''}

                                    <div class="u-item-overlay-actions">
                                        <button class="u-play-action-btn" 
                                                onclick="app.playFromUniverseModal(${item.id}, '${mType}')" 
                                                title="${isTr ? 'İzle' : 'Play'}">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="u-watchlist-action-btn" 
                                                onclick="app.toggleUniverseWatchlist(event, ${item.id}, '${mType}')">
                                            <i class="fas ${inWatchlist ? 'fa-check' : 'fa-bookmark'}"></i> 
                                            ${inWatchlist ? (isTr ? 'Listede' : 'Saved') : (isTr ? 'İzlenecek' : 'Watchlist')}
                                        </button>
                                    </div>
                                </div>

                                <div class="u-item-details">
                                    <div class="u-item-title" title="${item.title}">${item.title}</div>
                                    <div class="u-item-meta">
                                        <span>${item.year || ''}</span>
                                        ${item.score ? `
                                            <span class="u-item-score">
                                                <i class="fas fa-star"></i> ${item.score}
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    setModalTagFilter(tag) {
        this.state.activeModalTag = tag;
        this.renderModalContent();
    }

    playFromUniverseModal(id, type) {
        this.closeUniverseModal();
        this.playMovie(id, type);
    }

    async toggleUniverseWatchlist(e, id, type) {
        e.stopPropagation();
        await this.toggleList('watchlist', id, type);
        this.renderModalContent();
    }

    showToast(msg, icon = 'fa-check-circle') {
        let toast = document.getElementById('appToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'appToast';
            toast.className = 'app-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${msg}</span>`;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    async addMissingUniverseToWatchlist(universeId) {
        if (!this.currentModalUniverse) return;
        const universe = this.currentModalUniverse;
        const items = universe.items || [];
        const isTr = this.state.settings.language === 'tr';

        const allWatchedIds = new Set(this.state.watched.map(w => Number(w.id)));
        const allWatchedTitles = new Set(
            this.state.watched.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );
        const allWatchlistIds = new Set(this.state.watchlist.map(w => Number(w.id)));
        const allWatchlistTitles = new Set(
            this.state.watchlist.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );

        const isItemWatched = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchedIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            if (t && allWatchedTitles.has(t)) return true;
            if ((it.media_type === 'tv' || it.type === 'tv') && this.state.watchedEpisodes && this.state.watchedEpisodes[it.id]) {
                const eps = Object.values(this.state.watchedEpisodes[it.id]);
                if (eps.some(Boolean)) return true;
            }
            return false;
        };

        const isItemWatchlist = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchlistIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            return !!(t && allWatchlistTitles.has(t));
        };

        const missing = items.filter(it => !isItemWatched(it) && !isItemWatchlist(it));
        const btn = document.getElementById('addMissingWatchlistBtn');

        if (missing.length === 0) {
            if (btn) {
                btn.className = 'u-action-btn is-done';
                btn.innerHTML = `<i class="fas fa-check-double"></i> <span>${isTr ? 'Tüm Eksikler Zaten Listede!' : 'All Missing Already in Watchlist!'}</span>`;
            }
            return;
        }

        // 1. Immediate visual response: animated loading state
        if (btn) {
            btn.classList.add('is-loading');
            btn.style.pointerEvents = 'none';
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${isTr ? 'İzleneceklere Ekleniyor...' : 'Adding to Watchlist...'}</span>`;
        }

        // Slight deliberate delay (320ms) so user distinctly sees and feels the action
        await new Promise(r => setTimeout(r, 320));

        // 2. Add missing items to watchlist & persist
        const missingIdsSet = new Set(missing.map(m => Number(m.id)));
        for (const it of missing) {
            this.state.watchlist.push({
                id: it.id,
                title: it.title || it.name,
                name: it.name || it.title,
                media_type: it.media_type || it.type || 'movie',
                poster_path: it.poster_path,
                backdrop_path: it.backdrop_path,
                release_date: it.release_date || '',
                vote_average: it.score || it.vote_average || 0
            });
        }

        this.saveMovieData();

        // 3. Immediately update and highlight the cards inside the modal grid
        const grid = document.querySelector('#universeModalContent .u-modal-items-grid');
        if (grid) {
            const cards = grid.querySelectorAll('.u-item-card');
            cards.forEach(card => {
                const watchlistBtn = card.querySelector('.u-watchlist-action-btn');
                if (watchlistBtn) {
                    const onclickAttr = watchlistBtn.getAttribute('onclick') || '';
                    const match = onclickAttr.match(/toggleUniverseWatchlist\(event,\s*(\d+)/);
                    if (match && missingIdsSet.has(Number(match[1]))) {
                        card.classList.add('just-added');
                        watchlistBtn.innerHTML = `<i class="fas fa-check"></i> ${isTr ? 'Listede' : 'Saved'}`;
                        watchlistBtn.classList.add('active');
                    }
                }
            });
        }

        // 4. Update button to celebration Success State with glowing bounce
        if (btn) {
            btn.classList.remove('is-loading');
            btn.classList.add('is-success');
            btn.innerHTML = `<i class="fas fa-check-circle" style="font-size: 1.1rem;"></i> <span>${isTr ? `${missing.length} Yapım Eklendi! ✓` : `${missing.length} Titles Added! ✓`}</span>`;
        }

        // 5. Toast notification
        this.showToast(
            isTr ? `🎉 ${missing.length} yeni yapım başarıyla İzlenecekler listenize eklendi!` : `🎉 ${missing.length} titles added to Watchlist!`,
            'fa-check-circle'
        );

        // 6. After 1.6s, smoothly transform button into final completed status badge
        setTimeout(() => {
            if (btn && btn.parentElement) {
                btn.className = 'u-action-btn is-done';
                btn.style.pointerEvents = 'default';
                btn.onclick = null;
                btn.innerHTML = `<i class="fas fa-check-double"></i> <span>${isTr ? 'Tüm Eksikler İzleneceklerde ✓' : 'All Missing in Watchlist ✓'}</span>`;
            }
            this.renderUniversesPage(false);
        }, 1600);
    }

    closeUniverseModal() {
        const modal = document.getElementById('universeDetailModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
        this.state.activeUniverseModalId = null;
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
            const removedItem = list[index];
            list.splice(index, 1);
            // If removed from watched and it's a TV show, clear marked episodes
            const isTv = mediaType === 'tv' || (!removedItem?.title && !!removedItem?.name);
            if (listType === 'watched' && isTv) {
                this.unmarkAllEpisodesWatched(id);
            }
        } else {
            // Fetch basic details to save
            const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const movie = await res.json();
            movie.media_type = mediaType;
            list.push(movie);

            // If a TV show's main title is marked as watched, automatically mark all currently released episodes as watched!
            if (listType === 'watched' && mediaType === 'tv') {
                await this.markAllCurrentEpisodesWatched(id, movie);
            }
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
        if (listType === 'watchlist') this.renderWatchlistSpotlightBanner();

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
        this.renderGrid(this.state.watchlist, 'watchlist', true);
        this.renderStats();
        this.renderWatchlistSpotlightBanner();
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

    saveRecentlyPlayed() {
        if (!this.state.user) return;
        localStorage.setItem(`ct_${this.state.user}_recentlyPlayed`, JSON.stringify(this.state.recentlyPlayed));
    }

    renderWatchlistSpotlightBanner(forceNew = false) {
        const section = document.getElementById('watchlistBannerSection');
        if (!section) return;

        // Hide when searching or when browsing a specific catalog filter
        if (this.state.isSearching || this.state.currentCatalog) {
            section.style.display = 'none';
            return;
        }

        // Hide if watchlist is empty
        const watchlist = this.state.watchlist || [];
        if (watchlist.length === 0) {
            section.style.display = 'none';
            return;
        }

        // Validate items
        const validItems = watchlist.filter(m => m && (m.title || m.name || m.original_title || m.original_name));
        if (validItems.length === 0) {
            section.style.display = 'none';
            return;
        }

        // Filter out items in picks that are no longer in watchlist
        if (this.state.spotlightPicks && this.state.spotlightPicks.length > 0) {
            const currentIds = new Set(validItems.map(m => Number(m.id)));
            this.state.spotlightPicks = this.state.spotlightPicks.filter(p => currentIds.has(Number(p.id)));
        }

        if (forceNew || !this.state.spotlightPicks || this.state.spotlightPicks.length === 0) {
            // Pick up to 5 random items from watchlist
            const shuffled = [...validItems].sort(() => 0.5 - Math.random());
            this.state.spotlightPicks = shuffled.slice(0, Math.min(5, shuffled.length));
            this.state.spotlightActiveIndex = 0;
            this.preloadAllSpotlightPicks(this.state.spotlightPicks);
        }

        if (this.state.spotlightActiveIndex >= this.state.spotlightPicks.length) {
            this.state.spotlightActiveIndex = 0;
        }

        const activeItem = this.state.spotlightPicks[this.state.spotlightActiveIndex];
        if (!activeItem) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        const lang = this.state.settings.language || 'tr';
        const isTr = lang === 'tr';
        const t = TRANSLATIONS[lang] || TRANSLATIONS.tr;

        const mType = activeItem.media_type || (activeItem.first_air_date ? 'tv' : 'movie');
        const title = activeItem.original_title || activeItem.original_name || activeItem.title || activeItem.name || '';
        const numRating = Number(activeItem.vote_average) || 0;
        const rating = numRating.toFixed(1);
        const year = (activeItem.release_date || activeItem.first_air_date || '').split('-')[0] || '';
        const backdropUrl = activeItem.backdrop_path 
            ? (CONFIG.HERO_IMG + activeItem.backdrop_path) 
            : (activeItem.poster_path ? (CONFIG.BASE_IMG + activeItem.poster_path) : '');

        // Short punchy tagline or concise 1-sentence logline (never a long wall of text)
        let briefDescription = '';
        if (activeItem.tagline && activeItem.tagline.trim().length > 0) {
            briefDescription = `"${activeItem.tagline.trim()}"`;
        } else if (activeItem.overview) {
            const firstSentence = activeItem.overview.split(/(?<=[.!?])\s+/)[0] || activeItem.overview;
            briefDescription = firstSentence.length > 140 ? firstSentence.slice(0, 137) + '...' : firstSentence;
        }

        // Format genres as clean inline text instead of chunky boxes
        let genreText = '';
        if (activeItem.genres && Array.isArray(activeItem.genres) && activeItem.genres.length > 0) {
            genreText = activeItem.genres.slice(0, 2).map(g => typeof g === 'object' ? g.name : g).join(' • ');
        } else if (activeItem.genre_ids && Array.isArray(activeItem.genre_ids) && activeItem.genre_ids.length > 0) {
            genreText = activeItem.genre_ids.slice(0, 2).map(id => this.state.genres[id]).filter(Boolean).join(' • ');
        }

        // Proper Turkish grammar for season count ("4 Sezon", not "4 Sezonlar")
        const seasonsText = activeItem.number_of_seasons 
            ? `${activeItem.number_of_seasons} ${isTr ? 'Sezon' : (activeItem.number_of_seasons > 1 ? 'Seasons' : 'Season')}`
            : '';

        // Other picks as landscape (16:9) mini cards
        const otherPicks = this.state.spotlightPicks;
        const otherPicksHtml = otherPicks.map((pick, idx) => {
            const isActive = idx === this.state.spotlightActiveIndex;
            const pTitle = pick.original_title || pick.original_name || pick.title || pick.name || '';
            const pRating = (Number(pick.vote_average) || 0).toFixed(1);
            const pBg = pick.backdrop_path 
                ? (CONFIG.BASE_IMG + pick.backdrop_path) 
                : (pick.poster_path ? (CONFIG.BASE_IMG + pick.poster_path) : '');
            return `
                <div class="landscape-mini-thumb ${isActive ? 'active' : ''}" onclick="app.selectSpotlightPick(${idx})" title="${pTitle}">
                    <div class="mini-thumb-img-wrap" style="background-image: url('${pBg}');">
                        <div class="mini-thumb-overlay"></div>
                        ${Number(pick.vote_average) > 0 ? `<span class="mini-thumb-score"><i class="fas fa-star"></i> ${pRating}</span>` : ''}
                    </div>
                    <span class="mini-thumb-title">${pTitle}</span>
                </div>
            `;
        }).join('');

        // Title display: Use official transparent logo PNG if loaded, otherwise bold typography
        const titleHtml = activeItem.logo_path
            ? `<div class="spotlight-logo-wrap" onclick="app.playMovie(${activeItem.id}, '${mType}')">
                   <img src="https://image.tmdb.org/t/p/w500${activeItem.logo_path}" alt="${title}" class="spotlight-official-logo" onerror="this.style.display='none'; document.getElementById('spotlightFallbackTitle').style.display='block';">
                   <h2 id="spotlightFallbackTitle" class="spotlight-landscape-title" style="display: none;">${title}</h2>
               </div>`
            : `<h2 class="spotlight-landscape-title" onclick="app.playMovie(${activeItem.id}, '${mType}')">${title}</h2>`;

        section.innerHTML = `
            <div class="spotlight-landscape-hero">
                <!-- Full-Bleed Vivid Landscape Artwork -->
                <div class="spotlight-hero-artwork" style="background-image: url('${backdropUrl}');"></div>
                <div class="spotlight-hero-vignette"></div>

                <!-- Unified Hero Content Shell -->
                <div class="spotlight-hero-content">
                    <div class="spotlight-hero-left">
                        <!-- Top Badge Strip: Cohesive with Left Column -->
                        <div class="spotlight-hero-badge-row">
                            <div class="spotlight-pill-tag">
                                <i class="fas fa-bookmark"></i> <span>${t.spotlightBadge}</span>
                            </div>
                            <span class="spotlight-hero-type">${mType === 'tv' ? t.spotlightTypeTv : t.spotlightTypeMovie}</span>
                        </div>

                        ${titleHtml}

                        <!-- Clean Meta Row on a Single Crisp Baseline -->
                        <div class="spotlight-hero-meta">
                            ${numRating > 0 ? `<span class="hero-rating"><i class="fas fa-star"></i> ${rating}</span>` : ''}
                            ${year ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item">${year}</span>` : ''}
                            ${activeItem.runtime ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item">${this.formatMinutes(activeItem.runtime)}</span>` : ''}
                            ${seasonsText ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item">${seasonsText}</span>` : ''}
                            ${genreText ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item hero-genres">${genreText}</span>` : ''}
                        </div>

                        ${briefDescription ? `<p class="spotlight-hero-tagline">${briefDescription}</p>` : ''}

                        <!-- Hero Action Buttons with Clean Responsive Hierarchy -->
                        <div class="spotlight-hero-actions">
                            <button class="hero-btn-play" onclick="app.playMovie(${activeItem.id}, '${mType}')">
                                <i class="fas fa-play"></i> <span>${t.spotlightWatchBtn}</span>
                            </button>
                            <div class="hero-secondary-actions">
                                <button class="hero-btn-shuffle" onclick="app.shuffleSpotlight(this)" title="${t.spotlightShuffleBtn}">
                                    <i class="fas fa-shuffle"></i> <span>${t.spotlightShuffleBtn}</span>
                                </button>
                                <button class="hero-btn-check" onclick="app.markSpotlightWatched(${activeItem.id}, '${mType}')" title="${t.spotlightWatchedBtn}">
                                    <i class="fas fa-check"></i> <span>${t.spotlightWatchedBtn}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Landscape Thumbnails of other random picks -->
                    ${otherPicks.length > 1 ? `
                        <div class="spotlight-hero-right">
                            <div class="hero-thumbs-header">
                                <span>${t.spotlightOtherPicks}</span>
                                <button class="hero-thumbs-refresh" onclick="app.renderWatchlistSpotlightBanner(true)" title="Yeni Seçimler">
                                    <i class="fas fa-rotate"></i>
                                </button>
                            </div>
                            <div class="hero-thumbs-row">
                                ${otherPicksHtml}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // If activeItem is missing backdrop or details or logo, fetch fresh details in background
        if (!activeItem.tagline || !activeItem.logo_path || !activeItem.genres || activeItem.genres.length === 0) {
            this.fetchSpotlightDetails(activeItem, mType, true);
        }
    }

    preloadAllSpotlightPicks(picks) {
        if (!picks || !Array.isArray(picks)) return;
        picks.forEach((item, idx) => {
            const mType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            // Preload existing backdrop
            const initialBg = item.backdrop_path 
                ? (CONFIG.HERO_IMG + item.backdrop_path) 
                : (item.poster_path ? (CONFIG.BASE_IMG + item.poster_path) : '');
            if (initialBg) {
                const img = new Image();
                img.src = initialBg;
            }
            // Fetch full TMDB details & logo if missing
            if (!item.tagline || !item.logo_path || !item.genres || item.genres.length === 0) {
                this.fetchSpotlightDetails(item, mType, idx === this.state.spotlightActiveIndex);
            }
        });
    }

    async fetchSpotlightDetails(item, mType, allowRerender = true) {
        if (!item || !item.id) return;
        try {
            // Always fetch with language=en-US and include_image_language=en,null to keep covers, backdrops, and titles in original language
            const res = await fetch(`https://api.themoviedb.org/3/${mType}/${item.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US&append_to_response=images&include_image_language=en,null`);
            if (!res.ok) return;
            const data = await res.json();
            
            item.tagline = data.tagline || item.tagline;
            item.backdrop_path = data.backdrop_path || item.backdrop_path;
            item.genres = data.genres || item.genres;
            item.runtime = data.runtime || item.runtime;
            item.number_of_seasons = data.number_of_seasons || item.number_of_seasons;
            if (data.vote_average) item.vote_average = data.vote_average;
            if (data.overview) item.overview = data.overview;
            item.original_title = data.original_title || item.original_title;
            item.original_name = data.original_name || item.original_name;

            // Preload fresh original backdrop image into browser cache
            if (data.backdrop_path) {
                const bImg = new Image();
                bImg.src = CONFIG.HERO_IMG + data.backdrop_path;
            }

            // Always select original language or English logo, never localized Turkish translation
            const origLang = data.original_language || item.original_language || 'en';
            const logos = data.images?.logos || [];
            if (logos.length > 0) {
                const origLogo = logos.find(l => l.iso_639_1 === origLang);
                const enLogo = logos.find(l => l.iso_639_1 === 'en');
                const nullLogo = logos.find(l => !l.iso_639_1);
                const nonTrLogo = logos.find(l => l.iso_639_1 && l.iso_639_1 !== 'tr');
                const bestLogo = (origLang !== 'tr' ? (origLogo || enLogo || nullLogo || nonTrLogo) : origLogo) || logos[0];
                if (bestLogo && bestLogo.file_path) {
                    item.logo_path = bestLogo.file_path;
                    const lImg = new Image();
                    lImg.src = 'https://image.tmdb.org/t/p/w500' + bestLogo.file_path;
                }
            }

            // If this item is currently displayed, smoothly re-render
            if (allowRerender) {
                const activePick = this.state.spotlightPicks?.[this.state.spotlightActiveIndex];
                if (activePick && Number(activePick.id) === Number(item.id)) {
                    this.renderWatchlistSpotlightBanner(false);
                }
            }
        } catch (e) {
            console.warn('Error fetching spotlight details:', e);
        }
    }

    selectSpotlightPick(index) {
        if (!this.state.spotlightPicks || !this.state.spotlightPicks[index]) return;
        if (this.state.spotlightActiveIndex === index) return;

        const hero = document.querySelector('.spotlight-landscape-hero');
        const artwork = hero?.querySelector('.spotlight-hero-artwork');
        const leftContent = hero?.querySelector('.spotlight-hero-left');

        // Immediate visual feedback on thumbnails
        const thumbs = hero?.querySelectorAll('.landscape-mini-thumb');
        thumbs?.forEach((t, i) => t.classList.toggle('active', i === index));

        this.state.spotlightActiveIndex = index;

        if (hero && artwork && leftContent) {
            // Smoothly fade out current artwork and content
            artwork.classList.add('spotlight-fade-out');
            leftContent.classList.add('spotlight-fade-out');

            setTimeout(() => {
                this.renderWatchlistSpotlightBanner(false);
                const newArtwork = document.querySelector('.spotlight-hero-artwork');
                const newLeft = document.querySelector('.spotlight-hero-left');
                if (newArtwork) {
                    newArtwork.classList.add('spotlight-fade-in');
                    setTimeout(() => newArtwork.classList.remove('spotlight-fade-in'), 300);
                }
                if (newLeft) {
                    newLeft.classList.add('spotlight-fade-in');
                    setTimeout(() => newLeft.classList.remove('spotlight-fade-in'), 300);
                }
            }, 130);
        } else {
            this.renderWatchlistSpotlightBanner(false);
        }
    }

    shuffleSpotlight(btn) {
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 600);
            }
        }
        if (!this.state.spotlightPicks || this.state.spotlightPicks.length <= 1) {
            this.renderWatchlistSpotlightBanner(true);
            return;
        }
        const nextIdx = (this.state.spotlightActiveIndex + 1) % this.state.spotlightPicks.length;
        this.selectSpotlightPick(nextIdx);
    }

    async markSpotlightWatched(id, mediaType) {
        const isTr = this.state.settings.language === 'tr';
        await this.moveToWatched(id, mediaType);
        this.showToast(isTr ? '✓ Yapım İzlediklerim listenize taşındı!' : '✓ Moved to your Watched list!', 'fa-check-circle');
    }

    renderRecentlyPlayed() {
        const section = document.getElementById('recentlyWatchedSection');
        const container = document.getElementById('recentlyWatchedResults');
        if (!section || !container) return;

        if (!this.state.recentlyPlayed || this.state.recentlyPlayed.length === 0) {
            section.style.display = 'none';
            return;
        }

        if (this.state.isSearching || this.state.currentCatalog) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        container.innerHTML = this.state.recentlyPlayed.map(movie => {
            const badgeHtml = movie.type === 'tv' ? `<div class="movie-badge" style="background:var(--primary);color:white;font-size:0.68rem;padding:2px 7px;">S${movie.season} E${movie.episode}</div>` : '';
            return `
                <div class="movie-card recent-movie-card" onclick="app.playMovie(${movie.id}, '${movie.type}')">
                    <div class="poster-wrapper">
                        ${badgeHtml}
                        <img class="movie-poster" src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.title}" loading="lazy">
                        <div class="movie-info">
                            <div class="movie-title">${movie.title}</div>
                            <div class="movie-meta">
                                <span><i class="fas fa-play"></i> ${this.state.settings.language === 'tr' ? 'Kaldığın Yer' : 'Continue'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="recent-progress-bar">
                        <div class="recent-progress-fill"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadMovieData() {
        const prefix = `ct_${this.state.user}_`;
        const legacyPrefix = `user_${this.state.user}_`;

        // 1. Try new local storage
        let watched = localStorage.getItem(prefix + 'watched');
        let watchlist = localStorage.getItem(prefix + 'watchlist');
        let ignored = localStorage.getItem(prefix + 'ignored');
        let watchedEpisodes = localStorage.getItem(prefix + 'watchedEpisodes');
        let recentlyPlayed = localStorage.getItem(prefix + 'recentlyPlayed');

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
        this.state.watchedEpisodes = watchedEpisodes ? JSON.parse(watchedEpisodes) : {};
        this.state.recentlyPlayed = recentlyPlayed ? JSON.parse(recentlyPlayed) : [];

        this.renderStats();
        this.renderRecentlyPlayed();
        this.renderWatchlistSpotlightBanner();
        this.refreshZeroRatings();

        // 3. Fetch from Cloud in background (Non-blocking)
        this.fetchFromCloud().then(() => {
            this.renderStats();
            this.renderRecentlyPlayed();
            this.renderWatchlistSpotlightBanner();
            if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList', true);
            if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist', true);
            this.refreshZeroRatings();
        });
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

                    this.state.watched = cloudData.watched || [];
                    this.state.watchlist = cloudData.watchlist || [];
                    this.state.ignored = cloudData.ignored || [];
                    if (cloudData.watchedEpisodes) {
                        this.state.watchedEpisodes = cloudData.watchedEpisodes;
                        localStorage.setItem(`ct_${this.state.user}_watchedEpisodes`, JSON.stringify(this.state.watchedEpisodes));
                    }

                    // Save back to local to prevent "empty list" on next load
                    localStorage.setItem(`ct_${this.state.user}_watched`, JSON.stringify(this.state.watched));
                    localStorage.setItem(`ct_${this.state.user}_watchlist`, JSON.stringify(this.state.watchlist));
                    localStorage.setItem(`ct_${this.state.user}_ignored`, JSON.stringify(this.state.ignored));

                    if (cloudData.settings) {
                        this.state.settings = { ...this.state.settings, ...cloudData.settings };
                        localStorage.setItem('ct_compact_mode', this.state.settings.compactMode);
                        localStorage.setItem('ct_lang', this.state.settings.language);
                        localStorage.setItem('ct_auto_tr_sub', this.state.settings.autoTurkishSub);
                        localStorage.setItem('ct_auto_source', this.state.settings.autoSource === true);
                        this.applySettings();
                        this.updateProfileUI();
                    }

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
        document.body.classList.toggle('tv-mode', this.state.settings.tvMode);

        if (this.state.settings.tvMode) {
            if (!this.keyboardManager) this.keyboardManager = new KeyboardManager(this);
            this.keyboardManager.init();
        } else if (this.keyboardManager) {
            this.keyboardManager.destroy();
        }
    }

    toggleTVMode(enabled) {
        this.state.settings.tvMode = enabled;
        localStorage.setItem('ct_tv_mode', enabled);
        this.applySettings();
        this.syncWithCloud();
    }

    toggleCompactMode(enabled) {
        this.state.settings.compactMode = enabled;
        localStorage.setItem('ct_compact_mode', enabled);
        this.applySettings();
        this.syncWithCloud();
    }

    toggleAutoTurkishSub(enabled) {
        this.state.settings.autoTurkishSub = enabled;
        localStorage.setItem('ct_auto_tr_sub', enabled);
        this.syncWithCloud();
    }

    toggleAutoSource(enabled) {
        this.state.settings.autoSource = enabled;
        localStorage.setItem('ct_auto_source', enabled);
        this.syncWithCloud();
    }

    toggleAutoPlay(enabled) {
        this.state.settings.autoPlay = enabled;
        localStorage.setItem('ct_auto_play', enabled);
        this.syncWithCloud();
    }

    toggleLanguage() {
        const newLang = this.state.settings.language === 'tr' ? 'en' : 'tr';
        this.state.settings.language = newLang;
        localStorage.setItem('ct_lang', newLang);
        this.setLanguageUI();
        this.syncWithCloud();

        // Update stats and grids to refresh labels
        this.renderStats();
        if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList', true);
        if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist', true);
        if (this.state.currentView === 'search') this.renderWatchlistSpotlightBanner();

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
        const mainViews = ['search', 'watched', 'watchlist', 'collections', 'profile'];
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
        if (viewId === 'search') {
            this.renderWatchlistSpotlightBanner();
            this.renderRecentlyPlayed();
        }
        if (viewId === 'watched') {
            this.renderGrid(this.state.watched, 'watchedList');
            this.refreshZeroRatings('watched');
        }
        if (viewId === 'watchlist') {
            this.renderGrid(this.state.watchlist, 'watchlist');
            this.refreshZeroRatings('watchlist');
        }
        if (viewId === 'collections') {
            this.renderUniversesPage();
        }

        if (this.state.settings.tvMode && this.keyboardManager) {
            this.keyboardManager.focusedIndex = -1;
            setTimeout(() => this.keyboardManager.refreshNavigableElements(), 300);
        }
    }

    goBack() {
        // Always return to the main view that opened the player
        this.switchView(this.state.previousView || 'search');
    }

    // --- Professional Video Player ---
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

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('universeDetailModal');
                if (modal && modal.style.display !== 'none') {
                    this.closeUniverseModal();
                }
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
            const title = (item.original_title || item.original_name || item.title || item.name || '').toLowerCase();
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
                        watchedEpisodes: this.state.watchedEpisodes || {},
                        settings: this.state.settings,
                        lastUpdated: Date.now()
                    }
                })
            });
        } catch (e) {
            console.warn('Cloud sync failed:', e);
        }
    }

    checkDisclaimerState() {
        if (localStorage.getItem('ct_disclaimer_dismissed') === 'true') {
            document.body.classList.add('disclaimer-closed');
        }
    }

    dismissDisclaimer() {
        document.body.classList.add('disclaimer-closed');
        localStorage.setItem('ct_disclaimer_dismissed', 'true');
    }

    openLegalModal() {
        const modal = document.getElementById('legalModal');
        if (modal) modal.style.display = 'flex';
    }

    closeLegalModal() {
        const modal = document.getElementById('legalModal');
        if (modal) modal.style.display = 'none';
    }
}


// Global instance for onclick handlers
const app = new CineTrack();
window.app = app;

