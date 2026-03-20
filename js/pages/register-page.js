import {
    buildLoginUrl,
    formatAuthError,
    getNextPath,
    redirectAuthenticatedUser,
    signUpWithEmail
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
    const button = document.getElementById('register-submit');
    if (!button) return;

    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Створюємо акаунт...' : 'Зареєструватися';
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('register-form');
    const loginLink = document.getElementById('register-login-link');
    const nextPath = getNextPath();

    if (loginLink) {
        loginLink.href = buildLoginUrl(nextPath);
    }

    try {
        const redirected = await redirectAuthenticatedUser();
        if (redirected) return;
    } catch (error) {
        setFeedback(error.message || 'Не вдалося підготувати сторінку реєстрації.', 'error');
        if (form) form.classList.remove('opacity-60', 'pointer-events-none');
        return;
    }

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('register-name')?.value?.trim() || '';
        const email = document.getElementById('register-email')?.value?.trim() || '';
        const password = document.getElementById('register-password')?.value || '';
        const confirmPassword = document.getElementById('register-password-confirm')?.value || '';

        if (password !== confirmPassword) {
            setFeedback('Паролі не збігаються.', 'error');
            return;
        }

        setSubmitting(true);
        setFeedback('Створюємо акаунт...', 'neutral');

        try {
            const data = await signUpWithEmail({ email, password, fullName });

            if (data.session) {
                setFeedback('Акаунт створено. Перенаправляємо в кабінет...', 'success');
                window.location.replace(nextPath);
                return;
            }

            setFeedback('Акаунт створено. Перевірте email та підтвердіть реєстрацію через лист від Supabase.', 'success');
            form.reset();
        } catch (error) {
            setFeedback(formatAuthError(error), 'error');
        } finally {
            setSubmitting(false);
        }
    });
});
