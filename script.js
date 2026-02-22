const TMDB_API_KEY = '4a9f3fe6b13e66b0dd355b7318b7e0e4';
const LOCAL_URL = 'http://localhost:3000/data';

// Immediate check for saved user to prevent flicker
if (localStorage.getItem('active_user')) {
    document.documentElement.classList.add('user-logged-in');
}

// let isLocalServerAvailable = false; // Removed obsolete feature

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
    // Check for saved user session
    const savedUser = localStorage.getItem('active_user');
    if (savedUser) {
        state.currentUser = savedUser;
        document.documentElement.classList.add('user-logged-in');
        document.getElementById('userSelectionOverlay').style.display = 'none';
        document.getElementById('searchView').classList.add('active'); // Activate search view
        const nameSpan = document.getElementById('activeUserName');
        if (nameSpan) nameSpan.textContent = state.currentUser.charAt(0).toUpperCase() + state.currentUser.slice(1);

        // PRIORITY: Load local data and show UI instantly
        loadStateFromLocal(false);
        renderLists();
        initGenres();

        // BACKGROUND: Cloud sync and discovery
        setTimeout(async () => {
            await loadStateFromCloud();
            updateHeroSection();
            loadRecommendedMovies();
        }, 100);

        // Final cleanup of splash screen
        setTimeout(() => {
            const appLoader = document.getElementById('appLoader');
            if (appLoader) appLoader.classList.add('hidden');
        }, 500);
    } else {
        setTimeout(showLogin, 100);
        setTimeout(() => {
            const appLoader = document.getElementById('appLoader');
            if (appLoader) appLoader.classList.add('hidden');
        }, 500);
    }

    // Register PWA Service Worker
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
    }
}

// Removed heavy auth background fetching to improve login speed

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
        <div class="user-selection-content glass auth-card">
            <div class="auth-form">
                <div class="input-group">
                    <label><i class="fas fa-user"></i> Kullanıcı Adı</label>
                    <input type="text" id="loginUsername" placeholder="Kullanıcı adınızı girin" autocomplete="username">
                </div>
                <div class="input-group">
                    <label><i class="fas fa-lock"></i> Şifre</label>
                    <input type="password" id="loginPassword" placeholder="Şifrenizi girin" autocomplete="current-password">
                </div>
                <div id="authError" class="status-msg error" style="display: none; margin-bottom: 1rem;"></div>
                <div class="auth-actions">
                    <button class="primary-btn auth-main-btn" id="loginBtn" onclick="handleLogin()">
                        <span>Giriş Yap</span> <i class="fas fa-arrow-right"></i>
                    </button>
                    <div class="auth-divider"><span>veya</span></div>
                    <button class="secondary-btn auth-sub-btn" onclick="showRegister()">Hesap Oluştur</button>
                </div>
            </div>
        </div>
    `;
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';

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
        <div class="user-selection-content glass auth-card">
            <div class="auth-header">
                <h2>Yeni Hesap<span> Oluştur</span></h2>
                <p>Kendi film listenizi yönetmeye bir adım kaldı</p>
            </div>
            <div class="auth-form">
                <div class="input-group">
                    <label><i class="fas fa-user"></i> Kullanıcı Adı</label>
                    <input type="text" id="regUsername" placeholder="En az 3 karakter">
                </div>
                <div class="input-group">
                    <label><i class="fas fa-lock"></i> Şifre</label>
                    <input type="password" id="regPassword" placeholder="Şifrenizi belirleyin">
                </div>
                <div class="input-group">
                    <label><i class="fas fa-shield-alt"></i> Şifre Tekrar</label>
                    <input type="password" id="regPasswordConfirm" placeholder="Şifrenizi tekrar girin">
                </div>
                <div id="authError" class="status-msg error" style="display: none; margin-bottom: 1rem;"></div>
                <div class="auth-actions">
                    <button class="primary-btn auth-main-btn" id="regBtn" onclick="handleRegister()">
                        <span>Kayıt Ol</span> <i class="fas fa-check"></i>
                    </button>
                    <div class="auth-divider"><span>veya zaten hesabınız varsa</span></div>
                    <button class="secondary-btn auth-sub-btn" onclick="showLogin()">Giriş Yap</button>
                </div>
            </div>
        </div>
    `;

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
            window.scrollTo(0, 0);
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
    const passConfirmField = document.getElementById('regPasswordConfirm');
    const regBtn = document.getElementById('regBtn');
    const errorDiv = document.getElementById('authError');

    const user = userField.value.trim().toLowerCase();
    const pass = passField.value.trim();
    const passConfirm = passConfirmField.value.trim();

    if (user.length < 3 || pass.length < 3) {
        errorDiv.textContent = 'Kullanıcı adı ve şifre en az 3 karakter olmalıdır.';
        errorDiv.style.display = 'block';
        return;
    }

    if (pass !== passConfirm) {
        errorDiv.textContent = 'Şifreler birbiriyle eşleşmiyor!';
        errorDiv.style.display = 'block';
        passConfirmField.style.borderColor = 'var(--accent-bad)';
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


window.changePassword = async () => {
    const newPass = document.getElementById('newPassword').value.trim();
    const msg = document.getElementById('profileMsg'); // Changed from msgDiv to msg

    if (newPass.length < 3) {
        msg.textContent = 'Şifre en az 3 karakter olmalıdır.';
        msg.className = 'status-msg error'; // Updated class
        msg.style.display = 'block';
        return;
    }

    const userIdx = state.users.findIndex(u => u.username === state.currentUser);
    if (userIdx !== -1) {
        state.users[userIdx].password = newPass;
        localStorage.setItem('ct_users', JSON.stringify(state.users));
        await saveAllUsersToCloud(state.users);

        msg.textContent = 'Şifre başarıyla güncellendi!';
        msg.className = 'status-msg success';
        msg.style.display = 'block';
        document.getElementById('newPassword').value = '';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 3000);
    }
};

