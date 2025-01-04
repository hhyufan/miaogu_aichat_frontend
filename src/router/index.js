import { createRouter, createWebHistory } from 'vue-router';
import ChatHome from '../views/pages/chatHome/index.vue';
import Setting from "@/views/pages/setting.vue";

const routes = [
  {
    path: "/",
    redirect: "/ChatHome",
  },
  {
    path: "/ChatHome",
    name: "ChatHome",
    component: ChatHome,
  },
  {
    path: "/Setting",
    name: "Setting",
    component: Setting
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
