// Universes (franchises) page and modal
// These methods are attached to CineTrack in js/app.js.
class UniversesMethods {
    setUniverseFilter(filter, btn) {
        this.state.universeFilter = filter;
        document.querySelectorAll('.universe-pills-nav .u-pill').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderUniversesPage(false);
    }

    handleUniverseSearch(query) {
        this.state.universeSearchQuery = (query || '').trim().toLowerCase();
        this.renderUniversesPage(false);
    }

    async renderUniversesPage(showLoader = true) {
        const grid = document.getElementById('universesGrid');
        if (!grid) return;

        if (showLoader && !grid.children.length) {
            grid.innerHTML = `<div class="loader-spinner center"></div>`;
        }

        const isTr = this.state.settings.language === 'tr';

        // 1. Proactively deep scan movies in watched list that are missing collection info
        const moviesToScan = this.state.watched.filter(m =>
            (m.media_type === 'movie' || !m.media_type) &&
            m.belongs_to_collection === undefined &&
            !m._deepScanned
        );
        if (moviesToScan.length > 0) {
            const batch = moviesToScan.slice(0, 30);
            await Promise.all(batch.map(async (m) => {
                try {
                    const res = await fetch(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
                    const details = await res.json();
                    const index = this.state.watched.findIndex(w => Number(w.id) === Number(m.id));
                    if (index > -1) {
                        this.state.watched[index] = { ...this.state.watched[index], ...details, _deepScanned: true };
                    }
                } catch (e) {
                    m._deepScanned = true;
                }
            }));
            this.saveMovieData();
        }

        // 2. Discover collection IDs from watched movies
        const seenColIds = new Set();
        const collectionIds = [];
        this.state.watched.forEach(m => {
            if (m.belongs_to_collection && m.belongs_to_collection.id && !seenColIds.has(m.belongs_to_collection.id)) {
                seenColIds.add(m.belongs_to_collection.id);
                collectionIds.push(m.belongs_to_collection.id);
            }
        });

        // 3. Fetch full collection details for all discovered collections in parallel
        if (collectionIds.length > 0) {
            await Promise.all(collectionIds.map(id => this.fetchCollectionDetails(id)));
        }

        // 4. Build user franchise objects with actual items from cache
        const userFranchises = [];
        const today = new Date();
        for (const colId of collectionIds) {
            const colData = this.state.collectionsCache[colId];
            if (!colData || !colData.parts || colData.parts.length === 0) continue;

            const releasedParts = colData.parts.filter(p => p.release_date && new Date(p.release_date) <= today);
            const partsToUse = releasedParts.length > 0 ? releasedParts : colData.parts;

            const items = partsToUse.map(p => ({
                id: p.id,
                media_type: 'movie',
                title: p.title || p.original_title,
                year: (p.release_date || '').substring(0, 4),
                release_date: p.release_date,
                score: Math.round((p.vote_average || 0) * 10) / 10,
                poster_path: p.poster_path,
                backdrop_path: p.backdrop_path,
                overview: p.overview || '',
                tag: isTr ? 'Film' : 'Movie'
            }));

            userFranchises.push({
                id: `col-${colId}`,
                colId: colId,
                category: 'franchise',
                name: colData.name,
                nameEn: colData.name,
                creator: isTr ? 'Film Serisi' : 'Movie Franchise',
                tagline: colData.overview || (isTr ? `${colData.name} serisinin tüm yapımları.` : `All titles from ${colData.name}.`),
                accent: '#3b82f6',
                icon: 'fa-film',
                badge: isTr ? 'İzlediğim Seri' : 'Watched Franchise',
                backdrop: colData.backdrop_path,
                poster_path: colData.poster_path,
                items: items,
                isFranchise: true
            });
        }

        // 5. Combine curated universes and user franchises
        const universes = (window.CURATED_UNIVERSES || []).map(u => ({
            ...u,
            items: [...(u.items || [])]
        }));
        const combinedUniverses = [...universes, ...userFranchises];

        // 6. Robust watched matching (by ID, Title, and TV episodes)
        const allWatchedIds = new Set(this.state.watched.map(w => Number(w.id)));
        const allWatchedTitles = new Set(
            this.state.watched.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );

        const isItemWatched = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchedIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            if (t && allWatchedTitles.has(t)) return true;
            if ((it.media_type === 'tv' || it.type === 'tv') && this.state.watchedEpisodes && this.state.watchedEpisodes[it.id]) {
                const eps = Object.values(this.state.watchedEpisodes[it.id]);
                if (eps.some(Boolean)) return true;
            }
            return false;
        };

        // 7. Overall stats across all universes
        let totalWatchedProductions = 0;
        let completedUniversesCount = 0;

        combinedUniverses.forEach(u => {
            const items = u.items || [];
            if (items.length > 0) {
                const watchedInU = items.filter(it => isItemWatched(it));
                totalWatchedProductions += watchedInU.length;
                if (watchedInU.length === items.length) {
                    completedUniversesCount++;
                }
            }
        });

        const statsStrip = document.getElementById('universesStatsStrip');
        if (statsStrip) {
            statsStrip.innerHTML = `
                <div class="u-stat-card">
                    <div class="u-stat-icon" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd;">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="u-stat-info">
                        <span class="u-stat-num">${combinedUniverses.length}</span>
                        <span class="u-stat-lbl">${isTr ? 'Koleksiyon' : 'Collections'}</span>
                    </div>
                </div>
                <div class="u-stat-card">
                    <div class="u-stat-icon" style="background: rgba(34, 197, 94, 0.2); color: #4ade80;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="u-stat-info">
                        <span class="u-stat-num">${totalWatchedProductions}</span>
                        <span class="u-stat-lbl">${isTr ? 'İzlenen' : 'Watched'}</span>
                    </div>
                </div>
                <div class="u-stat-card">
                    <div class="u-stat-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="u-stat-info">
                        <span class="u-stat-num">${completedUniversesCount}</span>
                        <span class="u-stat-lbl">${isTr ? 'Tamamlanan' : 'Completed'}</span>
                    </div>
                </div>
            `;
        }

        // 8. Apply category filter
        const catFilter = this.state.universeFilter || 'all';
        let filtered = combinedUniverses.filter(u => {
            if (catFilter === 'all') return true;
            return u.category === catFilter;
        });

        // 9. Apply search filter
        const q = this.state.universeSearchQuery;
        if (q) {
            filtered = filtered.filter(u => {
                const name = (u.name || '').toLowerCase();
                const nameEn = (u.nameEn || '').toLowerCase();
                const creator = (u.creator || '').toLowerCase();
                const tagline = (u.tagline || '').toLowerCase();
                const hasItemMatch = (u.items || []).some(it => (it.title || '').toLowerCase().includes(q));
                return name.includes(q) || nameEn.includes(q) || creator.includes(q) || tagline.includes(q) || hasItemMatch;
            });
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 4rem 1rem;">
                    <i class="fas fa-search" style="font-size: 2.5rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; color: var(--text-muted);">
                        ${isTr ? 'Aradığınız kriterlere uygun evren veya koleksiyon bulunamadı.' : 'No universes or collections found matching your search.'}
                    </p>
                </div>
            `;
            return;
        }

        // 10. Render Cards
        grid.innerHTML = filtered.map(u => {
            const items = u.items || [];
            const total = items.length;
            if (total === 0) return '';

            const watchedItems = items.filter(it => isItemWatched(it));
            const watchedCount = watchedItems.length;
            const percent = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
            const isCompleted = percent === 100 && total > 0;

            const bgImg = u.backdrop ? (CONFIG.BASE_IMG + u.backdrop) : (items[0] && items[0].backdrop_path ? CONFIG.BASE_IMG + items[0].backdrop_path : (u.poster_path ? CONFIG.BASE_IMG + u.poster_path : ''));
            const accent = u.accent || '#8b5cf6';
            const icon = u.icon || 'fa-layer-group';
            const displayName = isTr ? (u.name || u.nameEn) : (u.nameEn || u.name);
            const displayTagline = isTr ? (u.tagline || u.taglineEn) : (u.taglineEn || u.tagline);

            // Mini posters preview (first 5)
            const previewItems = items.slice(0, 5);
            const remainingCount = total - previewItems.length;

            return `
                <div class="universe-card" 
                     style="--u-accent: ${accent}; --u-accent-glow: ${accent}44;" 
                     onclick="app.openUniverseModal('${u.id}')">
                    <div class="u-card-backdrop" style="background-image: url('${bgImg}')"></div>
                    <div class="u-card-overlay"></div>
                    
                    <div class="u-card-content">
                        <div>
                            <div class="u-card-top">
                                <span class="u-badge">
                                    <i class="fas ${icon}"></i> ${u.badge || (u.category === 'director' ? 'Yönetmen' : 'Evren')}
                                </span>
                                ${isCompleted ? `
                                    <span class="u-trophy-badge">
                                        <i class="fas fa-trophy"></i> ${isTr ? 'Tamamlandı' : 'Completed'}
                                    </span>
                                ` : ''}
                            </div>

                            <div class="u-card-middle">
                                <h3 class="u-card-title">${displayName}</h3>
                                <div class="u-card-creator">
                                    <i class="fas fa-user-pen" style="font-size: 0.75rem;"></i> ${u.creator || ''}
                                </div>
                                <p class="u-card-tagline">${displayTagline || ''}</p>
                            </div>
                        </div>

                        <div>
                            <div class="u-card-progress-box">
                                <div class="u-progress-header">
                                    <span class="u-progress-count">${watchedCount} / ${total} ${isTr ? 'İzlendi' : 'Watched'}</span>
                                    <span class="u-progress-percent">%${percent}</span>
                                </div>
                                <div class="u-progress-bar-bg">
                                    <div class="u-progress-bar-fill" style="width: ${percent}%;"></div>
                                </div>
                            </div>

                            <div class="u-posters-strip">
                                ${previewItems.map(item => {
                const isW = isItemWatched(item);
                const posterUrl = item.poster_path ? (CONFIG.BASE_IMG + item.poster_path) : '';
                return `
                                        <div class="u-mini-poster ${isW ? 'watched' : ''}" title="${item.title}">
                                            ${posterUrl ? `<img src="${posterUrl}" alt="${item.title}" loading="lazy">` : ''}
                                        </div>
                                    `;
            }).join('')}
                                ${remainingCount > 0 ? `
                                    <div class="u-posters-more">+${remainingCount}</div>
                                ` : ''}
                            </div>

                            <div class="u-card-bottom">
                                <span class="u-explore-btn">
                                    ${isTr ? 'Koleksiyonu İncele' : 'Explore Collection'} <i class="fas fa-arrow-right"></i>
                                </span>
                                <span class="u-total-count-tag">
                                    ${total} ${isTr ? 'Yapım' : 'Titles'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async openUniverseModal(universeId) {
        const modal = document.getElementById('universeDetailModal');
        const content = document.getElementById('universeModalContent');
        if (!modal || !content) return;

        const isTr = this.state.settings.language === 'tr';
        this.state.activeUniverseModalId = universeId;
        this.state.activeModalTag = 'all';

        // 1. Find the universe
        let universe = (window.CURATED_UNIVERSES || []).find(u => u.id === universeId);

        // If not found in curated, check dynamic franchises
        if (!universe && universeId.startsWith('col-')) {
            const colId = parseInt(universeId.replace('col-', ''));
            const colData = await this.fetchCollectionDetails(colId);
            if (colData) {
                const today = new Date();
                const releasedParts = (colData.parts || []).filter(p => p.release_date && new Date(p.release_date) <= today);
                const partsToUse = releasedParts.length > 0 ? releasedParts : (colData.parts || []);

                universe = {
                    id: universeId,
                    colId: colId,
                    category: 'franchise',
                    name: colData.name,
                    nameEn: colData.name,
                    creator: isTr ? 'Film Serisi' : 'Movie Franchise',
                    tagline: colData.overview || (isTr ? `${colData.name} serisinin tüm yapımları.` : `All titles in ${colData.name}.`),
                    accent: '#3b82f6',
                    icon: 'fa-film',
                    badge: isTr ? 'Film Serisi' : 'Movie Franchise',
                    backdrop: colData.backdrop_path,
                    items: partsToUse.map(p => ({
                        id: p.id,
                        media_type: 'movie',
                        title: p.title,
                        year: (p.release_date || '').substring(0, 4),
                        release_date: p.release_date,
                        score: Math.round((p.vote_average || 0) * 10) / 10,
                        poster_path: p.poster_path,
                        backdrop_path: p.backdrop_path,
                        overview: p.overview,
                        tag: isTr ? 'Film' : 'Movie'
                    }))
                };
            }
        }

        if (!universe) return;

        this.currentModalUniverse = universe;
        this.renderModalContent();

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    renderModalContent() {
        const content = document.getElementById('universeModalContent');
        if (!content || !this.currentModalUniverse) return;

        const universe = this.currentModalUniverse;
        const isTr = this.state.settings.language === 'tr';
        const allWatchedIds = new Set(this.state.watched.map(w => Number(w.id)));
        const allWatchedTitles = new Set(
            this.state.watched.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );
        const allWatchlistIds = new Set(this.state.watchlist.map(w => Number(w.id)));
        const allWatchlistTitles = new Set(
            this.state.watchlist.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );

        const isItemWatched = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchedIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            if (t && allWatchedTitles.has(t)) return true;
            if ((it.media_type === 'tv' || it.type === 'tv') && this.state.watchedEpisodes && this.state.watchedEpisodes[it.id]) {
                const eps = Object.values(this.state.watchedEpisodes[it.id]);
                if (eps.some(Boolean)) return true;
            }
            return false;
        };

        const isItemWatchlist = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchlistIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            return !!(t && allWatchlistTitles.has(t));
        };

        const items = universe.items || [];
        const total = items.length;
        const watchedCount = items.filter(it => isItemWatched(it)).length;
        const unwatchedNotWatchlist = items.filter(it => !isItemWatched(it) && !isItemWatchlist(it));
        const unwatchedNotWatchlistCount = unwatchedNotWatchlist.length;
        const missingCount = total - watchedCount;
        const percent = total > 0 ? Math.round((watchedCount / total) * 100) : 0;

        const bgImg = universe.backdrop ? (CONFIG.BASE_IMG + universe.backdrop) : '';
        const accent = universe.accent || '#8b5cf6';
        const displayName = isTr ? (universe.name || universe.nameEn) : (universe.nameEn || universe.name);
        const displayTagline = isTr ? (universe.tagline || universe.taglineEn) : (universe.taglineEn || universe.tagline);

        // Tags for filtering inside the modal
        const distinctTags = [...new Set(items.map(it => it.tag).filter(Boolean))];

        // Filter modal items based on activeModalTag
        const currentTag = this.state.activeModalTag || 'all';
        let displayedItems = items;
        if (currentTag === 'watched') {
            displayedItems = items.filter(it => isItemWatched(it));
        } else if (currentTag === 'unwatched') {
            displayedItems = items.filter(it => !isItemWatched(it));
        } else if (currentTag !== 'all') {
            displayedItems = items.filter(it => it.tag === currentTag);
        }

        content.innerHTML = `
            <div class="u-modal-hero" style="--modal-accent: ${accent}; --modal-accent-glow: ${accent}44;">
                <div class="u-modal-hero-bg" style="background-image: url('${bgImg}')"></div>
                <div class="u-modal-hero-gradient"></div>

                <div class="u-modal-hero-content">
                    <span class="u-badge" style="margin-bottom: 0.8rem;">
                        <i class="fas ${universe.icon || 'fa-layer-group'}"></i> ${universe.badge || ''}
                    </span>
                    <h2 class="u-modal-title">${displayName}</h2>
                    <div class="u-modal-subtitle">
                        <i class="fas fa-user-pen"></i> ${universe.creator || ''}
                    </div>
                    <p class="u-modal-desc">${displayTagline || ''}</p>

                    <div class="u-modal-hero-bar">
                        <div class="u-modal-progress-strip">
                            <div>
                                <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 3px;">
                                    ${watchedCount} / ${total} ${isTr ? 'İzlendi' : 'Watched'} (%${percent})
                                </div>
                                <div class="u-progress-bar-bg" style="width: 140px; height: 6px;">
                                    <div class="u-progress-bar-fill" style="width: ${percent}%;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="u-modal-actions">
                            ${watchedCount === total && total > 0 ? `
                                <div class="u-trophy-badge" style="padding: 0.65rem 1.3rem; font-size: 0.85rem;">
                                    <i class="fas fa-trophy"></i> <span>${isTr ? 'Tüm Seri Tamamlandı! 🏆' : 'Entire Series Completed! 🏆'}</span>
                                </div>
                            ` : unwatchedNotWatchlistCount > 0 ? `
                                <button id="addMissingWatchlistBtn" class="u-action-btn u-action-btn-primary" 
                                        onclick="app.addMissingUniverseToWatchlist('${universe.id}')">
                                    <i class="fas fa-plus-circle"></i> 
                                    <span>${isTr ? `Eksikleri İzleneceklere Ekle (${unwatchedNotWatchlistCount})` : `Add Missing to Watchlist (${unwatchedNotWatchlistCount})`}</span>
                                </button>
                            ` : `
                                <div class="u-action-btn is-done">
                                    <i class="fas fa-check-double"></i> 
                                    <span>${isTr ? 'Tüm Eksikler İzleneceklerde ✓' : 'All Missing in Watchlist ✓'}</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>

            <div class="u-modal-body" style="--modal-accent: ${accent}; --modal-accent-glow: ${accent}44;">
                <div class="u-modal-controls">
                    <div class="u-modal-filter-pills">
                        <button class="u-m-pill ${currentTag === 'all' ? 'active' : ''}" 
                                onclick="app.setModalTagFilter('all')">
                            ${isTr ? 'Tümü' : 'All'} (${total})
                        </button>
                        <button class="u-m-pill ${currentTag === 'unwatched' ? 'active' : ''}" 
                                onclick="app.setModalTagFilter('unwatched')">
                            ${isTr ? 'İzlenmeyenler' : 'Unwatched'} (${missingCount})
                        </button>
                        <button class="u-m-pill ${currentTag === 'watched' ? 'active' : ''}" 
                                onclick="app.setModalTagFilter('watched')">
                            ${isTr ? 'İzlenenler' : 'Watched'} (${watchedCount})
                        </button>
                        ${distinctTags.map(tag => `
                            <button class="u-m-pill ${currentTag === tag ? 'active' : ''}" 
                                    onclick="app.setModalTagFilter('${tag}')">
                                ${tag}
                            </button>
                        `).join('')}
                    </div>

                    <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">
                        ${displayedItems.length} ${isTr ? 'Yapım Gösteriliyor' : 'Titles Shown'}
                    </div>
                </div>

                <div class="u-modal-items-grid">
                    ${displayedItems.map(item => {
            const isWatched = isItemWatched(item);
            const inWatchlist = isItemWatchlist(item);
            const posterUrl = item.poster_path ? (CONFIG.BASE_IMG + item.poster_path) : '';
            const mType = item.media_type || item.type || 'movie';

            return `
                            <div class="u-item-card">
                                <div class="u-item-poster-wrap">
                                    ${posterUrl ? `<img src="${posterUrl}" alt="${item.title}" loading="lazy">` : ''}
                                    ${isWatched ? `
                                        <div class="u-item-watched-badge">
                                            <i class="fas fa-check"></i> ${isTr ? 'İzlendi' : 'Watched'}
                                        </div>
                                    ` : ''}
                                    ${item.tag ? `
                                        <div class="u-item-tag-badge">${item.tag}</div>
                                    ` : ''}

                                    <div class="u-item-overlay-actions">
                                        <button class="u-play-action-btn" 
                                                onclick="app.playFromUniverseModal(${item.id}, '${mType}')" 
                                                title="${isTr ? 'İzle' : 'Play'}">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="u-watchlist-action-btn" 
                                                onclick="app.toggleUniverseWatchlist(event, ${item.id}, '${mType}')">
                                            <i class="fas ${inWatchlist ? 'fa-check' : 'fa-bookmark'}"></i> 
                                            ${inWatchlist ? (isTr ? 'Listede' : 'Saved') : (isTr ? 'İzlenecek' : 'Watchlist')}
                                        </button>
                                    </div>
                                </div>

                                <div class="u-item-details">
                                    <div class="u-item-title" title="${item.title}">${item.title}</div>
                                    <div class="u-item-meta">
                                        <span>${item.year || ''}</span>
                                        ${item.score ? `
                                            <span class="u-item-score">
                                                <i class="fas fa-star"></i> ${item.score}
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    setModalTagFilter(tag) {
        this.state.activeModalTag = tag;
        this.renderModalContent();
    }

    playFromUniverseModal(id, type) {
        this.closeUniverseModal();
        this.playMovie(id, type);
    }

    async toggleUniverseWatchlist(e, id, type) {
        e.stopPropagation();
        await this.toggleList('watchlist', id, type);
        this.renderModalContent();
    }

    async addMissingUniverseToWatchlist(universeId) {
        if (!this.currentModalUniverse) return;
        const universe = this.currentModalUniverse;
        const items = universe.items || [];
        const isTr = this.state.settings.language === 'tr';

        const allWatchedIds = new Set(this.state.watched.map(w => Number(w.id)));
        const allWatchedTitles = new Set(
            this.state.watched.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );
        const allWatchlistIds = new Set(this.state.watchlist.map(w => Number(w.id)));
        const allWatchlistTitles = new Set(
            this.state.watchlist.map(w => (w.title || w.original_title || w.name || w.original_name || '').trim().toLowerCase()).filter(Boolean)
        );

        const isItemWatched = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchedIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            if (t && allWatchedTitles.has(t)) return true;
            if ((it.media_type === 'tv' || it.type === 'tv') && this.state.watchedEpisodes && this.state.watchedEpisodes[it.id]) {
                const eps = Object.values(this.state.watchedEpisodes[it.id]);
                if (eps.some(Boolean)) return true;
            }
            return false;
        };

        const isItemWatchlist = (it) => {
            if (!it) return false;
            const numId = Number(it.id);
            if (!isNaN(numId) && allWatchlistIds.has(numId)) return true;
            const t = (it.title || it.name || '').trim().toLowerCase();
            return !!(t && allWatchlistTitles.has(t));
        };

        const missing = items.filter(it => !isItemWatched(it) && !isItemWatchlist(it));
        const btn = document.getElementById('addMissingWatchlistBtn');

        if (missing.length === 0) {
            if (btn) {
                btn.className = 'u-action-btn is-done';
                btn.innerHTML = `<i class="fas fa-check-double"></i> <span>${isTr ? 'Tüm Eksikler Zaten Listede!' : 'All Missing Already in Watchlist!'}</span>`;
            }
            return;
        }

        // 1. Immediate visual response: animated loading state
        if (btn) {
            btn.classList.add('is-loading');
            btn.style.pointerEvents = 'none';
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${isTr ? 'İzleneceklere Ekleniyor...' : 'Adding to Watchlist...'}</span>`;
        }

        // Slight deliberate delay (320ms) so user distinctly sees and feels the action
        await new Promise(r => setTimeout(r, 320));

        // 2. Add missing items to watchlist & persist
        const missingIdsSet = new Set(missing.map(m => Number(m.id)));
        for (const it of missing) {
            this.state.watchlist.push({
                id: it.id,
                title: it.title || it.name,
                name: it.name || it.title,
                media_type: it.media_type || it.type || 'movie',
                poster_path: it.poster_path,
                backdrop_path: it.backdrop_path,
                release_date: it.release_date || '',
                vote_average: it.score || it.vote_average || 0
            });
        }

        this.saveMovieData();

        // 3. Immediately update and highlight the cards inside the modal grid
        const grid = document.querySelector('#universeModalContent .u-modal-items-grid');
        if (grid) {
            const cards = grid.querySelectorAll('.u-item-card');
            cards.forEach(card => {
                const watchlistBtn = card.querySelector('.u-watchlist-action-btn');
                if (watchlistBtn) {
                    const onclickAttr = watchlistBtn.getAttribute('onclick') || '';
                    const match = onclickAttr.match(/toggleUniverseWatchlist\(event,\s*(\d+)/);
                    if (match && missingIdsSet.has(Number(match[1]))) {
                        card.classList.add('just-added');
                        watchlistBtn.innerHTML = `<i class="fas fa-check"></i> ${isTr ? 'Listede' : 'Saved'}`;
                        watchlistBtn.classList.add('active');
                    }
                }
            });
        }

        // 4. Update button to celebration Success State with glowing bounce
        if (btn) {
            btn.classList.remove('is-loading');
            btn.classList.add('is-success');
            btn.innerHTML = `<i class="fas fa-check-circle" style="font-size: 1.1rem;"></i> <span>${isTr ? `${missing.length} Yapım Eklendi! ✓` : `${missing.length} Titles Added! ✓`}</span>`;
        }

        // 5. Toast notification
        this.showToast(
            isTr ? `🎉 ${missing.length} yeni yapım başarıyla İzlenecekler listenize eklendi!` : `🎉 ${missing.length} titles added to Watchlist!`,
            'fa-check-circle'
        );

        // 6. After 1.6s, smoothly transform button into final completed status badge
        setTimeout(() => {
            if (btn && btn.parentElement) {
                btn.className = 'u-action-btn is-done';
                btn.style.pointerEvents = 'default';
                btn.onclick = null;
                btn.innerHTML = `<i class="fas fa-check-double"></i> <span>${isTr ? 'Tüm Eksikler İzleneceklerde ✓' : 'All Missing in Watchlist ✓'}</span>`;
            }
            this.renderUniversesPage(false);
        }, 1600);
    }

    closeUniverseModal() {
        const modal = document.getElementById('universeDetailModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
        this.state.activeUniverseModalId = null;
    }

    async fetchCollectionDetails(id) {
        if (this.state.collectionsCache[id]) return this.state.collectionsCache[id];

        // Force English for collection names as requested (Original/English)
        try {
            const res = await fetch(`https://api.themoviedb.org/3/collection/${id}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
            const data = await res.json();
            // Sort parts by release date
            if (data.parts) {
                data.parts.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
            }
            this.state.collectionsCache[id] = data;
            return data;
        } catch (e) {
            console.error('Collection detail fetch error:', e);
            return null;
        }
    }
}
