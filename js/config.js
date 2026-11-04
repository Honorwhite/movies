const CONFIG = {
    TMDB_KEY: '4a9f3fe6b13e66b0dd355b7318b7e0e4',
    BASE_IMG: 'https://image.tmdb.org/t/p/w500',
    HERO_IMG: 'https://image.tmdb.org/t/p/original',
    SUPABASE_URL: 'https://gbdqycgclxhblhhjhpbm.supabase.co',
    AUTH_EMAIL_DOMAIN: 'users.cinetrack.app',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHF5Y2djbHhoYmxoaGpocGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Njk2MjMsImV4cCI6MjA4MzA0NTYyM30.85TIwLzahIY30zRlY_y2afw_eziDaYLhXWCCh1HZu5I'
};

const MIN_PASSWORD_LENGTH = 4;
const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

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

const LIST_GENRES_CONFIG = [
    { id: 'all', tr: 'Tümü', en: 'All', icon: 'fa-layer-group', genre_ids: [] },
    { id: 'horror', tr: 'Korku', en: 'Horror', icon: 'fa-ghost', genre_ids: [27] },
    { id: 'comedy', tr: 'Komedi', en: 'Comedy', icon: 'fa-laugh-beam', genre_ids: [35] },
    { id: 'action', tr: 'Aksiyon', en: 'Action', icon: 'fa-fire', genre_ids: [28, 10759] },
    { id: 'sci_fi', tr: 'Bilim Kurgu', en: 'Sci-Fi', icon: 'fa-robot', genre_ids: [878, 10765] },
    { id: 'drama', tr: 'Dram', en: 'Drama', icon: 'fa-theater-masks', genre_ids: [18] },
    { id: 'thriller', tr: 'Gerilim', en: 'Thriller', icon: 'fa-user-secret', genre_ids: [53] },
    { id: 'adventure', tr: 'Macera', en: 'Adventure', icon: 'fa-mountain', genre_ids: [12, 10759] },
    { id: 'animation', tr: 'Animasyon', en: 'Animation', icon: 'fa-film', genre_ids: [16] },
    { id: 'romance', tr: 'Romantik', en: 'Romance', icon: 'fa-heart', genre_ids: [10749] },
    { id: 'crime', tr: 'Suç', en: 'Crime', icon: 'fa-fingerprint', genre_ids: [80] },
    { id: 'fantasy', tr: 'Fantastik', en: 'Fantasy', icon: 'fa-wand-magic-sparkles', genre_ids: [14, 10765] },
    { id: 'mystery', tr: 'Gizem', en: 'Mystery', icon: 'fa-mask', genre_ids: [9648] },
    { id: 'documentary', tr: 'Belgesel', en: 'Documentary', icon: 'fa-video', genre_ids: [99] },
    { id: 'family', tr: 'Aile', en: 'Family', icon: 'fa-people-roof', genre_ids: [10751] }
];
