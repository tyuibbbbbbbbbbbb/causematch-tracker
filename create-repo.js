const https = require('https');
const { execSync } = require('child_process');

// Get GitHub token from git credential store
const credOutput = execSync(
    'echo protocol=https\nhost=github.com | git credential fill',
    { encoding: 'utf8', shell: 'cmd.exe' }
);
const token = credOutput.split('\n').find(l => l.startsWith('password=')).replace('password=', '').trim();
const username = credOutput.split('\n').find(l => l.startsWith('username=')).replace('username=', '').trim();

console.log('GitHub user:', username);
console.log('Creating repo...');

const data = JSON.stringify({
    name: 'causematch-tracker',
    description: 'CauseMatch campaign tracker - real-time monitoring',
    private: false
});

const req = https.request({
    hostname: 'api.github.com',
    path: '/user/repos',
    method: 'POST',
    headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'node',
        'Content-Length': Buffer.byteLength(data)
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        const result = JSON.parse(body);
        if (result.html_url) {
            console.log('Repo created successfully:', result.html_url);
            console.log('Clone URL:', result.clone_url);
        } else if (result.errors && result.errors[0] && result.errors[0].message === 'name already exists on this account') {
            console.log('Repo already exists: https://github.com/' + username + '/causematch-tracker');
        } else {
            console.log('Response:', body);
        }
    });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
