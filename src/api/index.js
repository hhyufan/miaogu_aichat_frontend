import store from "@/vuex/store.js";

const requireEnv = (variableName) => {
    const value = import.meta.env[variableName];
    if (!value) {
        throw new Error(`${variableName} Not Empty!`);
    }
    return value;
}

const REMOTE_URL = requireEnv('VITE_REMOTE_URL');
const LOCAL_HOST = requireEnv('VITE_LOCAL_HOST');
const PUBLIC_KEY = requireEnv('VITE_PUBLIC_KEY');

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
    const baseUrl = isLocalhost ? LOCAL_HOST : REMOTE_URL
    await store.dispatch('updateBaseUrl', baseUrl);
    return baseUrl; // 返回更新后的 baseUrl
}

export async function getPublicKey() {
    if (store.state.publicKey) return store.state.publicKey; // 缓存结果
    await store.dispatch('updatePublicKey', PUBLIC_KEY);
    return PUBLIC_KEY; // 返回更新后的 publicKey
}

// 在应用启动时初始化 baseUrl
export async function initBaseUrl() {
    await getPublicKey();
    await getBaseUrl();
}
