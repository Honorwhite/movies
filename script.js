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
        url: 'https://gbdqycgclxhblhhjhpbm.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHF5Y2djbHhoYmxoaGpocGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Njk2MjMsImV4cCI6MjA4MzA0NTYyM30.85TIwLzahIY30zRlY_y2afw_eziDaYLhXWCCh1HZu5I'
    },
    ignored: [],
    users: [] // Stores {username, password, avatar}
};

// Default users with hidden credentials for the user to see in response
const DEFAULT_USERS = [
    { username: 'onur', password: 'onur123', avatar: 'fas fa-user-ninja' },
    { username: 'cemrik', password: 'cemrik123', avatar: 'fas fa-user-astronaut' }
];

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

let heroState = {
    trendingItems: [],
    currentIndex: 0,
    interval: null
};

const genreChips = document.getElementById('genreChips');
const watchedGenreChips = document.getElementById('watchedGenreChips');
const watchlistGenreChips = document.getElementById('watchlistGenreChips');


// --- Initialization ---
async function init() {
    try {
        // 1. Fetch all users from cloud first
        await fetchUsersFromCloud();
    } catch (e) {
        console.error('Initial user fetch failed, continuing with local storage:', e);
    }

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
    if (savedUser) {
        state.currentUser = savedUser;
        document.documentElement.classList.add('user-logged-in');
        document.getElementById('userSelectionOverlay').style.display = 'none';
        const nameSpan = document.getElementById('activeUserName');
        if (nameSpan) nameSpan.textContent = state.currentUser.charAt(0).toUpperCase() + state.currentUser.slice(1);

        updateHeroSection();
        await loadStateFromCloud();
        renderLists();
        initGenres();
        loadRecommendedMovies();
    } else {
        setTimeout(showLogin, 100); // Tiny delay to ensure DOM is ready
    }

    // Register PWA Service Worker (Optional: remove if it causes fetch errors)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW Registered'))
                .catch(err => console.log('SW Error', err));
        });
    }
}

async function fetchUsersFromCloud() {
    const rawLocal = localStorage.getItem('ct_users');
    let localUsers = [];
    try { localUsers = JSON.parse(rawLocal) || []; } catch (e) { }

    let mergedUsers = [...localUsers];

    DEFAULT_USERS.forEach(def => {
        const idx = mergedUsers.findIndex(u => u.username === def.username);
        if (idx === -1) mergedUsers.push(def);
        else mergedUsers[idx] = { ...mergedUsers[idx], ...def };
    });

    if (!state.cloudSettings.url || !state.cloudSettings.key) {
        state.users = mergedUsers;
        localStorage.setItem('ct_users', JSON.stringify(state.users));
        return;
    }

    try {
        // Use existing movie_tracker table with a special ID for all users
        const response = await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker?id=eq.system_users`, {
            headers: {
                'apikey': state.cloudSettings.key,
                'Authorization': `Bearer ${state.cloudSettings.key}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                const cloudUsers = data[0].content.users || [];

                cloudUsers.forEach(cu => {
                    const idx = mergedUsers.findIndex(u => u.username === cu.username);
                    if (idx === -1) {
                        mergedUsers.push(cu);
                    } else {
                        const isDefault = DEFAULT_USERS.some(d => d.username === cu.username);
                        if (!isDefault) mergedUsers[idx] = { ...mergedUsers[idx], ...cu };
                    }
                });
            } else {
                // First time setup: Push local/default users to cloud
                await saveAllUsersToCloud(mergedUsers);
            }
            state.users = mergedUsers;
            localStorage.setItem('ct_users', JSON.stringify(state.users));
        }
    } catch (e) {
        console.error('Kullanıcı senkronizasyon hatası:', e);
        state.users = mergedUsers;
    }
}

async function saveAllUsersToCloud(usersList) {
    if (!state.cloudSettings.url || !state.cloudSettings.key) return;
    try {
        await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker`, {
            method: 'POST',
            headers: {
                'apikey': state.cloudSettings.key,
                'Authorization': `Bearer ${state.cloudSettings.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                id: 'system_users',
                content: { users: usersList, lastUpdated: new Date().getTime() }
            })
        });
    } catch (e) {
        console.error('Kullanıcı listesi buluta kaydedilemedi:', e);
    }
}

window.showLogin = () => {
    const overlay = document.getElementById('userSelectionOverlay');
    overlay.innerHTML = `
        <div class="user-selection-content glass">
            <h2>Giriş Yap</h2>
            <div class="auth-form">
                <div class="input-group">
                    <input type="text" id="loginUsername" placeholder="Kullanıcı Adı" autocomplete="username">
                </div>
                <div class="input-group">
                    <input type="password" id="loginPassword" placeholder="Şifre" autocomplete="current-password">
                </div>
                <div id="authError" style="color: var(--accent-bad); font-size: 0.8rem; display: none; margin-top: -0.5rem; margin-bottom: 0.5rem;"></div>
                <div class="auth-actions">
                    <button class="primary-btn" id="loginBtn" onclick="handleLogin()">Giriş</button>
                    <button class="secondary-btn" onclick="showRegister()">Hesap Oluştur</button>
                </div>
            </div>
        </div>
    `;
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';

    // Enter key support
    const inputs = overlay.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    });
};

