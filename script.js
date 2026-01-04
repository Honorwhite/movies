const TMDB_API_KEY = '4a9f3fe6b13e66b0dd355b7318b7e0e4';
const LOCAL_URL = 'http://localhost:3000/data';

let isLocalServerAvailable = false;

let state = {
    watched: [],
    watchlist: [],
    currentView: 'search',
    watched: [],
    watchlist: [],
    currentView: 'search',
    cloudSettings: {
        url: localStorage.getItem('supabase_url') || 'https://gbdqycgclxhblhhjhpbm.supabase.co',
        key: localStorage.getItem('supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHF5Y2djbHhoYmxoaGpocGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Njk2MjMsImV4cCI6MjA4MzA0NTYyM30.85TIwLzahIY30zRlY_y2afw_eziDaYLhXWCCh1HZu5I'
    },
    ignored: []
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
const cancelRatingBtn = null; // Removed
const rateBtns = null; // Removed


const watchlistSearch = document.getElementById('watchlistSearch');
const syncStatus = document.getElementById('syncStatus');
const settingsModal = document.getElementById('settingsModal');
const saveCloudSettingsBtn = document.getElementById('saveCloudSettings');
const closeSettingsModalBtn = document.getElementById('closeSettingsModal');
const supabaseUrlInput = document.getElementById('supabaseUrl');
const supabaseKeyInput = document.getElementById('supabaseKey');

const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const restoreFile = document.getElementById('restoreFile');
const watchedSearch = document.getElementById('watchedSearch');

// Recommended Movies Elements
const recommendedSection = document.getElementById('recommendedSection');
const recommendedMovies = document.getElementById('recommendedMovies');
const loadingIndicator = document.getElementById('loadingIndicator');

let movieToRate = null;

// Recommended Movies State
let recommendedState = {
    page: 1,
    isLoading: false,
    hasMore: true,
    loadedMovies: [],
    selectedGenre: null
};

const genreChips = document.getElementById('genreChips');


// --- Initialization ---
async function init() {
    setupEventListeners();
    await checkLocalServer();

    // Fill settings inputs
    if (supabaseUrlInput) supabaseUrlInput.value = state.cloudSettings.url;
    if (supabaseKeyInput) supabaseKeyInput.value = state.cloudSettings.key;

    await loadStateFromCloud();
    renderLists();

    // Load initial recommended movies
    initGenres();
    loadRecommendedMovies();

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW Registered'))
                .catch(err => console.log('SW Error', err));
        });
    }
}


