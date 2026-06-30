const MainApp = {
    initialized: false,
    CART_STORAGE_KEY: 'upf_cart_v1',
    MOBILE_BREAKPOINT_QUERY: '(max-width: 768px)',
    MOBILE_TOP_THRESHOLD: 2,
    MOBILE_HIDE_TRIGGER: 72,

    pulseHeroButton(button) {
        if (!button) return;
        button.classList.remove('is-pressed');
        void button.offsetWidth;
        button.classList.add('is-pressed');
        window.setTimeout(() => {
            button.classList.remove('is-pressed');
        }, 180);
    },

    closeEditorSheet() {
        if (window.Editor && typeof window.Editor.closeToolsSheet === 'function') {
            window.Editor.closeToolsSheet();
        }
    },

    hasElement(id) {
        return Boolean(document.getElementById(id));
    },

    normalizeCartQty(value) {
        const qty = Number(value);
        return Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    },

    getCartItemsCountFromStorage() {
        try {
            const raw = window.localStorage.getItem(this.CART_STORAGE_KEY);
            if (!raw) return 0;

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return 0;

            return parsed.reduce((sum, entry) => sum + this.normalizeCartQty(entry?.quantity), 0);
        } catch (error) {
            return 0;
        }
    },

    syncCartBadges() {
        const count = this.getCartItemsCountFromStorage();
        document.querySelectorAll('[data-cart-count]').forEach((badge) => {
            badge.textContent = String(count);
            badge.classList.toggle('hidden', count < 1);
        });
    },

    openEditorCartPanel() {
        const cartPanelId = 'mobile-panel-order';
        const cartPanelEl = document.getElementById(cartPanelId);
        if (!cartPanelEl) return false;

        // Always switch panels via DOM as a reliable fallback.
        document.querySelectorAll('.tool-panel').forEach((panel) => {
            panel.classList.toggle('is-active', panel.id === cartPanelId);
        });
        document.querySelectorAll('.mobile-tools-tab[data-mobile-panel]').forEach((tab) => {
            const isActive = tab.getAttribute('data-mobile-panel') === cartPanelId;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            const toolsSheet = document.querySelector('.editor-tools');
            const backdrop = document.getElementById('editor-tools-backdrop');
            const openButton = document.getElementById('open-editor-sheet-btn');
            toolsSheet?.classList.add('is-open');
            backdrop?.classList.add('is-open');
            openButton?.setAttribute('aria-expanded', 'true');
            document.body.classList.add('editor-sheet-open');
        }

        if (window.Editor && typeof window.Editor.activateMobilePanel === 'function') {
            try {
                this.closeEditorSheet();
                window.Editor.activateMobilePanel(cartPanelId);

                if (typeof window.Editor.openToolsSheet === 'function') {
                    window.Editor.openToolsSheet();
                }
            } catch (error) {
                console.warn('Failed to open cart panel via Editor API, using fallback.', error);
            }
        }

        window.UI?.smoothScrollTo('constructor');
        return true;
    },

    openCartFromAnywhere() {
        if (window.Catalog && typeof window.Catalog.openCartModal === 'function') {
            window.Catalog.openCartModal();
            return;
        }

        if (this.hasElement('constructor') && this.openEditorCartPanel()) {
            return;
        }
    },

    navigateWithPulse(button, url) {
        this.pulseHeroButton(button);
        window.setTimeout(() => {
            window.location.href = url;
        }, 160);
    },

    setupMobileHeaderVisibility() {
        const updateHeaderState = () => {
            const isMobile = window.matchMedia(this.MOBILE_BREAKPOINT_QUERY).matches;
            if (!isMobile) {
                document.body.classList.remove('mobile-nav-hidden');
                return;
            }

            const isAtTop = window.scrollY <= this.MOBILE_TOP_THRESHOLD;
            if (isAtTop) {
                document.body.classList.remove('mobile-nav-hidden');
                return;
            }

            if (document.body.classList.contains('mobile-nav-hidden')) {
                return;
            }

            if (window.scrollY >= this.MOBILE_HIDE_TRIGGER) {
                document.body.classList.add('mobile-nav-hidden');
            }
        };

        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', updateHeaderState, { passive: true });
        updateHeaderState();
    },

    setupHeroStackedShowcase() {
        const showcase = document.querySelector('.stacked-showcase');
        if (!showcase) return;

        const cards = Array.from(showcase.querySelectorAll('.stacked-card'));
        const prevButton = showcase.querySelector('[data-stacked-nav="prev"]');
        const nextButton = showcase.querySelector('[data-stacked-nav="next"]');
        if (cards.length < 3 || !prevButton || !nextButton) return;

        const desktopQuery = window.matchMedia('(min-width: 769px)');
        let isAnimating = false;
        const buildEditorUrl = (productId, variantId) => {
            const params = new URLSearchParams({
                panel: 'media',
                product: productId
            });
            if (variantId) {
                params.set('variant', variantId);
            }
            return `editor.html?${params.toString()}`;
        };
        const openCardEditor = (card) => {
            if (!card || !card.classList.contains('stacked-card--front')) return;
            const productId = card.getAttribute('data-editor-product');
            if (!productId) return;
            const variantId = card.getAttribute('data-editor-variant') || '';
            window.location.href = buildEditorUrl(productId, variantId);
        };

        const getCardIndexByClass = (className) => cards.findIndex((card) => card.classList.contains(className));
        let frontIndex = getCardIndexByClass('stacked-card--front');
        if (!Number.isInteger(frontIndex) || frontIndex < 0 || frontIndex >= cards.length) {
            frontIndex = 0;
        }

        const getCardByPosition = () => ({
            front: frontIndex,
            left: (frontIndex - 1 + cards.length) % cards.length,
            right: (frontIndex + 1) % cards.length
        });

        const applyPositions = () => {
            const cardByPosition = getCardByPosition();
            cards.forEach((card, index) => {
                card.classList.remove('stacked-card--front', 'stacked-card--left', 'stacked-card--right');
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
                if (index === cardByPosition.front) {
                    card.classList.add('stacked-card--front');
                    card.style.display = '';
                    card.setAttribute('aria-hidden', 'false');
                } else if (index === cardByPosition.left) {
                    card.classList.add('stacked-card--left');
                    card.style.display = '';
                } else if (index === cardByPosition.right) {
                    card.classList.add('stacked-card--right');
                    card.style.display = '';
                }

                const canOpenEditor = card.hasAttribute('data-editor-product');
                if (!canOpenEditor) return;
                const isFront = index === cardByPosition.front;
                card.classList.add('stacked-card--interactive');
                card.setAttribute('role', 'link');
                card.setAttribute('tabindex', isFront ? '0' : '-1');
                card.setAttribute('aria-disabled', isFront ? 'false' : 'true');
            });
        };

        const slide = (direction) => {
            if (!desktopQuery.matches || isAnimating) return;
            isAnimating = true;

            frontIndex = direction === 'next'
                ? (frontIndex + 1) % cards.length
                : (frontIndex - 1 + cards.length) % cards.length;

            applyPositions();
            window.setTimeout(() => {
                isAnimating = false;
            }, 470);
        };

        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            slide('prev');
        });

        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            slide('next');
        });

        showcase.addEventListener('click', (event) => {
            if (event.target.closest('[data-stacked-nav]')) return;
            const card = event.target.closest('.stacked-card[data-editor-product]');
            if (!card) return;
            openCardEditor(card);
        });

        cards.forEach((card) => {
            if (!card.hasAttribute('data-editor-product')) return;
            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                openCardEditor(card);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (!desktopQuery.matches) return;
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                slide('prev');
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                slide('next');
            }
        });

        applyPositions();
        showcase.classList.add('stacked-showcase--animate-in');
        window.setTimeout(() => {
            showcase.classList.remove('stacked-showcase--animate-in');
        }, 1600);
    },

    setupExamplesStrip() {
        document.querySelectorAll('[data-examples-strip]').forEach((strip) => {
            const section = strip.closest('section') || document;
            const track = strip.querySelector('[data-examples-track]');
            const deferredTemplate = section.querySelector('[data-examples-deferred]');
            const prevButton = section.querySelector('[data-examples-nav="prev"]');
            const nextButton = section.querySelector('[data-examples-nav="next"]');
            if (!track || !prevButton || !nextButton) return;

            let deferredCardsLoaded = false;
            let animationFrameId = 0;
            let isAnimating = false;
            let queuedDirection = 0;
            const portfolioTitles = [
                'Наші роботи',
                'Приклади робіт',
                'Виконані проєкти',
                'Наші кейси',
                'Реальне замовлення',
                'Реальні замовлення',
                'Готові роботи',
                'Приклади друку',
                'Останні роботи',
                'Приклади виконання'
            ];

            const syncCardLabels = (root = track) => {
                root.querySelectorAll('.examples-strip__card').forEach((card, index) => {
                    const trigger = card.querySelector('[data-example-lightbox-title]');
                    const label = card.querySelector('.product-card-v2__body p');
                    const title = portfolioTitles[index % portfolioTitles.length];
                    if (trigger && title) {
                        trigger.setAttribute('data-example-lightbox-title', title);
                    }
                    if (label && title) {
                        label.textContent = title;
                    }
                });
            };

            const loadDeferredCards = () => {
                if (deferredCardsLoaded || !deferredTemplate?.content) return false;
                const deferredItems = deferredTemplate.content.cloneNode(true);
                if (!deferredItems.childElementCount) {
                    deferredCardsLoaded = true;
                    deferredTemplate.remove();
                    return false;
                }

                track.appendChild(deferredItems);
                syncCardLabels(track);
                deferredCardsLoaded = true;
                deferredTemplate.remove();
                return true;
            };

            const getCards = () => Array.from(track.querySelectorAll('.examples-strip__card'));

            const getNearestCardIndex = () => {
                const cards = getCards();
                if (!cards.length) return 0;

                let nearestIndex = 0;
                let nearestDistance = Number.POSITIVE_INFINITY;
                cards.forEach((card, index) => {
                    const distance = Math.abs(card.offsetLeft - track.scrollLeft);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestIndex = index;
                    }
                });
                return nearestIndex;
            };

            const animateTrackTo = (targetLeft) => {
                const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
                const destination = Math.max(0, Math.min(targetLeft, maxScrollLeft));
                const startLeft = track.scrollLeft;
                const distance = destination - startLeft;
                if (Math.abs(distance) < 2) {
                    track.scrollLeft = destination;
                    track.classList.remove('is-animating');
                    isAnimating = false;
                    syncButtons();
                    flushQueuedMove();
                    return;
                }

                const duration = 360;
                const startTime = performance.now();
                const easeInOutCubic = (progress) => (
                    progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2
                );

                track.classList.add('is-animating');
                isAnimating = true;

                const step = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeInOutCubic(progress);
                    track.scrollLeft = startLeft + (distance * eased);
                    syncButtons();

                    if (progress < 1) {
                        animationFrameId = window.requestAnimationFrame(step);
                        return;
                    }

                    track.scrollLeft = destination;
                    track.classList.remove('is-animating');
                    animationFrameId = 0;
                    isAnimating = false;
                    syncButtons();
                    flushQueuedMove();
                };

                animationFrameId = window.requestAnimationFrame(step);
            };

            const syncButtons = () => {
                const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
                prevButton.disabled = track.scrollLeft <= 4;
                const hasDeferredCards = !deferredCardsLoaded && Boolean(deferredTemplate?.content?.childElementCount);
                nextButton.disabled = hasDeferredCards ? false : track.scrollLeft >= maxScrollLeft - 4;
            };

            const moveByCard = (direction, allowQueue = true) => {
                if (isAnimating) {
                    if (allowQueue) {
                        queuedDirection = direction;
                    }
                    return;
                }

                if (loadDeferredCards()) {
                    syncButtons();
                }

                const cards = getCards();
                if (!cards.length) return;

                const currentIndex = getNearestCardIndex();
                const nextIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
                const targetCard = cards[nextIndex];
                if (!targetCard) return;

                animateTrackTo(targetCard.offsetLeft);
            };

            const flushQueuedMove = () => {
                if (!queuedDirection) return;
                const nextDirection = queuedDirection;
                queuedDirection = 0;
                moveByCard(nextDirection, false);
            };

            prevButton.addEventListener('click', () => {
                moveByCard(-1);
            });

            nextButton.addEventListener('click', () => {
                moveByCard(1);
            });

            track.addEventListener('scrollend', () => {
                if (!track.classList.contains('is-animating')) {
                    syncButtons();
                }
            });

            const preloadDeferredOnIntent = () => {
                if (loadDeferredCards()) {
                    syncButtons();
                }
            };

            track.addEventListener('pointerdown', preloadDeferredOnIntent, { passive: true, once: true });
            track.addEventListener('wheel', preloadDeferredOnIntent, { passive: true, once: true });
            track.addEventListener('touchstart', preloadDeferredOnIntent, { passive: true, once: true });
            track.addEventListener('scroll', syncButtons, { passive: true });
            window.addEventListener('resize', syncButtons, { passive: true });
            syncCardLabels(track);
            syncButtons();
        });
    },

    setupExamplesLightbox() {
        const modalId = 'examples-lightbox-modal';
        const modal = document.getElementById(modalId);
        const image = document.getElementById('examples-lightbox-image');
        const imageCaption = document.getElementById('examples-lightbox-caption');
        const video = document.getElementById('examples-lightbox-video');
        const videoControls = document.getElementById('examples-lightbox-video-controls');
        const videoTitle = document.getElementById('examples-lightbox-video-title');
        const videoToggle = document.getElementById('examples-lightbox-video-toggle');
        const videoSeek = document.getElementById('examples-lightbox-video-seek');
        const videoTime = document.getElementById('examples-lightbox-video-time');
        const closeButton = document.getElementById('examples-lightbox-close');
        const backdrop = modal?.querySelector('[data-examples-lightbox-close]');
        const viewport = modal?.querySelector('.examples-lightbox-modal__viewport');
        if (!modal || !image) return;

        const formatTime = (value) => {
            if (!Number.isFinite(value) || value < 0) return '0:00';
            const totalSeconds = Math.floor(value);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            return `${minutes}:${seconds}`;
        };

        const syncVideoUi = () => {
            if (!video) return;
            const isPlaying = !video.paused && !video.ended;
            const icon = videoToggle?.querySelector('i');
            if (icon) {
                icon.className = `fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`;
            }

            const duration = Number.isFinite(video.duration) ? video.duration : 0;
            const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
            if (videoSeek) {
                videoSeek.value = String(duration > 0 ? Math.min((currentTime / duration) * 1000, 1000) : 0);
            }
            if (videoTime) {
                videoTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            }
        };

        const closeModal = () => {
            modal.classList.remove('examples-lightbox-modal--video');
            image.src = '';
            image.classList.remove('hidden');
            image.alt = 'Фото прикладу';
            if (imageCaption) {
                imageCaption.textContent = '';
                imageCaption.classList.remove('hidden');
            }
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
                video.classList.add('hidden');
            }
            videoControls?.classList.add('hidden');
            if (videoTitle) {
                videoTitle.textContent = '';
                videoTitle.classList.add('hidden');
            }
            syncVideoUi();
            window.UI?.closeModal?.(modalId);
        };

        const openModal = (trigger) => {
            const src = trigger?.getAttribute('data-example-lightbox-src') || '';
            if (!src) return;
            const type = trigger?.getAttribute('data-example-lightbox-type') || 'image';
            const title =
                trigger.getAttribute('data-example-lightbox-title')
                || trigger.closest('.examples-strip__card')?.querySelector('.product-card-v2__body p')?.textContent?.trim()
                || '';

            if (type === 'video' && video) {
                modal.classList.add('examples-lightbox-modal--video');
                image.classList.add('hidden');
                image.removeAttribute('src');
                if (imageCaption) {
                    imageCaption.classList.add('hidden');
                    imageCaption.textContent = '';
                }
                video.classList.remove('hidden');
                video.src = src;
                video.currentTime = 0;
                if (videoTitle) {
                    videoTitle.textContent = '';
                    videoTitle.classList.add('hidden');
                }
                videoControls?.classList.remove('hidden');
                window.UI?.openModal?.(modalId);
                window.setTimeout(() => {
                    video.play().catch(() => {});
                    syncVideoUi();
                }, 40);
                return;
            }

            modal.classList.remove('examples-lightbox-modal--video');
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
                video.classList.add('hidden');
            }
            videoControls?.classList.add('hidden');
            if (videoTitle) {
                videoTitle.textContent = '';
                videoTitle.classList.add('hidden');
            }
            image.classList.remove('hidden');
            image.src = src;
            image.alt = trigger.getAttribute('data-example-lightbox-alt') || 'Фото прикладу';
            if (imageCaption) {
                imageCaption.classList.remove('hidden');
                imageCaption.textContent = title;
            }
            if (videoTitle) {
                videoTitle.classList.remove('hidden');
            }
            window.UI?.openModal?.(modalId);
        };

        document.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-example-lightbox-src]');
            if (!trigger) return;
            event.preventDefault();
            openModal(trigger);
        });

        document.addEventListener('keydown', (event) => {
            const trigger = event.target.closest?.('[data-example-lightbox-src]');
            if (trigger && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                openModal(trigger);
                return;
            }

            if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });

        closeButton?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeModal();
        });

        backdrop?.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal();
        });

        viewport?.addEventListener('click', (event) => {
            const mediaWrap = event.target.closest('.examples-lightbox-modal__media-wrap');
            const closeTrigger = event.target.closest('#examples-lightbox-close');
            if (mediaWrap || closeTrigger) return;
            closeModal();
        });

        videoToggle?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!video) return;
            if (video.paused) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });

        videoSeek?.addEventListener('input', () => {
            if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
            video.currentTime = (Number(videoSeek.value) / 1000) * video.duration;
            syncVideoUi();
        });

        video?.addEventListener('timeupdate', syncVideoUi);
        video?.addEventListener('loadedmetadata', syncVideoUi);
        video?.addEventListener('play', syncVideoUi);
        video?.addEventListener('pause', syncVideoUi);
        video?.addEventListener('ended', syncVideoUi);
    },

    setupExampleVideoPreviews() {
        document.querySelectorAll('[data-example-video-preview]').forEach((preview) => {
            if (preview.dataset.previewReady === '1') return;
            preview.dataset.previewReady = '1';
            preview.muted = true;
            preview.loop = false;
            preview.autoplay = false;
            preview.playsInline = true;
            preview.preload = 'auto';

            const freezeOnFrame = () => {
                preview.pause();
            };

            preview.addEventListener('loadeddata', () => {
                freezeOnFrame();
                if (preview.currentTime > 0) return;
                try {
                    const targetTime = Number.isFinite(preview.duration) && preview.duration > 0.08 ? 0.08 : 0;
                    preview.currentTime = targetTime;
                } catch (error) {
                    freezeOnFrame();
                }
            }, { once: true });

            preview.addEventListener('seeked', freezeOnFrame, { once: true });
            preview.load();
            freezeOnFrame();
        });
    },

    init() {
        if (this.initialized) return;
        this.initialized = true;

        if (this.hasElement('constructor')) {
            try {
                window.Editor?.init();
            } catch (error) {
                console.warn('Editor initialization failed, continuing with global handlers.', error);
            }
        }

        if (this.hasElement('catalog-grid') || this.hasElement('cart-modal')) {
            try {
                window.Catalog?.init();
            } catch (error) {
                console.warn('Catalog initialization failed, continuing with global handlers.', error);
            }
        }

        this.setupNavigation();
        this.setupGlobalButtons();
        this.setupFloatingCartButtons();
        this.setupKeyboardShortcuts();
        this.setupHeroStackedShowcase();
        this.setupExamplesStrip();
        this.setupExamplesLightbox();
        this.setupExampleVideoPreviews();
        this.setupLegalDocsModal();
        this.setupMobileHeaderVisibility();
        this.setupLanguageToggle();
        this.syncCartBadges();

        if (new URLSearchParams(window.location.search).get('success_preview') === '1') {
            window.setTimeout(() => {
                window.UI?.showOrderSuccessModal?.();
            }, 300);
        }

        window.addEventListener('storage', (event) => {
            if (event.key === this.CART_STORAGE_KEY) {
                this.syncCartBadges();
            }
        });

        console.info('Ukrainian Print Family initialized.');
    },

    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href')?.slice(1);
                if (!targetId) return;

                event.preventDefault();
                this.closeEditorSheet();
                window.UI?.smoothScrollTo(targetId);
            });
        });
    },

    setupGlobalButtons() {
        const navCreateBtn = document.getElementById('nav-create-btn');
        const navCartBtn = document.getElementById('nav-cart-btn');
        const heroStartBtn = document.getElementById('hero-start-btn');
        const heroGalleryBtn = document.getElementById('hero-gallery-btn');
        const isEditorPage = this.hasElement('constructor');
        const hasCatalogOnPage = this.hasElement('products');

        if (navCreateBtn) {
            if (isEditorPage) {
                navCreateBtn.setAttribute('href', 'index.html#products');
                const label = navCreateBtn.querySelector('span');
                if (label) {
                    label.textContent = 'Каталог';
                }
            }

            navCreateBtn.addEventListener('click', (event) => {
                if (!isEditorPage) {
                    event.preventDefault();
                    this.navigateWithPulse(navCreateBtn, 'editor.html?panel=media');
                    return;
                }

                event.preventDefault();
                this.closeEditorSheet();
                this.navigateWithPulse(navCreateBtn, 'index.html#products');
            });
        }

        if (heroStartBtn) {
            heroStartBtn.addEventListener('click', (event) => {
                event.preventDefault();
                if (isEditorPage) {
                    this.pulseHeroButton(heroStartBtn);
                    this.closeEditorSheet();
                    if (window.Editor && typeof window.Editor.activateMobilePanel === 'function') {
                        window.Editor.activateMobilePanel('mobile-panel-media');
                    }
                    window.UI?.smoothScrollTo('constructor');
                    return;
                }

                this.closeEditorSheet();
                this.navigateWithPulse(heroStartBtn, 'editor.html?panel=media');
            });
        }

        if (heroGalleryBtn) {
            heroGalleryBtn.addEventListener('click', (event) => {
                event.preventDefault();
                if (hasCatalogOnPage) {
                    this.pulseHeroButton(heroGalleryBtn);
                    this.closeEditorSheet();
                    window.UI?.smoothScrollTo('products');
                    return;
                }

                this.navigateWithPulse(heroGalleryBtn, 'index.html#products');
            });
        }

        if (navCartBtn) {
            navCartBtn.addEventListener('click', () => {
                this.openCartFromAnywhere();
            });
        }
    },

    setupLanguageToggle() {
        const langContainer = document.getElementById('nav-lang-btn');
        if (!langContainer) return;

        let storedLang = window.localStorage.getItem('upf_lang');
        if (!storedLang) {
            storedLang = 'ua';
            window.localStorage.setItem('upf_lang', 'ua');
        }
        langContainer.setAttribute('data-active-lang', storedLang);

        const uaBtn = langContainer.querySelector('[data-lang="ua"]');
        const enBtn = langContainer.querySelector('[data-lang="en"]');

        if (uaBtn && enBtn) {
            if (storedLang === 'en') {
                uaBtn.className = "nav-lang-cell relative z-10 flex-1 px-3 py-2.5 sm:px-4 sm:py-3.5 text-white font-extrabold [text-shadow:0_0_12px_#22d3ee,0_0_24px_#22d3ee] sm:text-slate-400 sm:[text-shadow:none] sm:font-medium hover:text-white transition";
                enBtn.className = "nav-lang-cell is-active relative z-10 hidden sm:block flex-1 px-3 py-2.5 sm:px-4 sm:py-3.5 text-white font-bold transition";
            } else {
                uaBtn.className = "nav-lang-cell is-active relative z-10 hidden sm:block flex-1 px-3 py-2.5 sm:px-4 sm:py-3.5 text-white font-bold transition";
                enBtn.className = "nav-lang-cell relative z-10 flex-1 px-3 py-2.5 sm:px-4 sm:py-3.5 text-white font-extrabold [text-shadow:0_0_12px_#22d3ee,0_0_24px_#22d3ee] sm:text-slate-400 sm:[text-shadow:none] sm:font-medium hover:text-white transition";
            }
        }

        const langCells = langContainer.querySelectorAll('.nav-lang-cell');
        langCells.forEach(cell => {
            const newCell = cell.cloneNode(true);
            cell.parentNode.replaceChild(newCell, cell);

            newCell.addEventListener('click', (e) => {
                const targetLang = e.currentTarget.getAttribute('data-lang');
                if (targetLang === storedLang) return;
                window.localStorage.setItem('upf_lang', targetLang);
                window.location.reload();
            });
        });
    },

    setupFloatingCartButtons() {
        document.querySelectorAll('[data-open-cart-fab]').forEach((button) => {
            if (button.dataset.cartFabReady === '1') return;
            button.dataset.cartFabReady = '1';

            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.openCartFromAnywhere();
            });
        });
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            const textInput = document.getElementById('text-input');
            if (event.key === '/' && textInput && document.activeElement !== textInput) {
                event.preventDefault();
                window.UI?.smoothScrollTo('constructor');
                window.setTimeout(() => textInput.focus(), 250);
            }
        });
    },

    setupLegalDocsModal() {
        const modalId = 'legal-modal';
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const titleEl = modal.querySelector('[data-legal-title]');
        const contentEl = modal.querySelector('[data-legal-content]');
        if (!titleEl || !contentEl) return;

        const lang = window.localStorage.getItem('upf_lang') || 'ua';
        const isEn = lang === 'en';

        const docs = isEn ? {
            delivery: {
                title: 'Delivery and Payment',
                paragraphs: [
                    'We deliver orders across Ukraine via Nova Poshta and Ukrposhta. Dispatch time is usually within 2-5 business days after confirmation.',
                    'Payment is available in two ways: by bank details or online via LiqPay (Google Pay / Apple Pay).',
                    'After placing an order, the manager may additionally clarify delivery details.'
                ]
            },
            terms: {
                title: 'Terms of Use',
                paragraphs: [
                    'By placing an order on the site, you agree to the rules for processing and fulfilling the order.',
                    'The client is responsible for the correctness of contact details, delivery address, and the content of the provided design.',
                    'The store reserves the right to refuse printing materials that violate the law or the rights of third parties.'
                ]
            },
            privacy: {
                title: 'Privacy Policy',
                paragraphs: [
                    '1. We collect only the data necessary for delivery (Name, phone, NP number).',
                    '2. Your data is used exclusively to process the order.',
                    '3. We do not pass information to third parties, except for logistics services.',
                    '4. By clicking "Place Order", you agree to these rules.'
                ]
            },
            returns: {
                title: 'Return Policy',
                paragraphs: [
                    'Returns or exchanges are only possible in case of problems on our side: manufacturing defect, picking error, or discrepancy between the product and the confirmed order.',
                    'If a product of good quality is made according to your custom order (print, size, color), returns or exchanges due to "wrong size", "didn\'t like it", or other personal reasons are not carried out.',
                    'In case of a warranty claim, contact us via the contacts on the site and provide a photo/video of the problem for verification.'
                ]
            }
        } : {
            delivery: {
                title: 'Доставка і оплата',
                paragraphs: [
                    'Ми доставляємо замовлення по Україні через Нову пошту та Укрпошту. Термін відправки зазвичай протягом 2-5 робочих днів після підтвердження.',
                    'Оплата доступна двома способами: за реквізитами або онлайн через LiqPay (Google Pay / Apple Pay).',
                    'Після оформлення замовлення менеджер може додатково уточнити деталі доставки.'
                ]
            },
            terms: {
                title: 'Угода користувача',
                paragraphs: [
                    'Оформлюючи замовлення на сайті, ви погоджуєтесь із правилами обробки та виконання замовлення.',
                    'Клієнт несе відповідальність за коректність контактних даних, адреси доставки та зміст наданого макету.',
                    'Магазин залишає за собою право відмовити у друці матеріалів, що порушують законодавство або права третіх осіб.'
                ]
            },
            privacy: {
                title: 'Політика конфіденційності',
                paragraphs: [
                    '1. Ми збираємо тільки ті дані, що необхідні для доставки (ПІБ, телефон, номер НП).',
                    '2. Ваші дані використовуються виключно для обробки замовлення.',
                    '3. Ми не передаємо інформацію третім особам, крім логістичних служб.',
                    '4. Натискаючи «Оформити замовлення», ви погоджуєтесь із цими правилами.'
                ]
            },
            returns: {
                title: 'Умови повернення',
                paragraphs: [
                    'Повернення або обмін можливі лише у випадку проблем з нашого боку: виробничий брак, помилка у комплектації або невідповідність товару підтвердженому замовленню.',
                    'Якщо товар виготовлено належної якості за вашим індивідуальним замовленням (принт, розмір, колір), повернення або обмін через «не підійшов розмір», «не сподобався» чи інші особисті причини не здійснюються.',
                    'У разі гарантійного звернення звʼяжіться з нами через контакти на сайті та додайте фото/відео проблеми для перевірки.'
                ]
            }
        };

        const closeModal = () => {
            if (window.UI && typeof window.UI.closeModal === 'function') {
                window.UI.closeModal(modalId);
                return;
            }
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        const openDoc = (docKey) => {
            const doc = docs[docKey];
            if (!doc) return;

            titleEl.textContent = doc.title;
            contentEl.replaceChildren();

            doc.paragraphs.forEach((paragraph) => {
                const item = document.createElement('p');
                item.textContent = paragraph;
                contentEl.appendChild(item);
            });

            if (window.UI && typeof window.UI.openModal === 'function') {
                window.UI.openModal(modalId);
                return;
            }
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        };

        document.querySelectorAll('[data-legal-doc]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                openDoc(link.getAttribute('data-legal-doc'));
            });
        });

        modal.querySelectorAll('[data-legal-close]').forEach((button) => {
            button.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (modal.classList.contains('hidden')) return;
            closeModal();
        });
    }
};