window.showRegister = () => {
    const overlay = document.getElementById('userSelectionOverlay');
    overlay.innerHTML = `
        <div class="user-selection-content glass">
            <h2>Hesap Oluştur</h2>
            <div class="auth-form">
                <div class="input-group">
                    <input type="text" id="regUsername" placeholder="Kullanıcı Adı">
                </div>
                <div class="input-group">
                    <input type="password" id="regPassword" placeholder="Şifre">
                </div>
                <div id="authError" style="color: var(--accent-bad); font-size: 0.8rem; display: none; margin-top: -0.5rem; margin-bottom: 0.5rem;"></div>
                <div class="auth-actions">
                    <button class="primary-btn" id="regBtn" onclick="handleRegister()">Kayıt Ol</button>
                    <button class="secondary-btn" onclick="showLogin()">Giriş'e Dön</button>
                </div>
            </div>
        </div>
    `;

    // Enter key support
    const inputs = overlay.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleRegister();
        });
    });
};

window.quickLogin = (username, password) => {
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = password;
    handleLogin();
};

window.handleLogin = async () => {
    const userField = document.getElementById('loginUsername');
    const passField = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('authError');

    const username = userField.value.toLowerCase().trim();
    const password = passField.value;

    if (!username || !password) return;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Giriş Yapılıyor...';
    errorDiv.style.display = 'none';

    // Re-verify users
    await fetchUsersFromCloud();

    // Failsafe: check both state.users (cloud/local) AND DEFAULT_USERS directly
    const found = state.users.find(u => u.username === username && u.password === password) ||
        DEFAULT_USERS.find(u => u.username === username && u.password === password);

    console.log('Login denemesi:', username, 'Bulundu mu:', !!found);

    if (found) {
        state.currentUser = username;
        localStorage.setItem('active_user', username);
        document.documentElement.classList.add('user-logged-in');

        const overlay = document.getElementById('userSelectionOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            init();
        }, 300);
    } else {
        errorDiv.innerHTML = `Hatalı kullanıcı adı veya şifre!<br><span style="font-size:0.7rem; opacity:0.7; cursor:pointer;" onclick="location.reload(true)">Sorun mu var? Sayfayı Zorla Yenile</span>`;
        errorDiv.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Giriş';
    }
};

window.handleRegister = async () => {
    const userField = document.getElementById('regUsername');
    const passField = document.getElementById('regPassword');
    const regBtn = document.getElementById('regBtn');
    const errorDiv = document.getElementById('authError');

    const user = userField.value.trim().toLowerCase();
    const pass = passField.value.trim();

    if (user.length < 3 || pass.length < 3) {
        errorDiv.textContent = 'En az 3 karakter olmalıdır.';
        errorDiv.style.display = 'block';
        return;
    }

    regBtn.disabled = true;
    regBtn.textContent = 'Kayıt Yapılıyor...';
    errorDiv.style.display = 'none';

    await fetchUsersFromCloud();

    if (state.users.find(u => u.username === user)) {
        errorDiv.textContent = 'Bu kullanıcı adı zaten alınmış.';
        errorDiv.style.display = 'block';
        regBtn.disabled = false;
        regBtn.textContent = 'Kayıt Ol';
        return;
    }

    const newUser = { username: user, password: pass, avatar: 'fas fa-user-circle' };
    state.users.push(newUser);
    await saveAllUsersToCloud(state.users);
    localStorage.setItem('ct_users', JSON.stringify(state.users));

    alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    showLogin();
};

window.openProfile = () => {
    // With full-page navigation, this function now primarily ensures the name is updated.
    // The actual view change is handled by setupEventListeners.
    if (!state.currentUser) return;
    const nameSpan = document.getElementById('profileDisplayName');
    if (nameSpan) {
        nameSpan.textContent = state.currentUser.charAt(0).toUpperCase() + state.currentUser.slice(1);
    }
};


window.changePassword = async () => {
    const newPass = document.getElementById('newPassword').value.trim();
    const msgDiv = document.getElementById('profileMsg');

    if (newPass.length < 3) {
        msgDiv.textContent = 'Şifre en az 3 karakter olmalıdır.';
        msgDiv.style.color = 'var(--accent-bad)';
        msgDiv.style.display = 'block';
        return;
    }

    const userIdx = state.users.findIndex(u => u.username === state.currentUser);
    if (userIdx !== -1) {
        state.users[userIdx].password = newPass;
        localStorage.setItem('ct_users', JSON.stringify(state.users));
        await saveAllUsersToCloud(state.users);

        msgDiv.textContent = 'Şifre başarıyla güncellendi!';
        msgDiv.style.color = 'var(--accent-good)';
        msgDiv.style.display = 'block';
        document.getElementById('newPassword').value = '';
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
    }
};

window.logout = () => {
    localStorage.removeItem('active_user');
    location.reload();
};

window.switchUser = () => logout();

async function checkLocalServer() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        const response = await fetch(LOCAL_URL, {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        isLocalServerAvailable = response.ok;
    } catch (e) {
        isLocalServerAvailable = false;
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
    const heroSection = document.getElementById('heroSection');
    if (!query) {
        if (heroSection) heroSection.classList.remove('search-mode');
        if (searchResults) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
        }
        updateFeaturedCarousel();
        return;
    }

    if (heroSection) heroSection.classList.add('search-mode');
    if (searchResults) searchResults.classList.add('active');

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
        const data = await response.json();
        renderSearchResults(data.results);
    } catch (error) {
        console.error('Search error:', error);
        alert('Arama sırasında bir hata oluştu.');
    }
}

