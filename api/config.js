import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export default async function handler(request) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const apiUrl = await get('API_URL');
        const publicKey = await get('VUE_APP_PUBLIC_KEY');
        return new Response(JSON.stringify({ apiUrl, publicKey }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error fetching config:', error);
        return new Response(JSON.stringify({ error: "Failed to fetch config" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
