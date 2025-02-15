import axios from 'axios';
import store from "@/vuex/store.js";
import {refreshToken, updateToken} from '@/api/getData'
import {toast} from "@/plugins/toast.js";
// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: "https://5bb6-59-44-118-74.ngrok-free.app",
});
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
let baseUrl = null;
let isBaseUrlReady = false;
let baseUrlPromise = new Promise(_resolve => {})
if (!isLocalhost) {
     baseUrlPromise = fetch('api/get-api-url')
        .then(response => response.json())
        .then(({ apiUrl }) => {
            baseUrl = apiUrl;
            isBaseUrlReady = true;
        })
        .catch(console.error);
}

// 添加请求拦截器
axiosInstance.interceptors.request.use(
    async config => {
        if (!isBaseUrlReady && !isLocalhost) {
            await baseUrlPromise;
        }
        config.baseURL = baseUrl;
        const ignoredUrls = ['/user/login', '/user/register', '/user/refresh'].map( v => config.baseURL + v);
        if (ignoredUrls.includes(config.url)) {
            // 如果请求的 URL 在忽略列表中，直接返回 config
            return config;
        }
        const token = store.state.token; // 从 Vuex store 获取 JWT
        if (Date.now() + 10 > store.state.expiresIn) {
            await refreshToken(); // 刷新令牌
        }
        if (token) {

            config.headers['Authorization'] = `Bearer ${token}`; // 添加 JWT 到请求头
        }
        return config; // 返回修改后的 config
    },
    error => {
        return Promise.reject(error); // 处理请求错误
    }
);

// 添加响应拦截器
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
