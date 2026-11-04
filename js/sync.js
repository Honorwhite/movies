// Loading lists from the browser and Supabase, saving them back
// These methods are attached to CineTrack in js/app.js.
class SyncMethods {
    async loadMovieData() {
        const prefix = `ct_${this.state.user}_`;
        const legacyPrefix = `user_${this.state.user}_`;

        // 1. Try new local storage
        let watched = localStorage.getItem(prefix + 'watched');
        let watchlist = localStorage.getItem(prefix + 'watchlist');
        let ignored = localStorage.getItem(prefix + 'ignored');
        let watchedEpisodes = localStorage.getItem(prefix + 'watchedEpisodes');
        let recentlyPlayed = localStorage.getItem(prefix + 'recentlyPlayed');

        // 2. Fallback to legacy local storage if empty
        if (!watched) {
            watched = localStorage.getItem(legacyPrefix + 'watched_list');
            if (watched) localStorage.setItem(prefix + 'watched', watched);
        }
        if (!watchlist) {
            watchlist = localStorage.getItem(legacyPrefix + 'watchlist_list');
            if (watchlist) localStorage.setItem(prefix + 'watchlist', watchlist);
        }
        if (!ignored) {
            ignored = localStorage.getItem(legacyPrefix + 'ignored_list');
            if (ignored) localStorage.setItem(prefix + 'ignored', ignored);
        }

        this.state.watched = watched ? JSON.parse(watched) : [];
        this.state.watchlist = watchlist ? JSON.parse(watchlist) : [];
        this.state.ignored = ignored ? JSON.parse(ignored) : [];
        this.state.watchedEpisodes = watchedEpisodes ? JSON.parse(watchedEpisodes) : {};
        this.state.recentlyPlayed = recentlyPlayed ? JSON.parse(recentlyPlayed) : [];

        // Check and clean: if an item is in watchlist, it must not be in watched
        if (this.ensureListIntegrity()) {
            this.saveMovieData();
        }

        this.renderStats();
        this.renderRecentlyPlayed();
        this.renderWatchlistSpotlightBanner();
        this.refreshZeroRatings();

        // 3. Fetch from Cloud in background (Non-blocking)
        this.fetchFromCloud().then(() => {
            this.renderStats();
            this.renderRecentlyPlayed();
            this.renderWatchlistSpotlightBanner();
            if (this.state.currentView === 'watched') this.renderUserList('watched');
            if (this.state.currentView === 'watchlist') this.renderUserList('watchlist');
            this.refreshZeroRatings();
        });
    }

    async fetchFromCloud() {
        if (!this.state.user) return;

        try {
            const { data, error } = await sb
                .from('movie_tracker')
                .select('content')
                .eq('id', this.cloudRowId());
            if (error) console.error('Failed to fetch from cloud:', error);

            if (!error) {
                if (data.length > 0) {
                    const cloudData = data[0].content;

                    this.state.watched = cloudData.watched || [];
                    this.state.watchlist = cloudData.watchlist || [];
                    this.state.ignored = cloudData.ignored || [];

                    // Check and clean: if an item is in watchlist, it must not be in watched
                    const cleaned = this.ensureListIntegrity();

                    if (cloudData.watchedEpisodes) {
                        this.state.watchedEpisodes = cloudData.watchedEpisodes;
                        localStorage.setItem(`ct_${this.state.user}_watchedEpisodes`, JSON.stringify(this.state.watchedEpisodes));
                    }

                    // Save back to local to prevent "empty list" on next load
                    localStorage.setItem(`ct_${this.state.user}_watched`, JSON.stringify(this.state.watched));
                    localStorage.setItem(`ct_${this.state.user}_watchlist`, JSON.stringify(this.state.watchlist));
                    localStorage.setItem(`ct_${this.state.user}_ignored`, JSON.stringify(this.state.ignored));

                    if (cleaned) {
                        this.syncWithCloud();
                    }

                    if (cloudData.settings) {
                        this.state.settings = { ...this.state.settings, ...cloudData.settings };
                        localStorage.setItem('ct_compact_mode', this.state.settings.compactMode);
                        localStorage.setItem('ct_lang', this.state.settings.language);
                        localStorage.setItem('ct_auto_tr_sub', this.state.settings.autoTurkishSub);
                        localStorage.setItem('ct_auto_source', this.state.settings.autoSource === true);
                        this.applySettings();
                        this.updateProfileUI();
                    }

                    console.log('Data restored from Supabase');
                }
            }
        } catch (e) {
            console.error('Failed to fetch from cloud:', e);
        }
    }

    async syncWithCloud() {
        if (!this.state.user) return;

        try {
            const { error } = await sb
                .from('movie_tracker')
                .upsert({
                    id: this.cloudRowId(),
                    owner: this.state.uid,
                    content: {
                        watched: this.state.watched,
                        watchlist: this.state.watchlist,
                        ignored: this.state.ignored,
                        watchedEpisodes: this.state.watchedEpisodes || {},
                        settings: this.state.settings,
                        lastUpdated: Date.now()
                    }
                });
            if (error) console.warn('Cloud sync failed:', error);
        } catch (e) {
            console.warn('Cloud sync failed:', e);
        }
    }
}
