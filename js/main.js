const MainApp = {
    initialized: false,

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
            window.Editor?.init();
        }

        if (this.hasElement('catalog-grid')) {
            window.Catalog?.init();
        }

        this.setupNavigation();
        this.setupGlobalButtons();
        this.setupKeyboardShortcuts();

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
                if (window.Catalog && typeof window.Catalog.openCartModal === 'function') {
                    window.Catalog.openCartModal();
                    return;
                }

                window.sessionStorage.setItem('openCartOnHome', '1');
                window.location.href = 'index.html#products';
            });
        }
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


