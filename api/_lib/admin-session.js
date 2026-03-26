const crypto = require('crypto');

const SESSION_COOKIE_NAME = 'upf_admin_session';
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12h

function toBase64Url(input) {
    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function fromBase64Url(value) {
    const raw = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padding = raw.length % 4 === 0 ? '' : '='.repeat(4 - (raw.length % 4));
    return Buffer.from(`${raw}${padding}`, 'base64');
}

function getAdminSessionSecret() {
    return String(process.env.ADMIN_SESSION_SECRET || '').trim();
}

function signPayload(payloadB64, secret) {
    return toBase64Url(
        crypto
            .createHmac('sha256', secret)
            .update(String(payloadB64 || ''))
            .digest()
    );
}

function createSessionToken(secret) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now,
        exp: now + SESSION_MAX_AGE_SECONDS
    };
    const payloadB64 = toBase64Url(JSON.stringify(payload));
    const signature = signPayload(payloadB64, secret);
    return `${payloadB64}.${signature}`;
}

function parseCookieHeader(req) {
    const header = String(req?.headers?.cookie || '').trim();
    if (!header) return {};
    return header.split(';').reduce((acc, part) => {
        const [key, ...rest] = part.trim().split('=');
        if (!key) return acc;
        acc[key] = rest.join('=');
        return acc;
    }, {});
}

function getSessionTokenFromRequest(req) {
    const cookies = parseCookieHeader(req);
    return String(cookies[SESSION_COOKIE_NAME] || '').trim();
}

function verifySessionToken(token, secret) {
    const raw = String(token || '').trim();
    if (!raw || !secret) return false;
    const [payloadB64, signature] = raw.split('.');
    if (!payloadB64 || !signature) return false;

    const expectedSignature = signPayload(payloadB64, secret);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (actualBuffer.length !== expectedBuffer.length) return false;
    if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return false;

    let payload;
    try {
        payload = JSON.parse(fromBase64Url(payloadB64).toString('utf8'));
    } catch (_) {
        return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = Number(payload?.exp || 0);
    if (!Number.isFinite(exp) || exp <= now) return false;
    return true;
}

function isSecureRequest(req) {
    const proto = String(req?.headers?.['x-forwarded-proto'] || '').toLowerCase();
    if (proto === 'https') return true;
    return Boolean(req?.connection?.encrypted);
}

function buildCookieValue(token, req) {
    const securePart = isSecureRequest(req) ? '; Secure' : '';
    return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${securePart}`;
}

function buildClearCookieValue(req) {
    const securePart = isSecureRequest(req) ? '; Secure' : '';
    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${securePart}`;
}

function setSessionCookie(res, req, secret) {
    const token = createSessionToken(secret);
    res.setHeader('Set-Cookie', buildCookieValue(token, req));
}

function clearSessionCookie(res, req) {
    res.setHeader('Set-Cookie', buildClearCookieValue(req));
}

function hasValidAdminSession(req) {
    const secret = getAdminSessionSecret();
    if (!secret) return false;
    const token = getSessionTokenFromRequest(req);
    return verifySessionToken(token, secret);
}

function requireAdminSession(req, res) {
    const secret = getAdminSessionSecret();
    if (!secret) {
        res.status(500).json({ error: 'ADMIN_SESSION_SECRET не налаштований.' });
        return false;
    }
    if (!hasValidAdminSession(req)) {
        res.status(401).json({ error: 'Сесія адміна недійсна або протермінована.' });
        return false;
    }
    return true;
}

module.exports = {
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    getAdminSessionSecret,
    hasValidAdminSession,
    requireAdminSession,
    setSessionCookie,
    clearSessionCookie
};