// Global filter for "Making of", "Behind the Scenes", etc.
function isSafeTitle(item) {
    const title = (item.title || item.name || '').toLowerCase();
    const blacklist = [
        'making of',
        'behind the scenes',
        'special features',
        'bonus features',
        'extras',
        'the vision of',
        'evolution of',
        'creating the',
        'legacy of',
        'deleted scenes',
        'visual effects',
        'the music of',
        'the art of',
        'interview with',
        'conversation with',
        'a look at',
        'on the set',
        'production diary',
        'a day in the life',
        'set tour',
        'backstage',
        'featurette',
        'inside the',
        'filming of',
        'recording of',
        'the making',
        'b-roll',
        'production gallery',
        'anatomy of',
        'journey to',
        'first look',
        'preview',
        'sneak peek',
        'teaser',
        'trailer',
        'the world of',
        'behind the mix',
        'unveiling'
    ];
    return !blacklist.some(word => title.includes(word));
}

// --- Recommended Movies & Categories ---
async function initGenres() {
    try {
        const [movieGenres, tvGenres] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
            fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`)
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

    // Toggle logic: If clicking the same genre again, reset to null
    const finalGenreId = currentState.selectedGenre === genreId ? null : genreId;

    // Update UI in that specific container
    container.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));

    // Find the correct chip to activate (either the clicked one or the "All" chip)
    if (finalGenreId === null) {
        container.querySelector('.genre-chip:first-child').classList.add('active');
    } else {
        chipElement.classList.add('active');
    }

    // Update state
    currentState.selectedGenre = finalGenreId;

    // Re-render the specific list
    renderLists();
}

function selectGenre(genreId, chipElement) {
    // Toggle logic: If clicking the same genre again, reset to null
    const finalGenreId = recommendedState.selectedGenre === genreId ? null : genreId;

    // Update UI - only for chips in the recommended section
    genreChips.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));

    if (finalGenreId === null) {
        genreChips.querySelector('.genre-chip:first-child').classList.add('active');
    } else {
        chipElement.classList.add('active');
    }

    // Update state and reload
    recommendedState.selectedGenre = finalGenreId;
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
        let allItems = [];
        let genreId = recommendedState.selectedGenre;

        // --- PERSONALIZATION LOGIC ---
        if (!genreId && state.watched.length > 0 && recommendedState.page === 1) {
            // 1. Get recommendations based on recently watched items (Top 3 recent)
            const recentItems = state.watched.slice(-3).reverse();
            const recPromises = recentItems.map(item =>
                fetch(`https://api.themoviedb.org/3/${item.media_type || 'movie'}/${item.id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
                    .then(res => res.json())
                    .catch(() => ({ results: [] }))
            );

            const recResults = await Promise.all(recPromises);
            recResults.forEach((resp, idx) => {
                if (resp.results) {
                    resp.results.forEach(m => {
                        m.media_type = recentItems[idx].media_type || 'movie';
                        m._rec_score = 10; // High priority for direct recommendations
                    });
                    allItems.push(...resp.results);
                }
            });
        }

        // 2. Fallback or Supplementary Discovery based on top genres
        if (allItems.length < 20 || genreId) {
            const genreCounts = {};
            state.watched.forEach(m => {
                const ids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
                ids.forEach(id => genreCounts[id] = (genreCounts[id] || 0) + 1);
            });

            const topGenres = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(e => e[0]);

            let discoverGenre = genreId;
            if (!discoverGenre && topGenres.length > 0) {
                // Pick a random one from top 3 for the search, or use comma-separated for 'OR'
                discoverGenre = topGenres.join(',');
            }

            const pageToRequest = recommendedState.page;
            const sortMethod = 'popularity.desc';
            const genreParam = discoverGenre ? `&with_genres=${discoverGenre}` : '';

            const [moviesRes, tvRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${pageToRequest}&sort_by=${sortMethod}${genreParam}&vote_count.gte=100`),
                fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&page=${pageToRequest}&sort_by=${sortMethod}${genreParam}&vote_count.gte=50`)
            ]);

            const [mData, tData] = await Promise.all([moviesRes.json(), tvRes.json()]);

            if (mData.results) mData.results.forEach(m => { m.media_type = 'movie'; m._rec_score = 5; });
            if (tData.results) tData.results.forEach(m => { m.media_type = 'tv'; m._rec_score = 5; });

            if (mData.results) allItems.push(...mData.results);
            if (tData.results) allItems.push(...tData.results);
        }

        // --- FILTERING & RANKING ---
        // 1. Unique items by ID
        const uniqueMap = new Map();
        allItems.forEach(item => {
            if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
            else {
                // If already exists, maybe boost score?
                const existing = uniqueMap.get(item.id);
                existing._rec_score = (existing._rec_score || 0) + 2;
            }
        });

        const sortedItems = Array.from(uniqueMap.values()).sort((a, b) => {
            // Sort by recommendation score + weighted popularity/rating
            const scoreA = (a._rec_score || 0) + (a.vote_average || 0) / 2;
            const scoreB = (b._rec_score || 0) + (b.vote_average || 0) / 2;
            return scoreB - scoreA;
        });

        const filteredItems = sortedItems.filter(item => {
            const isInWatched = state.watched.some(m => m.id === item.id);
            const isInWatchlist = state.watchlist.some(m => m.id === item.id);
            const isIgnored = state.ignored.some(m => m.id === item.id);
            const isAlreadyLoaded = recommendedState.loadedMovies.some(m => m.id === item.id);
            const hasValidPoster = item.poster_path;

            // Release date check (stay away from very old stuff unless highly rated)
            const releaseDate = item.release_date || item.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : 0;
            const isQuality = item.vote_average >= 5.5 && item.vote_count > 10;
            const isSafe = isSafeTitle(item);

            return !isInWatched && !isInWatchlist && !isIgnored && !isAlreadyLoaded && hasValidPoster && isQuality && isSafe && (year >= 1990 || item.vote_average >= 8);
        });

        const itemsToShow = filteredItems.slice(0, 12);

        if (itemsToShow.length === 0) {
            if (recommendedState.page < 50) {
                recommendedState.page++;
                recommendedState.isLoading = false;
                return setTimeout(loadRecommendedMovies, 100);
            }
            recommendedState.hasMore = false;
            loadingIndicator.innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem; margin-top: 2rem;">Tüm önerileri gördünüz ✨</p>';
            loadingIndicator.classList.add('active');
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
        setTimeout(() => {
            const rect = loadingIndicator.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && !recommendedState.isLoading && recommendedState.hasMore) {
                const searchView = document.getElementById('searchView');
                if (searchView && searchView.classList.contains('active')) {
                    loadRecommendedMovies();
                }
            }
        }, 300);
        loadingIndicator.classList.remove('active');
    }
}