window.logout = () => {
    localStorage.removeItem('active_user');
    location.reload();
};

window.switchUser = () => logout();

// Removed checkLocalServer as it is no longer used

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

    // UI Notification only for background sync
    updateSyncUI('Eşitleniyor...', 'active');

    const prefix = `user_${state.currentUser}_`;
    const localTimestamp = parseInt(localStorage.getItem(prefix + 'last_updated')) || 0;

    // Local server logic removed. Unified under cloud storage.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        if (state.cloudSettings.url && state.cloudSettings.key) {
            const userId = `user_${state.currentUser}`;
            const response = await fetch(`${state.cloudSettings.url}/rest/v1/movie_tracker?id=eq.${userId}`, {
                headers: { 'apikey': state.cloudSettings.key, 'Authorization': `Bearer ${state.cloudSettings.key}` },
                signal: controller.signal
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const cloudData = data[0].content;
                    const remoteTimestamp = cloudData.lastUpdated || 0;

                    if (remoteTimestamp > localTimestamp) {
                        state.watched = cloudData.watched || [];
                        state.watchlist = cloudData.watchlist || [];
                        state.ignored = cloudData.ignored || [];
                        saveStateToLocal(false);
                        renderLists(); // Re-render only if cloud has new data
                        updateSyncUI('Senkronizasyon Tamam', 'success');
                    } else {
                        updateSyncUI('Veriler Güncel', 'success');
                    }
                } else {
                    updateSyncUI('Bulut Hazır', 'success');
                }
            } else {
                updateSyncUI('Bağlantı Hatası', 'error');
            }
        }
    } catch (e) {
        console.warn('Cloud sync background error:', e);
        updateSyncUI('Bağlantı Hatası', 'error');
    } finally {
        clearTimeout(timeoutId);
    }
}

// mergeMovieLists removed - handled by simple array logic elsewhere

