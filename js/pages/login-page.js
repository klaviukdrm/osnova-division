import {
    buildRegisterUrl,
    formatAuthError,
    getNextPath,
    redirectAuthenticatedUser,
    signInWithEmail
} from '../services/auth-api.js';

function setFeedback(message, tone = 'neutral') {
    const feedback = document.getElementById('auth-feedback');
    if (!feedback) return;

    const tones = {
        neutral: 'auth-feedback auth-feedback--neutral',
        error: 'auth-feedback auth-feedback--error',
        success: 'auth-feedback auth-feedback--success'
    };

    feedback.className = tones[tone] || tones.neutral;
    feedback.textContent = message;
    feedback.classList.remove('hidden');
}

function setSubmitting(isSubmitting) {
    const button = document.getElementById('login-submit');
    if (!button) return;

    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Входимо...' : 'Увійти';
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('login-form');
    const registerLink = document.getElementById('login-register-link');
    const nextPath = getNextPath();

    if (registerLink) {
        registerLink.href = buildRegisterUrl(nextPath);
    }

    try {
        const redirected = await redirectAuthenticatedUser();
        if (redirected) return;
    } catch (error) {
        setFeedback(error.message || 'Не вдалося підготувати сторінку входу.', 'error');
        if (form) form.classList.remove('opacity-60', 'pointer-events-none');
        return;
    }

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email')?.value?.trim() || '';
        const password = document.getElementById('login-password')?.value || '';

        setSubmitting(true);
        setFeedback('Перевіряємо облікові дані...', 'neutral');

        try {
            await signInWithEmail({ email, password });
            setFeedback('Успішний вхід. Перенаправляємо...', 'success');
            window.location.replace(nextPath);
        } catch (error) {
            setFeedback(formatAuthError(error), 'error');
        } finally {
            setSubmitting(false);
        }
    });
});