function setupInfiniteScroll() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px 1200px 0px',
        threshold: 0
    };

    const triggerLoading = () => {
        if (!recommendedState.isLoading && recommendedState.hasMore) {
            const searchView = document.getElementById('searchView');
            if (searchView && searchView.classList.contains('active')) {
                loadRecommendedMovies();
            }
        }
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            triggerLoading();
        }
    }, observerOptions);

    if (loadingIndicator) observer.observe(loadingIndicator);

    // Efficient throttled scroll listener
    let scrollThrottled = false;
    window.addEventListener('scroll', () => {
        if (!scrollThrottled) {
            window.requestAnimationFrame(() => {
                const scrollPos = window.innerHeight + window.scrollY;
                const threshold = document.documentElement.scrollHeight - 1500;
                if (scrollPos > threshold) {
                    triggerLoading();
                }
                scrollThrottled = false;
            });
            scrollThrottled = true;
        }
    }, { passive: true });
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
        div.onclick = () => openPlayer(item.id, item.media_type || 'movie');
        div.innerHTML = `<img src="https://image.tmdb.org/t/p/w342${item.poster_path}" alt="${title}">`;
        return div;
    };

    // Calculate duration for constant speed
    // Higher value = slower. Basic formula: items * seconds_per_item
    const secondsPerItem = 4;
    const totalDuration = items.length * secondsPerItem;
    carouselTrack.style.setProperty('--duration', `${totalDuration}s`);

    items.forEach(item => carouselTrack.appendChild(createItem(item)));
    items.forEach(item => carouselTrack.appendChild(createItem(item)));
}

async function updateHeroSection() {
    const heroBackdrop = document.getElementById('heroBackdrop');
    const heroMovieInfo = document.getElementById('heroMovieInfo');

    if (!heroBackdrop || !heroMovieInfo) return;

    const renderMovie = (movie, immediate = false) => {
        heroMovieInfo.classList.remove('active');

        const setup = () => {
            const title = movie.title || movie.name || movie.original_title || movie.original_name;
            const releaseDate = movie.release_date || movie.first_air_date || '';
            const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
            const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;

            heroBackdrop.style.opacity = '0';

            const injectContent = () => {
                heroMovieInfo.innerHTML = `
                    <div class="hero-actions">
                        <button class="hero-primary-btn" onclick="openPlayer(${movie.id}, '${movie.media_type || 'movie'}')" title="${title}">
                            <i class="fas fa-play"></i> <span>${title}</span>
                        </button>
                        <button class="hero-btn watchlist-btn" onclick="addToWatchlist(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                            <i class="fas fa-plus"></i> <span class="btn-text">Listeye Ekle</span>
                        </button>
                        <button class="hero-btn watched-btn" onclick="addToWatched(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                            <i class="fas fa-check"></i> <span class="btn-text">İzledim</span>
                        </button>
                    </div>
                    <div class="hero-movie-meta">
                        <span><i class="far fa-calendar"></i> ${year}</span>
                        <span><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}</span>
                        <span><i class="fas fa-magic"></i> Sana Özel Seçim</span>
                    </div>
                `;
                setTimeout(() => heroMovieInfo.classList.add('active'), 50);
            };

            const img = new Image();
            img.src = backdropUrl;
            img.onload = () => {
                heroBackdrop.style.backgroundImage = `url(${backdropUrl})`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        heroBackdrop.style.opacity = '0.6';
                        injectContent();
                    });
                });
            };
            if (img.complete) img.onload();
        };

        if (immediate) {
            setup();
        } else {
            setTimeout(setup, 800);
        }
    };

    try {
        // If we don't have items yet or need to refresh
        let pool = [];
        let topGenreIds = [];
        if (state.watched.length > 0) {
            const genreCounts = {};
            state.watched.forEach(m => {
                const ids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
                ids.forEach(id => genreCounts[id] = (genreCounts[id] || 0) + 1);
            });
            topGenreIds = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(e => parseInt(e[0]));
        }

        // Randomly decide to fetch trending or specific genres
        const useTrending = topGenreIds.length === 0 || Math.random() > 0.7;

        if (useTrending) {
            const randomPage = Math.floor(Math.random() * 3) + 1;
            const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US&page=${randomPage}`);
            const data = await trendRes.json();
            pool = data.results.filter(item => item.backdrop_path && isSafeTitle(item));
        } else {
            const randomPage = Math.floor(Math.random() * 5) + 1;
            const genreStr = topGenreIds.join(',');
            const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreStr}&page=${randomPage}&language=en-US`);
            const data = await res.json();
            pool = data.results.filter(item => item.backdrop_path && isSafeTitle(item));
        }

        if (pool.length === 0) return;

        // Pick one random item from the pool and render
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        renderMovie(randomItem, true);
    } catch (error) {
        console.error('Error updating hero section:', error);
    }
}

