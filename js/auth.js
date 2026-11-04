// Login, sign-up and account (Supabase Auth)
// These methods are attached to CineTrack in js/app.js.
class AuthMethods {
    async checkAuth() {
        // Clean up the old login system: it cached plain-text passwords here
        localStorage.removeItem('ct_users');
        localStorage.removeItem('ct_active_user');

        const { data } = await sb.auth.getSession();
        const session = data && data.session;
        if (session) {
            this.setSessionUser(session);
            this.updateProfileUI();
        } else {
            this.showLogin();
        }
    }

    setSessionUser(session) {
        const meta = session.user.user_metadata || {};
        this.state.user = meta.username || session.user.email.split('@')[0];
        this.state.uid = session.user.id;
    }

    // Supabase Auth needs an e-mail; usernames are turned into a private,
    // never-mailed address (hex keeps any character, e.g. Turkish letters, valid).
    usernameToEmail(username) {
        const bytes = new TextEncoder().encode(username.trim().toLowerCase());
        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        return `u${hex}@${CONFIG.AUTH_EMAIL_DOMAIN}`;
    }

    // Supabase requires at least 6 characters, but CineTrack has always allowed 4.
    // A fixed suffix lets every existing password keep working unchanged.
    // Never change this value: existing accounts would stop being able to sign in.
    authPassword(password) {
        return password + '#ct';
    }

    cloudRowId() {
        return `user_${this.state.uid}`;
    }

    // Accounts from the old system: verify the old password on the server,
    // create the Supabase account, then move the old lists over to it.
    async migrateLegacyUser(user, email, password, strings) {
        const { data: ok, error } = await sb.rpc('legacy_check', { p_username: user, p_password: password });
        if (error || !ok) return null;

        const { data, error: signUpError } = await sb.auth.signUp({
            email,
            password: this.authPassword(password),
            options: { data: { username: user } }
        });
        if (signUpError || !data.session) {
            console.error('Legacy account migration failed:', signUpError);
            return null;
        }

        await sb.rpc('legacy_claim', { p_username: user, p_password: password });
        return data.session;
    }

    showLogin(mode = 'login') {
        const authOverlay = document.getElementById('authOverlay');
        const authContainer = document.getElementById('authContainer');
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];
        authOverlay.style.display = 'flex';

        if (mode === 'login') {
            authContainer.innerHTML = `
                <form onsubmit="event.preventDefault(); app.handleAuth('login', event)">
                    <div class="auth-logo"><i class="fas fa-play"></i></div>
                    <h2 style="margin-bottom: 0.5rem;">${strings.loginTitle}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">${strings.loginDesc}</p>
                    <input type="text" id="username" class="input-field" placeholder="${strings.username}" required>
                    <input type="password" id="password" class="input-field" placeholder="${strings.password}" required>
                    <button type="submit" class="btn-primary">${strings.loginBtn}</button>
                    <div class="auth-toggle-link" onclick="app.showLogin('signup')">
                        ${strings.noAccount}<span>${strings.signupBtn}</span>
                    </div>
                </form>
            `;
        } else {
            authContainer.innerHTML = `
                <form onsubmit="event.preventDefault(); app.handleAuth('signup', event)">
                    <div class="auth-logo"><i class="fas fa-play"></i></div>
                    <h2 style="margin-bottom: 0.5rem;">${strings.signupTitle}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">${strings.signupDesc}</p>
                    <input type="text" id="username" class="input-field" placeholder="${strings.username}" required>
                    <input type="password" id="password" class="input-field" placeholder="${strings.password}" required>
                    <input type="password" id="password_confirm" class="input-field" placeholder="${strings.confirmPassword}" required>
                    <button type="submit" class="btn-primary">${strings.signupBtn}</button>
                    <div class="auth-toggle-link" onclick="app.showLogin('login')">
                        ${strings.hasAccount}<span>${strings.loginBtn}</span>
                    </div>
                </form>
            `;
        }

