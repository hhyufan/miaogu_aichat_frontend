import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue'; // 引入 Home 组件
import ChatHome from '../views/pages/chatHome/index.vue';
import Setting from "@/views/pages/setting.vue";
import Login from "@/views/pages/Login.vue"; // 引入 LoginRegister 组件
import env from "@/util/env.js";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login, // 默认路由指向登录注册页面
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        redirect: 'ChatHome', // 默认子路由重定向到 ChatHome
      },
      {
        path: 'ChatHome',
        name: 'ChatHome',
        component: ChatHome,
      },
      {
        path: 'Setting',
        name: 'Setting',
        component: Setting,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(env.APP_URL),
  routes,
});

export default router;
