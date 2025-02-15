const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
let baseUrl = null;
let isBaseUrlReady = false;
let baseUrlPromise = Promise.resolve(); // 默认是已解决的 Promise

if (!isLocalhost) {
    baseUrlPromise = fetch('/api/config')
        .then(response => response.json())
        .then(({ apiUrl }) => {
            console.log("apiUrl", apiUrl);
            baseUrl = apiUrl;
            isBaseUrlReady = true;
        })
        .catch(console.error);
}

// 使用 async IIFE 确保在 baseUrl 被赋值后再创建 base 对象
const base = (async () => {
    await baseUrlPromise; // 等待 baseUrlPromise 完成
    return {
        baseUrl: baseUrl ?? 'https://5bb6-59-44-118-74.ngrok-free.app'
    };
})();

base.then(result => {
    console.log(result.baseUrl); // 在这里可以安全地使用 baseUrl
});

// 导出 base 对象
export default base;
