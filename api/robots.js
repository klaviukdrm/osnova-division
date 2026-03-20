module.exports = (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const body = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /cms/',
        '',
        `Sitemap: ${baseUrl}/sitemap.xml`
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(body);
};
