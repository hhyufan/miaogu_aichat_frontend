// axiosInstance.js
import axios from 'axios';
import { getBaseUrl } from '@/api';
import store from "@/vuex/store.js";
import {refreshToken, updateToken} from '@/api/getData';
import {toast} from "@/plugins/toast.js";

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: await getBaseUrl(), // 提前解析 baseUrl
});

// 请求拦截器
axiosInstance.interceptors.request.use(async (config) => {
    const ignoredUrls = ['/user/login', '/user/register', '/user/refresh'].map(v => config.baseURL + v);

    const token = store.state.token;
    const expiresIn = store.state.expiresIn;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (ignoredUrls.includes(config.url)) {
        return config;
    }

    // 检查 Token 是否即将过期（例如 30 秒内）
    if (expiresIn && Date.now() + 30000 > expiresIn) {
        await refreshToken(); // 刷新 Token
    }


    return config;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // 处理未授权的情况
            await toast.error("令牌过期或未授权", error.response.data.message);
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
