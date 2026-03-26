const fs = require('fs');
const path = require('path');

let cachedIndexHtml = null;

function getBaseUrl(req) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return `${protocol}://${host}`;
}

function loadIndexHtml() {
    if (cachedIndexHtml) return cachedIndexHtml;

    const candidates = [
        path.join(process.cwd(), 'index.html'),
        path.join(__dirname, '..', 'index.html')
    ];

    for (const filePath of candidates) {
        try {
            if (fs.existsSync(filePath)) {
                cachedIndexHtml = fs.readFileSync(filePath, 'utf8');
                return cachedIndexHtml;
            }
        } catch (_) {}
    }

    throw new Error('index.html not found');
}

function injectCanonical(html, absoluteCanonical) {
    const canonicalTagRegex = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
    const replacement = `<link rel="canonical" href="${absoluteCanonical}">`;

    if (canonicalTagRegex.test(html)) {
        return html.replace(canonicalTagRegex, replacement);
    }

    const headCloseRegex = /<\/head>/i;
    if (headCloseRegex.test(html)) {
        return html.replace(headCloseRegex, `    ${replacement}\n</head>`);
    }

    return html;
}

module.exports = (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const baseUrl = getBaseUrl(req);
        const canonical = `${baseUrl}/`;
        const sourceHtml = loadIndexHtml();
        const resultHtml = injectCanonical(sourceHtml, canonical);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Vary', 'x-forwarded-proto, x-forwarded-host, host');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
        res.status(200).send(resultHtml);
    } catch (error) {
        console.error('Failed to render home page with canonical:', error);
        res.status(500).send('Internal Server Error');
    }
};
