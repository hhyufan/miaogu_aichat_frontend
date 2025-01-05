import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router/index';
import './mock'; // 引入 Mock 数据
const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
