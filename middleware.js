export const config = { matcher: '/((?!api|static|.*\\..*|_next).*)' };

export function middleware(req) {
    const ua = req.headers['user-agent'] || 'windows';
    const isMobile = /mobile|android|iphone|ipad|phone|windows/i.test(ua.toLowerCase());
    if (isMobile) {
        return Response.redirect(`https://genshin.titlecan.cn/`, 302);
    } else {
        return Response.redirect(`https://baidu.com/`, 302);
    }
}
