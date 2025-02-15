const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
let baseUrl = null;
let isBaseUrlReady = false;
let baseUrlPromise = new Promise(_resolve => {})
if (!isLocalhost) {
    baseUrlPromise = fetch('/api/config')
        .then(response => response.json())
        .then(({ apiUrl }) => {
            baseUrl = apiUrl;
            isBaseUrlReady = true;
        })
        .catch(console.error);
}
(async () =>  {
    if (isBaseUrlReady && !isLocalhost) {
        await baseUrlPromise;
    }
})()
const base = {
    baseUrl:  baseUrl ?? 'https://5bb6-59-44-118-74.ngrok-free.app'
};

export default base;
