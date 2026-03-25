exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { to, subject, html } = JSON.parse(event.body);

        if (!to || !subject || !html) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: to, subject, html' }) };
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'RESEND_API_KEY not configured' }) };
        }

        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [to],
                subject: subject,
                html: html
            })
        });

        const result = await response.json();

        if (!response.ok) {
            return { statusCode: response.status, headers, body: JSON.stringify({ error: result.message || 'Failed to send email' }) };
        }

        return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: result.id }) };

    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
