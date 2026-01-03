const TMDB_API_KEY = '4a9f3fe6b13e66b0dd355b7318b7e0e4';
const PANTRY_ID = '3372c0c7-d867-4638-9993-4fc64379e43c'; // Gerçek ve benzersiz bir Pantry ID
const BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket`;

let state = {
    watched: [],
    watchlist: [],
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
const featuredCarousel = document.getElementById('featuredCarousel');
const carouselTrack = document.getElementById('carouselTrack');
const settingsBtn = document.getElementById('settingsBtn');
const ratingOverlay = document.getElementById('ratingOverlay');
const cancelRatingBtn = document.getElementById('cancelRating');
const rateBtns = document.querySelectorAll('.rate-btn');

const watchedCategoryFilter = document.getElementById('watchedCategoryFilter');
const watchedRatingFilter = document.getElementById('watchedRatingFilter');
const watchedSearch = document.getElementById('watchedSearch');
const watchlistCategoryFilter = document.getElementById('watchlistCategoryFilter');
const watchlistSearch = document.getElementById('watchlistSearch');

let movieToRate = null;

// --- Initialization ---
async function init() {
    setupEventListeners();
    await fetchGenres();
    await loadStateFromCloud();
    updateFeaturedCarousel();
    renderLists();
}

// --- Cloud Storage Functions (Pantry) ---
async function loadStateFromCloud() {
    // Önce LocalStorage'dan yükle (Hızlı başlangıç ve yedek)
    const localWatched = JSON.parse(localStorage.getItem('watched_list')) || [];
    const localWatchlist = JSON.parse(localStorage.getItem('watchlist_list')) || [];

    state.watched = localWatched;
    state.watchlist = localWatchlist;

    try {
        console.log('Buluttan veriler çekiliyor...');
        const response = await fetch(`${BASE_URL}/movieData`);

        if (response.ok) {
            const cloudData = await response.json();
            // Bulut verisi varsa LocalStorage'dan daha güncel kabul et
            if (cloudData.watched || cloudData.watchlist) {
                state.watched = cloudData.watched || [];
                state.watchlist = cloudData.watchlist || [];
                // LocalStorage'ı da güncelle
                localStorage.setItem('watched_list', JSON.stringify(state.watched));
                localStorage.setItem('watchlist_list', JSON.stringify(state.watchlist));
                console.log('Veriler buluttan başarıyla senkronize edildi.');
            }
        } else if (response.status === 404) {
            // Eğer bulutta hiç veri yoksa ama yerelde varsa, yereli buluta yükle
            if (state.watched.length > 0 || state.watchlist.length > 0) {
                console.log('Bulutta veri yok, yerel veriler yükleniyor...');
                await saveStateToCloud();
            }
        }
    } catch (error) {
        console.error('Bulut senkronizasyon hatası (Çevrimdışı mod):', error);
        // Hata durumunda yerel verilerle devam et (zaten yukarıda set etmiştik)
    }
}

async function saveStateToCloud() {
    // Her zaman önce yerel olarak kaydet
    localStorage.setItem('watched_list', JSON.stringify(state.watched));
    localStorage.setItem('watchlist_list', JSON.stringify(state.watchlist));

    try {
        const response = await fetch(`${BASE_URL}/movieData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                watched: state.watched,
                watchlist: state.watchlist
            })
        });

        if (response.ok) {
            console.log('Veriler buluta başarıyla kaydedildi.');
        } else {
            console.error('Bulut kaydetme hatası (Status):', response.status);
        }
    } catch (error) {
        console.error('Bulut kaydetme hatası (Network):', error);
    }
}

// --- API Functions ---
async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=tr-TR`);
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
    if (!query) {
        searchResults.innerHTML = '';
        updateFeaturedCarousel();
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR`);
        const data = await response.json();
        renderSearchResults(data.results);
    } catch (error) {
        console.error('Search error:', error);
        alert('Arama sırasında bir hata oluştu.');
    }
}