// --- Rendering Functions ---
function renderSearchResults(movies) {
    searchResults.innerHTML = '';

    // Filter out items without posters or those that aren't movie/tv, and non-making-of content
    const filtered = movies.filter(m => (m.media_type === 'movie' || m.media_type === 'tv') && m.poster_path && isSafeTitle(m));

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
    const isWatched = state.watched.find(m => m.id === movie.id);
    const isWatchlist = state.watchlist.find(m => m.id === movie.id);
    const isTV = movie.media_type === 'tv';

    const card = document.createElement('div');
    card.className = `movie-card ${isTV ? 'is-tv' : 'is-movie'} ${(isWatched || isWatchlist) && context === 'search' ? 'in-list' : ''}`;
    card.setAttribute('data-id', movie.id);
    card.setAttribute('data-context', context);

    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date || '';
    const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : `https://placehold.co/500x750/0f172a/FFF?text=${encodeURIComponent(title)}`;

    const removeBtnHtml = (context === 'watched' || context === 'watchlist') ? `
        <button class="action-btn remove-btn" onclick="event.stopPropagation(); ${context === 'watched' ? `removeFromWatched(${movie.id})` : `removeFromWatchlist(${movie.id})`}" title="Listeden Kaldır">
            <i class="fas fa-times"></i>
        </button>
    ` : '';

    const typeIcon = isTV ? '<i class="fas fa-layer-group"></i>' : '<i class="fas fa-film"></i>';

    card.innerHTML = `
        ${isTV ? '<div class="poster-stack poster-stack-1"></div><div class="poster-stack poster-stack-2"></div>' : ''}
        <div class="poster-container" onclick="openPlayer(${movie.id}, '${movie.media_type || 'movie'}')" style="cursor: pointer;">
            ${removeBtnHtml}
            <div class="media-type-badge" title="${isTV ? 'Dizi' : 'Film'}">${typeIcon}</div>
            <img src="${posterUrl}" alt="${title}" loading="lazy">
            <div class="card-overlay">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        </div>
        <div class="movie-info">
            <h3 onclick="openPlayer(${movie.id}, '${movie.media_type || 'movie'}')" style="cursor: pointer;">${title}</h3>
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
                    <i class="fas fa-plus"></i> <span class="btn-text">${isWatchlist ? 'Listede' : 'İzlenecek'}</span>
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
    let wlTotalEpisodes = 0;
    wlMovies.forEach(m => wlMinutes += m.runtime || 100);
    wlTV.forEach(m => {
        const eps = m.number_of_episodes || (m.number_of_seasons ? m.number_of_seasons * 10 : 10);
        const avgRuntime = (m.episode_run_time && m.episode_run_time[0]) || 45;
        wlTotalEpisodes += eps;
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
                <span class="stat-value">${wlTV.length} <small style="font-size: 0.7rem; color: var(--text-muted)">dizi</small></span>
                <span class="stat-label">${wlTotalEpisodes} Kalan Bölüm</span>
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

// --- Player Functions ---
let currentPlayerSource = 'vidsrc';

window.switchPlayerSource = (source, id, mediaType, season, episode) => {
    currentPlayerSource = source;

    // Update active class in UI
    document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.source-btn')).find(btn =>
        (source === 'vidsrc' && btn.textContent === 'Kaynak 1') ||
        (source === 'videasy' && btn.textContent === 'Kaynak 2')
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Reload player with new source
    const iframe = document.getElementById('moviePlayer');
    const embedUrl = source === 'tv' || mediaType === 'tv'
        ? (source === 'videasy' ? `https://player.videasy.net/tv/${id}/${season}/${episode}` : `https://vidsrc-embed.ru/embed/tv/${id}/${season}/${episode}`)
        : (source === 'videasy' ? `https://player.videasy.net/movie/${id}` : `https://vidsrc-embed.ru/embed/movie/${id}`);

    if (iframe.src !== embedUrl) {
        iframe.src = embedUrl;
    }
};

