import store from "@/vuex/store.js";
import env from "@/util/env.js";

export async function getBaseUrl() {
    if (store.state.baseURL) return store.state.baseURL; // 缓存结果
    await store.dispatch('updateBaseUrl', env.API_URL);
    return env.API_URL; // 返回更新后的 baseUrl
}

export async function getPublicKey() {
    if (store.state.publicKey) return store.state.publicKey; // 缓存结果
    await store.dispatch('updatePublicKey', env.PUBLIC_KEY);
    return env.PUBLIC_KEY; // 返回更新后的 publicKey
}

// 在应用启动时初始化 baseUrl
export async function initBaseUrl() {
    await getPublicKey();
    await getBaseUrl();
}
