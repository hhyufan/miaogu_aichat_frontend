// axiosInstance.js
import axios from 'axios';
import { getBaseUrl } from '@/api';
import store from "@/vuex/store.js";
import {refreshToken, updateToken} from '@/api/getData';
import {toast} from "@/plugins/toast.js";

// 创建 Axios 实例
const axiosInstance = axios.create();

// 请求拦截器
axiosInstance.interceptors.request.use(async (config) => {
    if(!config.baseURL) {
        config.baseURL = await getBaseUrl();
    }
    const ignoredUrls = ['/user/login', '/user/register', '/user/refresh'].map(v => config.baseURL + v);

    const token = store.state.token;
    const expiresIn = store.state.expiresIn;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (ignoredUrls.join(",").includes(config.url)) {
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
    async response => {
        if (response.data.extra?.["isTokenUpdated"]) {
            await updateToken()
        }
        return response; // 返回响应数据
    },
    async error => {

        if (error.response && error.response.status === 401) {
            // 处理未授权的情况，例如重定向到登录页面
            await toast.error("令牌过期或未授权", error.response.data.message);
            console.error(error);
            setTimeout(
                () => window.location.href = "/",
                1500
            )
        }
        return Promise.reject(error); // 处理其他错误
    }
);

// 导出 Axios 实例
export default axiosInstance;
