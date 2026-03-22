(function bootstrapLegacyEntry() {
    const start = () => {
        if (window.MainApp && typeof window.MainApp.init === 'function') {
            window.MainApp.init();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
}());
