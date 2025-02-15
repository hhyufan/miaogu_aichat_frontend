const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
let baseUrl = null;
let baseUrlPromise = Promise.resolve();

if (!isLocalhost) {
    baseUrlPromise = fetch('/api/config')
        .then(response => response.json())
        .then(({ apiUrl }) => {
            baseUrl = apiUrl;
            console.log("current ngrok url: " + baseUrl);
        })
        .catch(console.error);
}

const base = (async () => {
    await baseUrlPromise;
    return {
        baseUrl: baseUrl ?? 'https://5bb6-59-44-118-74.ngrok-free.app' // 使用 || 确保 falsy 值触发回退
    };
})();

export default base;
