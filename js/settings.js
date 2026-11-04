// Settings toggles and language
// These methods are attached to CineTrack in js/app.js.
class SettingsMethods {
    applySettings() {
        document.body.classList.toggle('compact-mode', this.state.settings.compactMode);
        document.body.classList.toggle('tv-mode', this.state.settings.tvMode);

        if (this.state.settings.tvMode) {
            if (!this.keyboardManager) this.keyboardManager = new KeyboardManager(this);
            this.keyboardManager.init();
        } else if (this.keyboardManager) {
            this.keyboardManager.destroy();
        }
    }

    toggleTVMode(enabled) {
        this.state.settings.tvMode = enabled;
        localStorage.setItem('ct_tv_mode', enabled);
        this.applySettings();
        this.syncWithCloud();
    }

    toggleCompactMode(enabled) {
        this.state.settings.compactMode = enabled;
        localStorage.setItem('ct_compact_mode', enabled);
        this.applySettings();
        this.syncWithCloud();
    }

    toggleAutoTurkishSub(enabled) {
        this.state.settings.autoTurkishSub = enabled;
        localStorage.setItem('ct_auto_tr_sub', enabled);
        this.syncWithCloud();
    }

    toggleAutoSource(enabled) {
        this.state.settings.autoSource = enabled;
        localStorage.setItem('ct_auto_source', enabled);
        this.syncWithCloud();
    }

    toggleAutoPlay(enabled) {
        this.state.settings.autoPlay = enabled;
        localStorage.setItem('ct_auto_play', enabled);
        this.syncWithCloud();
    }

    toggleLanguage() {
        const newLang = this.state.settings.language === 'tr' ? 'en' : 'tr';
        this.state.settings.language = newLang;
        localStorage.setItem('ct_lang', newLang);
        this.setLanguageUI();
        this.syncWithCloud();

        // Update stats and grids to refresh labels
        this.renderStats();
        if (this.state.currentView === 'watched') this.renderUserList('watched');
        if (this.state.currentView === 'watchlist') this.renderUserList('watchlist');
        if (this.state.currentView === 'search') this.renderWatchlistSpotlightBanner();

        // Update Search placeholder specifically
        const searchInput = document.getElementById('movieSearch');
        if (searchInput) {
            searchInput.placeholder = TRANSLATIONS[newLang].searchPlaceholder;
        }

        const langLabel = document.getElementById('currentLangLabel');
        if (langLabel) langLabel.textContent = newLang.toUpperCase();
    }

    setLanguageUI() {
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (strings[key]) el.textContent = strings[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (strings[key]) el.placeholder = strings[key];
        });
    }
}
