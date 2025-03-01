import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export default async function handler(
    req,
    res
) {
    try {
        // const apiUrl = await get('API_URL');
        // 从环境变量获取实际 API 地址
        const apiUrl = await get('API_URL');
        const API_BASE = apiUrl || 'http://cmyam.net:65533'
        // 构造请求路径
        const path = req.url?.replace('/api/proxy/', '') || ''
        const targetUrl = `${API_BASE}/${path}`

        // 处理请求头
        const headers = new Headers()
        req.headers['authorization'] && headers.set('Authorization', req.headers['authorization'])
        headers.set('Content-Type', 'application/json')

        // 转发请求
        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
        })

        // 处理响应头
        response.headers.forEach((value, key) => {
            res.setHeader(key, value)
        })

        // 设置 CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')

        // 返回响应
        const data = await response.json()
        res.status(response.status).json(data)

    } catch (error) {
        console.error('Proxy error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