window.openPlayer = async (id, mediaType = 'movie', season = 1, episode = 1) => {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('moviePlayer');
    const playerInfo = document.getElementById('playerInfo');
    const playerFooter = document.getElementById('playerFooter');
    // Show modal
    modal.classList.add('active');
    document.documentElement.classList.add('modal-open');

    // Set embed URL based on global source
    const embedUrl = mediaType === 'tv'
        ? (currentPlayerSource === 'videasy' ? `https://player.videasy.net/tv/${id}/${season}/${episode}` : `https://vidsrc-embed.ru/embed/tv/${id}/${season}/${episode}`)
        : (currentPlayerSource === 'videasy' ? `https://player.videasy.net/movie/${id}` : `https://vidsrc-embed.ru/embed/movie/${id}`);

    // Only update iframe if source changed to prevent reload
    if (iframe.src !== embedUrl) {
        iframe.src = embedUrl;
    }

    // Clear previous info
    playerInfo.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i></div>';
    playerFooter.innerHTML = '';

    // Fetched details for display in player
    try {
        // Fallback for cases where mediaType might be 'undefined' string from template literal
        if (mediaType === 'undefined' || !mediaType) mediaType = 'movie';

        const movie = await fetchItemDetails(id, mediaType);
        if (movie && (movie.title || movie.name)) {
            movie.media_type = mediaType; // Ensure media_type is correct
            const title = movie.title || movie.name;
            const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
            const rating = movie.vote_average?.toFixed(1);
            const overview = movie.overview || 'Açıklama bulunamadı.';

            let sourceSelectorHtml = `
                <div class="player-source-selector">
                    <button class="source-btn ${currentPlayerSource === 'vidsrc' ? 'active' : ''}" onclick="switchPlayerSource('vidsrc', ${id}, '${mediaType}', ${season}, ${episode})">Kaynak 1</button>
                    <button class="source-btn ${currentPlayerSource === 'videasy' ? 'active' : ''}" onclick="switchPlayerSource('videasy', ${id}, '${mediaType}', ${season}, ${episode})">Kaynak 2</button>
                </div>
            `;

            let selectorHtml = '';
            if (mediaType === 'tv' && movie.seasons) {
                const seasons = movie.seasons.filter(s => s.season_number > 0);
                selectorHtml = `
                    <div class="tv-selectors">
                        <div class="selector-group">
                            <label>Sezon</label>
                            <select id="seasonSelector" onchange="changeEpisode(${id}, this.value, 1)">
                                ${seasons.map(s => `<option value="${s.season_number}" ${s.season_number == season ? 'selected' : ''}>${s.season_number}. Sezon</option>`).join('')}
                            </select>
                        </div>
                        <div class="selector-group">
                            <label>Bölüm</label>
                            <select id="episodeSelector" onchange="changeEpisode(${id}, document.getElementById('seasonSelector').value, this.value)">
                                <!-- Will be populated by loadEpisodes -->
                                <option>Yükleniyor...</option>
                            </select>
                        </div>
                    </div>
                `;
            }

            playerInfo.innerHTML = `
                <div class="player-info-header">
                    <div class="player-title-row">
                        <h2>${title}</h2>
                        ${sourceSelectorHtml}
                    </div>
                    <br>
                    <div class="player-meta">
                        <span><i class="far fa-calendar"></i> ${year}</span>
                        <span><i class="fas fa-star" style="color:#f59e0b"></i> ${rating}</span>
                        ${mediaType === 'tv' ? '<span><i class="fas fa-tv"></i> Dizi</span>' : '<span><i class="fas fa-film"></i> Film</span>'}
                    </div>
                    ${selectorHtml}
                </div>
                <div class="player-description">
                    <p class="player-overview">${overview}</p>
                </div>
                <div id="playerUniverse" class="player-universe">
                    <!-- Universe content will be loaded here -->
                </div>
            `;

            updateModalFooter(movie);
            loadUniverseContent(movie);

            if (mediaType === 'tv') {
                loadEpisodes(id, season, episode);
            }
        }
    } catch (e) {
        console.error('Player info fetch error:', e);
        playerInfo.innerHTML = '<p>Bilgiler yüklenirken bir hata oluştu.</p>';
    }
};

// Global render task ID to prevent overlapping Universe list renders
let currentUniverseRenderId = 0;

