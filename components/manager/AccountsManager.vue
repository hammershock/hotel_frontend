<template>
  <div class="account-management">
<!--    <h1>帐号管理</h1>-->
    <div class="account-list">
      <ul>
        <li v-for="account in accounts" :key="account.id" :class="getAccountClass(account)">
          <strong>{{ account.username }}</strong> ({{ account.role }})
          <br>
          身份证号: {{ account.idCard }}
          <br>
          手机号: {{ account.phoneNumber }}

          <button @click="logoutAccount(account.username, account.role); ">注销</button>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      accounts: []
    };
  },
  mounted() {
    this.fetchAccounts(); // 首次加载时立即更新状态
  },
  methods: {
    getAccountClass(account) {
      switch (account.role) {
        case "客户":
          return "customer";
        case "管理员":
          return "admin";
        case "前台":
          return "front-desk";
        default:
          return "";
      }
    },
    async fetchAccounts() {
      try {
        const response = await axios.get(`${window.apiBaseUrl}/view-accounts`);
        this.accounts = response.data; // 将响应数据赋值给 accounts
      } catch (error) {
        console.error('Error fetching accounts:', error);
        alert(error);
      }
    },
    async logoutAccount(username, role) {
      try {
        const token = localStorage.getItem('token');
        const payload = {
          "username": username,
          "role": role,
        };

        const response = await axios.post(
            `${window.apiBaseUrl}/delete-account`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        await this.fetchAccounts();
        alert('删除成功！');
        // 在此处执行更新帐号列表的操作，例如重新加载帐号数据
      } catch (error) {
        console.error('Error during account logout:', error);
        alert(error);
      }
    },
  }
};
</script>


<style scoped>
.account-management {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  max-height: 400px; /* 设置最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
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

.customer {
  color: #4CAF50;
}

.admin {
  color: #2196F3;
}

.front-desk {
  color: #FF5722;
}

.account-info {
  flex: 1; /* 占据可用空间的比例，这里占据左边的空间 */
}

.account-details {
  flex: 1; /* 占据可用空间的比例，这里占据右边的空间 */
  text-align: right; /* 右对齐文本 */
}
</style>