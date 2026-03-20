const RU_TO_UA_WORD_MAP = new Map([
    ['а', 'а'],
    ['без', 'без'],
    ['будь', 'будь'],
    ['быть', 'бути'],
    ['вас', 'вас'],
    ['вам', 'вам'],
    ['ваш', 'ваш'],
    ['ваша', 'ваша'],
    ['ваше', 'ваше'],
    ['ваши', 'ваші'],
    ['в', 'в'],
    ['вместе', 'разом'],
    ['все', 'усе'],
    ['всегда', 'завжди'],
    ['всех', 'усіх'],
    ['вы', 'ви'],
    ['где', 'де'],
    ['героям', 'героям'],
    ['год', 'рік'],
    ['годом', 'роком'],
    ['день', 'день'],
    ['дела', 'справи'],
    ['дело', 'справа'],
    ['для', 'для'],
    ['добро', 'добро'],
    ['дочь', 'донька'],
    ['дочка', 'донька'],
    ['друг', 'друг'],
    ['друга', 'друга'],
    ['друзья', 'друзі'],
    ['жизнь', 'життя'],
    ['здравствуй', 'привіт'],
    ['здравствуйте', 'добрий день'],
    ['и', 'і'],
    ['из', 'з'],
    ['или', 'або'],
    ['их', 'їх'],
    ['класс', 'клас'],
    ['классно', 'класно'],
    ['когда', 'коли'],
    ['как', 'як'],
    ['какая', 'яка'],
    ['какие', 'які'],
    ['какой', 'який'],
    ['каталог', 'каталог'],
    ['киев', 'київ'],
    ['кошка', 'кішка'],
    ['кот', 'кіт'],
    ['котик', 'котик'],
    ['круто', 'круто'],
    ['крутой', 'крутий'],
    ['крутая', 'крута'],
    ['красивый', 'гарний'],
    ['красивая', 'гарна'],
    ['красивое', 'гарне'],
    ['красиво', 'гарно'],
    ['кто', 'хто'],
    ['любимый', 'улюблений'],
    ['любимая', 'улюблена'],
    ['любимое', 'улюблене'],
    ['люблю', 'люблю'],
    ['любовь', 'любов'],
    ['лучшая', 'найкраща'],
    ['лучшее', 'найкраще'],
    ['лучшие', 'найкращі'],
    ['лучший', 'найкращий'],
    ['мама', 'мама'],
    ['мир', 'мир'],
    ['мечта', 'мрія'],
    ['меня', 'мене'],
    ['мне', 'мені'],
    ['мой', 'мій'],
    ['мои', 'мої'],
    ['моя', 'моя'],
    ['мое', 'моє'],
    ['мы', 'ми'],
    ['на', 'на'],
    ['над', 'над'],
    ['надежда', 'надія'],
    ['навсегда', 'назавжди'],
    ['начать', 'почати'],
    ['наша', 'наша'],
    ['наше', 'наше'],
    ['наши', 'наші'],
    ['наш', 'наш'],
    ['но', 'але'],
    ['новым', 'новим'],
    ['о', 'про'],
    ['об', 'про'],
    ['он', 'він'],
    ['она', 'вона'],
    ['они', 'вони'],
    ['от', 'від'],
    ['очень', 'дуже'],
    ['папа', 'тато'],
    ['подарок', 'подарунок'],
    ['подарки', 'подарунки'],
    ['победа', 'перемога'],
    ['по', 'по'],
    ['под', 'під'],
    ['пожалуйста', 'будь ласка'],
    ['посмотреть', 'переглянути'],
    ['почему', 'чому'],
    ['при', 'при'],
    ['привет', 'привіт'],
    ['принт', 'принт'],
    ['про', 'про'],
    ['размер', 'розмір'],
    ['рождения', 'народження'],
    ['с', 'з'],
    ['самая', 'найбільш'],
    ['самое', 'найбільш'],
    ['самый', 'найбільш'],
    ['свобода', 'свобода'],
    ['семья', 'сімʼя'],
    ['семье', 'сімʼї'],
    ['семью', 'сімʼю'],
    ['сестра', 'сестра'],
    ['сегодня', 'сьогодні'],
    ['сила', 'сила'],
    ['слава', 'слава'],
    ['собака', 'собака'],
    ['со', 'з'],
    ['спасибо', 'дякую'],
    ['супер', 'супер'],
    ['счастье', 'щастя'],
    ['сын', 'син'],
    ['там', 'там'],
    ['тебе', 'тобі'],
    ['тебя', 'тебе'],
    ['текст', 'текст'],
    ['термокружка', 'термочашка'],
    ['только', 'лише'],
    ['тут', 'тут'],
    ['ты', 'ти'],
    ['твой', 'твій'],
    ['твои', 'твої'],
    ['твоя', 'твоя'],
    ['твое', 'твоє'],
    ['украина', 'україна'],
    ['улыбка', 'усмішка'],
    ['хорошо', 'добре'],
    ['цвет', 'колір'],
    ['что', 'що'],
    ['это', 'це'],
    ['этот', 'цей'],
    ['эта', 'ця'],
    ['эти', 'ці'],
    ['нет', 'ні'],
    ['да', 'так'],
    ['я', 'я']
]);

