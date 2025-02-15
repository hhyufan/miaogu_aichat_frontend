// /api/config/route.js
import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export async function GET() {
    try {
        const apiUrl = await get('API_URL'); // 从 Edge Config 获取数据
        return new Response(JSON.stringify({ apiUrl }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch config" }), {
            status: 500
        });
    }
}
