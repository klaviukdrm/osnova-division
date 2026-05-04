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
            duration = 2200
        } = options;

        const container = this.ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = `site-toast site-toast--${tone}`;
        toast.textContent = message;
        container.appendChild(toast);

        window.requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        window.setTimeout(() => {
            toast.classList.remove('is-visible');
            window.setTimeout(() => {
                toast.remove();
            }, 220);
        }, duration);
    }
};

window.UI = UI;
