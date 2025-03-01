import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
    try {
        const apiUrl = await get('API_URL');
        if (!apiUrl) {
            throw new Error('API_URL is not configured');
        }

        // 从URL获取路径
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);

        // 从路径段中移除'api'
        if (pathSegments[0] === 'api') {
            pathSegments.shift();
        }

        // 从路径段中移除'proxy'
        if (pathSegments[0] === 'proxy') {
            pathSegments.shift();
        }

        // 重构目标API的路径
        const path = pathSegments.join('/');
        const targetUrl = `${apiUrl}/${path}${url.search}`;

        console.log('代理到:', targetUrl);

        // 克隆请求头
        const headers = new Headers(req.headers);

        // 将请求转发到目标API
        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text(),
        });

        // 克隆响应
        const responseText = await response.text();
        console.log('目标API响应:', responseText);

        try {
            // 尝试解析为JSON
            const data = JSON.parse(responseText);
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            // 如果解析失败，返回为纯文本
            return new Response(responseText, {
                status: response.status,
                headers: { 'Content-Type': 'text/plain' },
            });
        }
    } catch (error) {
        console.error('代理错误:', error);
        return new Response(JSON.stringify({ error: '内部服务器错误', message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
