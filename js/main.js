const MainApp = {
    initialized: false,
    CART_STORAGE_KEY: 'upf_cart_v1',

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
        this.syncCartBadges();

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
            navCreateBtn.addEventListener('click', (event) => {
                if (!isEditorPage) {
                    event.preventDefault();
                    this.navigateWithPulse(navCreateBtn, 'editor.html');
                    return;
                }

                if (event.currentTarget?.tagName === 'A') {
                    event.preventDefault();
                }
                this.closeEditorSheet();
                window.UI?.smoothScrollTo('constructor');
            });
        }

        if (heroStartBtn) {
            heroStartBtn.addEventListener('click', (event) => {
                event.preventDefault();
                if (isEditorPage) {
                    this.pulseHeroButton(heroStartBtn);
                    this.closeEditorSheet();
                    window.UI?.smoothScrollTo('constructor');
                    return;
                }

                this.closeEditorSheet();
                this.navigateWithPulse(heroStartBtn, 'editor.html');
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
    }
};

window.MainApp = MainApp;
document.addEventListener('DOMContentLoaded', () => MainApp.init(), { once: true });
