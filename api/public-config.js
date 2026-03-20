module.exports = (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    const missing = [];

    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('SUPABASE_ANON_KEY');

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');

    if (missing.length) {
        res.status(500).send(JSON.stringify({
            error: `Missing required environment variables: ${missing.join(', ')}.`,
            missing
        }));
        return;
    }

    res.status(200).send(JSON.stringify({
        supabaseUrl,
        supabaseAnonKey
    }));
};
