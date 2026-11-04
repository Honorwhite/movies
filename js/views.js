// Navigation between pages, toasts, legal notice, global event listeners
// These methods are attached to CineTrack in js/app.js.
class ViewsMethods {
    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    showToast(msg, icon = 'fa-check-circle') {
        let toast = document.getElementById('appToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'appToast';
            toast.className = 'app-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${msg}</span>`;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

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
        const mainViews = ['search', 'watched', 'watchlist', 'stats', 'collections', 'profile'];
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
        if (viewId === 'search') {
            this.renderWatchlistSpotlightBanner();
            this.renderRecentlyPlayed();
        }
        if (viewId === 'watched') {
            this.renderUserList('watched');
            this.refreshZeroRatings('watched');
        }
        if (viewId === 'watchlist') {
            this.renderUserList('watchlist');
            this.refreshZeroRatings('watchlist');
        }
        if (viewId === 'collections') {
            this.renderUniversesPage();
        }
        if (viewId === 'stats') {
            this.renderStats();
        }

        if (this.state.settings.tvMode && this.keyboardManager) {
            this.keyboardManager.focusedIndex = -1;
            setTimeout(() => this.keyboardManager.refreshNavigableElements(), 300);
        }
    }

    goBack() {
        // Always return to the main view that opened the player
        this.switchView(this.state.previousView || 'search');
    }

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

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('universeDetailModal');
                if (modal && modal.style.display !== 'none') {
                    this.closeUniverseModal();
                }
            }
        });

        // Set initial state
        history.replaceState({ view: this.state.currentView }, '', `#${this.state.currentView}`);
    }

    checkDisclaimerState() {
        if (localStorage.getItem('ct_disclaimer_dismissed') === 'true') {
            document.body.classList.add('disclaimer-closed');
        }
    }

    dismissDisclaimer() {
        document.body.classList.add('disclaimer-closed');
        localStorage.setItem('ct_disclaimer_dismissed', 'true');
    }

    openLegalModal() {
        const modal = document.getElementById('legalModal');
        if (modal) modal.style.display = 'flex';
    }

    closeLegalModal() {
        const modal = document.getElementById('legalModal');
        if (modal) modal.style.display = 'none';
    }
}
