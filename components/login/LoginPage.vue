<template>
  <div class="canvas">
    <div>
      <h1 class="welcome-title">欢迎来到波普特酒店</h1>
    <h1 class="welcome-title">welcome to our BUPT hotel!</h1>
    </div>

    <div class="outer-login-container">

    <div class="login-container">

      <div class="login-content">
        <h3>{{ getName(currentRole) }} 登录</h3>
        <form @submit.prevent="login" class="form">
          <div class="form-group">
            <label for="username">帐号</label>
            <input type="text" id="username" v-model="username" placeholder="请输入帐号" required>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" v-model="password" placeholder="请输入密码" required>
          </div>
          <button type="submit">登录</button>
        </form>
        <div class="role-switcher">
          <span @click="switchRole('customer')">客户</span> |
          <span @click="switchRole('manager')">管理员</span> |
          <span @click="switchRole('frontDesk')">前台</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data(){
    return {username: '', password: '', currentRole: 'customer'}
  },
  created() {
    this.roomID = this.$route.params.roomID;
  },
  methods:
{
  switchRole(role){this.currentRole=role;},
  async login() {
      try {
        const loginApi = window.apiBaseUrl + '/login'; // 使用全局变量
        const response = await axios.post(loginApi, {
          username: this.username,
          password: this.password,
          role: this.currentRole
        });
        console.log(response)
        const token = response.data.token;
        localStorage.setItem('token', token); // 保存 token
        localStorage.setItem('username', this.username);
        // this.$emit('login-success', { role: this.currentRole, account: this.username });
        this.handleLoginSuccess();

      }  catch (error) {
    if (error.response) {
      // 请求已发送，服务器以状态码响应
      if (error.response.status === 401) {
        alert("用户名或密码不正确");
      } else {
        // 其他服务器端错误
        alert("服务器错误：" + error.response.status);
      }
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      alert("服务器无响应，请检查网络连接");
    } else {
      // 在设置请求时发生了一些问题
      alert("登录请求失败：" + error.message);
    }
    console.error('Login error:', error);
  }
    },

  handleLoginSuccess() {
    // ...设置登录状态
    if (this.currentRole === 'customer') {
      this.$router.push(`/customer/${this.username}`);
    } else if (this.currentRole === 'manager') {
      this.$router.push(`/manager/${this.username}`);
    } else if (this.currentRole === 'frontDesk') {
      this.$router.push(`/front-desk/${this.username}`);
    }
  },
  getName(role) {
    switch (role){
      case 'customer': return '客户';
      case 'manager': return '管理员';
      case 'frontDesk': return '前台';
    }
  }
}
}

</script>

<style scoped>

.canvas {
  /* 容器样式 */
  background-image: url('../../public/login-background.jpg'); /* 设置背景图片路径 */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: flex-end; /* 将登录框置于屏幕的右三分之二处 */
  align-items: center;
}

.login-content {
  background-color: rgba(255, 255, 255, 0.8); /* 背景颜色和透明度 */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  text-align: center;
  width: 300px; /* 限制登录框的宽度 */
  margin-right: 140px;
}

h1 {
  color: #ffffff; /* 标题颜色 */
  font-size: 36px; /* 设置标题字体大小 */
  margin-bottom: 20px; /* 底边距 */
}

h3 {
  color: #007BFF; /* 标题颜色 */
  font-size: 24px; /* 设置标题字体大小 */
}

.welcome-title {
  font-size: 36px;
  margin-left: 20px; /* 适当的左边距 */
  margin-top: 20px; /* 适当的上边距 */
  margin-right: 300px; /* 向左移动文字 */
}

.login-container {
  min-height: 100vh;
  display: flex;
  margin-right: 10%;
  justify-content: flex-end; /* 右对齐 */
  align-items: center;
}

.form-group {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  font-weight: bold;
  font-size: 16px; /* 设置label字体大小 */
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  margin-top: 5px; /* 适当的上边距 */
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* 适当的上边距 */
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.role-switcher {
  font-size: small;
  margin-top: 10px;
  cursor: pointer;
}

.role-switcher span {
  margin: 0 5px;
  color: #007BFF;
  text-decoration: underline;
}
</style>