async function checkLocalServer() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 saniye timeout

        const response = await fetch(LOCAL_URL, {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        isLocalServerAvailable = response.ok;
        if (isLocalServerAvailable) {
            console.log('Yerel sunucu aktif.');
        }
    } catch (e) {
        isLocalServerAvailable = false;
        console.log('Yerel sunucu yok, bulut kullanılacak.');
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
    const localIgnored = JSON.parse(localStorage.getItem('ignored_list')) || [];
    const localTimestamp = parseInt(localStorage.getItem('last_updated')) || 0;

    state.watched = localWatched;
    state.watchlist = localWatchlist;
    state.ignored = localIgnored;

    console.log('Yerel veriler yüklendi. Zaman damgası:', localTimestamp);

    if (isLocalServerAvailable) {
        try {
            const response = await fetch(LOCAL_URL);
            if (response.ok) {
                const remoteData = await response.json();
                const remoteTimestamp = remoteData.lastUpdated || 0;

                if (remoteTimestamp > localTimestamp) {
                    console.log('Dosya verisi yerelden yeni, güncelleniyor.');
                    state.watched = remoteData.watched || [];
                    state.watchlist = remoteData.watchlist || [];
                    state.ignored = remoteData.ignored || [];
                    saveStateToLocal(false);
                    updateSyncUI('Dosyadan Yüklendi', 'success');
                } else if (remoteTimestamp < localTimestamp && localTimestamp > 0) {
                    console.log('Yerel veri dosyadan yeni, dosyaya aktarılıyor.');
                    await saveStateToCloudBase(false);
                    updateSyncUI('Dosya Güncellendi', 'success');
                } else {
                    updateSyncUI('Dosya Güncel', 'success');
                }
            }
        } catch (e) {
            console.error('Lokal sunucu hatası:', e);
            updateSyncUI('Yerel Hata', 'error');
        }
    } else if (state.cloudSettings.url && state.cloudSettings.key) {
        try {
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

                    console.log('Bulut verisi zaman damgası:', remoteTimestamp);

                    if (remoteTimestamp > localTimestamp) {
                        console.log('Bulut verisi yerelden yeni, güncelleniyor.');
                        state.watched = cloudData.watched || [];
                        state.watchlist = cloudData.watchlist || [];
                        state.ignored = cloudData.ignored || [];
                        saveStateToLocal(false);
                        updateSyncUI('Buluttan Alındı', 'success');
                    } else if (remoteTimestamp < localTimestamp && (localWatched.length > 0 || localWatchlist.length > 0)) {
                        console.log('Yerel veri buluttan yeni, buluta aktarılıyor.');
                        await saveStateToCloudBase(false);
                        updateSyncUI('Bulut Güncellendi', 'success');
                    } else {
                        updateSyncUI('Bulut Güncel', 'success');
                    }
                } else {
                    console.log('Bulutta veri yok.');
                    if (localWatched.length > 0 || localWatchlist.length > 0) {
                        console.log('Yerel veri buluta ilk kez yükleniyor.');
                        await saveStateToCloudBase(false);
                        updateSyncUI('Buluta Aktarıldı', 'success');
                    } else {
                        updateSyncUI('Bulut Boş', 'success');
                    }
                }
            } else {
                const errorText = await response.text();
                console.error('Supabase Yükleme Hatası:', response.status, errorText);
                updateSyncUI('Bulut Hatası', 'error');
            }
        } catch (e) {
            console.error('Supabase Bağlantı Hatası:', e);
            updateSyncUI('Bağlantı Hatası', 'error');
        }
    } else {
        updateSyncUI('Bulut Devre Dışı', 'success');
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
    localStorage.setItem('ignored_list', JSON.stringify(state.ignored));
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
                    ignored: state.ignored,
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
                        ignored: state.ignored,
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
                    state.ignored = mergeMovieLists(state.ignored || [], importedState.ignored || []);
                } else {
                    state.watched = importedState.watched;
                    state.watchlist = importedState.watchlist;
                    state.ignored = importedState.ignored || [];
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


async function searchMovies(query) {
    if (!query) {
        searchResults.innerHTML = '';
        updateFeaturedCarousel();
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
        const data = await response.json();
        renderSearchResults(data.results);
    } catch (error) {
        console.error('Search error:', error);
        alert('Arama sırasında bir hata oluştu.');
    }
}

// --- Recommended Movies & Categories ---
async function initGenres() {
    try {
        const [movieGenres, tvGenres] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=tr-TR`),
            fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=tr-TR`)
        ]);

        const mData = await movieGenres.json();
        const tData = await tvGenres.json();

        // Combine and remove duplicates
        const allGenres = [...mData.genres, ...tData.genres];
        const uniqueGenres = Array.from(new Map(allGenres.map(g => [g.id, g])).values());

        renderGenreChips(uniqueGenres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function renderGenreChips(genres) {
    if (!genreChips) return;
    genreChips.innerHTML = '';

    // Add "All" chip
    const allChip = document.createElement('div');
    allChip.className = 'genre-chip active';
    allChip.textContent = 'Hepsi';
    allChip.onclick = () => selectGenre(null, allChip);
    genreChips.appendChild(allChip);

    genres.slice(0, 15).forEach(genre => {
        const chip = document.createElement('div');
        chip.className = 'genre-chip';
        chip.textContent = genre.name;
        chip.onclick = () => selectGenre(genre.id, chip);
        genreChips.appendChild(chip);
    });
}

function selectGenre(genreId, chipElement) {
    if (recommendedState.selectedGenre === genreId) return;

    // Update UI
    document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
    chipElement.classList.add('active');

    // Update state and reload
    recommendedState.selectedGenre = genreId;
    recommendedState.page = 1;
    recommendedState.loadedMovies = [];
    recommendedState.hasMore = true;
    recommendedMovies.innerHTML = '';

    loadRecommendedMovies();
}

async function loadRecommendedMovies() {
    if (recommendedState.isLoading || !recommendedState.hasMore) return;

    recommendedState.isLoading = true;
    loadingIndicator.classList.add('active');

    try {
        const genreParam = recommendedState.selectedGenre ? `&with_genres=${recommendedState.selectedGenre}` : '';

        // Fetch popular/top_rated for both movies and tv
        const baseURL = `https://api.themoviedb.org/3/discover`;
        const commonParams = `api_key=${TMDB_API_KEY}&language=en-US&page=${recommendedState.page}&sort_by=popularity.desc${genreParam}`;

        const [moviesRes, tvRes] = await Promise.all([
            fetch(`${baseURL}/movie?${commonParams}`),
            fetch(`${baseURL}/tv?${commonParams}`)
        ]);

        const dataArr = await Promise.all([
            moviesRes.json(), tvRes.json()
        ]);

        // Tag and combine
        dataArr[0].results.forEach(m => m.media_type = 'movie');
        dataArr[1].results.forEach(m => m.media_type = 'tv');

        let allItems = [...dataArr[0].results, ...dataArr[1].results];

        // Remove duplicates based on ID
        const uniqueItems = Array.from(new Map(allItems.map(m => [m.id, m])).values());

        // Filter out items already in user's lists, ignored, and already loaded
        const filteredItems = uniqueItems.filter(item => {
            const isInWatched = state.watched.some(m => m.id === item.id);
            const isInWatchlist = state.watchlist.some(m => m.id === item.id);
            const isIgnored = state.ignored.some(m => m.id === item.id);
            const isAlreadyLoaded = recommendedState.loadedMovies.some(m => m.id === item.id);
            const hasValidPoster = item.poster_path;
            const isHighRated = item.vote_average >= 6.5;

            const releaseDate = item.release_date || item.first_air_date;
            const isRecent = releaseDate && new Date(releaseDate).getFullYear() >= 2015;

            return !isInWatched && !isInWatchlist && !isIgnored && !isAlreadyLoaded && hasValidPoster && isHighRated && isRecent;
        });

        // Sort by rating and recency
        filteredItems.sort((a, b) => {
            const ratingDiff = b.vote_average - a.vote_average;
            if (Math.abs(ratingDiff) > 0.5) return ratingDiff;

            const dateA = new Date(a.release_date || a.first_air_date || '2000-01-01');
            const dateB = new Date(b.release_date || b.first_air_date || '2000-01-01');
            return dateB - dateA;
        });

        // Take top items
        const itemsToShow = filteredItems.slice(0, 12);

        if (itemsToShow.length === 0) {
            // If we have more pages but filtered everything out, try next page
            if (recommendedState.page < 10) {
                recommendedState.page++;
                recommendedState.isLoading = false;
                return loadRecommendedMovies();
            }
            recommendedState.hasMore = false;
            loadingIndicator.classList.remove('active');
            return;
        }

        // Add to loaded movies
        recommendedState.loadedMovies.push(...itemsToShow);

        // Render items
        itemsToShow.forEach(item => {
            const card = createMovieCard(item, 'recommended');
            recommendedMovies.appendChild(card);
        });

        recommendedState.page++;

    } catch (error) {
        console.error('Error loading recommended items:', error);
    } finally {
        recommendedState.isLoading = false;
        loadingIndicator.classList.remove('active');
    }
}

function setupInfiniteScroll() {
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            // Check if user is in search view
            const searchView = document.getElementById('searchView');
            if (!searchView || !searchView.classList.contains('active')) return;

            // Check if near bottom of page
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= pageHeight - 1000) {
                loadRecommendedMovies();
            }
        }, 100);
    });
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
    card.setAttribute('data-id', movie.id);
    card.setAttribute('data-context', context);

    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date || '';
    const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    const isWatched = state.watched.find(m => m.id === movie.id);
    const isWatchlist = state.watchlist.find(m => m.id === movie.id);

    const removeBtnHtml = (context === 'watched' || context === 'watchlist') ? `
        <button class="action-btn remove-btn" onclick="event.stopPropagation(); ${context === 'watched' ? `removeFromWatched(${movie.id})` : `removeFromWatchlist(${movie.id})`}" title="Listeden Kaldır">
            <i class="fas fa-times"></i>
        </button>
    ` : '';

    const watchUrl = `https://izlelan.vercel.app/ara?q=${encodeURIComponent(title)}`;

    card.innerHTML = `
        <div class="poster-container" onclick="window.open('${watchUrl}', '_blank')" style="cursor: pointer;">
            ${removeBtnHtml}
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
            ${context === 'search' || context === 'recommended' ? `
                <button class="action-btn watched-btn ${isWatched ? 'is-added' : ''}" 
                        onclick="${isWatched ? '' : `addToWatched(${JSON.stringify(movie).replace(/"/g, '&quot;')})`}">
                    <i class="fas fa-check"></i> <span>${isWatched ? 'İzlendi' : 'İzledim'}</span>
                </button>
                <button class="action-btn watchlist-btn ${isWatchlist ? 'is-added' : ''}" 
                        onclick="${isWatchlist ? '' : `addToWatchlist(${JSON.stringify(movie).replace(/"/g, '&quot;')})`}">
                    <i class="fas fa-plus"></i> <span>${isWatchlist ? 'Listede' : 'İzlenecek'}</span>
                </button>
                ${context === 'recommended' ? `
                    <button class="action-btn ignore-btn" onclick="ignoreMovie(${JSON.stringify(movie).replace(/"/g, '&quot;')})" title="Gizle">
                        <i class="fas fa-eye-slash"></i>
                    </button>
                ` : ''}
            ` : ''}
            
            ${context === 'watchlist' ? `
                <button class="action-btn watched-btn" onclick="addToWatched(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                    <i class="fas fa-check"></i> <span>İzledim</span>
                </button>
            ` : ''}
        </div>
    `;
    return card;
}

function renderLists() {
    // Render Watched List
    const watchedFiltered = filterList(state.watched, watchedSearch.value);
    watchedList.innerHTML = '';
    watchedFiltered.forEach(movie => watchedList.appendChild(createMovieCard(movie, 'watched')));
    if (watchedFiltered.length === 0) {
        watchedList.innerHTML = '<div class="empty-state">Burada henüz bir şey yok.</div>';
    }

    // Render Watchlist
    const watchlistFiltered = filterList(state.watchlist, watchlistSearch.value);
    watchlistContainer.innerHTML = '';
    watchlistFiltered.forEach(movie => watchlistContainer.appendChild(createMovieCard(movie, 'watchlist')));
    if (watchlistFiltered.length === 0) {
        watchlistContainer.innerHTML = '<div class="empty-state">İzlenecekler listesi boş.</div>';
    }
}

function filterList(list, searchQuery) {
    return list.filter(m => {
        const title = (m.title || m.name || '').toLowerCase();
        const searchMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
        return searchMatch;
    });
}



// --- Action Functions ---
function removeCardFromSearch(id) {
    const card = searchResults.querySelector(`.movie-card[data-id="${id}"][data-context="search"]`);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (card.parentNode === searchResults) {
                searchResults.removeChild(card);
                if (searchResults.children.length === 0) {
                    searchResults.innerHTML = '<p class="no-results">Sonuç bulunamadı.</p>';
                }
            }
        }, 300);
    }
}