function loadStateFromLocal(updateTimestamp = true) {
    if (!state.currentUser) return;
    const prefix = `user_${state.currentUser}_`;
    state.watched = JSON.parse(localStorage.getItem(prefix + 'watched_list')) || [];
    state.watchlist = JSON.parse(localStorage.getItem(prefix + 'watchlist_list')) || [];
    state.ignored = JSON.parse(localStorage.getItem(prefix + 'ignored_list')) || [];
    if (updateTimestamp) {
        localStorage.setItem(prefix + 'last_updated', new Date().getTime().toString());
    }
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

    if (state.cloudSettings.url && state.cloudSettings.key) {
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
                // Duplicate merging logic removed - handled by Map elsewhere
                if (confirm('Veriler geri yüklenecek. Mevcut listenizle birleştirilsin mi? (İptal derseniz tamamen yer değiştirir)')) {
                    const combine = (l1, l2) => Array.from(new Map([...l1, ...l2].map(m => [m.id, m])).values());
                    state.watched = combine(state.watched, importedState.watched);
                    state.watchlist = combine(state.watchlist, importedState.watchlist);
                    state.ignored = combine(state.ignored || [], importedState.ignored || []);
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
    // Simplified: Just generic safety check if item exists
    return item && (item.title || item.name);
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
    if (!state.currentUser) return; // Don't fetch if not logged in
    if (recommendedState.isLoading || !recommendedState.hasMore) return;

    recommendedState.isLoading = true;
    loadingIndicator.classList.add('active');

    try {
        let allItems = [];
        let genreId = recommendedState.selectedGenre;

        // Simplified fetching: Just Discover or Trending, not both + history recommendations
        if (genreId) {
            const moviesRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${recommendedState.page}&with_genres=${genreId}&sort_by=popularity.desc`);
            const data = await moviesRes.json();
            if (data.results) data.results.forEach(m => { m.media_type = 'movie'; allItems.push(m); });
        } else {
            const trendRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&page=${recommendedState.page}`);
            const data = await trendRes.json();
            if (data.results) allItems.push(...data.results);
        }

        // --- FILTERING & SHUFFLING ---
        const uniqueMap = new Map();
        allItems.forEach(item => {
            if (!item || !item.id) return;
            const itemId = Number(item.id);
            if (!uniqueMap.has(itemId)) {
                uniqueMap.set(itemId, item);
            } else {
                const existing = uniqueMap.get(itemId);
                existing._rec_score = (Number(existing._rec_score) || 0) + 5;
            }
        });

        // Convert to array and shuffle for variety
        let itemsPool = Array.from(uniqueMap.values());

        const filteredItems = itemsPool.filter(item => {
            const itemId = Number(item.id);
            const isInWatched = state.watched.some(m => Number(m.id) === itemId);
            const isInWatchlist = state.watchlist.some(m => Number(m.id) === itemId);
            const isIgnored = state.ignored.some(m => Number(m.id) === itemId);
            const isAlreadyLoaded = recommendedState.loadedMovies.some(m => Number(m.id) === itemId);

            const hasValidPoster = item.poster_path;
            const isSafe = isSafeTitle(item);

            // Quality threshold
            const isQuality = Number(item.vote_average) >= 6.0 && Number(item.vote_count) > 50;
            const releaseDate = item.release_date || item.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : 0;

            return !isInWatched && !isInWatchlist && !isIgnored && !isAlreadyLoaded && hasValidPoster && isQuality && isSafe && (year >= 1995 || item.vote_average >= 8);
        });

        // Shuffle pool after filtering
        const shuffled = filteredItems.sort(() => Math.random() - 0.5);

        // Sort by final score (rec_score + rating)
        const finalSorted = shuffled.sort((a, b) => {
            const scoreA = (Number(a._rec_score) || 0) + (Number(a.vote_average) || 0);
            const scoreB = (Number(b._rec_score) || 0) + (Number(b.vote_average) || 0);
            return scoreB - scoreA;
        });

        const itemsToShow = finalSorted.slice(0, 24);

        if (itemsToShow.length === 0) {
            if (recommendedState.page < 50) {
                recommendedState.page++;
                recommendedState.isLoading = false;
                // Significant delay when no results found to prevent rapid-fire requests
                return setTimeout(loadRecommendedMovies, 1500);
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

        requestAnimationFrame(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            if (scrollHeight <= clientHeight + 300 && recommendedState.hasMore && !recommendedState.isLoading) {
                loadRecommendedMovies();
            }
        });

    } catch (error) {
        console.error('Error loading recommended items:', error);
    } finally {
        recommendedState.isLoading = false;
        loadingIndicator.classList.remove('active');
    }
}

function setupInfiniteScroll() {
    const triggerLoading = () => {
        if (!recommendedState.isLoading && recommendedState.hasMore) {
            const searchView = document.getElementById('searchView');
            if (searchView && searchView.classList.contains('active')) {
                loadRecommendedMovies();
            }
        }
    };

    // Use IntersectionObserver as the primary trigger (most efficient)
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            triggerLoading();
        }
    }, { rootMargin: '400px' });

    if (loadingIndicator) observer.observe(loadingIndicator);

    // Optimized scroll listener with throttle to prevent spamming
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            // Trigger load if within 800px of bottom
            if ((scrollHeight - scrollTop - clientHeight) < 800) {
                triggerLoading();
            }
            scrollTimeout = null;
        }, 800);
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
    if (!state.currentUser) return; // Don't fetch if not logged in
    const heroBackdrop = document.getElementById('heroBackdrop');
    const heroMovieInfo = document.getElementById('heroMovieInfo');

    if (!heroBackdrop || !heroMovieInfo) return;

    const renderMovie = (movie, immediate = false) => {
        heroMovieInfo.classList.remove('active');
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(10px)';
        }

        const setup = () => {
            const title = movie.title || movie.name || movie.original_title || movie.original_name;
            const releaseDate = movie.release_date || movie.first_air_date || '';
            const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
            const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;

            heroBackdrop.style.opacity = '0';

            const injectContent = () => {
                if (heroTitle) {
                    heroTitle.textContent = title;
                    setTimeout(() => {
                        heroTitle.style.opacity = '1';
                        heroTitle.style.transform = 'translateY(0)';
                    }, 50);
                }

                heroMovieInfo.innerHTML = `
                    <div class="hero-actions">
                        <button class="hero-primary-btn" onclick="openPlayer(${movie.id}, '${movie.media_type || 'movie'}')" title="${title}">
                            <i class="fas fa-play"></i> <span>Hemen İzle</span>
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
    watched: { type: 'abc', order: 'asc' }, // 'abc', 'year', 'rating'
    watchlist: { type: 'abc', order: 'asc' }
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

    // Update Profile Specific Stats
    updateProfileStats();
}

function updateProfileStats() {
    const movieCount = document.getElementById('profileMovieCount');
    const tvCount = document.getElementById('profileTvCount');
    const totalTime = document.getElementById('profileTotalTime');

    if (!movieCount || !tvCount || !totalTime) return;

    const watchedMovies = state.watched.filter(m => m.media_type === 'movie');
    const watchedTV = state.watched.filter(m => m.media_type === 'tv');

    let totalMinutes = 0;
    watchedMovies.forEach(m => totalMinutes += m.runtime || 100);
    watchedTV.forEach(m => {
        const eps = m.number_of_episodes || (m.number_of_seasons ? m.number_of_seasons * 10 : 10);
        const avgRuntime = (m.episode_run_time && m.episode_run_time[0]) || 45;
        totalMinutes += eps * avgRuntime;
    });

    movieCount.textContent = watchedMovies.length;
    tvCount.textContent = watchedTV.length;

    if (totalMinutes < 60) {
        totalTime.textContent = `${totalMinutes}dk`;
    } else {
        const hours = Math.floor(totalMinutes / 60);
        if (hours > 24) {
            totalTime.textContent = `${(hours / 24).toFixed(1)}g`;
        } else {
            totalTime.textContent = `${hours}sa`;
        }
    }
}

const apiCache = new Map();

async function fetchItemDetails(id, mediaType) {
    const cacheKey = `${mediaType}_${id}`;
    if (apiCache.has(cacheKey)) return apiCache.get(cacheKey);

    try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await response.json();
        apiCache.set(cacheKey, data);
        return data;
    } catch (e) {
        console.error('Error fetching details:', e);
        return null;
    }
}

// fetchMissingDetails was removed to prevent excessive background requests (500+ requests on large lists)
// Stats now use accurate heuristics for missing data.

function filterList(list, searchQuery, genreId, sortObj) {
    const { type: sortType, order } = sortObj;

    const filtered = list.filter(m => {
        const title = (m.title || m.name || '').toLowerCase();
        const searchMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
        const genreMatch = !genreId || (m.genre_ids && m.genre_ids.includes(genreId));
        return searchMatch && genreMatch;
    });

    return filtered.sort((a, b) => {
        let res = 0;
        if (sortType === 'abc') {
            const titleA = (a.title || a.name || '').toLowerCase();
            const titleB = (b.title || b.name || '').toLowerCase();
            res = titleA.localeCompare(titleB, 'tr');
        } else if (sortType === 'year') {
            const yearA = parseInt((a.release_date || a.first_air_date || '0').split('-')[0]);
            const yearB = parseInt((b.release_date || b.first_air_date || '0').split('-')[0]);
            res = yearB - yearA; // Newest first by default (DESC)
        } else if (sortType === 'rating') {
            const rateA = a.vote_average || 0;
            const rateB = b.vote_average || 0;
            res = rateB - rateA; // Highest first by default (DESC)
        }

        if (order === 'asc') {
            return sortType === 'abc' ? res : -res;
        } else {
            return sortType === 'abc' ? -res : res;
        }
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
let currentPlayerSource = 'vidking';

window.switchPlayerSource = (source, id, mediaType, season, episode) => {
    currentPlayerSource = source;

    // Update active class in UI
    document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.source-btn')).find(btn =>
        (source === 'vidking' && btn.textContent === 'Kaynak 1') ||
        (source === 'vidsrc' && btn.textContent === 'Kaynak 2') ||
        (source === 'videasy' && btn.textContent === 'Kaynak 3')
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Reload player with new source
    const iframe = document.getElementById('moviePlayer');

    let embedUrl = '';
    if (mediaType === 'tv') {
        if (source === 'vidking') embedUrl = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=4f46e5%3B&autoPlay=true&nextEpisode=true&episodeSelector=true`;
        else if (source === 'vidsrc') embedUrl = `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
        else if (source === 'videasy') embedUrl = `https://player.videasy.net/tv/${id}/${season}/${episode}`;
    } else {
        if (source === 'vidking') embedUrl = `https://www.vidking.net/embed/movie/${id}?color=4f46e5%3B&autoPlay=true&nextEpisode=true&episodeSelector=true`;
        else if (source === 'vidsrc') embedUrl = `https://vidsrc.xyz/embed/movie/${id}`;
        else if (source === 'videasy') embedUrl = `https://player.videasy.net/movie/${id}`;
    }

    if (iframe.src !== embedUrl) {
        iframe.src = embedUrl;
    }
};

