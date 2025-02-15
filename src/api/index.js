import store from "@/vuex/store.js";

let baseUrl = null;

export async function getBaseUrl(message) {
    if (store.state.baseURL) return store.state.baseURL; // 缓存结果
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        try {
            const response = await fetch('/api/config');
            const { apiUrl } = await response.json();
            await store.dispatch('updateBaseUrl', apiUrl);
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    } else {
        await store.dispatch('updateBaseUrl', "http://localhost:8088");
    }
    return baseUrl;
}

// 在应用启动时初始化 baseUrl
export async function initBaseUrl() {
    await getBaseUrl();
    alert("baseURL: " + store.state.baseURL);
}
