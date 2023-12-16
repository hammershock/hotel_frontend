import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import axios from "axios";


// 导入你的页面组件
import RoomEditPage from './components/manager/RoomDetailPage.vue';
import CustomerPage from './components/customer/CustomerPage.vue';
import ManagerPage from './components/manager/ManagerPage.vue';
import FrontDeskPage from './components/front-desk/FrontDeskPage.vue';
import LoginPage from './components/login/LoginPage.vue';


// 定义路由
const routes = [
  { path: '/', component: LoginPage },
  { path: '/edit-room/:roomName', component: RoomEditPage },
  { path: '/customer/:roomID', component: CustomerPage },
  { path: '/manager/:roomID', component: ManagerPage },
  { path: '/front-desk/:roomID', component: FrontDeskPage },
  // ...其他路由
];

// 创建 router 实例

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
window.apiBaseUrl = 'http://localhost:5000';
app.mount('#app');

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});