function updateFeaturedCarousel() {
    if (!carouselTrack) return;

    const items = state.watchlist;
    if (items.length === 0) {
        featuredCarousel.style.display = 'none';
        return;
    }

    featuredCarousel.style.display = 'block';
    carouselTrack.innerHTML = '';

    const createItem = (item) => {
        const title = item.title || item.name;
        const watchUrl = `https://izlelan.vercel.app/ara?q=${encodeURIComponent(title)}`;
        const div = document.createElement('div');
        div.className = 'carousel-item';
        div.style.cursor = 'pointer';
        div.onclick = () => window.open(watchUrl, '_blank');
        div.innerHTML = `<img src="https://image.tmdb.org/t/p/w342${item.poster_path}" alt="${title}">`;
        return div;
    };

    // Populate and clone for infinite loop
    items.forEach(item => carouselTrack.appendChild(createItem(item)));

    // Clone items enough times to fill the track and ensure smooth loop
    const cloneCount = Math.ceil(20 / items.length) + 1;
    for (let i = 0; i < cloneCount; i++) {
        items.forEach(item => carouselTrack.appendChild(createItem(item)));
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

    const removeBtnHtml = (context === 'watched' || context === 'watchlist') ? `
        <button class="action-btn remove-btn" onclick="${context === 'watched' ? `removeFromWatched(${movie.id})` : `removeFromWatchlist(${movie.id})`}" title="Listeden Kaldır">
            <i class="fas fa-times"></i>
        </button>
    ` : '';

    const watchUrl = `https://izlelan.vercel.app/ara?q=${encodeURIComponent(title)}`;

    card.innerHTML = `
        <div class="poster-container" onclick="window.open('${watchUrl}', '_blank')" style="cursor: pointer;">
            ${removeBtnHtml}
            ${ratingBadge}
            <img src="${posterUrl}" alt="${title}" loading="lazy">
            <div class="card-overlay">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        </div>
        <div class="movie-info">
            <h3 onclick="window.open('${watchUrl}', '_blank')" style="cursor: pointer;">${title}</h3>
            <div class="movie-meta">
                <span><i class="far fa-calendar"></i> ${year}</span>
                <span><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
        </div>
        <div class="card-actions">
            ${context === 'search' ? `
                <button class="action-btn watched-btn ${isWatched ? 'is-added' : ''}" 
                        onclick="${isWatched ? '' : `openRatingModal(${movie.id}, ${JSON.stringify(movie).replace(/"/g, '&quot;')})`}">
                    <i class="fas fa-check"></i> ${isWatched ? 'İzlendi' : 'İzledim'}
                </button>
                <button class="action-btn watchlist-btn ${isWatchlist ? 'is-added' : ''}" 
                        onclick="${isWatchlist ? '' : `addToWatchlist(${JSON.stringify(movie).replace(/"/g, '&quot;')})`}">
                    <i class="fas fa-plus"></i> ${isWatchlist ? 'Listede' : 'İzlenecek'}
                </button>
            ` : ''}
            
            ${context === 'watchlist' ? `
                <button class="action-btn watched-btn" onclick="openRatingModal(${movie.id}, ${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                    <i class="fas fa-check"></i> İzledim
                </button>
            ` : ''}
        </div>
    `;
    return card;
}

function renderLists() {
    // Render Watched List
    const watchedFiltered = filterList(state.watched, watchedCategoryFilter.value, watchedRatingFilter.value, watchedSearch.value);
    watchedList.innerHTML = '';
    watchedFiltered.forEach(movie => watchedList.appendChild(createMovieCard(movie, 'watched')));
    if (watchedFiltered.length === 0) {
        watchedList.innerHTML = '<div class="empty-state">Burada henüz bir şey yok.</div>';
    }

    // Render Watchlist
    const watchlistFiltered = filterList(state.watchlist, watchlistCategoryFilter.value, 'all', watchlistSearch.value);
    watchlistContainer.innerHTML = '';
    watchlistFiltered.forEach(movie => watchlistContainer.appendChild(createMovieCard(movie, 'watchlist')));
    if (watchlistFiltered.length === 0) {
        watchlistContainer.innerHTML = '<div class="empty-state">İzlenecekler listesi boş.</div>';
    }
}

function filterList(list, category, rating, searchQuery) {
    return list.filter(m => {
        const title = (m.title || m.name || '').toLowerCase();
        const searchMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
        const categoryMatch = category === 'all' || (m.genre_ids && m.genre_ids.includes(parseInt(category)));
        const ratingMatch = rating === 'all' || m.userRating === rating;
        return searchMatch && categoryMatch && ratingMatch;
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
    saveStateToCloud();
    updateFilterOptions();
    updateFeaturedCarousel();
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
    searchInput.addEventListener('input', () => {
        if (!searchInput.value.trim()) {
            searchResults.innerHTML = '';
            updateFeaturedCarousel();
        }
    });

    // Settings (Hidden/Disabled)
    if (settingsBtn) settingsBtn.style.display = 'none';

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
    watchedSearch.addEventListener('input', renderLists);
    watchlistCategoryFilter.addEventListener('change', renderLists);
    watchlistSearch.addEventListener('input', renderLists);
}

// Run Init
init();