const RU_TO_UA_PHRASE_MAP = new Map([
    ['добро пожаловать', 'ласкаво просимо'],
    ['с днем рождения', 'з днем народження'],
    ['с днём рождения', 'з днем народження'],
    ['с новым годом', 'з новим роком'],
    ['слава украине', 'слава україні'],
    ['героям слава', 'героям слава'],
    ['спокойной ночи', 'на добраніч']
]);

const CYRILLIC_TOKEN_REGEX = /[А-Яа-яЁёІіЇїЄєҐґ'-]+/g;

const Editor = {
    products: [
        {
            id: 'tshirt-white',
            name: 'Біла футболка',
            shortName: 'Футболка',
            icon: 'fa-shirt',
            image: 'images/%D0%BF%D1%83%D1%81%D1%82%D0%B0%202.jpg',
            imageAlt: 'Біла футболка для друку',
            kind: 'apparel',
            previewWidth: 840,
            price: 299,
            colorLabel: 'Білий',
            swatch: '#ffffff',
            defaultVariantId: 'white',
            variants: [
                {
                    id: 'white',
                    label: 'Біла',
                    colorLabel: 'Білий',
                    swatch: '#f1f5f9',
                    image: 'images/%D0%BF%D1%83%D1%81%D1%82%D0%B0%202.jpg',
                    imageAlt: 'Біла футболка для друку'
                },
                {
                    id: 'black',
                    label: 'Чорна',
                    colorLabel: 'Чорний',
                    swatch: '#0f172a',
                    image: 'images/%D0%BF%D1%83%D1%81%D1%82%D0%B0.jpg',
                    imageAlt: 'Чорна футболка для друку'
                }
            ],
            description: 'Класична база під повноколірний фронтальний принт.',
            material: '100% бавовна, 180 г/м²',
            printTech: 'DTG, DTF та термоперенос',
            leadTime: '1-2 робочі дні',
            maxPrintHint: 'до 32.9 x 48.3 см',
            printHint: 'Залишай 2-3 см від краю без важливих елементів — так дизайн виглядатиме чисто після друку.',
            text: { min: 14, max: 52, default: 28 },
            printArea: { top: 22, left: 50, width: 52, height: 39, radius: 12 },
            formats: [
                { id: 'tee-a3plus', label: 'A3+', widthMm: 329, heightMm: 483, width: 56, height: 42, note: 'Максимальна фронтальна зона для великих ілюстрацій.' },
                { id: 'tee-a3', label: 'A3', widthMm: 297, heightMm: 420, width: 52, height: 39, note: 'Стандартна зона для центрального принта.' },
                { id: 'tee-a4', label: 'A4', widthMm: 210, heightMm: 297, width: 40, height: 31, note: 'Комфортний формат для логотипів і середніх макетів.' },
                { id: 'tee-a5', label: 'A5', widthMm: 148, heightMm: 210, width: 30, height: 23, note: 'Акуратний варіант для невеликих написів і знаків.' }
            ]
        },
        {
            id: 'hoodie-black',
            name: 'Худі oversize',
            shortName: 'Худі',
            icon: 'fa-shirt',
            image: 'images/hoodie-black.svg',
            imageAlt: 'Темне худі для друку',
            kind: 'apparel',
            previewWidth: 870,
            price: 799,
            colorLabel: 'Графіт',
            swatch: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
            description: 'Тепла база з окремими форматами під великий грудний принт і лого-розміщення.',
            material: 'Тринитка з начосом, 320 г/м²',
            printTech: 'DTF та шовкодрук',
            leadTime: '2-3 робочі дні',
            maxPrintHint: 'до 29 x 36 см',
            printHint: 'Для худі краще лишати трохи більше повітря зверху, щоб макет не заходив занадто близько до капюшона.',
            text: { min: 14, max: 44, default: 26 },
            printArea: { top: 30, left: 50, width: 44, height: 29, radius: 18 },
            formats: [
                { id: 'hoodie-xl', label: 'Фронт XL', widthMm: 290, heightMm: 360, width: 44, height: 29, note: 'Великий принт по центру грудей.' },
                { id: 'hoodie-m', label: 'Фронт M', widthMm: 240, heightMm: 300, width: 36, height: 24, note: 'Середній макет для більш повітряної посадки.' },
                { id: 'hoodie-heart', label: 'Серце', widthMm: 120, heightMm: 120, width: 17, height: 14, left: 40, top: 32, note: 'Компактний логотип зліва на грудях.' },
                { id: 'hoodie-pocket', label: 'Над кишенею', widthMm: 160, heightMm: 120, width: 22, height: 14, top: 45, note: 'Низьке розміщення над кишенею-кенгуру.' }
            ]
        },
        {
            id: 'mug-metal',
            name: 'Металева чашка',
            shortName: 'Металева чашка',
            icon: 'fa-mug-hot',
            image: 'images/mug-metal.svg',
            imageAlt: 'Металева чашка для друку',
            kind: 'drinkware',
            previewWidth: 780,
            price: 449,
            colorLabel: 'Сталевий металік',
            swatch: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
            defaultVariantId: 'chana-photo',
            variants: [
                {
                    id: 'chana-photo',
                    label: 'Фото',
                    colorLabel: 'Реальне фото',
                    swatch: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                    image: 'images/chana.jpg',
                    imageAlt: 'Металева чашка (фото)'
                },
                {
                    id: 'metal-render',
                    label: 'Макет',
                    colorLabel: 'Сталевий металік',
                    swatch: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
                    image: 'images/mug-metal.svg',
                    imageAlt: 'Металева чашка для друку'
                }
            ],
            description: 'Легка outdoor-чашка з окремими режимами під wrap і лого біля ручки.',
            material: 'Нержавіюча сталь',
            printTech: 'Сублімація та UV DTF',
            leadTime: '2-3 робочі дні',
            maxPrintHint: 'до 20 x 8.5 см',
            printHint: 'Для чашки не став важливі елементи впритул до ручки — залишай безпечний зазор по краях.',
            text: { min: 12, max: 34, default: 20 },
            printArea: { top: 16, left: 43, width: 60, height: 72, radius: 18 },
            formats: [
                { id: 'metal-wrap', label: 'Панорама 360', widthMm: 200, heightMm: 85, width: 60, height: 72, left: 43, top: 16, note: 'Панорамний принт по всій видимій площині чашки.' }
            ]
        },
        {
            id: 'mug-thermo',
            name: 'Термочашка',
            shortName: 'Термочашка',
            icon: 'fa-temperature-three-quarters',
            image: 'images/mug-thermo.svg',
            imageAlt: 'Термочашка для друку',
            kind: 'drinkware',
            previewWidth: 540,
            price: 589,
            colorLabel: 'Антрацит',
            swatch: 'linear-gradient(135deg, #111827 0%, #334155 100%)',
            description: 'Висока термочашка зі своїми вертикальними пропорціями друку.',
            material: 'Термосталь, soft-touch кришка',
            printTech: 'UV DTF та гравірування',
            leadTime: '2-3 робочі дні',
            maxPrintHint: 'до 22 x 12 см',
            printHint: 'На вузьких термочашках краще працюють вертикальні композиції та короткі слогани.',
            text: { min: 12, max: 30, default: 18 },
            printArea: { top: 24, left: 50, width: 30, height: 58, radius: 22 },
            formats: [
                { id: 'thermo-xl', label: 'Вертикаль XL', widthMm: 220, heightMm: 120, width: 30, height: 58, note: 'Високий вертикальний принт по центру.' },
                { id: 'thermo-m', label: 'Вертикаль M', widthMm: 180, heightMm: 100, width: 26, height: 48, note: 'Стриманий центральний формат для логотипу або фото.' },
                { id: 'thermo-logo', label: 'Лого', widthMm: 80, heightMm: 80, width: 18, height: 18, top: 38, note: 'Компактний логотип у центрі стакана.' },
                { id: 'thermo-strip', label: 'Смуга', widthMm: 220, heightMm: 60, width: 32, height: 16, top: 49, note: 'Горизонтальна стрічка для слогану.' }
            ]
        }
    ],

    state: {
        productId: 'tshirt-white',
        formatId: null,
        variantByProduct: {},
        mobilePanelId: 'mobile-panel-product',
        toolsSheetOpen: false
    },

    elements: {},
    previewImageEl: null,
    imageState: { x: 0, y: 0, scale: 1, rotate: 0 },
    imageDragState: { dragging: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 },
    textTranslationTimeoutId: null,

    cacheElements() {
        this.elements = {
            productSelector: document.getElementById('product-selector'),
            mobileToolsTabs: document.getElementById('mobile-tools-tabs'),
            mobileToolTabBtns: document.querySelectorAll('.mobile-tools-tab'),
            toolPanels: document.querySelectorAll('.tool-panel'),
            editorTools: document.querySelector('.editor-tools'),
            openEditorSheetBtn: document.getElementById('open-editor-sheet-btn'),
            closeEditorSheetBtn: document.getElementById('close-editor-sheet-btn'),
            editorToolsBackdrop: document.getElementById('editor-tools-backdrop'),
            selectedProductDescription: document.getElementById('selected-product-description'),
            selectedProductChip: document.getElementById('selected-product-chip'),
            selectedProductName: document.getElementById('selected-product-name'),
            previewDetailProduct: document.getElementById('preview-detail-product'),
            previewProductPill: document.getElementById('preview-product-pill'),
            previewFormatPill: document.getElementById('preview-format-pill'),
            productFormatSummary: document.getElementById('product-format-summary'),
            previewZoneInfo: document.getElementById('preview-zone-info'),
            productColorSelectorWrap: document.getElementById('product-color-selector-wrap'),
            productColorSelector: document.getElementById('product-color-selector'),
            productColorSwatch: document.getElementById('product-color-swatch'),
            productColorName: document.getElementById('product-color-name'),
            productMaterial: document.getElementById('product-material'),
            productPrintTech: document.getElementById('product-print-tech'),
            productLeadTime: document.getElementById('product-lead-time'),
            productMaxArea: document.getElementById('product-max-area'),
            productPrintHint: document.getElementById('product-print-hint'),
            priceValue: document.getElementById('price-value'),
            textInput: document.getElementById('text-input'),
            previewText: document.getElementById('preview-text'),
            colorPicker: document.getElementById('color-picker'),
            sizeSlider: document.getElementById('size-slider'),
            imageUpload: document.getElementById('image-upload'),
            imageUploadTrigger: document.getElementById('image-upload-trigger'),
            imageScale: document.getElementById('image-scale'),
            imageRotate: document.getElementById('image-rotate'),
            imageResetBtn: document.getElementById('image-reset-btn'),
            imageRemoveBtn: document.getElementById('image-remove-btn'),
            uploadLabel: document.getElementById('upload-label'),
            uploadLabelTitle: document.getElementById('upload-label-title'),
            uploadLabelSubtitle: document.getElementById('upload-label-subtitle'),
            printArea: document.getElementById('print-area'),
            printAreaBadge: document.getElementById('print-area-badge'),
            printCanvas: document.getElementById('print-canvas'),
            printDimensions: document.getElementById('print-dimensions'),
            formatNote: document.getElementById('format-note'),
            formatButtons: document.getElementById('format-buttons'),
            productMockupImage: document.getElementById('product-mockup-image'),
            mockupContainer: document.getElementById('mockup-container'),
            mockupStage: document.getElementById('mockup-stage'),
            addToCartBtn: document.getElementById('add-to-cart-btn')
        };
    },

    init() {
        this.cacheElements();
        if (!this.elements.productSelector || !this.elements.printArea) return;

        this.applyInitialRouteState();
        this.renderProductSelector();
        this.bindEvents();
        this.selectProduct(this.state.productId);
        this.updatePreviewText();
        this.updatePreviewColor();
        this.setupUploadDragAndDrop();
        this.setupMobileTools();
    },

    applyInitialRouteState() {
        const params = new URLSearchParams(window.location.search);
        const requestedProduct = params.get('product');
        const requestedFormat = params.get('format');
        const requestedText = params.get('text');

        if (requestedProduct && this.products.some((product) => product.id === requestedProduct)) {
            this.state.productId = requestedProduct;
        }

        if (requestedFormat) {
            this.state.formatId = requestedFormat;
        }

        if (requestedText && this.elements.textInput) {
            this.elements.textInput.value = requestedText;
        }
    },

    bindEvents() {
        this.elements.productSelector.addEventListener('click', (event) => {
            const button = event.target.closest('[data-product-id]');
            if (!button) return;
            this.selectProduct(button.getAttribute('data-product-id'));
        });

        if (this.elements.productColorSelector) {
            this.elements.productColorSelector.addEventListener('click', (event) => {
                const button = event.target.closest('[data-variant-id]');
                if (!button) return;
                this.selectProductVariant(button.getAttribute('data-variant-id'));
            });
        }

        this.elements.formatButtons.addEventListener('click', (event) => {
            const button = event.target.closest('[data-format-id]');
            if (!button) return;
            this.selectFormat(button.getAttribute('data-format-id'));
        });

        this.elements.textInput.addEventListener('input', () => this.handleTextInput());
        this.elements.textInput.addEventListener('blur', () => this.translateTextInputToUkrainian());
        this.elements.colorPicker.addEventListener('input', () => this.updatePreviewColor());
        this.elements.sizeSlider.addEventListener('input', () => this.updatePreviewSize());
        this.elements.imageUpload.addEventListener('change', (event) => {
            const file = event.target.files?.[0];
            if (file) this.handleImageUpload(file);
        });
        this.elements.imageUploadTrigger.addEventListener('click', () => this.elements.imageUpload.click());
        this.elements.imageScale.addEventListener('input', () => this.updateImageScale());
        this.elements.imageRotate.addEventListener('input', () => this.updateImageRotate());
        this.elements.imageResetBtn.addEventListener('click', () => this.resetImageEdits());
        this.elements.imageRemoveBtn.addEventListener('click', () => this.removeImage());
        this.elements.addToCartBtn.addEventListener('click', () => this.addToCartDemo());

        if (this.elements.mobileToolsTabs) {
            this.elements.mobileToolsTabs.addEventListener('click', (event) => {
                const tab = event.target.closest('[data-mobile-panel]');
                if (!tab) return;
                this.activateMobilePanel(tab.getAttribute('data-mobile-panel'));
            });
        }

        if (this.elements.openEditorSheetBtn) {
            this.elements.openEditorSheetBtn.addEventListener('click', () => this.openToolsSheet());
        }

        if (this.elements.closeEditorSheetBtn) {
            this.elements.closeEditorSheetBtn.addEventListener('click', () => this.closeToolsSheet());
        }

        if (this.elements.editorToolsBackdrop) {
            this.elements.editorToolsBackdrop.addEventListener('click', () => this.closeToolsSheet());
        }

        this.elements.printArea.addEventListener('click', (event) => {
            if (event.target.closest('.preview-image') || event.target.closest('#upload-label')) return;
            this.elements.textInput.focus();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.state.toolsSheetOpen) {
                this.closeToolsSheet();
            }
        });
    },

    isMobileViewport() {
        return window.matchMedia('(max-width: 768px)').matches;
    },

    setupMobileTools() {
        const sync = () => {
            this.applyMobileToolsState();
            this.applyToolsSheetState();
            this.syncDesktopToolsOffset();
        };
        sync();
        window.addEventListener('resize', sync);
    },

    activateMobilePanel(panelId) {
        if (!panelId) return;
        this.state.mobilePanelId = panelId;
        this.applyMobileToolsState();
    },

    applyMobileToolsState() {
        const fallbackPanelId = 'mobile-panel-product';
        const panelId = document.getElementById(this.state.mobilePanelId) ? this.state.mobilePanelId : fallbackPanelId;
        this.state.mobilePanelId = panelId;

        this.elements.mobileToolTabBtns?.forEach((tab) => {
            const isActive = tab.getAttribute('data-mobile-panel') === panelId;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        this.elements.toolPanels?.forEach((panel) => {
            panel.classList.toggle('is-active', panel.id === panelId);
        });
    },

    openToolsSheet() {
        if (!this.isMobileViewport()) return;
        this.state.toolsSheetOpen = true;
        this.applyToolsSheetState();
    },

    closeToolsSheet() {
        this.state.toolsSheetOpen = false;
        this.applyToolsSheetState();
    },

    applyToolsSheetState() {
        const isMobile = this.isMobileViewport();
        if (!isMobile) {
            this.state.toolsSheetOpen = false;
        }

        const isOpen = isMobile && this.state.toolsSheetOpen;

        if (this.elements.editorTools) {
            this.elements.editorTools.classList.toggle('is-open', isOpen);
        }

        if (this.elements.editorToolsBackdrop) {
            this.elements.editorToolsBackdrop.classList.toggle('is-open', isOpen);
        }

        if (this.elements.openEditorSheetBtn) {
            this.elements.openEditorSheetBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        document.body.classList.toggle('editor-sheet-open', isOpen);
    },

    syncDesktopToolsOffset() {
        const tools = this.elements.editorTools;
        const stage = this.elements.mockupStage;
        const parent = tools?.parentElement;
        if (!tools || !stage || !parent) return;

        if (!window.matchMedia('(min-width: 1024px)').matches) {
            tools.style.removeProperty('margin-top');
            return;
        }

        const offset = Math.max(0, Math.round(stage.getBoundingClientRect().top - parent.getBoundingClientRect().top));
        tools.style.setProperty('margin-top', `${offset}px`, 'important');
    },

    getProductById(productId) {
        return this.products.find((product) => product.id === productId) || this.products[0];
    },

    getSelectedProduct() {
        return this.getProductById(this.state.productId);
    },

    getSelectedVariant(product = this.getSelectedProduct()) {
        const variants = Array.isArray(product.variants) ? product.variants : [];
        if (!variants.length) return null;

        const storedVariantId = this.state.variantByProduct?.[product.id];
        return variants.find((variant) => variant.id === storedVariantId)
            || variants.find((variant) => variant.id === product.defaultVariantId)
            || variants[0];
    },

    getProductVisual(product = this.getSelectedProduct()) {
        const variant = this.getSelectedVariant(product);
        return {
            image: variant?.image || product.image,
            imageAlt: variant?.imageAlt || product.imageAlt,
            colorLabel: variant?.colorLabel || product.colorLabel,
            swatch: variant?.swatch || product.swatch
        };
    },

    getPreviewProductLabel(product = this.getSelectedProduct()) {
        const variant = this.getSelectedVariant(product);
        const variantLabel = (variant?.label || '').trim();
        const shortName = (product?.shortName || '').trim();

        // For apparel variants like "Біла/Чорна", show variant + base name in the preview pills.
        if (product?.kind === 'apparel' && variantLabel && shortName) {
            return `${variantLabel} ${shortName.toLowerCase()}`;
        }

        return product?.name || '';
    },

    extractPrimarySwatchColor(swatch = '') {
        if (typeof swatch !== 'string' || !swatch) return null;

        const hexMatch = swatch.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
        if (!hexMatch) return null;

        let hex = hexMatch[1];
        if (hex.length === 3) {
            hex = hex.split('').map((ch) => ch + ch).join('');
        }

        return `#${hex.toLowerCase()}`;
    },

    isDarkColor(hexColor) {
        if (typeof hexColor !== 'string' || !/^#[0-9a-f]{6}$/i.test(hexColor)) {
            return false;
        }

        const red = parseInt(hexColor.slice(1, 3), 16);
        const green = parseInt(hexColor.slice(3, 5), 16);
        const blue = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
        return luminance < 150;
    },

    updateUploadPromptTone(visual = this.getProductVisual()) {
        const titleEl = this.elements.uploadLabelTitle;
        const subtitleEl = this.elements.uploadLabelSubtitle;
        if (!titleEl || !subtitleEl) return;

        const swatchColor = this.extractPrimarySwatchColor(visual?.swatch);
        const useLightText = swatchColor ? this.isDarkColor(swatchColor) : false;

        const titleColor = useLightText ? '#f8fafc' : '#0f172a';
        const subtitleColor = useLightText ? '#dbeafe' : '#334155';
        const textShadow = useLightText ? '0 1px 2px rgba(15, 23, 42, 0.45)' : 'none';

        titleEl.style.setProperty('color', titleColor, 'important');
        subtitleEl.style.setProperty('color', subtitleColor, 'important');
        titleEl.style.setProperty('text-shadow', textShadow);
        subtitleEl.style.setProperty('text-shadow', textShadow);
    },

    getSelectedFormat() {
        const product = this.getSelectedProduct();
        return product.formats.find((format) => format.id === this.state.formatId) || product.formats[0];
    },

    renderProductSelector() {
        this.elements.productSelector.innerHTML = this.products.map((product) => `
            <button type="button" class="product-option" data-product-id="${product.id}" aria-pressed="false">
                <span class="product-option__icon"><i class="fa-solid ${product.icon}"></i></span>
                <span>
                    <span class="product-option__title">${product.name}</span>
                    <span class="product-option__meta">${product.description}</span>
                </span>
            </button>
        `).join('');
    },

    renderProductColorSelector() {
        if (!this.elements.productColorSelector || !this.elements.productColorSelectorWrap) return;

        const product = this.getSelectedProduct();
        const variants = Array.isArray(product.variants) ? product.variants : [];

        if (!variants.length) {
            this.elements.productColorSelector.innerHTML = '';
            this.elements.productColorSelectorWrap.classList.add('hidden');
            return;
        }

        this.elements.productColorSelectorWrap.classList.remove('hidden');
        this.elements.productColorSelector.innerHTML = variants.map((variant) => `
            <button
                type="button"
                class="product-color-btn"
                data-variant-id="${variant.id}"
                aria-pressed="false"
                title="${variant.label}"
            >
                <span class="product-color-btn__swatch" style="background:${variant.swatch};"></span>
                <span class="product-color-btn__label">${variant.label}</span>
            </button>
        `).join('');

        this.syncProductVariantButtons();
    },

    syncProductVariantButtons() {
        if (!this.elements.productColorSelector) return;
        const selectedVariant = this.getSelectedVariant();
        const selectedVariantId = selectedVariant?.id;

        this.elements.productColorSelector.querySelectorAll('[data-variant-id]').forEach((button) => {
            const isActive = button.getAttribute('data-variant-id') === selectedVariantId;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    },

    selectProductVariant(variantId) {
        const product = this.getSelectedProduct();
        const variants = Array.isArray(product.variants) ? product.variants : [];
        if (!variants.length) return;

        const chosenVariant = variants.find((variant) => variant.id === variantId) || variants[0];
        this.state.variantByProduct[product.id] = chosenVariant.id;
        this.updateProductMeta(product);
        this.updateProductMockup(product);
        this.syncProductVariantButtons();
    },

    renderFormatButtons() {
        const product = this.getSelectedProduct();
        this.elements.formatButtons.innerHTML = product.formats.map((format) => `
            <button type="button" class="format-btn" data-format-id="${format.id}" aria-pressed="false">
                <span class="format-btn__title">${format.label}</span>
                <span class="format-btn__meta">${format.widthMm} x ${format.heightMm} мм</span>
            </button>
        `).join('');
    },

    selectProduct(productId, options = {}) {
        const product = this.getProductById(productId);
        this.state.productId = product.id;

        if (Array.isArray(product.variants) && product.variants.length) {
            const currentVariantId = this.state.variantByProduct[product.id];
            const hasStoredVariant = product.variants.some((variant) => variant.id === currentVariantId);
            if (!hasStoredVariant) {
                this.state.variantByProduct[product.id] = product.defaultVariantId || product.variants[0].id;
            }
        }

        this.renderFormatButtons();
        this.renderProductColorSelector();
        this.syncProductButtons();
        this.configureTextSlider(product);
        this.updateProductMeta(product);
        this.updateProductMockup(product);
        this.elements.mockupContainer.style.setProperty('--mockup-max-width', `${product.previewWidth}px`);
        this.elements.mockupStage.dataset.productKind = product.kind;
        this.elements.printCanvas.dataset.productKind = product.kind;

        const nextFormatId = product.formats.some((format) => format.id === options.formatId)
            ? options.formatId
            : product.formats.some((format) => format.id === this.state.formatId)
                ? this.state.formatId
                : product.formats[0].id;

        this.selectFormat(nextFormatId);
        this.resetImageEdits({ keepPreview: true });
        this.updateCanvasLayout();
        this.syncDesktopToolsOffset();
    },

    updateProductMockup(product = this.getSelectedProduct()) {
        const visual = this.getProductVisual(product);
        this.elements.productMockupImage.src = visual.image;
        this.elements.productMockupImage.alt = visual.imageAlt;
    },

    syncProductButtons() {
        this.elements.productSelector.querySelectorAll('[data-product-id]').forEach((button) => {
            const isActive = button.getAttribute('data-product-id') === this.state.productId;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    },

    configureTextSlider(product) {
        const slider = this.elements.sizeSlider;
        const currentValue = Number(slider.value || product.text.default);
        slider.min = String(product.text.min);
        slider.max = String(product.text.max);
        slider.value = String(Math.min(product.text.max, Math.max(product.text.min, currentValue || product.text.default)));
        this.updatePreviewSize();
    },

    selectFormat(formatId) {
        const product = this.getSelectedProduct();
        const format = product.formats.find((item) => item.id === formatId) || product.formats[0];
        this.state.formatId = format.id;

        this.elements.printArea.style.setProperty('--print-top', `${format.top ?? product.printArea.top}%`);
        this.elements.printArea.style.setProperty('--print-left', `${format.left ?? product.printArea.left}%`);
        this.elements.printArea.style.setProperty('--print-w', `${format.width ?? product.printArea.width}%`);
        this.elements.printArea.style.setProperty('--print-h', `${format.height ?? product.printArea.height}%`);
        this.elements.printArea.style.setProperty('--print-radius', `${format.radius ?? product.printArea.radius}px`);

        this.elements.printAreaBadge.textContent = `${format.label} • ${format.widthMm} x ${format.heightMm} мм`;
        this.elements.printDimensions.textContent = `${format.widthMm} x ${format.heightMm} мм`;
        this.elements.formatNote.textContent = format.note;
        this.elements.previewFormatPill.innerHTML = `<i class="fa-solid fa-ruler-combined"></i>${format.label} • ${format.widthMm} x ${format.heightMm} мм`;
        this.elements.productFormatSummary.textContent = `${format.label} — ${format.note}`;
        this.syncFormatButtons();
    },

    syncFormatButtons() {
        this.elements.formatButtons.querySelectorAll('[data-format-id]').forEach((button) => {
            const isActive = button.getAttribute('data-format-id') === this.state.formatId;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    },

    updateProductMeta(product) {
        const visual = this.getProductVisual(product);
        const previewProductLabel = this.getPreviewProductLabel(product);

        this.elements.selectedProductDescription.textContent = product.description;
        this.elements.selectedProductChip.textContent = previewProductLabel;
        this.elements.selectedProductName.textContent = `${previewProductLabel} для кастомного друку`;
        this.elements.previewDetailProduct.textContent = previewProductLabel;
        this.elements.previewProductPill.innerHTML = `<i class="fa-solid ${product.icon}"></i>${previewProductLabel}`;
        this.elements.previewZoneInfo.textContent = product.maxPrintHint;
        this.elements.productColorName.textContent = visual.colorLabel;
        this.elements.productColorSwatch.style.background = visual.swatch;
        this.updateUploadPromptTone(visual);
        this.elements.productMaterial.textContent = product.material;
        this.elements.productPrintTech.textContent = product.printTech;
        this.elements.productLeadTime.textContent = product.leadTime;
        this.elements.productMaxArea.textContent = product.maxPrintHint;
        this.elements.productPrintHint.textContent = product.printHint;
        this.elements.priceValue.textContent = `${product.price} грн`;
    },

    handleTextInput() {
        this.updatePreviewText();
        this.scheduleTextTranslation();
    },

    scheduleTextTranslation() {
        if (this.textTranslationTimeoutId) {
            window.clearTimeout(this.textTranslationTimeoutId);
        }

        this.textTranslationTimeoutId = window.setTimeout(() => {
            this.textTranslationTimeoutId = null;
            this.translateTextInputToUkrainian();
        }, 240);
    },

    translateTextInputToUkrainian() {
        const input = this.elements.textInput;
        if (!input) return;

        const source = input.value || '';
        const translated = this.translateRussianText(source);
        if (!translated || translated === source) return;

        const isFocused = document.activeElement === input;
        input.value = translated;

        if (isFocused && typeof input.setSelectionRange === 'function') {
            input.setSelectionRange(translated.length, translated.length);
        }

        this.updatePreviewText(translated);
    },

    translateRussianText(text) {
        if (!/[А-Яа-яЁё]/.test(text)) return text;
        let output = text;

        RU_TO_UA_PHRASE_MAP.forEach((uaPhrase, ruPhrase) => {
            const phrasePattern = new RegExp(this.escapeRegex(ruPhrase), 'gi');
            output = output.replace(phrasePattern, (match) => this.applyWordCase(match, uaPhrase));
        });

        output = output.replace(CYRILLIC_TOKEN_REGEX, (token) => this.translateRussianToken(token));
        return output;
    },

    translateRussianToken(token) {
        if (!/[А-Яа-яЁё]/.test(token)) return token;
        if (/[ІіЇїЄєҐґ]/.test(token) && !/[ЁёЫыЭэЪъ]/.test(token)) return token;

        if (token.includes('-')) {
            return token
                .split('-')
                .map((part) => this.translateRussianToken(part))
                .join('-');
        }

        const loweredToken = token.toLowerCase();
        const dictionaryHit = RU_TO_UA_WORD_MAP.get(loweredToken);
        if (dictionaryHit) {
            return this.applyWordCase(token, dictionaryHit);
        }

        if (/[ЁёЫыЭэЪъ]/.test(token)) {
            const normalized = loweredToken
                .replace(/ё/g, 'йо')
                .replace(/ы/g, 'и')
                .replace(/э/g, 'е')
                .replace(/ъ/g, '');
            return this.applyWordCase(token, normalized);
        }

        return token;
    },

    applyWordCase(source, target) {
        if (!source) return target;

        if (source === source.toUpperCase()) {
            return target.toUpperCase();
        }

        const isCapitalized =
            source[0] === source[0].toUpperCase() &&
            source.slice(1) === source.slice(1).toLowerCase();
        if (isCapitalized) {
            return `${target.charAt(0).toUpperCase()}${target.slice(1)}`;
        }

        return target;
    },

    escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    updatePreviewText(previewValue = this.elements.textInput.value || '') {
        const value = previewValue.trim();
        this.elements.previewText.textContent = value ? value.toUpperCase() : '';
        this.elements.previewText.style.opacity = value ? '1' : '0';
        this.updateUploadPromptVisibility();
        this.updateCanvasLayout();
    },

    updatePreviewColor() {
        this.elements.previewText.style.color = this.elements.colorPicker.value;
    },

    updatePreviewSize() {
        this.elements.previewText.style.fontSize = `${this.elements.sizeSlider.value}px`;
    },

    updateUploadPromptVisibility() {
        const hasText = this.elements.textInput.value.trim().length > 0;
        const hasImage = Boolean(this.previewImageEl);
        this.elements.uploadLabel.classList.toggle('hidden', hasText || hasImage);
    },

    updateCanvasLayout() {
        const hasText = this.elements.textInput.value.trim().length > 0;
        const hasImage = Boolean(this.previewImageEl);
        let layout = 'empty';

        if (hasText && hasImage) {
            layout = 'split';
        } else if (hasText) {
            layout = 'text-only';
        } else if (hasImage) {
            layout = 'image-only';
        }

        this.elements.printCanvas.dataset.layout = layout;
    },

    handleImageUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (this.previewImageEl) {
                this.previewImageEl.remove();
            }

            const image = document.createElement('img');
            image.src = event.target.result;
            image.alt = 'Завантажений принт';
            image.className = 'preview-image';
            image.draggable = false;
            this.elements.printCanvas.appendChild(image);
            this.previewImageEl = image;

            this.resetImageEdits({ keepPreview: true });
            this.bindImageDrag(image);
            this.updateUploadPromptVisibility();
            this.updateCanvasLayout();
        };

        reader.readAsDataURL(file);
    },

    bindImageDrag(image) {
        image.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            image.setPointerCapture(event.pointerId);
            this.imageDragState.dragging = true;
            this.imageDragState.startX = event.clientX;
            this.imageDragState.startY = event.clientY;
            this.imageDragState.startOffsetX = this.imageState.x;
            this.imageDragState.startOffsetY = this.imageState.y;
        });

        image.addEventListener('pointermove', (event) => {
            if (!this.imageDragState.dragging) return;
            const deltaX = event.clientX - this.imageDragState.startX;
            const deltaY = event.clientY - this.imageDragState.startY;
            this.imageState.x = this.imageDragState.startOffsetX + deltaX;
            this.imageState.y = this.imageDragState.startOffsetY + deltaY;
            this.applyImageTransform();
        });

        const stopDrag = () => {
            this.imageDragState.dragging = false;
        };

        image.addEventListener('pointerup', stopDrag);
        image.addEventListener('pointercancel', stopDrag);
        image.addEventListener('lostpointercapture', stopDrag);
    },

    applyImageTransform() {
        if (!this.previewImageEl) return;
        const { x, y, scale, rotate } = this.imageState;
        this.previewImageEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotate}deg)`;
    },

    updateImageScale() {
        this.imageState.scale = Number(this.elements.imageScale.value) / 100;
        this.applyImageTransform();
    },

    updateImageRotate() {
        this.imageState.rotate = Number(this.elements.imageRotate.value);
        this.applyImageTransform();
    },

    resetImageEdits(options = {}) {
        this.imageState = { x: 0, y: 0, scale: 1, rotate: 0 };
        this.elements.imageScale.value = '100';
        this.elements.imageRotate.value = '0';

        if (!options.keepPreview && this.previewImageEl) {
            this.previewImageEl.remove();
            this.previewImageEl = null;
            this.elements.imageUpload.value = '';
        }

        this.applyImageTransform();
        this.updateUploadPromptVisibility();
        this.updateCanvasLayout();
    },

    removeImage() {
        if (this.previewImageEl) {
            this.previewImageEl.remove();
            this.previewImageEl = null;
        }
        this.elements.imageUpload.value = '';
        this.resetImageEdits({ keepPreview: true });
    },

    setupUploadDragAndDrop() {
        const area = this.elements.printArea;
        const highlight = () => area.classList.add('upload-active');
        const clear = () => area.classList.remove('upload-active');

        area.addEventListener('dragover', (event) => {
            event.preventDefault();
            highlight();
        });

        area.addEventListener('dragenter', (event) => {
            event.preventDefault();
            highlight();
        });

        area.addEventListener('dragleave', (event) => {
            if (area.contains(event.relatedTarget)) return;
            clear();
        });

        area.addEventListener('drop', (event) => {
            event.preventDefault();
            clear();
            const file = event.dataTransfer?.files?.[0];
            if (file) {
                this.handleImageUpload(file);
            }
        });
    },

    addToCartDemo() {
        this.translateTextInputToUkrainian();
        const product = this.getSelectedProduct();
        const visual = this.getProductVisual(product);
        const format = this.getSelectedFormat();
        const text = this.elements.textInput.value.trim() || 'Без тексту';
        alert(`Демо-товар додано в кошик.\nОснова: ${product.name}\nКолір: ${visual.colorLabel}\nФормат: ${format.label} (${format.widthMm} x ${format.heightMm} мм)\nТекст: ${text}\nЦіна від: ${product.price} грн`);
    }
};

window.Editor = Editor;


