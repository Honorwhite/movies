const TMDB_API_KEY = '4a9f3fe6b13e66b0dd355b7318b7e0e4';
const LOCAL_URL = 'http://localhost:3000/data';

let isLocalServerAvailable = false;

let state = {
    watched: [],
    watchlist: [],
    currentView: 'search',
    genres: {},
    cloudSettings: {
        url: localStorage.getItem('supabase_url') || 'https://gbdqycgclxhblhhjhpbm.supabase.co',
        key: localStorage.getItem('supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHF5Y2djbHhoYmxoaGpocGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Njk2MjMsImV4cCI6MjA4MzA0NTYyM30.85TIwLzahIY30zRlY_y2afw_eziDaYLhXWCCh1HZu5I'
    }
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
const watchlistSearch = document.getElementById('watchlistSearch');
const syncStatus = document.getElementById('syncStatus');
const settingsModal = document.getElementById('settingsModal');
const saveCloudSettingsBtn = document.getElementById('saveCloudSettings');
const closeSettingsModalBtn = document.getElementById('closeSettingsModal');
const supabaseUrlInput = document.getElementById('supabaseUrl');
const supabaseKeyInput = document.getElementById('supabaseKey');

let movieToRate = null;

// --- Initialization ---
async function init() {
    setupEventListeners();
    await fetchGenres();
    await checkLocalServer();

    // Fill settings inputs
    if (supabaseUrlInput) supabaseUrlInput.value = state.cloudSettings.url;
    if (supabaseKeyInput) supabaseKeyInput.value = state.cloudSettings.key;

    await loadStateFromCloud();
    renderLists();
}

async function checkLocalServer() {
    try {
        const response = await fetch(LOCAL_URL, { method: 'GET' });
        isLocalServerAvailable = response.ok;
        if (isLocalServerAvailable) {
            console.log('Yerel sunucu (server.js) aktif. Veriler movies.json dosyasına kaydedilecek.');
        }
    } catch (e) {
        isLocalServerAvailable = false;
        console.log('Yerel sunucu aktif değil. Bulut yedekleme kullanılacak.');
    }
}

// --- Cloud Storage Functions (Pantry) ---
function updateSyncUI(message, type = 'active') {
    if (!syncStatus) return;
    const span = syncStatus.querySelector('span');
    const icon = syncStatus.querySelector('i');

    span.textContent = message;
    syncStatus.className = `sync-status ${type}`;

    if (type === 'error') {
        icon.className = 'fas fa-exclamation-triangle';
    } else {
        icon.className = 'fas fa-cloud';
    }

    if (type === 'active' || type === 'error') {
        syncStatus.classList.add('active');
    } else {
        setTimeout(() => syncStatus.classList.remove('active'), 2000);
    }
}

async function loadStateFromCloud() {
    updateSyncUI('Eşitleniyor...', 'active');

    const localWatched = JSON.parse(localStorage.getItem('watched_list')) || [];
    const localWatchlist = JSON.parse(localStorage.getItem('watchlist_list')) || [];

    state.watched = localWatched;
    state.watchlist = localWatchlist;

    if (isLocalServerAvailable) {
        try {
            const response = await fetch(LOCAL_URL);
            if (response.ok) {
                const remoteData = await response.json();
                const remoteTimestamp = remoteData.lastUpdated || 0;
                const localTimestamp = parseInt(localStorage.getItem('last_updated')) || 0;

                if (remoteTimestamp > localTimestamp) {
                    state.watched = remoteData.watched || [];
                    state.watchlist = remoteData.watchlist || [];
                    saveStateToLocal(false); // Update local without updating timestamp
                    updateSyncUI('Dosyadan Yüklendi', 'success');
                } else {
                    await saveStateToCloudBase(false); // Push local to file
                    updateSyncUI('Dosya Güncellendi', 'success');
                }
            }
        } catch (e) {
            console.error('Lokal sunucu yükleme hatası:', e);
            updateSyncUI('Yerel Hata', 'error');
        }
    } else if (state.cloudSettings.url && state.cloudSettings.key) {
        try {
            // Supabase REST API - Get data
            const response = await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker?id=eq.default`, {
                headers: {
                    'apikey': state.cloudSettings.key,
                    'Authorization': `Bearer ${state.cloudSettings.key}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const cloudData = data[0].content;
                    const remoteTimestamp = cloudData.lastUpdated || 0;
                    const localTimestamp = parseInt(localStorage.getItem('last_updated')) || 0;

                    if (remoteTimestamp > localTimestamp) {
                        state.watched = cloudData.watched || [];
                        state.watchlist = cloudData.watchlist || [];
                        saveStateToLocal(false);
                        updateSyncUI('Buluttan Alındı', 'success');
                    } else {
                        await saveStateToCloudBase(false);
                        updateSyncUI('Bulut Güncellendi', 'success');
                    }
                } else {
                    updateSyncUI('Bulut Hazır', 'success');
                }
            } else {
                const errorText = await response.text();
                console.error('Supabase Yükleme Hatası detayı:', response.status, errorText);
                updateSyncUI('Bulut Hatası', 'error');
            }
        } catch (e) {
            console.error('Supabase bağlantı hatası:', e);
            updateSyncUI('Bağlantı Hatası', 'error');
        }
    } else {
        updateSyncUI('Bulut Kapalı', 'success');
    }

    renderLists();
    updateFeaturedCarousel();
}

