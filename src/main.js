import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router/index';
// import './mock';
import store from "@/vuex/store.js";
import { initBaseUrl } from "@/api/index.js"; // 引入 Mock 数据
import env from './util/env.js';

const app = createApp(App);
// 检查用户代理并重定向
router.beforeEach((to, from, next) => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|iemobile|opera mini|mobile/i.test(userAgent);

    // 如果是移动设备则重定向到移动端页面
    if (isMobile) {
        window.location.href = env.MOBILE_URL;
    } else {
        next(); // 继续正常路由
    }
});
app.use(store);
app.use(router);
app.use(ElementPlus);
initBaseUrl().then(() => {
    // 启动应用
    app.mount('#app');
});
