const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3355;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);

    // Proxy all /api/* requests to causematch.com
    if (parsedUrl.path.startsWith('/api/')) {
        const target = 'https://causematch.com' + parsedUrl.path;
        https.get(target, { headers: { 'Accept': 'application/json' } }, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(apiRes.statusCode, {
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

    // Serve HTML files
    const htmlFiles = { '/': 'index.html', '/index.html': 'index.html', '/demo': 'demo.html', '/demo.html': 'demo.html' };
    const file = htmlFiles[parsedUrl.pathname];
    if (file) {
        fs.readFile(path.join(__dirname, file), 'utf8', (err, content) => {
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