// İki listeyi ID bazlı birleştirir, aynı film varsa son veriyi tutar
function mergeMovieLists(list1, list2) {
    const combinedMap = new Map();
    list1.forEach(m => combinedMap.set(m.id, m));
    list2.forEach(m => combinedMap.set(m.id, m));
    return Array.from(combinedMap.values());
}

function saveStateToLocal(updateTimestamp = true) {
    const now = new Date().getTime();
    if (updateTimestamp) {
        localStorage.setItem('last_updated', now.toString());
    }
    localStorage.setItem('watched_list', JSON.stringify(state.watched));
    localStorage.setItem('watchlist_list', JSON.stringify(state.watchlist));
    return now;
}

// Sadece buluta/dosyaya kaydeder
async function saveStateToCloudBase(showUI = true) {
    if (showUI) updateSyncUI('Kaydediliyor...', 'active');

    if (isLocalServerAvailable) {
        try {
            const response = await fetch(LOCAL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watched: state.watched,
                    watchlist: state.watchlist,
                    lastUpdated: parseInt(localStorage.getItem('last_updated')) || new Date().getTime()
                })
            });
            if (showUI) {
                if (response.ok) updateSyncUI('Dosyaya Kaydedildi', 'success');
                else updateSyncUI('Dosya Hatası', 'error');
            }
            return response.ok;
        } catch (e) {
            if (showUI) updateSyncUI('Yerel Hata', 'error');
            return false;
        }
    } else if (state.cloudSettings.url && state.cloudSettings.key) {
        try {
            // Supabase REST API - UPSERT logic
            const response = await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker`, {
                method: 'POST',
                headers: {
                    'apikey': state.cloudSettings.key,
                    'Authorization': `Bearer ${state.cloudSettings.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({
                    id: 'default',
                    content: {
                        watched: state.watched,
                        watchlist: state.watchlist,
                        lastUpdated: parseInt(localStorage.getItem('last_updated')) || new Date().getTime()
                    }
                })
            });
            if (showUI) {
                if (response.ok) {
                    updateSyncUI('Buluta Kaydedildi', 'success');
                } else {
                    const errorText = await response.text();
                    console.error('Supabase Kayıt Hatası detayı:', response.status, errorText);
                    updateSyncUI('Bulut Hatası', 'error');
                }
            }
            return response.ok;
        } catch (e) {
            if (showUI) updateSyncUI('Bağlantı Hatası', 'error');
            return false;
        }
    }
    return false;
}

async function saveState() {
    saveStateToLocal();
    updateFilterOptions();
    updateFeaturedCarousel();
    await saveStateToCloudBase();
}

// --- Backup & Restore Functions ---
function downloadData() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinetrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    updateSyncUI('Yedek İndirildi', 'success');
}

function handleRestore(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedState = JSON.parse(e.target.result);
            if (importedState.watched && importedState.watchlist) {
                if (confirm('Veriler geri yüklenecek. Mevcut listenizle birleştirilsin mi? (İptal derseniz tamamen yer değiştirir)')) {
                    state.watched = mergeMovieLists(state.watched, importedState.watched);
                    state.watchlist = mergeMovieLists(state.watchlist, importedState.watchlist);
                } else {
                    state.watched = importedState.watched;
                    state.watchlist = importedState.watchlist;
                }

                await saveState();
                renderLists();
                updateFeaturedCarousel();
                alert('Yedek başarıyla yüklendi!');
            } else {
                alert('Geçersiz yedek dosyası.');
            }
        } catch (err) {
            console.error('Yükleme hatası:', err);
            alert('Dosya okunurken bir hata oluştu.');
        }
    };
    reader.readAsText(file);
    restoreFile.value = ''; // Reset input
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

    // Settings
    if (settingsBtn) settingsBtn.style.display = 'flex';

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
    // Backup & Restore
    backupBtn.addEventListener('click', downloadData);
    restoreBtn.addEventListener('click', () => restoreFile.click());
    restoreFile.addEventListener('change', handleRestore);

    // Settings Modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    closeSettingsModalBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    saveCloudSettingsBtn.addEventListener('click', async () => {
        state.cloudSettings.url = supabaseUrlInput.value.trim();
        state.cloudSettings.key = supabaseKeyInput.value.trim();

        localStorage.setItem('supabase_url', state.cloudSettings.url);
        localStorage.setItem('supabase_key', state.cloudSettings.key);

        settingsModal.classList.remove('active');
        await loadStateFromCloud();
    });
}

// Run Init
init();