function removeCardFromRecommended(id) {
    const card = recommendedMovies.querySelector(`.movie-card[data-id="${id}"][data-context="recommended"]`);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (card.parentNode === recommendedMovies) {
                recommendedMovies.removeChild(card);
            }
        }, 300);
    }
}


window.addToWatchlist = (movie) => {
    if (state.watchlist.find(m => m.id === movie.id)) {
        alert('Bu zaten izlenecekler listenizde!');
        return;
    }
    state.watchlist.push(movie);
    saveState();
    renderLists();
    removeCardFromSearch(movie.id);
    removeCardFromRecommended(movie.id);
};

window.addToWatched = (movie) => {
    if (state.watched.find(m => m.id === movie.id)) {
        alert('Bu zaten izlediğiniz filmler listenizde!');
        return;
    }
    // Remove from watchlist if exists
    state.watchlist = state.watchlist.filter(m => m.id !== movie.id);
    state.watched.push(movie);
    saveState();
    renderLists();
    removeCardFromSearch(movie.id);
    removeCardFromRecommended(movie.id);
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

window.ignoreMovie = (movie) => {
    if (state.ignored.find(m => m.id === movie.id)) return;
    state.ignored.push(movie);
    saveState();
    removeCardFromRecommended(movie.id);
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
    if (typeof searchBtn !== 'undefined' && searchBtn) searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
    if (typeof searchInput !== 'undefined' && searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchMovies(searchInput.value);
        });
        searchInput.addEventListener('input', () => {
            if (!searchInput.value.trim()) {
                searchResults.innerHTML = '';
                updateFeaturedCarousel();
            }
        });
    }

    // Settings
    if (typeof settingsBtn !== 'undefined' && settingsBtn) settingsBtn.style.display = 'flex';

    // Filters
    if (typeof watchedSearch !== 'undefined' && watchedSearch) watchedSearch.addEventListener('input', renderLists);
    if (typeof watchlistSearch !== 'undefined' && watchlistSearch) watchlistSearch.addEventListener('input', renderLists);

    // Backup & Restore
    if (typeof backupBtn !== 'undefined' && backupBtn) backupBtn.addEventListener('click', downloadData);
    if (typeof restoreBtn !== 'undefined' && restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            if (typeof restoreFile !== 'undefined' && restoreFile) restoreFile.click();
        });
    }
    if (typeof restoreFile !== 'undefined' && restoreFile) restoreFile.addEventListener('change', handleRestore);

    // Settings Modal
    if (typeof settingsBtn !== 'undefined' && settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if (typeof settingsModal !== 'undefined' && settingsModal) settingsModal.classList.add('active');
        });
    }

    if (typeof closeSettingsModalBtn !== 'undefined' && closeSettingsModalBtn) {
        closeSettingsModalBtn.addEventListener('click', () => {
            if (typeof settingsModal !== 'undefined' && settingsModal) settingsModal.classList.remove('active');
        });
    }

    if (typeof saveCloudSettingsBtn !== 'undefined' && saveCloudSettingsBtn) {
        saveCloudSettingsBtn.addEventListener('click', async () => {
            if (typeof supabaseUrlInput !== 'undefined' && supabaseUrlInput && typeof supabaseKeyInput !== 'undefined' && supabaseKeyInput) {
                state.cloudSettings.url = supabaseUrlInput.value.trim();
                state.cloudSettings.key = supabaseKeyInput.value.trim();

                localStorage.setItem('supabase_url', state.cloudSettings.url);
                localStorage.setItem('supabase_key', state.cloudSettings.key);
            }

            if (typeof settingsModal !== 'undefined' && settingsModal) settingsModal.classList.remove('active');
            await loadStateFromCloud();
        });
    }

    // Setup infinite scroll for recommended movies
    setupInfiniteScroll();
}


// Run Init
init();
