import store from "@/vuex/store.js";

let baseUrl = null;

export async function getBaseUrl(message) {
    if (store.state.baseURL) return store.state.baseURL; // 缓存结果
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        try {
            const response = await fetch('/api/config');
            const { apiUrl } = await response.json();
            store.commit('updateBaseUrl', apiUrl);
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    } else {
        baseUrl = 'http://localhost:8088'; // 本地开发用默认值
    }
    alert(`baseUrl${baseUrl}`);
    return baseUrl;
}

// 在应用启动时初始化 baseUrl
export async function initBaseUrl() {
    await getBaseUrl();
}
