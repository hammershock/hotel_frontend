import { createApp } from 'vue';
import App from './App.vue';
import AirConditionerControlPanel from './components/AirConditionerControlPanel.vue';

const app = createApp(App);

// 全局注册空调控制面板组件
app.component('AirConditionerControlPanel', AirConditionerControlPanel);

app.provide('apiBaseUrl', 'http://localhost:5000');

app.mount('#app');
