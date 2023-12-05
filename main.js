import { createApp } from 'vue';
import App from './App.vue';
import axios from "axios";

const app = createApp(App);

window.apiBaseUrl = 'http://localhost:5000';

app.mount('#app');

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});


