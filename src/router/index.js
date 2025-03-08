import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue'; // 引入 Home 组件
import ChatHome from '../views/pages/chatHome/index.vue';
import Setting from "@/views/pages/setting.vue";
import Login from "@/views/pages/Login.vue"; // 引入 LoginRegister 组件
import env from "@/util/env.js";
import store from "@/vuex/store.js";

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

router.beforeEach(async (to, from, next) => {
  const token = store.state.token

  // 如果 token 存在且访问的是登录页面，则重定向到 ChatHome
  if (token && to.name === 'Login') {
    return next({ name: 'ChatHome' });
  }

  // 如果没有 token 且不是登录或刷新页面，重置状态并重定向
  if (from.name !== null && !token && to.name !== 'Login') {
    store.commit('resetState');
    localStorage.removeItem('my-app-storage'); // 清除持久化数据
    window.location.href = env.APP_URL; // 重定向到 APP_URL
  }
  
  next(); // 继续路由
});

export default router;