const Translator = {
    dict: {
        'Кошик': 'Cart',
        'Контакти': 'Contacts',
        'Створити дизайн': 'Create Design',
        'Каталог': 'Catalog',
        'До каталогу': 'To Catalog',
        'На головну': 'Home',
        'Обирай готовий виріб,': 'Choose a ready-made product,',
        'дивись реальні роботи,': 'see real works,',
        'переходь у кастомізацію': 'go to customization',
        'Тут зібраний саме каталог готових надрукованих речей. Якщо потрібно зробити свій макет — відкрий конструктор на окремій сторінці.': 'Here is a catalog of ready-made items. If you want a custom design, open the constructor.',
        'Готові надруковані вироби в наявності': 'Ready-made printed products in stock',
        'Відкрити конструктор': 'Open Constructor',
        'ПЕРЕГЛЯНУТИ КАТАЛОГ': 'VIEW CATALOG',
        'Готові надруковані вироби': 'Ready-made printed products',
        'Пошук товару за назвою': 'Search product by name',
        'Поки що немає товарів. Додай їх у CMS.': 'No products yet.',
        'Друк на одязі та сувенірах під замовлення': 'Custom printing on clothes and souvenirs',
        'Ukrainian Print Family виготовляє футболки, чашки та худі з принтом і друкує індивідуальні макети під замовлення. На сайті можна обрати готовий дизайн або перейти в конструктор і оформити замовлення онлайн за кілька хвилин.': 'Ukrainian Print Family produces printed t-shirts, mugs, and hoodies to order. You can choose a ready-made design or use the constructor to place an order online.',
        'Каталог готових виробів': 'Ready-made Catalog',
        'У каталозі доступні футболки, чашки та худі з уже підготовленими принтами.': 'T-shirts, mugs, and hoodies with ready prints are available in the catalog.',
        'Конструктор макетів': 'Design Constructor',
        'Завантажуй власне фото, додавай текст і підбирай основу для персонального друку.': 'Upload your photo, add text, and choose a base for custom printing.',
        'Швидке оформлення': 'Fast Checkout',
        'Після вибору товару замовлення оформлюється онлайн, а деталі підтверджує менеджер.': 'Orders are placed online, and details are confirmed by a manager.',
        'Часті питання': 'FAQ',
        'Які вироби можна замовити?': 'What products can I order?',
        'У каталозі доступні футболки, чашки та худі з готовим друком. Якщо потрібен персональний варіант, можна перейти в конструктор.': 'T-shirts, mugs, and hoodies with ready prints are available. For a custom item, use the constructor.',
        'Чи можна завантажити власний макет?': 'Can I upload my own design?',
        'Так, на сторінці конструктора можна завантажити своє зображення, додати текст і підготувати макет перед оформленням замовлення.': 'Yes, in the constructor you can upload an image, add text, and prepare your design before ordering.',
        'Які строки виготовлення замовлення?': 'What are the production times?',
        'Стандартний термін виготовлення — 3-5 робочих днів після підтвердження замовлення.': 'Standard production time is 3-5 business days after order confirmation.',
        'Інструменти конструктора': 'Constructor Tools',
        'Основа': 'Base',
        'Фото': 'Photo',
        'Текст': 'Text',
        'Основа для друку': 'Printing Base',
        'Колір основи': 'Base Color',
        'Текст принту': 'Print Text',
        'Колір тексту': 'Text Color',
        'Розмір тексту': 'Text Size',
        'Формат друку': 'Print Format',
        'Редагування фото': 'Edit Photo',
        'Завантажити / змінити фото': 'Upload / change photo',
        'Масштаб': 'Scale',
        'Орієнтація принта': 'Print Orientation',
        'Повернути на 90°': 'Rotate 90°',
        'Скинути': 'Reset',
        'Видалити': 'Remove',
        'Працює drag and drop: перетягни фото прямо в зону друку.': 'Drag and drop works: drag the photo directly into the print zone.',
        'Відкрити інструменти': 'Open Tools',
        'Завантажити фото': 'Upload photo',
        'або перетягни файл у зону друку': 'or drag & drop file into print area',
        'Ціна від': 'Price from',
        'Зберегти': 'Save',
        'В кошик': 'To Cart',
        'Додати в кошик': 'Add to Cart',
        'Розмір': 'Size',
        'Колір': 'Color',
        'Розмірна сітка': 'Size Guide',
        'Формати друку': 'Print Formats',
        'Параметри основи': 'Base Parameters',
        'Матеріал': 'Material',
        'Друк': 'Printing',
        'Термін': 'Lead Time',
        'Макс. зона:': 'Max area:',
        'Залишай відступ від краю, щоб друк виглядав акуратно.': 'Leave a margin from the edge so the print looks neat.',
        'Який формат краще обрати для футболки?': 'Which format is best for a t-shirt?',
        'Для великого центрального принта зазвичай підходить A2 або A3, для логотипів і невеликих написів — A4 або A5.': 'A2 or A3 is usually suitable for a large central print, A4 or A5 for logos and small inscriptions.',
        'Що робити, якщо макет виходить за межі?': 'What if the design goes out of bounds?',
        'Зменш масштаб фото або обери інший формат друку, щоб важливі елементи не обрізалися під час друку.': 'Reduce the photo scale or choose a different print format so important elements are not cropped.',
        'Активний формат': 'Active format',
        'Максимум': 'Maximum',
        'КОШИК': 'CART',
        'Ваші товари': 'Your Items',
        'Кошик порожній': 'Cart is Empty',
        'Додайте товари з каталогу, і вони з\'являться тут.': 'Add items from the catalog, and they will appear here.',
        'Додайте товари, і вони з\'являться тут.': 'Add items, and they will appear here.',
        'Разом': 'Total',
        'Очистити': 'Clear',
        'Замовити': 'Order',
        'ФОРМУВАННЯ ЗАМОВЛЕННЯ': 'ORDER FORMATION',
        'Оформити покупку': 'Checkout',
        'Доставка по світу': 'Worldwide Shipping',
        'Ваші дані успішно надіслано. Напишіть менеджеру в Telegram або Instagram або зачекайте, поки він зв\'яжеться з вами.': 'Your details have been sent successfully. Message our manager on Telegram or Instagram, or wait for him to contact you.',
        'Ваші дані успішно надіслано. Очікуйте зв\'язку з менеджером.': 'Your details have been sent successfully. Please wait for the manager to contact you.',
        'Ім\'я': 'Name',
        'Країна': 'Country',
        'Місто': 'City',
        'Номер телефону': 'Phone number',
        'Відправити': 'Send',
        'Відправляємо...': 'Sending...',
        'Відкрити Telegram-бот': 'Open Telegram Bot',
        'Відкрити Instagram': 'Open Instagram',
        'Позицій': 'Items',
        'Сума': 'Total Amount',
        'ПІБ': 'Full Name',
        'Місто та номер НП/Укрпошти': 'City and Nova Poshta/Ukrposhta office',
        'Ваш Telegram (необов\'язково)': 'Your Telegram (optional)',
        'Телефон': 'Phone',
        'Опис (необов\'язково)': 'Description (optional)',
        'Оплата за реквізитами': 'Pay by Details',
        'ОПЛАТА ЗА РЕКВІЗИТАМИ': 'PAYMENT BY DETAILS',
        'Реквізити для оплати': 'Payment Details',
        'Квитанція / скріншот оплати': 'Payment receipt / screenshot',
        'Файл не вибрано': 'No file chosen',
        'Оформити замовлення': 'Place Order',
        'Сума до сплати:': 'Total to pay:',
        'Після підтвердження ми зв\'яжемося з вами для уточнення деталей замовлення.': 'After confirmation, we will contact you to clarify the order details.',
        'Швидкі посилання': 'Quick Links',
        'Зв\'язатися з нами': 'Contact Us',
        'Каталог готових надрукованих виробів та конструктор для персональних замовлень.': 'Catalog of ready-made printed products and a constructor for custom orders.',
        'Сторінка конструктора для персоналізації друку на одязі та посуді.': 'Constructor page for personalizing prints on clothes and dishware.',
        'Доставка і оплата': 'Delivery & Payment',
        'Угода користувача': 'Terms of Use',
        'Умови повернення': 'Return Policy',
        'Політика конфіденційності': 'Privacy Policy',
        'Договір оферти': 'Offer Agreement',
        'Таблиця розмірів': 'Size Chart',
        'Порівняння форматів друку': 'Print Formats Comparison',
        'Технічна схема форматів': 'Technical formats scheme',
        'Інформація': 'Information',
        'Товар не знайдено': 'Product Not Found',
        'Можливо, посилання застаріло або товар було видалено.': 'Perhaps the link is outdated or the product was deleted.',
        'Перейти в каталог': 'Go to Catalog',
        'Категорія': 'Category',
        'Опція': 'Option',
        'Відкрити каталог': 'Open Catalog',
        'ФОП РАХУНОК (IBAN):': 'Business Account (IBAN):',
        'ФОП РАХУНОК:': 'Business Account:',
        'КАРТА ФОП РАХУНКУ:': 'Business Card:',
        'КАРТА:': 'Card:',
        'ЄДРПОУ:': 'Company Code (EDRPOU):',
        'Компактний формат для мінімалістичних акцентів.': 'Compact format for minimalist accents.',
        'Невеликий формат для акуратного принта.': 'Small format for a neat print.',
        'Акуратний варіант для невеликих написів і знаків.': 'Neat option for small inscriptions and signs.',
        'Комфортний формат для логотипів і середніх макетів.': 'Comfortable format for logos and medium designs.',
        'Стандартна зона для центрального принта.': 'Standard zone for a central print.',
        'Максимальна фронтальна зона для великих ілюстрацій.': 'Maximum frontal zone for large illustrations.',
        'Панорамний принт по всій видимій площині чашки.': 'Panoramic print across the entire visible surface of the mug.',
        'КАТАЛОГ': 'CATALOG',
        'КОНСТРУКТОР': 'CONSTRUCTOR',
        'РОЗМІРНА СІТКА': 'SIZE GUIDE',
        'ФОРМАТИ ДРУКУ': 'PRINT FORMATS',
        'Скачати у форматі DOCX': 'Download in DOCX format',
        'Умови повернення та обміну': 'Return and Exchange Policy',
        'Публічний договір (оферта)': 'Public Contract (Offer)',
        'Готова біла футболка з принтом': 'Ready white t-shirt with print',
        'Базова футболка для друку': 'Basic t-shirt for printing',
        'Щільна тканина, зручний крій і рівна фронтальна зона для чіткого принта.': 'Thick fabric, comfortable fit and flat front area for a clear print.',
        'Чорна базова футболка': 'Black basic t-shirt',
        'Керамічні чашки': 'Ceramic mugs',
        'Класична кераміка з насиченим друком, зручна для щоденного використання.': 'Classic ceramics with rich printing, comfortable for daily use.',
        'Базове худі для друку': 'Basic hoodie for printing',
        'Щільне худі, зручний крій і рівна фронтальна зона для чіткого принта.': 'Thick hoodie, comfortable fit and flat front area for a clear print.',
        'Чорне базове худі': 'Black basic hoodie',
        'Футболки': 'T-shirts',
        'Худі': 'Hoodies',
        'Чашки': 'Mugs',
        'Термочашки': 'Thermo mugs',
        'Подарункові набори': 'Gift sets',
        'Сумки-шопери': 'Shopper bags',
        'Назад': 'Back',
        'Вперед': 'Next',
        'ЧАСТІ ЗАПИТАННЯ': 'FAQ',
        'Чи можна накладним платежем?': 'Is cash on delivery available?',
        'Ні, тільки повна передплата.': 'No, full prepayment only.',
        'Скільки часу на відправку?': 'How long does shipping take?',
        'Протягом 2-5 робочих днів.': 'Within 2-5 business days.',
        'Як підібрати розмір?': 'How to choose the size?',
        'Зайдіть у розмірну сітку для коректного вибору.': 'Check the size chart to make the right choice.',
        'Як зрозуміти що замовлення прийняте?': 'How to know if the order is accepted?',
        'Якщо оплата пройшла успішно то ваше замовлення прийшло до нас, та буде відправлено.': 'If the payment is successful, your order has reached us and will be shipped.',
        'Додано в кошик': 'Added to cart',
        'Товар прибрано з кошика': 'Item removed from cart',
        'Кошик очищено': 'Cart cleared',
        'Прибрано з обраного': 'Removed from favorites',
        'Додано в обране': 'Added to favorites',
        'Спочатку натисни "Зберегти"': 'Click "Save" first',
        'Макет збережено': 'Design saved',
        'Не вдалося зберегти макет. Спробуйте ще раз.': 'Failed to save design. Try again.',
        'Зачекай, фото ще обробляється...': 'Wait, photo is processing...',
        'Додайте хоча б один товар у кошик.': 'Add at least one item to the cart.',
        'Кошик порожній. Додайте товари перед оформленням.': 'Cart is empty. Add items before checkout.',
        'Додайте скріншот або квитанцію про оплату перед оформленням замовлення.': 'Add a screenshot or payment receipt before placing the order.',
        'Не вдалося оформити замовлення. Спробуйте ще раз.': 'Failed to place the order. Try again.',
        'Не вдалося перейти до LiqPay. Спробуйте ще раз.': 'Failed to proceed to LiqPay. Try again.',
        'Не вдалося скопіювати. Скопіюйте реквізити вручну.': 'Failed to copy. Copy the details manually.',
        'Дозволено завантажувати тільки зображення або PDF (скріншот/квитанцію).': 'Only images or PDF (screenshot/receipt) are allowed.',
        'Файл занадто великий. Максимум 12 МБ.': 'File is too large. Maximum 12 MB.',
        'Не вдалося обробити файл. Спробуйте інше зображення.': 'Failed to process file. Try another image.',
        'Помилка оплати. Спробуйте ще раз.': 'Payment error. Try again.',
        'Кошик збережено, але частину файлів старих макетів прибрано': 'Cart saved, but some files from old designs were removed',
        'Кошик збережено у спрощеному режимі для великих файлів': 'Cart saved in simplified mode for large files',
        'Не вдалося додати в кошик': 'Failed to add to cart',
        'Велике фото оптимізовано для стабільної роботи редактора': 'Large photo optimized for stable editor performance',
        'Файл занадто великий. Спробуй фото до 80 МБ.': 'File is too large. Try a photo up to 80 MB.',
        'Не вдалося завантажити фото. Спробуй інший файл.': 'Failed to upload photo. Try another file.',
        'Оформлюємо...': 'Processing...',
        'Зберігаємо...': 'Saving...',
        'Переходимо до LiqPay...': 'Redirecting to LiqPay...',
        'Скопійовано': 'Copied',
        'Дякуємо за замовлення!': 'Thank you for your order!',
        'Ваше замовлення буде відправлено протягом 2-5 робочих днів.': 'Your order will be shipped within 2-5 business days.',
        'По усім питанням пишіть в бота': 'For any questions, write to our bot',
        'Або телефонуйте за номером': 'Or call us at',
        'Чудово, на головну': 'Great, back to home',
        'Макет розміру L': 'Size L mockup',
        'Біла': 'White',
        'Чорна': 'Black',
        'Білий': 'White',
        'Чорний': 'Black',
        '100% бавовна, 180 г/м²': '100% cotton, 180 g/m²',
        'Бавовна/поліестер, 320 г/м²': 'Cotton/polyester, 320 g/m²',
        'Кераміка': 'Ceramics',
        'Біла кераміка': 'White ceramics',
        'DTG, DTF та термоперенос': 'DTG, DTF and thermal transfer',
        'Сублімація та UV DTF': 'Sublimation and UV DTF',
        '3-5 робочих днів': '3-5 business days',
        'до 42 x 59.4 см': 'up to 42 x 59.4 cm',
        'до 20 x 8.5 см': 'up to 20 x 8.5 cm',
        'Залишай 2-3 см від краю без важливих елементів — так дизайн виглядатиме чисто після друку.': 'Leave 2-3 cm from the edge without important elements so the design looks clean after printing.',
        'Для чашки не став важливі елементи впритул до ручки — залишай безпечний зазор по краях.': 'For a mug, do not place important elements close to the handle — leave a safe gap around the edges.',
        'Базова футболка': 'Basic t-shirt',
        'Керамічна чашка': 'Ceramic mug',
        'Реальне фото': 'Real photo',
        'Редагування виробу': 'Edit Product',
        'для кастомного друку': 'for custom printing',
        'Біла футболка': 'White t-shirt',
        'Чорна футболка': 'Black t-shirt',
        'Біле худі': 'White hoodie',
        'Чорне худі': 'Black hoodie',
        'Перетягуй фото прямо на макеті': 'Drag the photo directly onto the mockup',
        'Чи можна завантажити своє фото?': 'Can I upload my own photo?',
        'Так, натисни «Завантажити фото» або просто перетягни файл прямо в зону друку на макеті.': 'Yes, click "Upload photo" or simply drag the file directly into the print area on the mockup.',
        'Футболка з власним принтом': 'T-shirt with custom print',
        'Худі з власним принтом': 'Hoodie with custom print',
        'Чашка з власним принтом': 'Mug with custom print',
        'Термочашка з власним принтом': 'Thermo mug with custom print',
        'Товар з власним принтом': 'Product with custom print',
        'Панорама 360': 'Panorama 360',
        'Розмір:': 'Size:',
        'Розміри': 'Sizes',
        'Прибрати': 'Remove',
        'УКРАЇНА': 'UKRAINE',
        'Зменшити кількість': 'Decrease quantity',
        'Збільшити кількість': 'Increase quantity',
        'Попереднє фото': 'Previous photo',
        'Наступне фото': 'Next photo',
        'Нічого не знайдено за цим запитом.': 'Nothing found for this query.',
        'Оформлення цього товару без переходу в редактор.': 'Ordering this product without going to the editor.',
        'Футболка з надруком': 'Printed t-shirt',
        'Футболка з двостороннім надруком': 'Double-sided printed t-shirt',
        'Худі з надруком': 'Printed hoodie',
        'Худі oversize': 'Oversize hoodie',
        'Худі з двостороннім надруком': 'Double-sided printed hoodie',
        'Керамічна чашка з надруком': 'Printed ceramic mug',
        'Чашка з двостороннім надруком': 'Double-sided printed mug',
        'Термочашка з надруком': 'Printed thermo mug',
        'Подарунковий набір': 'Gift set',
        'Подарунковий набір з футболкою': 'Gift set with t-shirt',
        'Подарунковий набір з чашкою': 'Gift set with mug',
        'Сумка-шопер з надруком': 'Printed shopper bag',
        'Сумка-шопер з власним принтом': 'Shopper bag with custom print',
        'Ціна уточнюється': 'Price to be specified',
        'Завантажуємо товар...': 'Loading product...',
        'Таблиця розмірів для футболок': 'T-shirt size chart',
        'Таблиця розмірів для oversize футболок': 'Oversize t-shirt size chart',
        'Таблиця розмірів для худі': 'Hoodie size chart',
        'Конструктор': 'Constructor',
        'Опис товару відсутній.': 'Product description is missing.',
        'Розмірна сітка для худі': 'Hoodie size chart',
        'Розмірна сітка для футболок': 'T-shirt size chart',
        'Розмірна сітка для oversize футболок': 'Oversize t-shirt size chart',
        'Без тексту': 'No text',
        'Товар': 'Product',
        'Закрити': 'Close',
        'Не вдалося ініціювати оплату через LiqPay.': 'Failed to initiate LiqPay payment.'
    },
    placeholders: {
        'Пошук товару за назвою': 'Search product by name',
        'Вкажіть ПІБ': 'Enter Full Name',
        'Вкажіть ім\'я': 'Enter name',
        'Наприклад: Хмельницький': 'e.g. Kyiv',
        'Наприклад: НП 27 / Укрпошта 01001': 'e.g. Post Office 27',
        'Наприклад: Польща': 'e.g. Poland',
        'Наприклад: Варшава': 'e.g. Warsaw',
        'Наприклад: @nickname': 'e.g. @nickname',
        'Наприклад: +48 123 456 789': 'e.g. +48 123 456 789',
        'Потрібен дзвінок або SMS для підтвердження? Напишіть тут.': 'Need a call or SMS to confirm the order? Write it here.',
        'Напиши свій текст...': 'Type your text...'
    },
    formatPrice(uah) {
        const priceMap = {
            650: 13, 750: 15, 850: 17, 950: 19,
            1350: 26, 1450: 28, 1550: 30, 1650: 32
        };
        if (priceMap[uah]) return `${priceMap[uah]} €`;
        return `${Math.round(uah / 50)} €`;
    },
    applyNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let changed = false;
            const trimmed = text.trim();
            if (Translator.dict[trimmed]) {
                text = text.replace(trimmed, Translator.dict[trimmed]);
                changed = true;
            }
            if (/\(\+200 грн за 3XL\)/.test(text)) {
                text = text.replace(/\(\+200 грн за 3XL\)/g, '(+4 € for 3XL)');
                changed = true;
            }
            if (/(\d[\d\s\u00A0]*)\s*грн/g.test(text)) {
                text = text.replace(/(\d[\d\s\u00A0]*)\s*грн/g, (match, p1) => Translator.formatPrice(parseInt(p1.replace(/[^\d]/g, ''), 10)));
                changed = true;
            }
            if (/(\d[\d\s\u00A0]*)\s*₴/g.test(text)) {
                text = text.replace(/(\d[\d\s\u00A0]*)\s*₴/g, (match, p1) => Translator.formatPrice(parseInt(p1.replace(/[^\d]/g, ''), 10)));
                changed = true;
            }
            if (/разом з футболкою/.test(text)) {
                text = text.replace(/разом з футболкою/g, 'with t-shirt');
                changed = true;
            }
            if (/разом з худі/.test(text)) {
                text = text.replace(/разом з худі/g, 'with hoodie');
                changed = true;
            }
            if (/(\d+(?:\.\d+)?)\s*мм/g.test(text)) {
                text = text.replace(/(\d+(?:\.\d+)?)\s*мм/g, '$1 mm');
                changed = true;
            }
            if (/(\d+(?:\.\d+)?)\s*см/g.test(text)) {
                text = text.replace(/(\d+(?:\.\d+)?)\s*см/g, '$1 cm');
                changed = true;
            }
            if (/(\d+(?:\.\d+)?)\s*мл/g.test(text)) {
                text = text.replace(/(\d+(?:\.\d+)?)\s*мл/g, '$1 ml');
                changed = true;
            }
            if (changed) node.nodeValue = text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute('placeholder')) {
                const ph = node.getAttribute('placeholder');
                if (Translator.placeholders[ph]) node.setAttribute('placeholder', Translator.placeholders[ph]);
            }
            if (node.hasAttribute('alt')) {
                const alt = node.getAttribute('alt');
                if (Translator.dict[alt]) node.setAttribute('alt', Translator.dict[alt]);
            }
            if (node.hasAttribute('aria-label')) {
                const al = node.getAttribute('aria-label');
                if (Translator.dict[al]) node.setAttribute('aria-label', Translator.dict[al]);
            }
        }
    },
    init() {
        let storedLang = window.localStorage.getItem('upf_lang');
        if (!storedLang) {
            storedLang = 'ua';
            window.localStorage.setItem('upf_lang', 'ua');
        }
        if (storedLang !== 'en') return;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToTranslate = [];
        while ((node = walker.nextNode())) nodesToTranslate.push(node);
        
        nodesToTranslate.forEach(Translator.applyNode);
        document.querySelectorAll('[placeholder], [alt], [aria-label]').forEach(Translator.applyNode);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'characterData') {
                    Translator.applyNode(mutation.target);
                } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(addedNode => {
                        if (addedNode.nodeType === Node.TEXT_NODE) {
                            Translator.applyNode(addedNode);
                        } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            const innerWalker = document.createTreeWalker(addedNode, NodeFilter.SHOW_TEXT, null, false);
                            let innerNode;
                            while ((innerNode = innerWalker.nextNode())) Translator.applyNode(innerNode);
                            if (addedNode.hasAttribute('placeholder') || addedNode.hasAttribute('alt') || addedNode.hasAttribute('aria-label')) Translator.applyNode(addedNode);
                            addedNode.querySelectorAll('[placeholder], [alt], [aria-label]').forEach(Translator.applyNode);
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    Translator.applyNode(mutation.target);
                }
            });
        });

        observer.observe(document.body, {
            childList: true, subtree: true, characterData: true,
            attributes: true, attributeFilter: ['placeholder', 'alt', 'aria-label']
        });
    }
};

window.Translator = Translator;
window.MainApp = MainApp;
document.addEventListener('DOMContentLoaded', () => {
    if (window.Translator) window.Translator.init();
    MainApp.init();
}, { once: true });
