<template>
  <div class="account-management">
    <div class="controls">
      <input type="text" v-model="searchQuery" placeholder="搜索账号..." class="search-bar">
      <select v-model="selectedRole" class="role-filter">
        <option value="">所有角色</option>
        <option value="客户">客户</option>
        <option value="管理员">管理员</option>
        <option value="前台">前台</option>
      </select>
    </div>
    <div class="account-list">
      <transition-group name="account-fade" tag="div" class="account-list">
       <div v-for="account in filteredAccounts" :key="account.id" :class="['account-card', getAccountClass(account)]">
        <div class="account-header">
          <strong>{{ account.username }}</strong> ({{ account.role }})
        </div>
        <div class="account-info" v-if="account.role === '客户'">
          <p>身份证号: {{ account.idCard || 'N/A' }}</p>
          <p>手机号: {{ account.phoneNumber || 'N/A' }}</p>
          <p>房间号: {{ account.roomName || 'N/A' }}</p>
        </div>
        <button @click="deleteAccount(account.username, account.role)" class="logout-btn">注销</button>
      </div>
      </transition-group>
    </div>

    <!-- 分页控件或其他功能 -->
    <div class="add-account-form">
      <h2>添加新账号</h2>
      <form @submit.prevent="createAccount">

        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="newAccount.username" required>
        </div>

        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="newAccount.password" required>
        </div>

        <div class="form-group">
          <label for="role">角色:</label>
          <select id="role" v-model="newAccount.role" required>
            <option value="">选择角色</option>
            <option value="customer">客户</option>
            <option value="manager">管理员</option>
            <option value="frontDesk">前台</option>
          </select>
        </div>

        <!-- 身份证号和手机号输入 -->
        <div class="form-group" v-if="newAccount.role === 'customer'">
          <label for="idCard">身份证号:</label>
          <input type="text" id="idCard" v-model="newAccount.idCard" required>
        </div>

        <div class="form-group"  v-if="newAccount.role === 'customer'">
          <label for="phoneNumber">手机号:</label>
          <input type="text" id="phoneNumber" v-model="newAccount.phoneNumber" required>
        </div>

        <div class="form-group" v-if="newAccount.role === 'customer'">
          <label for="roomNumber">房间号:</label>
          <input type="text" id="roomNumber" v-model="newAccount.roomName" required>
        </div>

        <div class="form-group" v-if="newAccount.role === 'customer'">
          <label for="days">入住天数:</label>
          <input type="text" id="days" v-model="newAccount.days" required>
        </div>

        <button type="submit" class="submit-btn">添加账号</button>
      </form>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      accounts: [],
      searchQuery: '',
      selectedRole: '',
      newAccount: {
        username: '',
        password: '',
        role: '',
        idCard: '',
        phoneNumber: '',
        roomName: ''
      }
    };
  },
  mounted() {
    this.fetchAccounts(); // 首次加载时立即更新状态
  },

  computed: {
    filteredAccounts() {
      return this.accounts.filter(account => {
        return (
          (this.selectedRole === '' || account.role === this.selectedRole) &&
          account.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  methods: {
    getAccountClass(account) {
      switch (account.role) {
        case "customer":
          return "customer";
        case "manager":
          return "admin";
        case "frontDesk":
          return "front-desk";
        default:
          return "";
      }
    },
    async createAccount() {
      try {
        // 发送请求到后端创建账号
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${window.apiBaseUrl}/account/create`,
            this.newAccount,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        // 清空表单
        this.newAccount = { username: '', password: '', role: '', idCard: '', phoneNumber: '', days: ''};
        // 可能需要重新加载账号列表
        await this.fetchAccounts();

      } catch (error) {
        console.error('Error creating account:', error);
        alert("房间不存在或已被占用")
      }
    },

    async deleteAccount(username, role) {
      try {
        const token = localStorage.getItem('token');
        const payload = {
          "username": username,
        };

        const response = await axios.post(
            `${window.apiBaseUrl}/account/delete`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        // 在此处执行更新帐号列表的操作，例如重新加载帐号数据
        await this.fetchAccounts();
        // alert('删除成功！');

      } catch (error) {
        console.error('Error during account logout:', error);
        alert(error);
      }

    },

    async fetchAccounts() {
      try {
        const response = await axios.get(`${window.apiBaseUrl}/accounts`);
        this.accounts = response.data.accounts; // 将响应数据赋值给 accounts
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        alert(error);
      }
    },
  }
};
</script>


<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar {
  padding: 10px;
  width: 300px;
}

.role-filter {
  padding: 10px;
  width: 200px;
}

.account-management {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  max-height: 800px; /* 设置最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.account-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.account-card {
  width: 300px;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.account-card:hover {
  transform: scale(1.05);
}

.account-header {
  font-size: 18px;
  margin-bottom: 10px;
}

.account-info p {
  margin: 5px 0;
}

.logout-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #ff7875;
}

.customer {
  background-color: #e6f7ff;
}

.admin {
  background-color: #fffbe6;
}

.front-desk {
  background-color: #f6ffed;
}

.account-list ul {
  list-style: none;
  padding: 0;
}

.account-list li {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 水平布局，内容分布在两端 */
  align-items: center; /* 垂直居中对齐 */
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-account-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}

.account-fade-enter-active, .account-fade-leave-active {
  transition: opacity 0.5s ease;
}
.account-fade-enter, .account-fade-leave-to /* 2.1.8版及更高版本 */ {
  opacity: 0;
}
</style>

