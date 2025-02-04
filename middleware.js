export const config = { matcher: '/((?!api|static|.*\\..*|_next).*)' };

export function middleware(req) {
    const url = new URL(req.url);
    const ua = req.headers['user-agent'] || 'android';
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(ua.toLowerCase());
    // 跳过已处理的移动子域名
    if (url.hostname.includes('miaogu.top') && isMobile) {
        return Response.redirect(`https://genshin.titlecan.cn/`, 302);
    }
}
