const TMDB_API_KEY = '4a9f3fe6b13e66b0dd355b7318b7e0e4';
const LOCAL_URL = 'http://localhost:3000/data';

// Immediate check for saved user to prevent flicker
if (localStorage.getItem('active_user')) {
    document.documentElement.classList.add('user-logged-in');
}

let isLocalServerAvailable = false;

let state = {
    currentUser: null,
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
const watchedStatsContainer = document.getElementById('watchedStats');
const watchlistStatsContainer = document.getElementById('watchlistStats');
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
const scrollTopBtn = document.getElementById('scrollTopBtn');

let movieToRate = null;

// Recommended Movies State
let recommendedState = {
    page: 1,
    isLoading: false,
    hasMore: true,
    loadedMovies: [],
    selectedGenre: null
};

let watchedListState = {
    selectedGenre: null
};

let watchlistSectionState = {
    selectedGenre: null
};

const genreChips = document.getElementById('genreChips');
const watchedGenreChips = document.getElementById('watchedGenreChips');
const watchlistGenreChips = document.getElementById('watchlistGenreChips');


// --- Initialization ---
async function init() {
    // Reset states for the new user
    recommendedState = {
        page: 1,
        isLoading: false,
        hasMore: true,
        loadedMovies: [],
        selectedGenre: null
    };
    watchedListState = { selectedGenre: null };
    watchlistSectionState = { selectedGenre: null };

    // Clear UI containers
    if (recommendedMovies) recommendedMovies.innerHTML = '';
    if (searchResults) searchResults.innerHTML = '';

    setupEventListeners();
    setupScrollTop();
    await checkLocalServer();

    // Check for saved user session
    const savedUser = localStorage.getItem('active_user');
    if (savedUser && !state.currentUser) {
        state.currentUser = savedUser;
    }

    if (!state.currentUser) {
        document.getElementById('userSelectionOverlay').style.display = 'flex';
        document.getElementById('userSelectionOverlay').style.opacity = '1';
        return;
    } else {
        document.getElementById('userSelectionOverlay').style.display = 'none';
        const nameSpan = document.getElementById('activeUserName');
        if (nameSpan) nameSpan.textContent = state.currentUser.charAt(0).toUpperCase() + state.currentUser.slice(1);
    }

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

window.selectUser = async (username) => {
    state.currentUser = username;
    localStorage.setItem('active_user', username);

    // Migrate old data for Onur if it exists and new format doesn't
    if (username === 'onur' && !localStorage.getItem('user_onur_watched_list')) {
        const oldWatched = localStorage.getItem('watched_list');
        const oldWatchlist = localStorage.getItem('watchlist_list');
        const oldIgnored = localStorage.getItem('ignored_list');
        const oldUpdated = localStorage.getItem('last_updated');

        if (oldWatched) localStorage.setItem('user_onur_watched_list', oldWatched);
        if (oldWatchlist) localStorage.setItem('user_onur_watchlist_list', oldWatchlist);
        if (oldIgnored) localStorage.setItem('user_onur_ignored_list', oldIgnored);
        if (oldUpdated) localStorage.setItem('user_onur_last_updated', oldUpdated);
    }

    document.getElementById('userSelectionOverlay').style.opacity = '1';
    document.getElementById('userSelectionOverlay').style.display = 'flex';

    setTimeout(() => {
        document.getElementById('userSelectionOverlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('userSelectionOverlay').style.display = 'none';
            init(); // Re-run init with user
        }, 300);
    }, 10);
};

window.switchUser = () => {
    state.currentUser = null;
    localStorage.removeItem('active_user');
    document.documentElement.classList.remove('user-logged-in');
    location.reload(); // Simplest way to reset everything
};


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
    if (!state.currentUser) return;
    updateSyncUI('Eşitleniyor...', 'active');

    const prefix = `user_${state.currentUser}_`;
    const localWatched = JSON.parse(localStorage.getItem(prefix + 'watched_list')) || [];
    const localWatchlist = JSON.parse(localStorage.getItem(prefix + 'watchlist_list')) || [];
    const localIgnored = JSON.parse(localStorage.getItem(prefix + 'ignored_list')) || [];
    const localTimestamp = parseInt(localStorage.getItem(prefix + 'last_updated')) || 0;

    state.watched = localWatched;
    state.watchlist = localWatchlist;
    state.ignored = localIgnored;

    console.log(`[${state.currentUser}] Yerel veriler yüklendi. Zaman damgası:`, localTimestamp);

    if (isLocalServerAvailable) {
        try {
            const response = await fetch(`${LOCAL_URL}?user=${state.currentUser}`);
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
            const userId = `user_${state.currentUser}`;
            const response = await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker?id=eq.${userId}`, {
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
    if (!state.currentUser) return;
    const prefix = `user_${state.currentUser}_`;
    const now = new Date().getTime();
    if (updateTimestamp) {
        localStorage.setItem(prefix + 'last_updated', now.toString());
    }
    localStorage.setItem(prefix + 'watched_list', JSON.stringify(state.watched));
    localStorage.setItem(prefix + 'watchlist_list', JSON.stringify(state.watchlist));
    localStorage.setItem(prefix + 'ignored_list', JSON.stringify(state.ignored));
    return now;
}

// Sadece buluta/dosyaya kaydeder
async function saveStateToCloudBase(showUI = true) {
    if (!state.currentUser) return false;
    if (showUI) updateSyncUI('Kaydediliyor...', 'active');

    const prefix = `user_${state.currentUser}_`;
    const lastUpdated = parseInt(localStorage.getItem(prefix + 'last_updated')) || new Date().getTime();

    if (isLocalServerAvailable) {
        try {
            const response = await fetch(LOCAL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: state.currentUser,
                    watched: state.watched,
                    watchlist: state.watchlist,
                    ignored: state.ignored,
                    lastUpdated: lastUpdated
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
            const userId = `user_${state.currentUser}`;
            const response = await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker`, {
                method: 'POST',
                headers: {
                    'apikey': state.cloudSettings.key,
                    'Authorization': `Bearer ${state.cloudSettings.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({
                    id: userId,
                    content: {
                        watched: state.watched,
                        watchlist: state.watchlist,
                        ignored: state.ignored,
                        lastUpdated: lastUpdated
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

        renderGenreChips(uniqueGenres, genreChips, (genreId, chip) => selectGenre(genreId, chip));
        renderGenreChips(uniqueGenres, watchedGenreChips, (genreId, chip) => selectGenreForList('watched', genreId, chip));
        renderGenreChips(uniqueGenres, watchlistGenreChips, (genreId, chip) => selectGenreForList('watchlist', genreId, chip));
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function renderGenreChips(genres, container, onSelect) {
    if (!container) return;
    container.innerHTML = '';

    // Add "All" chip
    const allChip = document.createElement('div');
    allChip.className = 'genre-chip active';
    allChip.textContent = 'Hepsi';
    allChip.onclick = () => onSelect(null, allChip);
    container.appendChild(allChip);

    genres.slice(0, 15).forEach(genre => {
        const chip = document.createElement('div');
        chip.className = 'genre-chip';
        chip.textContent = genre.name;
        chip.onclick = () => onSelect(genre.id, chip);
        container.appendChild(chip);
    });
}

function selectGenreForList(listType, genreId, chipElement) {
    const container = listType === 'watched' ? watchedGenreChips : watchlistGenreChips;
    const currentState = listType === 'watched' ? watchedListState : watchlistSectionState;

    if (currentState.selectedGenre === genreId) return;

    // Update UI in that specific container
    container.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
    chipElement.classList.add('active');

    // Update state
    currentState.selectedGenre = genreId;

    // Re-render the specific list
    renderLists();
}

function selectGenre(genreId, chipElement) {
    if (recommendedState.selectedGenre === genreId) return;

    // Update UI - only for chips in the recommended section
    genreChips.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
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
        let genreId = recommendedState.selectedGenre;

        // If no genre selected, pick one from user's favorites randomly for variety
        if (!genreId && state.watched.length > 0) {
            const genreCounts = {};
            state.watched.forEach(m => {
                const ids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
                ids.forEach(id => {
                    genreCounts[id] = (genreCounts[id] || 0) + 1;
                });
            });

            const topGenres = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3) // Narrower pool for better personalization
                .map(e => e[0]);

            // Higher probability of personalization (85%)
            if (topGenres.length > 0 && Math.random() > 0.15) {
                genreId = topGenres[Math.floor(Math.random() * topGenres.length)];
                console.log(`[${state.currentUser}] Personalizing recommendations based on genre ID:`, genreId);
            }
        }

        const genreParam = genreId ? `&with_genres=${genreId}` : '';

        // Randomize sort for more variety
        const sortOptions = ['popularity.desc', 'vote_count.desc', 'vote_average.desc', 'revenue.desc'];
        const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

        // Stay on page 1 for personalized content to ensure quality, otherwise random
        const pageToRequest = recommendedState.page === 1 ? (genreId ? 1 : Math.floor(Math.random() * 5) + 1) : recommendedState.page;

        const baseURL = `https://api.themoviedb.org/3/discover`;
        const commonParams = `api_key=${TMDB_API_KEY}&language=en-US&page=${pageToRequest}&sort_by=${randomSort}${genreParam}`;

        const [moviesRes, tvRes] = await Promise.all([
            fetch(`${baseURL}/movie?${commonParams}`),
            fetch(`${baseURL}/tv?${commonParams}`)
        ]);

        const dataArr = await Promise.all([
            moviesRes.json(), tvRes.json()
        ]);

        dataArr[0].results.forEach(m => m.media_type = 'movie');
        dataArr[1].results.forEach(m => m.media_type = 'tv');

        let allItems = [...dataArr[0].results, ...dataArr[1].results];

        // Shuffle allItems for better randomness
        allItems = allItems.sort(() => Math.random() - 0.5);

        const uniqueItems = Array.from(new Map(allItems.map(m => [m.id, m])).values());

        const filteredItems = uniqueItems.filter(item => {
            const isInWatched = state.watched.some(m => m.id === item.id);
            const isInWatchlist = state.watchlist.some(m => m.id === item.id);
            const isIgnored = state.ignored.some(m => m.id === item.id);
            const isAlreadyLoaded = recommendedState.loadedMovies.some(m => m.id === item.id);
            const hasValidPoster = item.poster_path;
            const isHighRated = item.vote_average >= 6.0;

            const releaseDate = item.release_date || item.first_air_date;
            const isNotTooOld = releaseDate && new Date(releaseDate).getFullYear() >= 2000;

            return !isInWatched && !isInWatchlist && !isIgnored && !isAlreadyLoaded && hasValidPoster && isHighRated && isNotTooOld;
        });

        const itemsToShow = filteredItems.slice(0, 12);

        if (itemsToShow.length === 0) {
            if (recommendedState.page < 20) {
                recommendedState.page++;
                recommendedState.isLoading = false;
                return loadRecommendedMovies();
            }
            recommendedState.hasMore = false;
            loadingIndicator.classList.remove('active');
            return;
        }

        recommendedState.loadedMovies.push(...itemsToShow);

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

    // Calculate duration for constant speed
    // Higher value = slower. Basic formula: items * seconds_per_item
    const secondsPerItem = 4;
    const totalDuration = items.length * secondsPerItem;
    carouselTrack.style.setProperty('--duration', `${totalDuration}s`);

    // Populate and clone exactly once for the -50% translate loop
    items.forEach(item => carouselTrack.appendChild(createItem(item)));
    items.forEach(item => carouselTrack.appendChild(createItem(item)));
}

// --- Rendering Functions ---
function renderSearchResults(movies) {
    searchResults.innerHTML = '';

    // Filter out items without posters or those that aren't movie/tv
    const filtered = movies.filter(m => (m.media_type === 'movie' || m.media_type === 'tv') && m.poster_path);

    // Sort by popularity descending
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

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

// --- Sorting State ---
let sortState = {
    watched: 'abc', // 'abc', 'year', 'rating'
    watchlist: 'abc'
};

function renderLists() {
    // Render Watched List
    const watchedFiltered = filterList(state.watched, watchedSearch.value, watchedListState.selectedGenre, sortState.watched);
    watchedList.innerHTML = '';
    watchedFiltered.forEach(movie => watchedList.appendChild(createMovieCard(movie, 'watched')));
    if (watchedFiltered.length === 0) {
        watchedList.innerHTML = '<div class="empty-state">Burada henüz bir şey yok.</div>';
    }

    // Render Watchlist
    const watchlistFiltered = filterList(state.watchlist, watchlistSearch.value, watchlistSectionState.selectedGenre, sortState.watchlist);
    watchlistContainer.innerHTML = '';
    watchlistFiltered.forEach(movie => watchlistContainer.appendChild(createMovieCard(movie, 'watchlist')));
    if (watchlistFiltered.length === 0) {
        watchlistContainer.innerHTML = '<div class="empty-state">İzlenecekler listesi boş.</div>';
    }

    renderStats();
}

async function renderStats() {
    if (!watchedStatsContainer || !watchlistStatsContainer) return;

    // Watched Stats
    const watchedMovies = state.watched.filter(m => m.media_type === 'movie');
    const watchedTV = state.watched.filter(m => m.media_type === 'tv');

    let totalMinutes = 0;
    let totalEpisodes = 0;

    watchedMovies.forEach(m => {
        totalMinutes += m.runtime || 100; // heuristic if missing
    });

    watchedTV.forEach(m => {
        const eps = m.number_of_episodes || (m.number_of_seasons ? m.number_of_seasons * 10 : 10);
        const avgRuntime = (m.episode_run_time && m.episode_run_time[0]) || 45;
        totalEpisodes += eps;
        totalMinutes += eps * avgRuntime;
    });

    const hours = Math.floor(totalMinutes / 60);
    const days = (hours / 24).toFixed(1);

    // Calculate average rating for Watched
    const ratedWatched = state.watched.filter(m => m.vote_average > 0);
    const watchedAvgRating = ratedWatched.length > 0
        ? (ratedWatched.reduce((acc, m) => acc + m.vote_average, 0) / ratedWatched.length).toFixed(1)
        : '0.0';

    watchedStatsContainer.innerHTML = `
        <div class="stat-card accent">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-content">
                <span class="stat-value">${hours} <small style="font-size: 0.7rem; color: var(--text-muted)">saat</small></span>
                <span class="stat-label">Toplam Süre (${days} gün)</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-film"></i></div>
            <div class="stat-content">
                <span class="stat-value">${watchedMovies.length}</span>
                <span class="stat-label">Film</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-tv"></i></div>
            <div class="stat-content">
                <span class="stat-value">${watchedTV.length} <small style="font-size: 0.7rem; color: var(--text-muted)">dizi</small></span>
                <span class="stat-label">${totalEpisodes} Toplam Bölüm</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-star" style="color: #f59e0b"></i></div>
            <div class="stat-content">
                <span class="stat-value">${watchedAvgRating}</span>
                <span class="stat-label">Ort. Puan</span>
            </div>
        </div>
    `;

    // Watchlist Stats
    const wlMovies = state.watchlist.filter(m => m.media_type === 'movie');
    const wlTV = state.watchlist.filter(m => m.media_type === 'tv');

    let wlMinutes = 0;
    wlMovies.forEach(m => wlMinutes += m.runtime || 100);
    wlTV.forEach(m => {
        const eps = m.number_of_episodes || (m.number_of_seasons ? m.number_of_seasons * 10 : 10);
        const avgRuntime = (m.episode_run_time && m.episode_run_time[0]) || 45;
        wlMinutes += eps * avgRuntime;
    });

    const wlHours = Math.floor(wlMinutes / 60);

    // Calculate average rating for Watchlist
    const ratedWatchlist = state.watchlist.filter(m => m.vote_average > 0);
    const watchlistAvgRating = ratedWatchlist.length > 0
        ? (ratedWatchlist.reduce((acc, m) => acc + m.vote_average, 0) / ratedWatchlist.length).toFixed(1)
        : '0.0';

    watchlistStatsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-hourglass-half"></i></div>
            <div class="stat-content">
                <span class="stat-value">${wlHours} <small style="font-size: 0.7rem; color: var(--text-muted)">saat</small></span>
                <span class="stat-label">Kalan Süre</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-film"></i></div>
            <div class="stat-content">
                <span class="stat-value">${wlMovies.length}</span>
                <span class="stat-label">Kalan Film</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-tv"></i></div>
            <div class="stat-content">
                <span class="stat-value">${wlTV.length}</span>
                <span class="stat-label">Kalan Dizi</span>
            </div>
        </div>
         <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-star" style="color: #f59e0b"></i></div>
            <div class="stat-content">
                <span class="stat-value">${watchlistAvgRating}</span>
                <span class="stat-label">Ort. Puan</span>
            </div>
        </div>
    `;

    // Background detail fetcher (quietly)
    fetchMissingDetails();
}

async function fetchItemDetails(id, mediaType) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        return await response.json();
    } catch (e) {
        console.error('Error fetching details:', e);
        return null;
    }
}

let isFetchingDetails = false;
async function fetchMissingDetails() {
    if (isFetchingDetails) return;
    isFetchingDetails = true;

    const allItems = [...state.watched, ...state.watchlist];
    const missing = allItems.filter(m => {
        if (m.media_type === 'movie') return !m.runtime;
        if (m.media_type === 'tv') return !m.number_of_episodes;
        return false;
    });

    if (missing.length === 0) {
        isFetchingDetails = false;
        return;
    }

    // Fetch one by one to avoid rate limits and UI lag
    for (const item of missing) {
        const details = await fetchItemDetails(item.id, item.media_type);
        if (details) {
            // Update item in state
            const targetList = state.watched.find(m => m.id === item.id) ? state.watched : state.watchlist;
            const idx = targetList.findIndex(m => m.id === item.id);
            if (idx !== -1) {
                targetList[idx] = { ...targetList[idx], ...details };
                // We don't saveState() every time to avoid too many writes
            }
        }
        // Small delay
        await new Promise(r => setTimeout(r, 200));
    }

    isFetchingDetails = false;
    // We removed saveState() and renderStats() from here to prevent infinite loop of syncing
    // The details will be saved to local/cloud on next manual action (add/remove)
    console.log('Background details fetch completed.');
}

function filterList(list, searchQuery, genreId, sortType = 'abc') {
    const filtered = list.filter(m => {
        const title = (m.title || m.name || '').toLowerCase();
        const searchMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
        const genreMatch = !genreId || (m.genre_ids && m.genre_ids.includes(genreId));
        return searchMatch && genreMatch;
    });

    return filtered.sort((a, b) => {
        if (sortType === 'abc') {
            const titleA = (a.title || a.name || '').toLowerCase();
            const titleB = (b.title || b.name || '').toLowerCase();
            return titleA.localeCompare(titleB, 'tr');
        } else if (sortType === 'year') {
            const yearA = parseInt((a.release_date || a.first_air_date || '0').split('-')[0]);
            const yearB = parseInt((b.release_date || b.first_air_date || '0').split('-')[0]);
            return yearB - yearA; // Newest first
        } else if (sortType === 'rating') {
            const rateA = a.vote_average || 0;
            const rateB = b.vote_average || 0;
            return rateB - rateA; // Highest first
        }
        return 0;
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


window.addToWatchlist = async (movie) => {
    if (state.watchlist.find(m => m.id === movie.id)) {
        alert('Bu zaten izlenecekler listenizde!');
        return;
    }
    const details = await fetchItemDetails(movie.id, movie.media_type || 'movie');
    const movieWithDetails = { ...movie, ...details };
    state.watchlist.push(movieWithDetails);
    saveState();
    renderLists();
    removeCardFromSearch(movie.id);
    removeCardFromRecommended(movie.id);
};

window.addToWatched = async (movie) => {
    if (state.watched.find(m => m.id === movie.id)) {
        alert('Bu zaten izlediğiniz filmler listenizde!');
        return;
    }
    // Remove from watchlist if exists
    state.watchlist = state.watchlist.filter(m => m.id !== movie.id);

    const details = await fetchItemDetails(movie.id, movie.media_type || 'movie');
    const movieWithDetails = { ...movie, ...details };

    state.watched.push(movieWithDetails);
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
            window.scrollTo(0, 0);
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

    // Sort Buttons
    document.querySelectorAll('.sort-controls .sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const listType = btn.parentElement.getAttribute('data-list');
            const sortType = btn.getAttribute('data-sort');

            // Update UI
            btn.parentElement.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update State
            sortState[listType] = sortType;
            renderLists();
        });
    });

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
function setupScrollTop() {
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
