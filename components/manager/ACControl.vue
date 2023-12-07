<template>
  <div class="ac-settings">
    <h2>空调参数设置</h2>
    <form @submit.prevent="submitSettings">
      <div class="form-group">
        <label for="minTemperature">最低温度:</label>
        <input type="number" id="minTemperature" v-model="settings.minTemperature" required>
      </div>

      <div class="form-group">
        <label for="maxTemperature">最高温度:</label>
        <input type="number" id="maxTemperature" v-model="settings.maxTemperature" required>
      </div>

      <div class="form-group">
        <label for="acRate">空调费率:</label>
        <input type="number" id="acRate" v-model="settings.acRate" required>
      </div>

      <div class="form-group">
        <label for="acSpeed">空调风速:</label>
        <select id="acSpeed" v-model="settings.acSpeed">
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>

      <div class="form-group">
        <label for="acMode">空调模式:</label>
        <select id="acMode" v-model="settings.acMode">
          <option value="cool">制冷</option>
          <option value="heat">制热</option>
        </select>
      </div>

      <button type="submit" class="submit-btn">提交设置</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      settings: {
        minTemperature: '',
        maxTemperature: '',
        acRate: '',
        acSpeed: 'low',
        acMode: 'cool'
      }
    };
  },
  methods: {
    async submitSettings() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${window.apiBaseUrl}/change-settings`, this.settings, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('空调参数设置成功！');
      } catch (error) {
        console.error('设置失败:', error);
        alert('设置失败: ' + error);
      }
    }
  }
};
</script>

<style>
.ac-settings {
  /* 样式与之前组件保持一致 */
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
</style>
