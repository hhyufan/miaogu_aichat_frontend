import axios from 'axios';

// 全局参数，自定义参数可在发送请求时设置
axios.defaults.timeout = 300000000; // 超时时间ms
axios.defaults.withCredentials = true;

// 请求时的拦截
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.log('请求异常：' + JSON.stringify(error));
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('响应出错：' + error);
        return Promise.reject(error);
    }
);

const base = {
    axios: axios,
    baseUrl: 'http://localhost:8088'
};

export default base;
