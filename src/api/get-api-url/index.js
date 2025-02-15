import { get } from '@vercel/edge-config';

export default async function handler(_request) {
    const apiUrl = await get('API_URL');
    return new Response(JSON.stringify({ apiUrl }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export const config = { runtime: 'edge' };
