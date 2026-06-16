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
        invalidCredentials: 'Kullanıcı adı veya şifre hatalı!'
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
        invalidCredentials: 'Invalid username or password!'
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
            recentlyPlayed: [],
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
            currentCatalog: null
        };

        this.init();
    }

    async init() {
        console.log('CineTrack Initializing...');
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
            return;
        }

        this.state.isSearching = true;
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
            card.innerHTML = `
                <div class="poster-wrapper">
                    ${badgeHtml}
                    <img class="movie-poster" src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.original_title || movie.original_name || movie.title || movie.name}" loading="lazy">
                    <div class="movie-info">
                        <div class="movie-title">${movie.original_title || movie.original_name || movie.title || movie.name}</div>
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

    saveRecentlyPlayed() {
        if (!this.state.user) return;
        localStorage.setItem(`ct_${this.state.user}_recentlyPlayed`, JSON.stringify(this.state.recentlyPlayed));
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
            const badgeHtml = movie.type === 'tv' ? `<div class="movie-badge" style="background:var(--primary);color:white;">S${movie.season} E${movie.episode}</div>` : '';
            return `
                <div class="movie-card" onclick="app.playMovie(${movie.id}, '${movie.type}')" 
                     style="min-width: 140px; max-width: 140px; flex: 0 0 auto; scroll-snap-align: start; cursor: pointer;">
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
        this.state.recentlyPlayed = recentlyPlayed ? JSON.parse(recentlyPlayed) : [];

        this.state.recentlyPlayed = recentlyPlayed ? JSON.parse(recentlyPlayed) : [];

        this.renderStats();
        this.renderRecentlyPlayed();

        // 3. Fetch from Cloud in background (Non-blocking)
        this.fetchFromCloud().then(() => {
            this.renderStats();
            this.renderRecentlyPlayed();
            if (this.state.currentView === 'watched') this.renderGrid(this.state.watched, 'watchedList', true);
            if (this.state.currentView === 'watchlist') this.renderGrid(this.state.watchlist, 'watchlist', true);
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

                    // Simple merge or overwrite based on lastUpdated if available, 
                    // but here we prioritize cloud since user said they are reset locally.
                    this.state.watched = cloudData.watched || [];
                    this.state.watchlist = cloudData.watchlist || [];
                    this.state.ignored = cloudData.ignored || [];

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
            // Fetch detailed info
            const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();
            this.state.currentMovieData = data;

            // Populate Sidebar & Info
            const titleEl = document.getElementById('watchMovieTitle');
            if (titleEl) titleEl.textContent = data.original_title || data.original_name || data.title || data.name;

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

        const lang = this.state.currentMovieData?.original_language || 'en';
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${this.state.player.id}/season/${season}?api_key=${CONFIG.TMDB_KEY}&language=${lang}`);
            const data = await res.json();

            episodeGrid.innerHTML = data.episodes
                .map(e => `
                    <button class="ep-btn ${this.state.player.episode == e.episode_number ? 'active' : ''}" 
                            onclick="app.playEpisode(${e.episode_number}, this)">
                        <span class="ep-num">${e.episode_number}</span>
                        <span class="ep-name">${e.name}</span>
                    </button>
                `)
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
                        settings: this.state.settings,
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

