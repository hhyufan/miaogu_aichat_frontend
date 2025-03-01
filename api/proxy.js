import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export default async function handler(req) {
    try {
        const apiUrl = await get('API_URL');
        if (!apiUrl) {
            throw new Error('API_URL is not configured');
        }

        const url = new URL(req.url, 'http://cmyam.net:65533');
        const path = url.pathname.replace('/api/proxy/', '');
        const targetUrl = `${apiUrl}/${path}`;

        const headers = new Headers(req.headers);
        headers.set('Content-Type', 'application/json');

        const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body);

        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
