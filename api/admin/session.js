const crypto = require('crypto');
const {
    getAdminSessionSecret,
    hasValidAdminSession,
    setSessionCookie,
    clearSessionCookie
} = require('../_lib/admin-session');

function sendJson(res, statusCode, payload) {
    res.status(statusCode).json(payload);
}

function readBody(req) {
    if (!req || req.body === undefined || req.body === null) return {};
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body !== 'string') return {};
    try {
        return JSON.parse(req.body);
    } catch (_) {
        return {};
    }
}

function safeCompare(a, b) {
    const left = Buffer.from(String(a || ''));
    const right = Buffer.from(String(b || ''));
    if (left.length !== right.length) return false;
    return crypto.timingSafeEqual(left, right);
}

module.exports = async (req, res) => {
    const secret = getAdminSessionSecret();
    if (!secret) {
        sendJson(res, 500, { error: 'ADMIN_SESSION_SECRET не налаштований.' });
        return;
    }

    if (req.method === 'GET') {
        sendJson(res, 200, {
            ok: true,
            authenticated: hasValidAdminSession(req)
        });
        return;
    }

    if (req.method === 'POST') {
        const body = readBody(req);
        const providedPassword = String(body?.password || '').trim();
        const expectedPassword = String(process.env.ADMIN_PANEL_PASSWORD || '').trim();

        if (!expectedPassword) {
            sendJson(res, 500, { error: 'ADMIN_PANEL_PASSWORD не налаштований.' });
            return;
        }

        if (!providedPassword || !safeCompare(providedPassword, expectedPassword)) {
            sendJson(res, 401, { error: 'Невірний пароль адмінки.' });
            return;
        }

        setSessionCookie(res, req, secret);
        sendJson(res, 200, { ok: true, authenticated: true });
        return;
    }

    if (req.method === 'DELETE') {
        clearSessionCookie(res, req);
        sendJson(res, 200, { ok: true, authenticated: false });
        return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    sendJson(res, 405, { error: 'Method not allowed' });
};

