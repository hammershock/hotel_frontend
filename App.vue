<template>
  <div id="app">
    <!-- 如果已登录且当前角色是客户，显示空调控制面板 -->
    <AirConditionerControlPanel
      v-if="isLoggedIn && currentRole === '客户'"
      @logout="handleLogoutSuccess"
      :room-i-d="currentAccount"
    />

    <!-- 如果已登录且当前角色是空调管理员，显示管理员界面 -->
    <ACManager
      v-else-if="isLoggedIn && currentRole === '管理员'"
      @logout="handleLogoutSuccess"
    />

    <!-- 如果已登录且当前角色是前台，显示前台界面 -->
    <ReceptionComponent
      v-else-if="isLoggedIn && currentRole === '前台'"
      @logout="handleLogoutSuccess"
    />

    <!-- 如果未登录，显示登录组件 -->
    <LoginComponent v-else @login-success="handleLoginSuccess"/>
  </div>
</template>

<script>
import LoginComponent from './components/login/LoginComponent.vue';
import AirConditionerControlPanel from './components/customer/AirConditionerControlPanel.vue';
import ReceptionComponent from './components/front-desk/ReceptionComponent.vue';
import ACManager from './components/ACManager.vue'; // 导入空调管理员界面组件

export default {
  name: 'App',
  components: {
    LoginComponent,
    AirConditionerControlPanel,
    ReceptionComponent,
    ACManager // 注册空调管理员界面组件
  },
  data() {
    return {
      isLoggedIn: false,
      currentRole: '',
      currentAccount: null
    };
  },
  methods: {
    handleLoginSuccess({ role, account }) {
      this.isLoggedIn = true;
      this.currentRole = role;
      this.currentAccount = account;
      alert(`login success, ${role}, ${account}`)

    },
    handleLogoutSuccess() {
      this.isLoggedIn = false;
      this.currentRole = '';
      this.currentAccount = null;
    }
  }
};
</script>
