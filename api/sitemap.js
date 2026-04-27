const { getAllCatalogProducts } = require('./_lib/product-catalog');

function xmlEscape(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

module.exports = async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    let products = [];
    try {
        products = await getAllCatalogProducts();
    } catch (error) {
        console.warn('Failed to build product URLs for sitemap:', error?.message || error);
        products = [];
    }

    const productPages = products
        .map((product) => String(product?.slug || '').trim())
        .filter(Boolean)
        .map((slug) => ({
            loc: `${baseUrl}/product/${encodeURIComponent(slug)}`,
            changefreq: 'daily',
            priority: '0.8'
        }));

    const pages = [
        {
            loc: `${baseUrl}/`,
            changefreq: 'weekly',
            priority: '1.0'
        },
        ...productPages
    ];

    const urls = pages.map((page) => `
    <url>
        <loc>${xmlEscape(page.loc)}</loc>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('');

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(body);
};
