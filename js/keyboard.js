class KeyboardManager {
    constructor(app) {
        this.app = app;
        this.focusedIndex = -1;
        this.navigableElements = [];
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    init() {
        window.addEventListener('keydown', this.handleKeyDown);
        this.refreshNavigableElements();
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.clearFocus();
    }

    refreshNavigableElements() {
        const view = document.querySelector('.view.active');
        const authOverlay = document.getElementById('authOverlay');
        const isAuthVisible = authOverlay && authOverlay.style.display !== 'none';

        if (!view && !isAuthVisible) return;

        let elements = [];

        if (isAuthVisible) {
            elements = [...authOverlay.querySelectorAll('input, button')];
        } else {
            // Collect all interactive elements in the current view + global nav
            elements = [
                ...document.querySelectorAll('.nav-btn'),
                ...view.querySelectorAll('input, button, .movie-card, .chip, .source-chip, .ep-btn, .col-movie-card, select')
            ];
        }

        this.navigableElements = elements.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
        });

        // If nothing is focused, focus the first element
        if (this.focusedIndex === -1 && elements.length > 0) {
            this.setFocus(0);
        }
    }

    handleKeyDown(e) {
        if (!this.app.state.settings.tvMode) return;

        // Skip keyboard nav if typing in an input (unless it's ArrowDown/Up to leave input)
        if (document.activeElement.tagName === 'INPUT' && !['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
            return;
        }

        this.refreshNavigableElements();

        switch (e.key) {
            case 'ArrowRight':
                this.moveFocus(1);
                e.preventDefault();
                break;
            case 'ArrowLeft':
                this.moveFocus(-1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.moveFocusGrid('down');
                e.preventDefault();
                break;
            case 'ArrowUp':
                this.moveFocusGrid('up');
                e.preventDefault();
                break;
            case 'Enter':
                this.clickFocused();
                e.preventDefault();
                break;
            case 'Escape':
            case 'Backspace':
                if (this.app.state.currentView === 'watch') {
                    this.app.goBack();
                } else if (this.app.state.currentView !== 'search') {
                    this.app.switchView('search');
                }
                e.preventDefault();
                break;
        }
    }

    moveFocus(delta) {
        let next = this.focusedIndex + delta;
        if (next < 0) next = 0;
        if (next >= this.navigableElements.length) next = this.navigableElements.length - 1;
        this.setFocus(next);
    }

    moveFocusGrid(direction) {
        if (this.focusedIndex === -1) return this.setFocus(0);

        const currentRect = this.navigableElements[this.focusedIndex].getBoundingClientRect();
        const currentCenter = currentRect.left + currentRect.width / 2;

        let bestMatch = -1;
        let bestDistance = Infinity;

        this.navigableElements.forEach((el, index) => {
            if (index === this.focusedIndex) return;

            const rect = el.getBoundingClientRect();
            const center = rect.left + rect.width / 2;

            if (direction === 'down' && rect.top >= currentRect.bottom - 5) {
                const dist = Math.abs(center - currentCenter) + (rect.top - currentRect.bottom);
                if (dist < bestDistance) {
                    bestDistance = dist;
                    bestMatch = index;
                }
            } else if (direction === 'up' && rect.bottom <= currentRect.top + 5) {
                const dist = Math.abs(center - currentCenter) + (currentRect.top - rect.bottom);
                if (dist < bestDistance) {
                    bestDistance = dist;
                    bestMatch = index;
                }
            }
        });

        if (bestMatch !== -1) {
            this.setFocus(bestMatch);
        } else if (direction === 'up') {
            // If we can't go up anymore in the view, try focusing the nav
            const navBtns = document.querySelectorAll('.nav-btn');
            if (navBtns.length > 0) {
                const firstNavBtn = Array.from(this.navigableElements).findIndex(el => el.classList.contains('nav-btn'));
                if (firstNavBtn !== -1) this.setFocus(firstNavBtn);
            }
        }
    }

    setFocus(index) {
        this.clearFocus();
        this.focusedIndex = index;
        const el = this.navigableElements[index];
        if (el) {
            el.classList.add('focused');
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearFocus() {
        this.navigableElements.forEach(el => el.classList.remove('focused'));
    }

    clickFocused() {
        if (this.focusedIndex !== -1) {
            const el = this.navigableElements[this.focusedIndex];
            el.click();

            // Re-refresh after click as view might have changed
            setTimeout(() => this.refreshNavigableElements(), 100);
        }
    }
}
