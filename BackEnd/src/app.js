const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')
const path = require('node:path')

const app = express()

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
    res.json({ name: 'Code Review API', status: 'ok' });
})

app.use('/ai', aiRoutes)

const frontendBuild = path.resolve(__dirname, '../../Frontend/dist');
app.use(express.static(frontendBuild));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/ai/')) return next();
    return res.sendFile(path.join(frontendBuild, 'index.html'), (error) => {
        if (error) next();
    });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large. Keep code under 1 MB.' });
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ error: 'Request body must be valid JSON.' });
    console.error('Request failed:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

module.exports = app
