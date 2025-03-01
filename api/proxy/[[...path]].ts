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

        // 移除开头的 /api/proxy 部分
        let path = url.pathname.replace(/^\/api\/proxy\/?/, '');

        // 构建目标URL，确保路径正确连接
        const targetUrl = path ? `${apiUrl}/${path}${url.search}` : `${apiUrl}${url.search}`;

        console.log('代理到:', targetUrl);

        // 克隆请求头
        const headers = new Headers(req.headers);
        headers.delete('host'); // 删除原始host头，避免可能的冲突

        // 将请求转发到目标API
        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text(),
        });

        // 获取响应
        const responseText = await response.text();
        console.log('目标API响应:', responseText);

        try {
            // 尝试解析为JSON
            const data = JSON.parse(responseText);
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // 允许跨域访问
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        } catch (error) {
            // 如果解析失败，返回为纯文本
            return new Response(responseText, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }
    } catch (error) {
        console.error('代理错误:', error);
        return new Response(JSON.stringify({ error: '内部服务器错误', message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}