        if (this.keyboardManager && this.state.settings.tvMode) {
            this.keyboardManager.focusedIndex = -1;
            this.keyboardManager.refreshNavigableElements();
        }
    }

    async handleAuth(mode = 'login', event = null) {
        const lang = this.state.settings.language;
        const strings = TRANSLATIONS[lang];

        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');

        if (!usernameEl || !passwordEl) return;

        const user = usernameEl.value.trim();
        const password = passwordEl.value;

        if (user.length < 3) {
            alert(strings.shortUsername);
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            alert(strings.shortPassword);
            return;
        }

        // Disable button during network requests
        const submitBtn = event && event.target ? (event.target.tagName === 'FORM' ? event.target.querySelector('button[type="submit"]') : event.target) : null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = lang === 'tr' ? 'Lütfen bekleyin...' : 'Please wait...';
        }

        const email = this.usernameToEmail(user);
        let session = null;

        if (mode === 'signup') {
            const passwordConfirmEl = document.getElementById('password_confirm');
            if (!passwordConfirmEl) {
                this.resetAuthBtn(event, mode, lang);
                return;
            }
            const passwordConfirm = passwordConfirmEl.value;

            if (password !== passwordConfirm) {
                alert(strings.passwordMismatch);
                this.resetAuthBtn(event, mode, lang);
                return;
            }

            // Names still waiting in the old system are reserved for their owners
            const { data: taken } = await sb.rpc('legacy_user_exists', { p_username: user });
            if (taken) {
                alert(strings.userExists);
                this.resetAuthBtn(event, mode, lang);
                return;
            }

            const { data, error } = await sb.auth.signUp({
                email,
                password: this.authPassword(password),
                options: { data: { username: user } }
            });
            if (error) {
                alert(/registered|exists/i.test(error.message) ? strings.userExists : error.message);
                this.resetAuthBtn(event, mode, lang);
                return;
            }
            session = data.session;
        } else {
            const { data, error } = await sb.auth.signInWithPassword({ email, password: this.authPassword(password) });
            if (!error) {
                session = data.session;
                // Finishes a migration that was interrupted earlier (no-op otherwise)
                sb.rpc('legacy_claim', { p_username: user, p_password: password });
            } else {
                session = await this.migrateLegacyUser(user, email, password, strings);
                if (!session) {
                    alert(strings.invalidCredentials);
                    this.resetAuthBtn(event, mode, lang);
                    return;
                }
            }
        }

        if (!session) {
            alert(strings.authFailed);
            this.resetAuthBtn(event, mode, lang);
            return;
        }

        this.setSessionUser(session);

        document.getElementById('authOverlay').style.display = 'none';
        this.updateProfileUI();
        await this.loadMovieData();
        this.fetchTrending();

        if (this.state.settings.tvMode && this.keyboardManager) {
            this.keyboardManager.focusedIndex = -1;
            this.keyboardManager.refreshNavigableElements();
        }
    }

    resetAuthBtn(event, mode, lang) {
        const submitBtn = event && event.target ? (event.target.tagName === 'FORM' ? event.target.querySelector('button[type="submit"]') : event.target) : null;
        if (submitBtn) {
            submitBtn.disabled = false;
            if (mode === 'signup') {
                submitBtn.textContent = TRANSLATIONS[lang].signupBtn;
            } else {
                submitBtn.textContent = TRANSLATIONS[lang].loginBtn;
            }
        }
    }

    async logout() {
        await sb.auth.signOut();
        location.reload();
    }

    updateProfileUI() {
        const profileName = document.getElementById('profileName');
        const navProfileName = document.getElementById('navProfileName');
        if (profileName) profileName.textContent = this.state.user;
        if (navProfileName) navProfileName.textContent = this.state.user;

        // Sync settings UI
        const compactToggle = document.getElementById('compactToggle');
        if (compactToggle) compactToggle.checked = this.state.settings.compactMode;

        const langLabel = document.getElementById('currentLangLabel');
        if (langLabel) langLabel.textContent = this.state.settings.language.toUpperCase();

        const autoSubToggle = document.getElementById('autoSubToggle');
        if (autoSubToggle) autoSubToggle.checked = this.state.settings.autoTurkishSub;

        const autoSourceToggle = document.getElementById('autoSourceToggle');
        if (autoSourceToggle) autoSourceToggle.checked = this.state.settings.autoSource;

        const tvModeToggle = document.getElementById('tvModeToggle');
        if (tvModeToggle) tvModeToggle.checked = this.state.settings.tvMode;

        const autoPlayToggle = document.getElementById('autoPlayToggle');
        if (autoPlayToggle) autoPlayToggle.checked = this.state.settings.autoPlay;

        const episodeNotifToggle = document.getElementById('episodeNotifToggle');
        if (episodeNotifToggle) episodeNotifToggle.checked = this.state.settings.episodeNotifications;
        this.renderShareSettings();

        this.applySettings();
        this.setLanguageUI();
    }

    async changePassword() {
        const lang = this.state.settings.language;
        const promptMsg = lang === 'tr' ? 'Yeni şifrenizi girin:' : 'Enter your new password:';
        const successMsg = lang === 'tr' ? 'Şifreniz başarıyla güncellendi!' : 'Password updated successfully!';
        const shortPassMsg = TRANSLATIONS[lang].shortPassword;

        const newPass = prompt(promptMsg);
        if (!newPass) return;
        if (newPass.length < MIN_PASSWORD_LENGTH) {
            alert(shortPassMsg);
            return;
        }

        const { error } = await sb.auth.updateUser({ password: this.authPassword(newPass) });
        if (error) {
            alert(error.message);
            return;
        }
        alert(successMsg);
    }
}
