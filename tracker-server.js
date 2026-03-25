const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3355;
const API_URL = 'https://causematch.com/api/public/campaign/yth';

const server = http.createServer((req, res) => {
    // Proxy endpoint
    if (req.url === '/api/campaign') {
        https.get(API_URL, { headers: { 'Accept': 'application/json' } }, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            });
        }).on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
        return;
    }

    // Serve HTML
    if (req.url === '/' || req.url === '/index.html') {
        const htmlPath = path.join(__dirname, 'causematch-tracker.html');
        fs.readFile(htmlPath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
