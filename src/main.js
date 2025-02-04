import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router/index';
// import './mock';
import store from "@/vuex/store.js"; // 引入 Mock 数据
const app = createApp(App);
// 检查用户代理并重定向
router.beforeEach((to, from, next) => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|iemobile|opera mini|mobile/i.test(userAgent);

    // 如果是移动设备并且访问的不是移动端页面，重定向到移动端页面
    if (isMobile && to.path !== '/mobile') {
        window.location.href = 'https://genshin.titlecan.cn/';
    } else {
        next(); // 继续正常路由
    }
});
app.use(store);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
