<template>
  <div id="app">
    <!-- 如果已登录且当前角色是客户，显示空调控制面板 -->
    <AirConditionerControlPanel v-if="isLoggedIn && currentRole === '客户'" @logout="handleLogoutSuccess" :room-i-d="currentAccount"/>

    <!-- 如果已登录且当前角色是前台，显示前台界面 -->
    <ReceptionComponent v-else-if="isLoggedIn && currentRole === '前台'" @logout="handleLogoutSuccess" />

    <!-- 如果未登录，显示登录组件 -->
    <LoginComponent v-else @login-success="handleLoginSuccess"/>
  </div>
</template>

<script>
import LoginComponent from './components/LoginComponent.vue';
import AirConditionerControlPanel from './components/AirConditionerControlPanel.vue';
import ReceptionComponent from './components/ReceptionComponent.vue';

export default {
  name: 'App',
  components: {
    LoginComponent,
    AirConditionerControlPanel,
    ReceptionComponent // 注册前台界面组件
  },
  data() {
    return {
      isLoggedIn: false, // 默认为已登录状态
      currentRole: '', // 默认角色为客户
      currentAccount: null,
    };
  },
  methods: {
    handleLoginSuccess(role, account) {
      // alert(`${role} login success!`);
      this.isLoggedIn = true;
      this.currentRole = role;
      this.currentAccount = account;
    },
    handleLogoutSuccess(role, account){
      // alert(`${role} logout success!`)
      this.isLoggedIn = false;
      this.currentRole = ''
    }
  }
};
</script>
