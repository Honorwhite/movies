// Core: state and startup
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
                autoPlay: localStorage.getItem('ct_auto_play') !== 'false',
                episodeNotifications: localStorage.getItem('ct_episode_notifications') === 'true',
                shareId: null
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
            listFilters: {
                watched: { genre: 'all', query: '' },
                watchlist: { genre: 'all', query: '' }
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
        // A shared watchlist link (?share=…) shows a read-only page; no login needed
        if (await this.openSharedListFromUrl()) return;
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
}

// Attach the feature files (js/auth.js, js/lists.js, ...) to CineTrack.
// A method name defined twice is an error, so one copy can never silently replace another.
[
    AuthMethods,
    SyncMethods,
    DiscoverMethods,
    StatsMethods,
    UniversesMethods,
    ListsMethods,
    EpisodesMethods,
    SpotlightMethods,
    SettingsMethods,
    ViewsMethods,
    PlayerMethods,
    TransferMethods,
    RemindersMethods,
    ShareMethods,
].forEach(mixin => {
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
        if (name === 'constructor') return;
        if (Object.prototype.hasOwnProperty.call(CineTrack.prototype, name)) {
            throw new Error(`CineTrack: method "${name}" is defined twice (${mixin.name})`);
        }
        Object.defineProperty(CineTrack.prototype, name, Object.getOwnPropertyDescriptor(mixin.prototype, name));
    });
});

// Global instance for onclick handlers
const app = new CineTrack();
window.app = app;
