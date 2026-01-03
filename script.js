// State Management
let state = {
    apiKey: localStorage.getItem('tmdb_api_key') || '',
    watched: JSON.parse(localStorage.getItem('watched_list')) || [],
    watchlist: JSON.parse(localStorage.getItem('watchlist_list')) || [],
    currentView: 'search',
    genres: {}
};

// --- DOM Elements ---
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const searchInput = document.getElementById('movieSearch');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const watchedList = document.getElementById('watchedList');
const watchlistContainer = document.getElementById('watchlist');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const closeSettingsBtn = document.getElementById('closeSettings');
const ratingOverlay = document.getElementById('ratingOverlay');
const cancelRatingBtn = document.getElementById('cancelRating');
const rateBtns = document.querySelectorAll('.rate-btn');

const watchedCategoryFilter = document.getElementById('watchedCategoryFilter');
const watchedRatingFilter = document.getElementById('watchedRatingFilter');
const watchlistCategoryFilter = document.getElementById('watchlistCategoryFilter');

let movieToRate = null;

// --- Initialization ---
async function init() {
    setupEventListeners();
    if (state.apiKey) {
        apiKeyInput.value = state.apiKey;
        await fetchGenres();
    } else {
        settingsModal.classList.add('active');
    }
    renderLists();
}

// --- API Functions ---
async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${state.apiKey}&language=tr-TR`);
        const data = await response.json();
        data.genres.forEach(g => {
            state.genres[g.id] = g.name;
        });
        updateFilterOptions();
    } catch (error) {
        console.error('Genre fetch error:', error);
    }
}

async function searchMovies(query) {
    if (!state.apiKey) {
        alert('Lütfen önce ayarlardan API anahtarınızı girin.');
        settingsModal.classList.add('active');
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${state.apiKey}&query=${encodeURIComponent(query)}&language=tr-TR`);
        const data = await response.json();
        renderSearchResults(data.results);
    } catch (error) {
        console.error('Search error:', error);
        alert('Arama sırasında bir hata oluştu.');
    }
}

// --- Rendering Functions ---
function renderSearchResults(movies) {
    searchResults.innerHTML = '';
    
    // Filter out items without posters or those that aren't movie/tv
    const filtered = movies.filter(m => (m.media_type === 'movie' || m.media_type === 'tv') && m.poster_path);

    if (filtered.length === 0) {
        searchResults.innerHTML = '<p class="no-results">Sonuç bulunamadı.</p>';
        return;
    }

    filtered.forEach(movie => {
        const card = createMovieCard(movie, 'search');
        searchResults.appendChild(card);
    });
}

function createMovieCard(movie, context) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date || '';
    const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    
    const isWatched = state.watched.find(m => m.id === movie.id);
    const isWatchlist = state.watchlist.find(m => m.id === movie.id);

    let ratingBadge = '';
    if (context === 'watched' && movie.userRating) {
        const ratingLabels = { good: 'İyi 😍', meh: 'Eh İşte 😐', bad: 'Kötü 💩' };
        ratingBadge = `<div class="rating-badge badge-${movie.userRating}">${ratingLabels[movie.userRating]}</div>`;
    }

    card.innerHTML = `
        <div class="poster-container">
            ${ratingBadge}
            <img src="${posterUrl}" alt="${title}" loading="lazy">
            <div class="card-overlay"></div>
        </div>
        <div class="movie-info">
            <h3>${title}</h3>
            <div class="movie-meta">
                <span><i class="far fa-calendar"></i> ${year}</span>
                <span><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
        </div>
        <div class="card-actions">
            ${context === 'search' ? `
                <button class="action-btn watched-btn" onclick="openRatingModal(${movie.id}, ${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                    <i class="fas fa-check"></i> İzledim
                </button>
                <button class="action-btn watchlist-btn" onclick="addToWatchlist(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                    <i class="fas fa-plus"></i> İzlenecek
                </button>
            ` : ''}
            
            ${context === 'watched' ? `
                <button class="action-btn remove-btn" onclick="removeFromWatched(${movie.id})">
                    <i class="fas fa-trash"></i> Kaldır
                </button>
            ` : ''}

            ${context === 'watchlist' ? `
                <button class="action-btn watched-btn" onclick="openRatingModal(${movie.id}, ${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                    <i class="fas fa-check"></i> İzledim
                </button>
                <button class="action-btn remove-btn" onclick="removeFromWatchlist(${movie.id})">
                    <i class="fas fa-trash"></i> Kaldır
                </button>
            ` : ''}
        </div>
    `;
    return card;
}