function renderUniverseList(items) {
    const listContainer = document.getElementById('universeList');
    if (!listContainer) return;

    if (items.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:var(--text-dim); font-size:0.9rem;">Sonuç bulunamadı.</p>';
        return;
    }

    const renderId = ++currentUniverseRenderId;
    listContainer.innerHTML = '';
    const chunkSize = 12;
    let index = 0;

    function renderChunk() {
        // If a new render task has started, abort this one
        if (renderId !== currentUniverseRenderId) return;

        const chunk = items.slice(index, index + chunkSize);
        const html = chunk.map(item => {
            const itemTitle = item.title || item.name;
            const itemYear = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
            const itemRating = item.vote_average?.toFixed(1) || 'N/A';
            const itemIcon = item.media_type === 'tv' ? 'fa-tv' : 'fa-film';
            const posterUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                : `https://placehold.co/92x138/0f172a/FFF?text=Yok`;

            return `
                <div class="universe-item" onclick="openPlayer(${item.id}, '${item.media_type}')">
                    <img src="${posterUrl}" alt="${itemTitle}" loading="lazy" onerror="this.src='https://placehold.co/92x138/0f172a/FFF?text=Yok'">
                    <div class="universe-item-info">
                        <h4>${itemTitle}</h4>
                        <div class="universe-item-meta">
                            <span><i class="far fa-calendar"></i> ${itemYear}</span>
                            <span><i class="fas fa-star" style="color:#f59e0b"></i> ${itemRating}</span>
                            <span><i class="fas ${itemIcon}"></i> ${item.media_type === 'tv' ? 'Dizi' : 'Film'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        listContainer.insertAdjacentHTML('beforeend', html);
        index += chunkSize;

        if (index < items.length) {
            requestAnimationFrame(renderChunk);
        }
    }

    renderChunk();
}

window.loadUniverseContent = async (movie) => {
    const container = document.getElementById('playerUniverse');
    if (!container) return;

    const id = movie.id;
    const mediaType = movie.media_type || 'movie';
    const title = movie.title || movie.name;

    // Major Studios Mapping
    const franchiseMap = {
        'Marvel Studios': { companyId: 420, keywordId: 180547 },
        'Lucasfilm': { companyId: 1, keywordId: 161168 },
        'DC Films': { companyId: 128064, keywordId: 8828 },
        'DC Entertainment': { companyId: 9993, keywordId: 8828 },
        'Pixar': { companyId: 3 },
        'Walt Disney Animation Studios': { companyId: 6125 },
        'Studio Ghibli': { companyId: 10341 },
        'Wizarding World': { keywordId: 616 } // Harry Potter
    };

    let activeFranchise = null;
    if (movie.production_companies) {
        for (const company of movie.production_companies) {
            if (franchiseMap[company.name]) {
                activeFranchise = { ...franchiseMap[company.name], name: company.name };
                break;
            }
        }
    }

    // Special case for Star Wars even if production company is missing (sometimes happens in TMDB data)
    if (!activeFranchise && (title.includes('Star Wars') || title.includes('Yıldız Savaşları'))) {
        activeFranchise = franchiseMap['Lucasfilm'];
    }

    // Determine Franchise Name for search fallback
    let franchiseName = '';
    if (movie.belongs_to_collection) {
        franchiseName = movie.belongs_to_collection.name.replace(' Collection', '').replace(' Serisi', '');
    } else {
        franchiseName = title.split(':')[0].split(' - ')[0].trim();
    }

    container.innerHTML = `
        <div class="universe-tabs">
            <div class="universe-tab active" onclick="switchUniverseTab(this, 'main')">Ana Seri</div>
            <div class="universe-tab" onclick="switchUniverseTab(this, 'saga')">Bütün Filmler</div>
            <div class="universe-tab" onclick="switchUniverseTab(this, 'all')">Tüm Evren</div>
        </div>
        <div id="universeList" class="universe-content">
            <div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i></div>
        </div>
    `;

    const universeData = { main: [], saga: [], all: [] };

    window.switchUniverseTab = async (tabElement, type) => {
        container.querySelectorAll('.universe-tab').forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');

        const listContainer = document.getElementById('universeList');
        listContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i></div>';

        if (universeData[type].length > 0) {
            renderUniverseList(universeData[type]);
            return;
        }

        try {
            let results = [];
            if (type === 'main') {
                if (movie.belongs_to_collection) {
                    const res = await fetch(`https://api.themoviedb.org/3/collection/${movie.belongs_to_collection.id}?api_key=${TMDB_API_KEY}&language=en-US`);
                    const data = await res.json();
                    results = (data.parts || []).map(p => ({ ...p, media_type: 'movie' })).filter(isSafeTitle);
                } else {
                    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(franchiseName)}&language=en-US`);
                    const data = await res.json();
                    results = (data.results || []).map(m => ({ ...m, media_type: 'movie' })).filter(isSafeTitle);
                }
            } else if (type === 'saga') {
                if (activeFranchise && activeFranchise.companyId) {
                    // Use production company filter for "same producer" accuracy
                    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_companies=${activeFranchise.companyId}&language=en-US&sort_by=release_date.asc`);
                    const data = await res.json();
                    results = (data.results || []).map(m => ({ ...m, media_type: 'movie' }));
                } else {
                    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(franchiseName)}&language=en-US`);
                    const data = await res.json();
                    results = (data.results || []).map(m => ({ ...m, media_type: 'movie' })).filter(isSafeTitle);
                }
            } else if (type === 'all') {
                if (activeFranchise && activeFranchise.companyId) {
                    // Multi-step discovery for better "Universe" coverage
                    const [moviesRes, tvRes] = await Promise.all([
                        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_companies=${activeFranchise.companyId}&language=en-US&sort_by=release_date.asc`),
                        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_companies=${activeFranchise.companyId}&language=en-US&sort_by=first_air_date.asc`)
                    ]);
                    const [mData, tData] = await Promise.all([moviesRes.json(), tvRes.json()]);
                    results = [
                        ...(mData.results || []).map(m => ({ ...m, media_type: 'movie' })),
                        ...(tData.results || []).map(t => ({ ...t, media_type: 'tv' }))
                    ];
                } else {
                    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(franchiseName)}&language=en-US`);
                    const data = await res.json();
                    results = (data.results || []).filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && isSafeTitle(item));
                }
            }

            // Remove Making Of and Sort
            results = results.filter(isSafeTitle);
            results.sort((a, b) => {
                const dateA = a.release_date || a.first_air_date || '0';
                const dateB = b.release_date || b.first_air_date || '0';
                return dateA.localeCompare(dateB);
            });

            // Unique items only
            const unique = [];
            const seen = new Set();
            for (const item of results) {
                if (!seen.has(`${item.id}_${item.media_type || 'movie'}`)) {
                    unique.push(item);
                    seen.add(`${item.id}_${item.media_type || 'movie'}`);
                }
            }

            universeData[type] = unique;
            renderUniverseList(unique);
        } catch (e) {
            console.error('Universe switch error:', e);
            listContainer.innerHTML = '<p>Yüklenemedi.</p>';
        }
    };

    // Initial load
    switchUniverseTab(container.querySelector('.universe-tab'), 'main');
};

