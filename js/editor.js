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
            name: 'Базова футболка',
            shortName: 'Футболка',
            icon: 'fa-shirt',
            image: 'images/%D0%BF%D1%83%D1%81%D1%82%D0%B0%202.jpg',
            imageAlt: 'Базова футболка для друку',
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
                    imageAlt: 'Базова футболка для друку'
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
            maxPrintHint: 'до 42 x 59.4 см',
            printHint: 'Залишай 2-3 см від краю без важливих елементів — так дизайн виглядатиме чисто після друку.',
            text: { min: 14, max: 52, default: 28 },
            printArea: { top: 31, left: 50, width: 41, height: 49, radius: 12 },
            formats: [
                { id: 'tee-a2', label: 'A2', widthMm: 420, heightMm: 594, width: 41, height: 49, top: 31, note: 'Максимальна фронтальна зона для великих ілюстрацій.' },
                { id: 'tee-a3', label: 'A3', widthMm: 297, heightMm: 420, width: 34, height: 41, top: 34, note: 'Стандартна зона для центрального принта.' },
                { id: 'tee-a4', label: 'A4', widthMm: 210, heightMm: 297, width: 28, height: 34, top: 37, note: 'Комфортний формат для логотипів і середніх макетів.' },
                { id: 'tee-a5', label: 'A5', widthMm: 148, heightMm: 210, width: 22, height: 27, top: 40, note: 'Акуратний варіант для невеликих написів і знаків.' }
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
            maxPrintHint: 'до 42 x 59.4 см',
            printHint: 'Для худі краще лишати трохи більше повітря зверху, щоб макет не заходив занадто близько до капюшона.',
            text: { min: 14, max: 44, default: 26 },
            printArea: { top: 27, left: 50, width: 38, height: 54, radius: 18 },
            formats: [
                { id: 'hoodie-a2', label: 'A2', widthMm: 420, heightMm: 594, width: 45, height: 64, top: 23, note: 'Максимальна фронтальна зона для великого принта.' },
                { id: 'hoodie-a3', label: 'A3', widthMm: 297, heightMm: 420, width: 38, height: 54, top: 27, note: 'Стандартна центральна зона для щоденного макета.' },
                { id: 'hoodie-a4', label: 'A4', widthMm: 210, heightMm: 297, width: 31, height: 44, top: 32, note: 'Середній формат під текст або логотип.' },
                { id: 'hoodie-a5', label: 'A5', widthMm: 148, heightMm: 210, width: 24, height: 34, top: 36, note: 'Компактний варіант для мінімалістичного дизайну.' }
            ]
        },
        {
            id: 'mug-metal',
            name: 'Керамічна чашка',
            shortName: 'Керамічна чашка',
            icon: 'fa-mug-hot',
            image: 'images/mug-metal.svg',
            imageAlt: 'Керамічна чашка для друку',
            kind: 'drinkware',
            previewWidth: 780,
            price: 449,
            colorLabel: 'Біла кераміка',
            swatch: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #e2e8f0 100%)',
            defaultVariantId: 'chana-photo',
            variants: [
                {
                    id: 'chana-photo',
                    label: 'Фото',
                    colorLabel: 'Реальне фото',
                    swatch: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                    image: 'images/chana.jpg',
                    imageAlt: 'Керамічна чашка (фото)'
                },
                {
                    id: 'metal-render',
                    label: 'Макет',
                    colorLabel: 'Біла кераміка',
                    swatch: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #e2e8f0 100%)',
                    image: 'images/mug-metal.svg',
                    imageAlt: 'Керамічна чашка для друку'
                }
            ],
            description: 'Класична керамічна чашка для повсякденного використання з панорамним друком.',
            material: 'Кераміка',
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
        mobilePanelId: 'mobile-panel-media',
        toolsSheetOpen: false
    },

    elements: {},
    previewImageEl: null,
    imageTransformBoxEl: null,
    imageIdCounter: 0,
    imageSourceById: {},
    imageHistoryStack: [],
    isRestoringImageSnapshot: false,
    imageScaleGestureActive: false,
    designDirty: true,
    savedDesignPreview: null,
    savedDesignKey: null,
    imageState: { x: 0, y: 0, scale: 1, rotate: 0 },
    imageDragState: { dragging: false, pointerId: null, imageId: null, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, historyPushed: false },
    imageResizeState: {
        active: false,
        pointerId: null,
        axis: 'both',
        startScale: 1,
        startStretchX: 1,
        startStretchY: 1,
        startDistance: 1,
        centerX: 0,
        centerY: 0
    },
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
            imageOrientationControls: document.getElementById('image-orientation-controls'),
            imageOrientationButtons: document.querySelectorAll('[data-image-orientation]'),
            imageRotateBtn: document.getElementById('image-rotate-btn'),
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
            saveDesignBtn: document.getElementById('save-design-btn'),
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
        this.applyConstructorOrderControlsState();
        this.syncImageRotateButtonState();
    },

    applyInitialRouteState() {
        const params = new URLSearchParams(window.location.search);
        const requestedProduct = params.get('product');
        const requestedFormat = params.get('format');
        const requestedText = params.get('text');
        const requestedPanel = params.get('panel');

        if (requestedProduct && this.products.some((product) => product.id === requestedProduct)) {
            this.state.productId = requestedProduct;
        }

        if (requestedFormat) {
            this.state.formatId = requestedFormat;
        }

        if (requestedText && this.elements.textInput) {
            this.elements.textInput.value = requestedText;
        }

        if (requestedPanel) {
            const panelId = requestedPanel === 'media'
                ? 'mobile-panel-media'
                : requestedPanel === 'text'
                    ? 'mobile-panel-text'
                    : requestedPanel === 'order'
                        ? 'mobile-panel-order'
                        : requestedPanel === 'product'
                            ? 'mobile-panel-product'
                            : null;
            if (panelId) {
                this.state.mobilePanelId = panelId;
            }
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

        this.elements.textInput.addEventListener('input', () => {
            this.markDesignDirty();
            this.handleTextInput();
        });
        this.elements.textInput.addEventListener('blur', () => this.translateTextInputToUkrainian());
        this.elements.colorPicker.addEventListener('input', () => {
            this.markDesignDirty();
            this.updatePreviewColor();
        });
        this.elements.sizeSlider.addEventListener('input', () => {
            this.markDesignDirty();
            this.updatePreviewSize();
        });
        this.elements.imageUpload.addEventListener('change', (event) => {
            const files = Array.from(event.target.files || []).filter((file) => file.type?.startsWith('image/'));
            files.forEach((file, index) => this.handleImageUpload(file, { recordHistory: index === 0 }));
        });
        this.elements.imageUploadTrigger.addEventListener('click', () => this.elements.imageUpload.click());
        this.elements.imageScale.addEventListener('pointerdown', () => {
            if (!this.previewImageEl || this.imageScaleGestureActive) return;
            this.pushImageHistorySnapshot();
            this.imageScaleGestureActive = true;
            this.markDesignDirty();
        });
        this.elements.imageScale.addEventListener('pointerup', () => {
            this.imageScaleGestureActive = false;
        });
        this.elements.imageScale.addEventListener('pointercancel', () => {
            this.imageScaleGestureActive = false;
        });
        this.elements.imageScale.addEventListener('change', () => {
            this.imageScaleGestureActive = false;
        });
        this.elements.imageScale.addEventListener('input', () => this.updateImageScale());
        if (this.elements.imageOrientationControls) {
            this.elements.imageOrientationControls.addEventListener('click', (event) => {
                const button = event.target.closest('#image-rotate-btn');
                if (!button) return;
                this.rotateImageClockwise();
            });
        }
        this.elements.saveDesignBtn?.addEventListener('click', () => this.saveCurrentDesign());
        this.elements.imageResetBtn.addEventListener('click', () => this.undoLastImageAction());
        this.elements.imageRemoveBtn.addEventListener('click', () => this.removeImage());
        this.elements.addToCartBtn.addEventListener('click', () => this.addToCartDemo());
        this.elements.productMockupImage?.addEventListener('load', () => this.updateImageTransformBox());

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
            if (event.target.closest('.preview-image') || event.target.closest('.image-transform-handle') || event.target.closest('#upload-label')) return;
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
            this.updateImageTransformBox();
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
        const fallbackPanelId = 'mobile-panel-media';
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

    getConstructorOrderTitle(product = this.getSelectedProduct()) {
        if (!product) return 'Товар з власним принтом';

        if (product.id === 'tshirt-white') {
            return 'Футболка з власним принтом';
        }

        if (product.id === 'hoodie-black') {
            return 'Худі з власним принтом';
        }

        if (product.id === 'mug-metal') {
            return 'Чашка з власним принтом';
        }

        if (product.id === 'mug-thermo') {
            return 'Термочашка з власним принтом';
        }

        return `${product.name} з власним принтом`;
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
        this.markDesignDirty();
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
        this.resetAllImageTransforms();
        this.updateCanvasLayout();
        this.syncDesktopToolsOffset();
        this.markDesignDirty();
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
        window.requestAnimationFrame(() => this.updateImageTransformBox());
        window.setTimeout(() => this.updateImageTransformBox(), 280);
        this.markDesignDirty();
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

    applyConstructorOrderControlsState() {
        const addButton = this.elements.addToCartBtn;
        if (!addButton) return;

        const isReady = !this.designDirty && Boolean(this.savedDesignPreview);
        addButton.disabled = !isReady;
        addButton.classList.toggle('opacity-60', !isReady);
        addButton.classList.toggle('pointer-events-none', !isReady);
    },

    markDesignDirty() {
        this.designDirty = true;
        this.applyConstructorOrderControlsState();
    },

    resolveCssLength(value, base) {
        if (typeof value === 'number') return value;
        const normalized = String(value || '').trim();
        if (!normalized) return 0;
        if (normalized.endsWith('%')) {
            const percent = Number.parseFloat(normalized.slice(0, -1));
            return Number.isFinite(percent) ? (base * percent) / 100 : 0;
        }
        const px = Number.parseFloat(normalized);
        return Number.isFinite(px) ? px : 0;
    },

    buildDesignSnapshotDataUrl() {
        const mockupImage = this.elements.productMockupImage;
        const printArea = this.elements.printArea;
        if (!mockupImage || !printArea) return null;
        if (!mockupImage.complete || !mockupImage.naturalWidth || !mockupImage.naturalHeight) {
            return null;
        }

        const mockupRect = mockupImage.getBoundingClientRect();
        const printAreaRect = printArea.getBoundingClientRect();
        if (!mockupRect.width || !mockupRect.height) return null;

        const sourceWidth = mockupImage.naturalWidth;
        const sourceHeight = mockupImage.naturalHeight;
        const maxSide = 960;
        const downscale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(sourceWidth * downscale));
        canvas.height = Math.max(1, Math.round(sourceHeight * downscale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const ratioX = canvas.width / mockupRect.width;
        const ratioY = canvas.height / mockupRect.height;

        ctx.drawImage(mockupImage, 0, 0, canvas.width, canvas.height);

        const clipX = (printAreaRect.left - mockupRect.left) * ratioX;
        const clipY = (printAreaRect.top - mockupRect.top) * ratioY;
        const clipW = printAreaRect.width * ratioX;
        const clipH = printAreaRect.height * ratioY;
        const printCanvasRect = this.elements.printCanvas.getBoundingClientRect();

        ctx.save();
        ctx.beginPath();
        ctx.rect(clipX, clipY, clipW, clipH);
        ctx.clip();

        this.getImageLayers().forEach((layer) => {
            if (!layer.complete) return;
            const state = this.getImageState(layer);
            const computed = window.getComputedStyle(layer);
            const anchorLeft = this.resolveCssLength(computed.left, printCanvasRect.width);
            const anchorTop = this.resolveCssLength(computed.top, printCanvasRect.height);

            const centerX = clipX + (anchorLeft + state.x) * ratioX;
            const centerY = clipY + (anchorTop + state.y) * ratioY;
            const baseW = layer.clientWidth * ratioX;
            const baseH = layer.clientHeight * ratioY;
            const scaleX = state.scale * state.stretchX;
            const scaleY = state.scale * state.stretchY;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((state.rotate * Math.PI) / 180);
            ctx.scale(scaleX, scaleY);
            ctx.drawImage(layer, -baseW / 2, -baseH / 2, baseW, baseH);
            ctx.restore();
        });

        const previewText = this.elements.previewText;
        const textValue = previewText?.textContent?.trim() || '';
        if (previewText && textValue) {
            const textRect = previewText.getBoundingClientRect();
            const textCenterX = (textRect.left - mockupRect.left + textRect.width / 2) * ratioX;
            const textCenterY = (textRect.top - mockupRect.top + textRect.height / 2) * ratioY;
            const textStyle = window.getComputedStyle(previewText);
            const fontSize = Math.max(12, Number.parseFloat(textStyle.fontSize || '24') * ((ratioX + ratioY) / 2) * 0.9);
            ctx.save();
            ctx.fillStyle = textStyle.color || '#1e40af';
            ctx.font = `800 ${fontSize}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(textValue, textCenterX, textCenterY);
            ctx.restore();
        }

        ctx.restore();
        return canvas.toDataURL('image/jpeg', 0.82);
    },

    saveCurrentDesign() {
        const snapshot = this.buildDesignSnapshotDataUrl();
        if (!snapshot) {
            window.UI?.showToast?.('Не вдалося зберегти макет. Спробуйте ще раз.', { tone: 'warning' });
            return;
        }

        this.savedDesignPreview = snapshot;
        this.savedDesignKey = `constructor-design-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        this.designDirty = false;
        this.applyConstructorOrderControlsState();
        window.UI?.showToast?.('Макет збережено', { tone: 'info' });
    },

    createDefaultImageState() {
        return { x: 0, y: 0, scale: 1, stretchX: 1, stretchY: 1, rotate: 0 };
    },

    getImageLayers() {
        return Array.from(this.elements.printCanvas?.querySelectorAll('.preview-image') || []);
    },

    getImageState(image) {
        if (!image) return this.createDefaultImageState();
        if (!image.__imageState) {
            image.__imageState = this.createDefaultImageState();
        }
        return image.__imageState;
    },

    setImageState(image, nextState) {
        if (!image) return;
        image.__imageState = {
            x: Number(nextState?.x || 0),
            y: Number(nextState?.y || 0),
            scale: this.clampImageScale(Number(nextState?.scale || 1)),
            stretchX: this.clampImageStretch(Number(nextState?.stretchX || 1)),
            stretchY: this.clampImageStretch(Number(nextState?.stretchY || 1)),
            rotate: Number(nextState?.rotate || 0)
        };
    },

    setActiveImage(image, options = {}) {
        const syncControls = options.syncControls !== false;
        const layers = this.getImageLayers();
        layers.forEach((layer) => layer.classList.remove('is-active'));

        const nextImage = image && layers.includes(image) ? image : null;
        this.previewImageEl = nextImage;

        if (!nextImage) {
            this.imageState = this.createDefaultImageState();
            if (syncControls) {
                this.syncImageScaleControl();
                this.syncImageOrientationButtons('landscape');
            }
            this.syncImageRotateButtonState();
            this.updateImageTransformBox();
            return;
        }

        nextImage.classList.add('is-active');
        this.imageState = { ...this.getImageState(nextImage) };
        if (syncControls) {
            this.syncImageScaleControl();
            this.syncImageOrientationButtons(this.imageState.rotate === 90 ? 'portrait' : 'landscape');
        }
        this.syncImageRotateButtonState();
        this.updateImageTransformBox();
    },

    syncImageRotateButtonState() {
        const button = this.elements.imageRotateBtn;
        if (!button) return;
        const hasImage = Boolean(this.previewImageEl);
        button.disabled = !hasImage;
        button.classList.toggle('is-active', hasImage);
        button.classList.toggle('is-disabled', !hasImage);
        button.setAttribute('aria-disabled', hasImage ? 'false' : 'true');
    },

    resetAllImageTransforms() {
        this.imageHistoryStack = [];
        this.imageScaleGestureActive = false;
        const layers = this.getImageLayers();

        if (!layers.length) {
            this.setActiveImage(null, { syncControls: true });
            this.updateUploadPromptVisibility();
            this.updateCanvasLayout();
            return;
        }

        layers.forEach((layer) => {
            this.setImageState(layer, this.createDefaultImageState());
            this.applyImageTransformToImage(layer, { updateBox: false });
        });

        const nextActive = this.previewImageEl && layers.includes(this.previewImageEl)
            ? this.previewImageEl
            : layers[layers.length - 1];

        this.setActiveImage(nextActive, { syncControls: true });
        this.updateUploadPromptVisibility();
        this.updateCanvasLayout();
        this.updateImageTransformBox();
    },

    captureImageSnapshot() {
        return {
            layers: this.getImageLayers().map((layer) => ({
                id: layer.dataset.imageId,
                state: { ...this.getImageState(layer) }
            })),
            activeImageId: this.previewImageEl?.dataset.imageId || null
        };
    },

    isSameImageSnapshot(first, second) {
        if (!first || !second) return false;
        return JSON.stringify(first) === JSON.stringify(second);
    },

    pushImageHistorySnapshot() {
        if (this.isRestoringImageSnapshot) return;
        const snapshot = this.captureImageSnapshot();
        const prevSnapshot = this.imageHistoryStack[this.imageHistoryStack.length - 1];
        if (prevSnapshot && this.isSameImageSnapshot(prevSnapshot, snapshot)) return;
        this.imageHistoryStack.push(snapshot);
        if (this.imageHistoryStack.length > 80) {
            this.imageHistoryStack.shift();
        }
    },

    undoLastImageAction() {
        if (!this.imageHistoryStack.length) return;
        const currentSnapshot = this.captureImageSnapshot();
        let targetSnapshot = this.imageHistoryStack.pop();

        while (targetSnapshot && this.isSameImageSnapshot(targetSnapshot, currentSnapshot)) {
            targetSnapshot = this.imageHistoryStack.pop();
        }

        if (!targetSnapshot) return;
        this.restoreImageSnapshot(targetSnapshot);
        this.markDesignDirty();
    },

    restoreImageSnapshot(snapshot) {
        if (!snapshot) return;

        this.isRestoringImageSnapshot = true;
        this.imageScaleGestureActive = false;
        this.getImageLayers().forEach((layer) => layer.remove());

        const restoredLayers = [];
        snapshot.layers.forEach((layerSnapshot) => {
            const source = this.imageSourceById[layerSnapshot.id];
            if (!source) return;
            const layer = this.createImageLayer({
                id: layerSnapshot.id,
                src: source,
                state: layerSnapshot.state
            });
            restoredLayers.push(layer);
        });

        const nextActive = restoredLayers.find((layer) => layer.dataset.imageId === snapshot.activeImageId)
            || restoredLayers[restoredLayers.length - 1]
            || null;

        this.isRestoringImageSnapshot = false;
        this.setActiveImage(nextActive, { syncControls: true });
        this.updateUploadPromptVisibility();
        this.updateCanvasLayout();
        this.updateImageTransformBox();
    },

    createImageLayer({ id, src, state }) {
        const image = document.createElement('img');
        image.src = src;
        image.alt = 'Завантажений принт';
        image.className = 'preview-image';
        image.draggable = false;
        image.dataset.imageId = id;
        this.setImageState(image, state || this.createDefaultImageState());
        image.addEventListener('load', () => this.updateImageTransformBox());

        this.elements.printCanvas.appendChild(image);
        this.bindImageDrag(image);
        this.applyImageTransformToImage(image, { updateBox: false });
        return image;
    },

    updateUploadPromptVisibility() {
        const hasText = this.elements.textInput.value.trim().length > 0;
        const hasImage = this.getImageLayers().length > 0;
        this.elements.uploadLabel.classList.toggle('hidden', hasText || hasImage);
    },

    updateCanvasLayout() {
        const hasText = this.elements.textInput.value.trim().length > 0;
        const hasImage = this.getImageLayers().length > 0;
        let layout = 'empty';

        if (hasText && hasImage) {
            layout = 'split';
        } else if (hasText) {
            layout = 'text-only';
        } else if (hasImage) {
            layout = 'image-only';
        }

        this.elements.printCanvas.dataset.layout = layout;
        window.requestAnimationFrame(() => this.updateImageTransformBox());
    },

    handleImageUpload(file, options = {}) {
        if (!file) return;
        const shouldRecordHistory = options.recordHistory !== false;
        if (shouldRecordHistory) {
            this.pushImageHistorySnapshot();
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const source = event.target.result;
            const imageId = `img-${Date.now()}-${++this.imageIdCounter}`;
            this.imageSourceById[imageId] = source;
            const image = this.createImageLayer({
                id: imageId,
                src: source,
                state: this.createDefaultImageState()
            });
            this.setActiveImage(image, { syncControls: true });
            this.ensureImageTransformBox();
            this.updateUploadPromptVisibility();
            this.updateCanvasLayout();
            this.elements.imageUpload.value = '';
            this.markDesignDirty();
        };

        reader.readAsDataURL(file);
    },

    bindImageDrag(image) {
        image.addEventListener('pointerdown', (event) => {
            this.setActiveImage(image, { syncControls: true });
            event.preventDefault();
            image.setPointerCapture(event.pointerId);
            this.imageDragState.dragging = true;
            this.imageDragState.pointerId = event.pointerId;
            this.imageDragState.imageId = image.dataset.imageId;
            this.imageDragState.startX = event.clientX;
            this.imageDragState.startY = event.clientY;
            const state = this.getImageState(image);
            this.imageDragState.startOffsetX = state.x;
            this.imageDragState.startOffsetY = state.y;
            this.imageDragState.historyPushed = false;
        });

        image.addEventListener('pointermove', (event) => {
            if (!this.imageDragState.dragging || event.pointerId !== this.imageDragState.pointerId) return;
            if (!this.imageDragState.historyPushed) {
                this.pushImageHistorySnapshot();
                this.imageDragState.historyPushed = true;
                this.markDesignDirty();
            }
            const deltaX = event.clientX - this.imageDragState.startX;
            const deltaY = event.clientY - this.imageDragState.startY;
            const nextState = this.getImageState(image);
            nextState.x = this.imageDragState.startOffsetX + deltaX;
            nextState.y = this.imageDragState.startOffsetY + deltaY;
            this.setImageState(image, nextState);
            this.applyImageTransformToImage(image);
        });

        const stopDrag = (event) => {
            if (event.pointerId !== this.imageDragState.pointerId) return;
            this.imageDragState.dragging = false;
            this.imageDragState.pointerId = null;
            this.imageDragState.imageId = null;
            this.imageDragState.historyPushed = false;
        };

        image.addEventListener('pointerup', stopDrag);
        image.addEventListener('pointercancel', stopDrag);
        image.addEventListener('lostpointercapture', stopDrag);
    },

    applyImageTransformToImage(image, options = {}) {
        if (!image) {
            if (options.updateBox !== false) {
                this.updateImageTransformBox();
            }
            return;
        }
        const state = this.getImageState(image);
        const effectiveScaleX = state.scale * state.stretchX;
        const effectiveScaleY = state.scale * state.stretchY;
        image.style.transform = `translate(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px)) scale(${effectiveScaleX}, ${effectiveScaleY}) rotate(${state.rotate}deg)`;
        if (image === this.previewImageEl) {
            this.imageState = { ...state };
            if (options.updateBox !== false) {
                this.updateImageTransformBox();
            }
        }
    },

    applyImageTransform() {
        this.applyImageTransformToImage(this.previewImageEl);
    },

    updateImageScale() {
        if (!this.previewImageEl) return;
        this.markDesignDirty();
        if (!this.imageScaleGestureActive) {
            this.pushImageHistorySnapshot();
        }
        const state = this.getImageState(this.previewImageEl);
        state.scale = this.clampImageScale(Number(this.elements.imageScale.value) / 100);
        this.setImageState(this.previewImageEl, state);
        this.imageState = { ...state };
        this.syncImageScaleControl();
        this.applyImageTransformToImage(this.previewImageEl);
    },

    rotateImageClockwise() {
        if (!this.previewImageEl) return;
        this.pushImageHistorySnapshot();
        const state = this.getImageState(this.previewImageEl);
        const currentRotate = Number.isFinite(Number(state.rotate)) ? Number(state.rotate) : 0;
        state.rotate = ((currentRotate + 90) % 360 + 360) % 360;
        this.setImageState(this.previewImageEl, state);
        this.imageState = { ...state };
        this.applyImageTransformToImage(this.previewImageEl);
        this.markDesignDirty();
    },

    setImageOrientation(orientation) {
        if (!this.previewImageEl) return;
        const normalizedOrientation = orientation === 'portrait' ? 'portrait' : 'landscape';
        const nextRotate = normalizedOrientation === 'portrait' ? 90 : 0;
        const state = this.getImageState(this.previewImageEl);
        if (state.rotate === nextRotate) {
            this.syncImageOrientationButtons(normalizedOrientation);
            return;
        }
        this.pushImageHistorySnapshot();
        state.rotate = nextRotate;
        this.setImageState(this.previewImageEl, state);
        this.imageState = { ...state };
        this.syncImageOrientationButtons(normalizedOrientation);
        this.applyImageTransformToImage(this.previewImageEl);
    },

    syncImageOrientationButtons(activeOrientation = null) {
        const resolvedOrientation = activeOrientation
            || (this.previewImageEl && this.getImageState(this.previewImageEl).rotate === 90 ? 'portrait' : 'landscape');
        this.elements.imageOrientationButtons?.forEach((button) => {
            const orientation = button.getAttribute('data-image-orientation');
            const isActive = orientation === resolvedOrientation;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    },

    removeImage() {
        if (!this.previewImageEl) return;
        this.pushImageHistorySnapshot();
        this.previewImageEl.remove();
        const remainingLayers = this.getImageLayers();
        const nextActive = remainingLayers[remainingLayers.length - 1] || null;
        this.setActiveImage(nextActive, { syncControls: true });
        this.updateUploadPromptVisibility();
        this.updateCanvasLayout();
        this.updateImageTransformBox();
        this.markDesignDirty();
    },

    clampImageScale(scale) {
        const minScale = Number(this.elements.imageScale?.min || 40) / 100;
        const maxScale = Number(this.elements.imageScale?.max || 220) / 100;
        return Math.min(maxScale, Math.max(minScale, scale));
    },

    clampImageStretch(stretch) {
        const minStretch = 0.45;
        const maxStretch = 3;
        return Math.min(maxStretch, Math.max(minStretch, stretch));
    },

    syncImageScaleControl() {
        if (!this.elements.imageScale) return;
        const state = this.previewImageEl ? this.getImageState(this.previewImageEl) : this.createDefaultImageState();
        this.elements.imageScale.value = String(Math.round(state.scale * 100));
    },

    ensureImageTransformBox() {
        if (this.imageTransformBoxEl || !this.elements.printCanvas) return;

        const box = document.createElement('div');
        box.className = 'image-transform-box is-hidden';
        box.setAttribute('aria-hidden', 'true');

        const handles = [
            { pos: 'nw', axis: 'both' },
            { pos: 'n', axis: 'y' },
            { pos: 'ne', axis: 'both' },
            { pos: 'e', axis: 'x' },
            { pos: 'se', axis: 'both' },
            { pos: 's', axis: 'y' },
            { pos: 'sw', axis: 'both' },
            { pos: 'w', axis: 'x' }
        ];

        box.innerHTML = handles.map((handle) => `
            <button
                type="button"
                class="image-transform-handle"
                data-handle="${handle.pos}"
                data-axis="${handle.axis}"
                tabindex="-1"
                aria-hidden="true"
            ></button>
        `).join('');

        box.addEventListener('pointerdown', (event) => {
            const handle = event.target.closest('.image-transform-handle');
            if (!handle) return;
            this.startImageResize(event, handle);
        });

        this.elements.printCanvas.appendChild(box);
        this.imageTransformBoxEl = box;
        this.updateImageTransformBox();
    },

    removeImageTransformBox() {
        if (this.imageTransformBoxEl) {
            this.imageTransformBoxEl.remove();
            this.imageTransformBoxEl = null;
        }
        this.imageResizeState.active = false;
    },

    updateImageTransformBox() {
        if (!this.imageTransformBoxEl) return;
        if (!this.previewImageEl) {
            this.imageTransformBoxEl.classList.add('is-hidden');
            return;
        }

        const canvasRect = this.elements.printCanvas.getBoundingClientRect();
        const imageRect = this.previewImageEl.getBoundingClientRect();
        if (!canvasRect.width || !canvasRect.height || !imageRect.width || !imageRect.height) {
            this.imageTransformBoxEl.classList.add('is-hidden');
            return;
        }

        this.imageTransformBoxEl.classList.remove('is-hidden');
        this.imageTransformBoxEl.style.left = `${imageRect.left - canvasRect.left}px`;
        this.imageTransformBoxEl.style.top = `${imageRect.top - canvasRect.top}px`;
        this.imageTransformBoxEl.style.width = `${imageRect.width}px`;
        this.imageTransformBoxEl.style.height = `${imageRect.height}px`;
    },

    getPointerPositionInCanvas(event) {
        const canvasRect = this.elements.printCanvas.getBoundingClientRect();
        return {
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top
        };
    },

    computeResizeDistance(point, axis, centerX, centerY) {
        if (axis === 'x') return Math.max(12, Math.abs(point.x - centerX));
        if (axis === 'y') return Math.max(12, Math.abs(point.y - centerY));
        return Math.max(16, Math.hypot(point.x - centerX, point.y - centerY));
    },

    startImageResize(event, handle) {
        if (!this.previewImageEl) return;
        event.preventDefault();
        event.stopPropagation();
        this.pushImageHistorySnapshot();
        this.markDesignDirty();

        const pointer = this.getPointerPositionInCanvas(event);
        const imageRect = this.previewImageEl.getBoundingClientRect();
        const canvasRect = this.elements.printCanvas.getBoundingClientRect();
        const centerX = imageRect.left - canvasRect.left + (imageRect.width / 2);
        const centerY = imageRect.top - canvasRect.top + (imageRect.height / 2);
        const axis = handle.getAttribute('data-axis') || 'both';
        const startDistance = this.computeResizeDistance(pointer, axis, centerX, centerY);
        const currentState = this.getImageState(this.previewImageEl);

        this.imageResizeState = {
            active: true,
            pointerId: event.pointerId,
            axis,
            startScale: currentState.scale,
            startStretchX: currentState.stretchX,
            startStretchY: currentState.stretchY,
            startDistance,
            centerX,
            centerY
        };

        handle.setPointerCapture(event.pointerId);

        const onMove = (moveEvent) => {
            if (!this.imageResizeState.active || moveEvent.pointerId !== this.imageResizeState.pointerId) return;
            moveEvent.preventDefault();
            const movePoint = this.getPointerPositionInCanvas(moveEvent);
            const distance = this.computeResizeDistance(
                movePoint,
                this.imageResizeState.axis,
                this.imageResizeState.centerX,
                this.imageResizeState.centerY
            );
            const ratio = distance / this.imageResizeState.startDistance;
            const state = this.getImageState(this.previewImageEl);

            if (this.imageResizeState.axis === 'both') {
                // Corners: proportional zoom in/out.
                state.scale = this.clampImageScale(this.imageResizeState.startScale * ratio);
            } else if (this.imageResizeState.axis === 'x') {
                // Side handles: horizontal stretch only.
                state.stretchX = this.clampImageStretch(this.imageResizeState.startStretchX * ratio);
            } else if (this.imageResizeState.axis === 'y') {
                // Top/bottom handles: vertical stretch only.
                state.stretchY = this.clampImageStretch(this.imageResizeState.startStretchY * ratio);
            }

            this.setImageState(this.previewImageEl, state);
            this.imageState = { ...state };
            this.syncImageScaleControl();
            this.applyImageTransformToImage(this.previewImageEl);
        };

        const stop = (stopEvent) => {
            if (stopEvent.pointerId !== this.imageResizeState.pointerId) return;
            this.imageResizeState.active = false;
            handle.removeEventListener('pointermove', onMove);
            handle.removeEventListener('pointerup', stop);
            handle.removeEventListener('pointercancel', stop);
            handle.removeEventListener('lostpointercapture', stop);
        };

        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup', stop);
        handle.addEventListener('pointercancel', stop);
        handle.addEventListener('lostpointercapture', stop);
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
            const files = Array.from(event.dataTransfer?.files || []).filter((file) => file.type?.startsWith('image/'));
            files.forEach((file, index) => {
                this.handleImageUpload(file, { recordHistory: index === 0 });
            });
        });
    },

    addToCartDemo() {
        if (this.designDirty || !this.savedDesignPreview || !this.savedDesignKey) {
            window.UI?.showToast?.('Спочатку натисни "Зберегти"', { tone: 'warning' });
            return;
        }

        this.translateTextInputToUkrainian();
        const product = this.getSelectedProduct();
        const format = this.getSelectedFormat();
        const text = this.elements.textInput.value.trim() || 'Без тексту';
        const cartStorageKey = 'upf_cart_v1';
        const itemTitle = `${this.getConstructorOrderTitle(product)} • ${format.label}`;
        const cartItem = {
            title: itemTitle,
            category: 'Конструктор',
            customKey: this.savedDesignKey,
            price: product.price,
            image: this.savedDesignPreview,
            description: `${product.description} Текст: ${text}`
        };

        try {
            const raw = window.localStorage.getItem(cartStorageKey);
            let parsed = [];
            try {
                parsed = JSON.parse(raw || '[]');
            } catch (parseError) {
                console.warn('Cart JSON is corrupted. Reinitializing cart payload.', parseError);
                parsed = [];
            }
            const cartItems = Array.isArray(parsed) ? parsed : [];
            const itemKey = cartItem.customKey || `${cartItem.category || ''}::${cartItem.title || ''}`;
            const existingIndex = cartItems.findIndex((entry) => {
                const customKey = entry?.item?.customKey || '';
                if (customKey && cartItem.customKey) {
                    return customKey === cartItem.customKey;
                }
                const title = entry?.item?.title || '';
                const category = entry?.item?.category || '';
                return `${category}::${title}` === itemKey;
            });

            if (existingIndex >= 0) {
                const currentQty = Number(cartItems[existingIndex]?.quantity || 1);
                cartItems[existingIndex].quantity = Number.isFinite(currentQty) ? Math.max(1, Math.floor(currentQty + 1)) : 1;
            } else {
                cartItems.push({
                    item: cartItem,
                    quantity: 1
                });
            }

            const payload = JSON.stringify(cartItems);
            const isQuotaError = (error) => {
                const name = String(error?.name || '');
                const message = String(error?.message || '');
                return name === 'QuotaExceededError'
                    || Number(error?.code) === 22
                    || /quota|storage/i.test(message);
            };

            try {
                window.localStorage.setItem(cartStorageKey, payload);
            } catch (storageError) {
                if (!isQuotaError(storageError)) {
                    throw storageError;
                }

                // Keep regular catalog items and only one heavy constructor preview to free storage.
                const compacted = cartItems
                    .filter((entry) => {
                        const image = entry?.item?.image;
                        const isHeavyPreview = typeof image === 'string' && image.startsWith('data:image/');
                        if (!isHeavyPreview) return true;
                        return entry?.item?.customKey === cartItem.customKey;
                    })
                    .map((entry) => {
                        const nextItem = { ...(entry?.item || {}) };
                        delete nextItem.gallery;
                        return {
                            item: nextItem,
                            quantity: this.normalizeQuantity(entry?.quantity)
                        };
                    });

                window.localStorage.setItem(cartStorageKey, JSON.stringify(compacted));
                window.UI?.showToast?.('Кошик оновлено після очищення зайвих превʼю', { tone: 'info' });
            }

            window.MainApp?.syncCartBadges?.();
            window.UI?.showToast?.('Додано в кошик', { tone: 'success' });
        } catch (error) {
            console.warn('Failed to add constructor item to cart.', error);
            window.UI?.showToast?.('Не вдалося додати в кошик', { tone: 'warning' });
        }
    }
};

window.Editor = Editor;


