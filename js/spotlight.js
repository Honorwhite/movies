// Home page: watchlist spotlight banner and recently played
// These methods are attached to CineTrack in js/app.js.
class SpotlightMethods {
    saveRecentlyPlayed() {
        if (!this.state.user) return;
        localStorage.setItem(`ct_${this.state.user}_recentlyPlayed`, JSON.stringify(this.state.recentlyPlayed));
    }

    renderWatchlistSpotlightBanner(forceNew = false) {
        const section = document.getElementById('watchlistBannerSection');
        if (!section) return;

        // Hide when searching or when browsing a specific catalog filter
        if (this.state.isSearching || this.state.currentCatalog) {
            section.style.display = 'none';
            return;
        }

        // Hide if watchlist is empty
        const watchlist = this.state.watchlist || [];
        if (watchlist.length === 0) {
            section.style.display = 'none';
            return;
        }

        // Validate items
        const validItems = watchlist.filter(m => m && (m.title || m.name || m.original_title || m.original_name));
        if (validItems.length === 0) {
            section.style.display = 'none';
            return;
        }

        // Filter out items in picks that are no longer in watchlist
        if (this.state.spotlightPicks && this.state.spotlightPicks.length > 0) {
            const currentIds = new Set(validItems.map(m => Number(m.id)));
            this.state.spotlightPicks = this.state.spotlightPicks.filter(p => currentIds.has(Number(p.id)));
        }

        if (forceNew || !this.state.spotlightPicks || this.state.spotlightPicks.length === 0) {
            // Pick up to 5 random items from watchlist
            const shuffled = [...validItems].sort(() => 0.5 - Math.random());
            this.state.spotlightPicks = shuffled.slice(0, Math.min(5, shuffled.length));
            this.state.spotlightActiveIndex = 0;
            this.preloadAllSpotlightPicks(this.state.spotlightPicks);
        }

        if (this.state.spotlightActiveIndex >= this.state.spotlightPicks.length) {
            this.state.spotlightActiveIndex = 0;
        }

        const activeItem = this.state.spotlightPicks[this.state.spotlightActiveIndex];
        if (!activeItem) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        const lang = this.state.settings.language || 'tr';
        const isTr = lang === 'tr';
        const t = TRANSLATIONS[lang] || TRANSLATIONS.tr;

        const mType = activeItem.media_type || (activeItem.first_air_date ? 'tv' : 'movie');
        const title = activeItem.original_title || activeItem.original_name || activeItem.title || activeItem.name || '';
        const numRating = Number(activeItem.vote_average) || 0;
        const rating = numRating.toFixed(1);
        const year = (activeItem.release_date || activeItem.first_air_date || '').split('-')[0] || '';
        const backdropUrl = activeItem.backdrop_path 
            ? (CONFIG.HERO_IMG + activeItem.backdrop_path) 
            : (activeItem.poster_path ? (CONFIG.BASE_IMG + activeItem.poster_path) : '');

        // Short punchy tagline or concise 1-sentence logline (never a long wall of text)
        let briefDescription = '';
        if (activeItem.tagline && activeItem.tagline.trim().length > 0) {
            briefDescription = `"${activeItem.tagline.trim()}"`;
        } else if (activeItem.overview) {
            const firstSentence = activeItem.overview.split(/(?<=[.!?])\s+/)[0] || activeItem.overview;
            briefDescription = firstSentence.length > 140 ? firstSentence.slice(0, 137) + '...' : firstSentence;
        }

        // Format genres as clean inline text instead of chunky boxes
        let genreText = '';
        if (activeItem.genres && Array.isArray(activeItem.genres) && activeItem.genres.length > 0) {
            genreText = activeItem.genres.slice(0, 2).map(g => typeof g === 'object' ? g.name : g).join(' • ');
        } else if (activeItem.genre_ids && Array.isArray(activeItem.genre_ids) && activeItem.genre_ids.length > 0) {
            genreText = activeItem.genre_ids.slice(0, 2).map(id => this.state.genres[id]).filter(Boolean).join(' • ');
        }

        // Proper Turkish grammar for season count ("4 Sezon", not "4 Sezonlar")
        const seasonsText = activeItem.number_of_seasons 
            ? `${activeItem.number_of_seasons} ${isTr ? 'Sezon' : (activeItem.number_of_seasons > 1 ? 'Seasons' : 'Season')}`
            : '';

        // Other picks as landscape (16:9) mini cards
        const otherPicks = this.state.spotlightPicks;
        const otherPicksHtml = otherPicks.map((pick, idx) => {
            const isActive = idx === this.state.spotlightActiveIndex;
            const pTitle = pick.original_title || pick.original_name || pick.title || pick.name || '';
            const pRating = (Number(pick.vote_average) || 0).toFixed(1);
            const pBg = pick.backdrop_path 
                ? (CONFIG.BASE_IMG + pick.backdrop_path) 
                : (pick.poster_path ? (CONFIG.BASE_IMG + pick.poster_path) : '');
            return `
                <div class="landscape-mini-thumb ${isActive ? 'active' : ''}" onclick="app.selectSpotlightPick(${idx})" title="${pTitle}">
                    <div class="mini-thumb-img-wrap" style="background-image: url('${pBg}');">
                        <div class="mini-thumb-overlay"></div>
                        ${Number(pick.vote_average) > 0 ? `<span class="mini-thumb-score"><i class="fas fa-star"></i> ${pRating}</span>` : ''}
                    </div>
                    <span class="mini-thumb-title">${pTitle}</span>
                </div>
            `;
        }).join('');

        // Title display: Use official transparent logo PNG if loaded, otherwise bold typography
        const titleHtml = activeItem.logo_path
            ? `<div class="spotlight-logo-wrap" onclick="app.playMovie(${activeItem.id}, '${mType}')">
                   <img src="https://image.tmdb.org/t/p/w500${activeItem.logo_path}" alt="${title}" class="spotlight-official-logo" onerror="this.style.display='none'; document.getElementById('spotlightFallbackTitle').style.display='block';">
                   <h2 id="spotlightFallbackTitle" class="spotlight-landscape-title" style="display: none;">${title}</h2>
               </div>`
            : `<h2 class="spotlight-landscape-title" onclick="app.playMovie(${activeItem.id}, '${mType}')">${title}</h2>`;

        section.innerHTML = `
            <div class="spotlight-landscape-hero">
                <!-- Full-Bleed Vivid Landscape Artwork -->
                <div class="spotlight-hero-artwork" style="background-image: url('${backdropUrl}');"></div>
                <div class="spotlight-hero-vignette"></div>

                <!-- Unified Hero Content Shell -->
                <div class="spotlight-hero-content">
                    <div class="spotlight-hero-left">
                        <!-- Top Badge Strip: Cohesive with Left Column -->
                        <div class="spotlight-hero-badge-row">
                            <div class="spotlight-pill-tag">
                                <i class="fas fa-bookmark"></i> <span>${t.spotlightBadge}</span>
                            </div>
                            <span class="spotlight-hero-type">${mType === 'tv' ? t.spotlightTypeTv : t.spotlightTypeMovie}</span>
                        </div>

                        ${titleHtml}

                        <!-- Clean Meta Row on a Single Crisp Baseline -->
                        <div class="spotlight-hero-meta">
                            ${numRating > 0 ? `<span class="hero-rating"><i class="fas fa-star"></i> ${rating}</span>` : ''}
                            ${year ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item">${year}</span>` : ''}
                            ${activeItem.runtime ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item">${this.formatMinutes(activeItem.runtime)}</span>` : ''}
                            ${seasonsText ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item">${seasonsText}</span>` : ''}
                            ${genreText ? `<span class="hero-meta-dot">•</span><span class="hero-meta-item hero-genres">${genreText}</span>` : ''}
                        </div>

                        ${briefDescription ? `<p class="spotlight-hero-tagline">${briefDescription}</p>` : ''}

                        <!-- Hero Action Buttons with Clean Responsive Hierarchy -->
                        <div class="spotlight-hero-actions">
                            <button class="hero-btn-play" onclick="app.playMovie(${activeItem.id}, '${mType}')">
                                <i class="fas fa-play"></i> <span>${t.spotlightWatchBtn}</span>
                            </button>
                            <div class="hero-secondary-actions">
                                <button class="hero-btn-shuffle" onclick="app.shuffleSpotlight(this)" title="${t.spotlightShuffleBtn}">
                                    <i class="fas fa-shuffle"></i> <span>${t.spotlightShuffleBtn}</span>
                                </button>
                                <button class="hero-btn-check" onclick="app.markSpotlightWatched(${activeItem.id}, '${mType}')" title="${t.spotlightWatchedBtn}">
                                    <i class="fas fa-check"></i> <span>${t.spotlightWatchedBtn}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Landscape Thumbnails of other random picks -->
                    ${otherPicks.length > 1 ? `
                        <div class="spotlight-hero-right">
                            <div class="hero-thumbs-header">
                                <span>${t.spotlightOtherPicks}</span>
                                <button class="hero-thumbs-refresh" onclick="app.renderWatchlistSpotlightBanner(true)" title="Yeni Seçimler">
                                    <i class="fas fa-rotate"></i>
                                </button>
                            </div>
                            <div class="hero-thumbs-row">
                                ${otherPicksHtml}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // If activeItem is missing backdrop or details or logo, fetch fresh details in background
        if (!activeItem.tagline || !activeItem.logo_path || !activeItem.genres || activeItem.genres.length === 0) {
            this.fetchSpotlightDetails(activeItem, mType, true);
        }
    }

    preloadAllSpotlightPicks(picks) {
        if (!picks || !Array.isArray(picks)) return;
        picks.forEach((item, idx) => {
            const mType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            // Preload existing backdrop
            const initialBg = item.backdrop_path 
                ? (CONFIG.HERO_IMG + item.backdrop_path) 
                : (item.poster_path ? (CONFIG.BASE_IMG + item.poster_path) : '');
            if (initialBg) {
                const img = new Image();
                img.src = initialBg;
            }
            // Fetch full TMDB details & logo if missing
            if (!item.tagline || !item.logo_path || !item.genres || item.genres.length === 0) {
                this.fetchSpotlightDetails(item, mType, idx === this.state.spotlightActiveIndex);
            }
        });
    }

    async fetchSpotlightDetails(item, mType, allowRerender = true) {
        if (!item || !item.id) return;
        try {
            // Always fetch with language=en-US and include_image_language=en,null to keep covers, backdrops, and titles in original language
            const res = await fetch(`https://api.themoviedb.org/3/${mType}/${item.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US&append_to_response=images&include_image_language=en,null`);
            if (!res.ok) return;
            const data = await res.json();
            
            item.tagline = data.tagline || item.tagline;
            item.backdrop_path = data.backdrop_path || item.backdrop_path;
            item.genres = data.genres || item.genres;
            item.runtime = data.runtime || item.runtime;
            item.number_of_seasons = data.number_of_seasons || item.number_of_seasons;
            if (data.vote_average) item.vote_average = data.vote_average;
            if (data.overview) item.overview = data.overview;
            item.original_title = data.original_title || item.original_title;
            item.original_name = data.original_name || item.original_name;

            // Preload fresh original backdrop image into browser cache
            if (data.backdrop_path) {
                const bImg = new Image();
                bImg.src = CONFIG.HERO_IMG + data.backdrop_path;
            }

            // Always select original language or English logo, never localized Turkish translation
            const origLang = data.original_language || item.original_language || 'en';
            const logos = data.images?.logos || [];
            if (logos.length > 0) {
                const origLogo = logos.find(l => l.iso_639_1 === origLang);
                const enLogo = logos.find(l => l.iso_639_1 === 'en');
                const nullLogo = logos.find(l => !l.iso_639_1);
                const nonTrLogo = logos.find(l => l.iso_639_1 && l.iso_639_1 !== 'tr');
                const bestLogo = (origLang !== 'tr' ? (origLogo || enLogo || nullLogo || nonTrLogo) : origLogo) || logos[0];
                if (bestLogo && bestLogo.file_path) {
                    item.logo_path = bestLogo.file_path;
                    const lImg = new Image();
                    lImg.src = 'https://image.tmdb.org/t/p/w500' + bestLogo.file_path;
                }
            }

            // If this item is currently displayed, smoothly re-render
            if (allowRerender) {
                const activePick = this.state.spotlightPicks?.[this.state.spotlightActiveIndex];
                if (activePick && Number(activePick.id) === Number(item.id)) {
                    this.renderWatchlistSpotlightBanner(false);
                }
            }
        } catch (e) {
            console.warn('Error fetching spotlight details:', e);
        }
    }

    selectSpotlightPick(index) {
        if (!this.state.spotlightPicks || !this.state.spotlightPicks[index]) return;
        if (this.state.spotlightActiveIndex === index) return;

        const hero = document.querySelector('.spotlight-landscape-hero');
        const artwork = hero?.querySelector('.spotlight-hero-artwork');
        const leftContent = hero?.querySelector('.spotlight-hero-left');

        // Immediate visual feedback on thumbnails
        const thumbs = hero?.querySelectorAll('.landscape-mini-thumb');
        thumbs?.forEach((t, i) => t.classList.toggle('active', i === index));

        this.state.spotlightActiveIndex = index;

        if (hero && artwork && leftContent) {
            // Smoothly fade out current artwork and content
            artwork.classList.add('spotlight-fade-out');
            leftContent.classList.add('spotlight-fade-out');

            setTimeout(() => {
                this.renderWatchlistSpotlightBanner(false);
                const newArtwork = document.querySelector('.spotlight-hero-artwork');
                const newLeft = document.querySelector('.spotlight-hero-left');
                if (newArtwork) {
                    newArtwork.classList.add('spotlight-fade-in');
                    setTimeout(() => newArtwork.classList.remove('spotlight-fade-in'), 300);
                }
                if (newLeft) {
                    newLeft.classList.add('spotlight-fade-in');
                    setTimeout(() => newLeft.classList.remove('spotlight-fade-in'), 300);
                }
            }, 130);
        } else {
            this.renderWatchlistSpotlightBanner(false);
        }
    }

    shuffleSpotlight(btn) {
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 600);
            }
        }
        if (!this.state.spotlightPicks || this.state.spotlightPicks.length <= 1) {
            this.renderWatchlistSpotlightBanner(true);
            return;
        }
        const nextIdx = (this.state.spotlightActiveIndex + 1) % this.state.spotlightPicks.length;
        this.selectSpotlightPick(nextIdx);
    }

    async markSpotlightWatched(id, mediaType) {
        const isTr = this.state.settings.language === 'tr';
        await this.moveToWatched(id, mediaType);
        this.showToast(isTr ? '✓ Yapım İzlediklerim listenize taşındı!' : '✓ Moved to your Watched list!', 'fa-check-circle');
    }

    renderRecentlyPlayed() {
        const section = document.getElementById('recentlyWatchedSection');
        const container = document.getElementById('recentlyWatchedResults');
        if (!section || !container) return;

        if (!this.state.recentlyPlayed || this.state.recentlyPlayed.length === 0) {
            section.style.display = 'none';
            return;
        }

        if (this.state.isSearching || this.state.currentCatalog) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        container.innerHTML = this.state.recentlyPlayed.map(movie => {
            const badgeHtml = movie.type === 'tv' ? `<div class="movie-badge" style="background:var(--primary);color:white;font-size:0.68rem;padding:2px 7px;">S${movie.season} E${movie.episode}</div>` : '';
            return `
                <div class="movie-card recent-movie-card" onclick="app.playMovie(${movie.id}, '${movie.type}')">
                    <div class="poster-wrapper">
                        ${badgeHtml}
                        <img class="movie-poster" src="${CONFIG.BASE_IMG + movie.poster_path}" alt="${movie.title}" loading="lazy">
                        <div class="movie-info">
                            <div class="movie-title">${movie.title}</div>
                            <div class="movie-meta">
                                <span><i class="fas fa-play"></i> ${this.state.settings.language === 'tr' ? 'Kaldığın Yer' : 'Continue'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="recent-progress-bar">
                        <div class="recent-progress-fill"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}