function renderLists() {
    // Render Watched List
    const watchedFiltered = filterList(state.watched, watchedCategoryFilter.value, watchedRatingFilter.value);
    watchedList.innerHTML = '';
    watchedFiltered.forEach(movie => watchedList.appendChild(createMovieCard(movie, 'watched')));
    if (watchedFiltered.length === 0) {
        watchedList.innerHTML = '<div class="empty-state">Burada henüz bir şey yok.</div>';
    }

    // Render Watchlist
    const watchlistFiltered = filterList(state.watchlist, watchlistCategoryFilter.value, 'all');
    watchlistContainer.innerHTML = '';
    watchlistFiltered.forEach(movie => watchlistContainer.appendChild(createMovieCard(movie, 'watchlist')));
    if (watchlistFiltered.length === 0) {
        watchlistContainer.innerHTML = '<div class="empty-state">İzlenecekler listesi boş.</div>';
    }
}

function filterList(list, category, rating) {
    return list.filter(m => {
        const categoryMatch = category === 'all' || (m.genre_ids && m.genre_ids.includes(parseInt(category)));
        const ratingMatch = rating === 'all' || m.userRating === rating;
        return categoryMatch && ratingMatch;
    });
}

function updateFilterOptions() {
    const categories = new Set();
    [...state.watched, ...state.watchlist].forEach(m => {
        if (m.genre_ids) m.genre_ids.forEach(id => categories.add(id));
    });

    const categoryOptions = '<option value="all">Tüm Kategoriler</option>' + 
        Array.from(categories)
            .sort((a, b) => (state.genres[a] || '').localeCompare(state.genres[b] || ''))
            .map(id => `<option value="${id}">${state.genres[id] || 'Bilinmeyen'}</option>`)
            .join('');

    watchedCategoryFilter.innerHTML = categoryOptions;
    watchlistCategoryFilter.innerHTML = categoryOptions;
}

// --- Action Functions ---
window.addToWatchlist = (movie) => {
    if (state.watchlist.find(m => m.id === movie.id)) {
        alert('Bu zaten izlenecekler listenizde!');
        return;
    }
    state.watchlist.push(movie);
    saveState();
    renderLists();
};

window.openRatingModal = (id, movie) => {
    movieToRate = movie;
    ratingOverlay.classList.add('active');
};

window.removeFromWatched = (id) => {
    state.watched = state.watched.filter(m => m.id !== id);
    saveState();
    renderLists();
};

window.removeFromWatchlist = (id) => {
    state.watchlist = state.watchlist.filter(m => m.id !== id);
    saveState();
    renderLists();
};

function saveState() {
    localStorage.setItem('watched_list', JSON.stringify(state.watched));
    localStorage.setItem('watchlist_list', JSON.stringify(state.watchlist));
    updateFilterOptions();
}

// --- Event Listeners ---
function setupEventListeners() {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.getAttribute('data-view');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`${viewId}View`).classList.add('active');
        });
    });

    // Search
    searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies(searchInput.value);
    });

    // Settings
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    saveApiKeyBtn.addEventListener('click', () => {
        state.apiKey = apiKeyInput.value.trim();
        localStorage.setItem('tmdb_api_key', state.apiKey);
        settingsModal.classList.remove('active');
        fetchGenres();
    });

    // Rating
    rateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = btn.getAttribute('data-rating');
            if (movieToRate) {
                // Remove from watchlist if there
                state.watchlist = state.watchlist.filter(m => m.id !== movieToRate.id);
                // Add to watched
                movieToRate.userRating = rating;
                state.watched.push(movieToRate);
                saveState();
                renderLists();
                ratingOverlay.classList.remove('active');
                movieToRate = null;
            }
        });
    });

    cancelRatingBtn.addEventListener('click', () => {
        ratingOverlay.classList.remove('active');
        movieToRate = null;
    });

    // Filters
    watchedCategoryFilter.addEventListener('change', renderLists);
    watchedRatingFilter.addEventListener('change', renderLists);
    watchlistCategoryFilter.addEventListener('change', renderLists);
}

// Run Init
init();
