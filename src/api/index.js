import store from "@/vuex/store.js";

const REMOTE_URL = 'https://api.miaogu.top';
const REMOTE_API_URL = `${LOCALHOST_URL}/edge-config/api/config`;
const API_URL = '/api/config';

async function fetchConfig(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch config:', error);
        throw error; // 重新抛出错误以便调用者处理
    }
}

export async function getBaseUrl() {
    if (store.state.baseURL) return store.state.baseURL; // 缓存结果
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocalhost ? REMOTE_URL : API_URL;

    // const data = await fetchConfig(url);
    // const apiUrl = isLocalhost ? LOCALHOST_URL : data.apiUrl;
    const apiUrl = "https://api.miaogu.top"
    await store.dispatch('updateBaseUrl', apiUrl);
    return apiUrl; // 返回更新后的 baseUrl
}

export async function getPublicKey() {
    if (store.state.publicKey) return store.state.publicKey; // 缓存结果

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocalhost ? REMOTE_API_URL : API_URL;

    const data = await fetchConfig(url);
    const publicKey = isLocalhost ? data.find(item => item.key === 'VUE_APP_PUBLIC_KEY')?.value : data.publicKey;

    await store.dispatch('updatePublicKey', publicKey);
    return publicKey; // 返回更新后的 publicKey
}

// 在应用启动时初始化 baseUrl
export async function initBaseUrl() {
    await getPublicKey();
    await getBaseUrl();
}