window.toggleFullscreen = () => {
    const iframe = document.getElementById('moviePlayer');
    if (!iframe) return;

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
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
    let embedUrl = '';
    if (mediaType === 'tv') {
        if (currentPlayerSource === 'vidking') embedUrl = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=4f46e5%3B&autoPlay=true&nextEpisode=true&episodeSelector=true`;
        else if (currentPlayerSource === 'vidsrc') embedUrl = `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
        else if (currentPlayerSource === 'videasy') embedUrl = `https://player.videasy.net/tv/${id}/${season}/${episode}`;
    } else {
        if (currentPlayerSource === 'vidking') embedUrl = `https://www.vidking.net/embed/movie/${id}?color=4f46e5%3B&autoPlay=true&nextEpisode=true&episodeSelector=true`;
        else if (currentPlayerSource === 'vidsrc') embedUrl = `https://vidsrc.xyz/embed/movie/${id}`;
        else if (currentPlayerSource === 'videasy') embedUrl = `https://player.videasy.net/movie/${id}`;
    }

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
                    <button class="source-btn ${currentPlayerSource === 'vidking' ? 'active' : ''}" onclick="switchPlayerSource('vidking', ${id}, '${mediaType}', ${season}, ${episode})">Kaynak 1</button>
                    <button class="source-btn ${currentPlayerSource === 'vidsrc' ? 'active' : ''}" onclick="switchPlayerSource('vidsrc', ${id}, '${mediaType}', ${season}, ${episode})">Kaynak 2</button>
                    <button class="source-btn ${currentPlayerSource === 'videasy' ? 'active' : ''}" onclick="switchPlayerSource('videasy', ${id}, '${mediaType}', ${season}, ${episode})">Kaynak 3</button>
                    <button class="source-btn fullscreen-btn" onclick="toggleFullscreen()" title="Tam Ekran"><i class="fas fa-expand"></i></button>
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
            `;

            updateModalFooter(movie);

            if (mediaType === 'tv') {
                loadEpisodes(id, season, episode);
            }
        }
    } catch (e) {
        console.error('Player info fetch error:', e);
        playerInfo.innerHTML = '<p>Bilgiler yüklenirken bir hata oluştu.</p>';
    }
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
        let searchDebounce;
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                if (query.length >= 2) {
                    searchMovies(query);
                } else if (!query) {
                    searchMovies('');
                }
            }, 400); // 400ms debounce
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

            if (sortState[listType].type === sortType) {
                // Toggle order if clicking same type
                sortState[listType].order = sortState[listType].order === 'asc' ? 'desc' : 'asc';
            } else {
                // Set new type and default order
                sortState[listType].type = sortType;
                sortState[listType].order = (sortType === 'abc' ? 'asc' : 'desc');
            }

            // Update UI for all buttons in this control
            btn.parentElement.querySelectorAll('.sort-btn').forEach(b => {
                b.classList.remove('active');
                b.classList.remove('order-asc');
                b.classList.remove('order-desc');
            });

            btn.classList.add('active');
            btn.classList.add(`order-${sortState[listType].order}`);

            renderLists();
        });
    });



    // Setup infinite scroll for recommended movies
    setupInfiniteScroll();
}


// Security blockers removed or simplified elsewhere to prioritize performance

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
