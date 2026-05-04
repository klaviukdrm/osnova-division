﻿const MainApp = {
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
        this.setupLegalDocsModal();
        this.setupMobileHeaderVisibility();
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

        const docs = {
            delivery: {
                title: 'Доставка і оплата',
                paragraphs: [
                    'Ми доставляємо замовлення по Україні через Нову пошту та Укрпошту. Термін відправки зазвичай 3-5 робочих днів після підтвердження.',
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

window.MainApp = MainApp;
document.addEventListener('DOMContentLoaded', () => MainApp.init(), { once: true });
