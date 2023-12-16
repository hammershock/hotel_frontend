<template>
  <div class="hotel-reception">
    <h2 class="hotel-title">波普特酒店管理员系统</h2>
    <!-- 返回按钮 -->
    <button @click="logout" class="back-button left">
    <img src="/logout.png" alt="Logout" width="16" height="16"> 退出登录
    </button>
<!--    <button v-if="this.inPage === true" @click="goToMainMenu" class="back-button right">-->
<!--      <img src="/home.png" alt="Home" width="16" height="16"> 返回主菜单-->
<!--    </button>-->

    <!-- 主菜单 -->
    <div class="main-menu">
      <button
          v-for="menu in mainMenuItems"
          :key="menu.text"
          :class="['menu-button', { 'active': selected === menu.id}]"
          @click="turnToPage(menu.id)"
      >
        {{ menu.text }}
      </button>
    </div>

    <!-- 管理帐号 -->
    <Accounts v-if="this.selected === 1" @goBackToMenu="goToMainMenu" @logout="logout"/>

    <!-- 管理房间 -->
    <Rooms v-if="this.selected === 2" @goBackToMenu="goToMainMenu" @logout="logout"/>

    <!-- 管理房间 -->
    <Control v-if="this.selected === 3" @goBackToMenu="goToMainMenu" @logout="logout"/>

  </div>


</template>

<script>

import Accounts from "./AccountsManager.vue";
import Rooms from "./RoomManager.vue"
import Control from "./SettingsPage.vue"


export default {
  components: {Accounts, Rooms, Control},

  created() {
  const savedMenu = sessionStorage.getItem('selectedMenu');
  if (savedMenu) {
    this.selected = parseInt(savedMenu, 10);
  }
},


  data() {
    return {
      selected: 0,
      inPage: false,
      mainMenuItems: [
        {text: '帐号管理', id: 1},
        {text: '房间管理', id: 2},
        {text: '空调设置', id: 3},
      ],
    };
  },
  methods: {
    turnToPage(id) {
      this.inPage = true;
      this.selected = id;
      sessionStorage.setItem('selectedMenu', id);
    },
    goToMainMenu() {
      this.inPage = false;
      this.selected = 0;
    },
    logout(){
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.hotel-reception {
  text-align: center;
}

.main-menu {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.menu-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.menu-button:hover:not(.disabled) {
  transform: scale(1.1);
  background-color: #0056b3;
}

.menu-button:not(.active) {
  background-color: #ccc;
  cursor: not-allowed;
}

.menu-button.active {
  background-color: #2d92dd; /* 活动菜单项的背景颜色 */
}

.progress-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: None;
  margin: 0 5px;
  transition: background-color 0.3s ease;
}

.back-button {
  background-color: #f8f9fa;
  color: #007BFF;
  border: 1px solid #007BFF;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
  margin-top: 10px;
}

.back-button {
  position: absolute;
  top: 10px;
  background-color: transparent;
  color: #007BFF;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
}

.back-button.left {
  left: 10px;
}

.back-button.right {
  right: 10px;
}

.back-button:hover {
  background-color: #f8f9fa;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin: 10px 0;
  display: flex;
  align-items: center; /* 垂直居中元素 */
}

label {
  font-weight: bold;
  font-size: 16px;
  width: 120px; /* 固定标签的宽度 */
}

.input-group select {
  width: 200px; /* 拉长房间类型选框的长度 */
}

.input-group input[type="number"] {
  width: 80px; /* 拉长入住天数输入框的长度 */
}

input[type="text"],
input[type="password"],
select,
button[type="submit"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  margin-top: 5px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
}

.action-button:hover {
  background-color: #0056b3;
}

.rooms {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.room-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
}

.room-button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* 添加悬停时的缩放效果 */
}
</style>
