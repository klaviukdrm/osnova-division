const UI = {
    toastContainer: null,

    smoothScrollTo(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    },

    ensureToastContainer() {
        if (this.toastContainer && document.body.contains(this.toastContainer)) {
            return this.toastContainer;
        }

        const container = document.createElement('div');
        container.className = 'site-toast-stack';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'false');
        document.body.appendChild(container);
        this.toastContainer = container;
        return container;
    },

    showToast(message, options = {}) {
        if (!message) return;

        const {
            tone = 'info',
            duration = 2200,
            persistent = false
        } = options;

        const container = this.ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = `site-toast site-toast--${tone}`;
        
        if (persistent) {
            toast.style.display = 'flex';
            toast.style.alignItems = 'center';
            toast.style.justifyContent = 'space-between';
            toast.style.gap = '12px';

            const textNode = document.createElement('span');
            textNode.textContent = message;
            
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'opacity-70 hover:opacity-100 transition shrink-0 text-xl leading-none';
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('aria-label', 'Закрити');
            
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('is-visible');
                window.setTimeout(() => toast.remove(), 220);
            });

            toast.appendChild(textNode);
            toast.appendChild(closeBtn);
        } else {
            toast.textContent = message;
        }

        container.appendChild(toast);

        window.requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        if (!persistent) {
            window.setTimeout(() => {
                toast.classList.remove('is-visible');
                window.setTimeout(() => {
                    toast.remove();
                }, 220);
            }, duration);
        }
    },

    showOrderSuccessModal() {
        const existing = document.getElementById('order-success-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'order-success-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm opacity-0 transition-opacity duration-300';
        
        modal.innerHTML = `
            <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full mx-4 text-center transform scale-95 transition-transform duration-300" id="order-success-content">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa-solid fa-check text-4xl text-green-600"></i>
                </div>
                <h2 class="text-3xl font-bold text-slate-900 mb-4">Дякуємо за замовлення!</h2>
                <p class="text-slate-600 mb-8 text-lg">
                    Ваше замовлення буде відправлено протягом 2-5 робочих днів.<br>
                    По усім питанням пишіть в бота <a href="https://t.me/Ukrainian_Print_Familybot" target="_blank" class="text-blue-600 hover:underline font-medium">@Ukrainian_Print_Familybot</a><br>
                    Або телефонуйте за номером <a href="tel:+380986677359" class="text-blue-600 hover:underline font-medium">+380986677359</a>
                </p>
                <button type="button" class="w-full text-lg py-4 font-semibold bg-green-600 hover:bg-green-700 text-white rounded-2xl transition shadow-lg shadow-green-600/20" id="success-modal-close">
                    Чудово, на головну
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('overflow-hidden');

        modal.querySelector('#success-modal-close').addEventListener('click', () => {
            window.location.href = window.location.pathname;
        });
        
        window.requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            modal.querySelector('#order-success-content').classList.remove('scale-95');
            modal.querySelector('#order-success-content').classList.add('scale-100');
        });
    }
};

window.UI = UI;