window.updateModalFooter = (movie) => {
    const playerFooter = document.getElementById('playerFooter');
    if (!playerFooter) return;

    const isWatched = state.watched.find(m => m.id === movie.id);
    const isWatchlist = state.watchlist.find(m => m.id === movie.id);

    playerFooter.innerHTML = `
        <button class="footer-btn watched-btn ${isWatched ? 'active' : ''}" 
                onclick='handleModalWatched(${JSON.stringify(movie).replace(/'/g, "&#39;")})'>
            <i class="fas ${isWatched ? 'fa-check-circle' : 'fa-check'}"></i>
            <span>${isWatched ? 'İzlendi' : 'İzledim'}</span>
        </button>
        <button class="footer-btn watchlist-btn ${isWatchlist ? 'active' : ''}" 
                onclick='handleModalWatchlist(${JSON.stringify(movie).replace(/'/g, "&#39;")})'>
            <i class="fas ${isWatchlist ? 'fa-bookmark' : 'fa-plus'}"></i>
            <span>${isWatchlist ? 'Listede' : 'İzlenecekler'}</span>
        </button>
    `;
};

window.handleModalWatched = async (movie) => {
    const isWatched = state.watched.find(m => m.id === movie.id);
    if (isWatched) {
        removeFromWatched(movie.id);
    } else {
        await addToWatched(movie);
    }
    updateModalFooter(movie);
};

window.handleModalWatchlist = async (movie) => {
    const isWatchlist = state.watchlist.find(m => m.id === movie.id);
    if (isWatchlist) {
        removeFromWatchlist(movie.id);
    } else {
        await addToWatchlist(movie);
    }
    updateModalFooter(movie);
};

window.loadEpisodes = async (id, seasonNumber, currentEpisode = 1) => {
    const episodeSelector = document.getElementById('episodeSelector');
    if (!episodeSelector) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await res.json();

        if (data.episodes) {
            episodeSelector.innerHTML = data.episodes.map(ev =>
                `<option value="${ev.episode_number}" ${ev.episode_number == currentEpisode ? 'selected' : ''}>${ev.episode_number}. Bölüm: ${ev.name}</option>`
            ).join('');
        }
    } catch (e) {
        console.error('Error loading episodes:', e);
        episodeSelector.innerHTML = '<option>Hata oluştu</option>';
    }
};

window.changeEpisode = (id, season, episode) => {
    openPlayer(id, 'tv', season, episode);
};

window.closePlayer = () => {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('moviePlayer');
    modal.classList.remove('active');
    iframe.src = '';
    document.documentElement.classList.remove('modal-open');
};



// --- Event Listeners ---
function setupEventListeners() {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.getAttribute('data-view');

            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(viewId + 'View');
            if (targetView) targetView.classList.add('active');

            if (viewId === 'profile') {
                const nameSpan = document.getElementById('profileDisplayName');
                if (nameSpan && state.currentUser) {
                    nameSpan.textContent = state.currentUser.charAt(0).toUpperCase() + state.currentUser.slice(1);
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (viewId === 'search') {
                updateHeroSection();
            }
        });
    });

    // Search
    if (typeof searchBtn !== 'undefined' && searchBtn) searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
    if (typeof searchInput !== 'undefined' && searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchMovies(searchInput.value);
        });
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                searchMovies(query);
            } else if (!query) {
                searchMovies('');
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

    // Player modal close on background click
    const playerModal = document.getElementById('playerModal');
    if (playerModal) {
        playerModal.addEventListener('click', (e) => {
            if (e.target === playerModal) closePlayer();
        });
    }

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



    // Setup infinite scroll for recommended movies
    setupInfiniteScroll();
}


// --- Aggressive Popup & New Tab Blocker ---
(function () {
    // 1. Block any programmatic window.open calls
    window.open = function () {
        console.warn('CineTrack: Popup blocked');
        return {
            focus: () => { },
            close: () => { },
            document: { write: () => { } }
        }; // Return dummy object to prevent errors in ad scripts
    };

    // 2. Intercept all clicks to prevent target="_blank"
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (target && target.target === '_blank') {
            e.preventDefault();
            window.location.href = target.href;
        }
    }, true);

    // 3. Focus Protection: If a popup tries to take focus while player is open
    window.addEventListener('blur', () => {
        const modal = document.getElementById('playerModal');
        if (modal && modal.classList.contains('active')) {
            // Attempt to pull focus back immediately if a popup escapes
            setTimeout(() => {
                window.focus();
            }, 100);
        }
    });
})();

// Run Init
init();
function setupScrollTop() {
    if (!scrollTopBtn) return;

    let isScrolling;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
