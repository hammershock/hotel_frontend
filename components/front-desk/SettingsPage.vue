<template>
  <div class="ac-settings">
    <div class="settings">
      <p>温度下限: {{ this.latestSettings.minTemperature }}°C </p>
      <p>默认温度: {{ this.latestSettings.defaultTemperature }}°C</p>
      <p>温度上限: {{ this.latestSettings.maxTemperature }}°C </p>
      <p>默认风速: {{ this.latestSettings.defaultFanSpeed }} </p>
      <p>费率: {{ this.latestSettings.rate }}元/°C </p>
      <p>空调模式: {{ this.latestSettings.acMode }} </p>
      <p>最近修改时间: {{ this.latestSettings.lastEditTime }} </p>
    </div>

    <h2>空调参数设置</h2>

    <form @submit.prevent="submitSettings">
      <div class="form-group">
        <label for="minTemperature">最低温度:</label>
        <input type="number" id="minTemperature" v-model="settings.minTemperature" required>
      </div>

      <div class="form-group">
        <label for="defaultTemperature">默认温度:</label>
        <input type="number" id="defaultTemperature" v-model="settings.defaultTemperature" required>
      </div>

      <div class="form-group">
        <label for="maxTemperature">最高温度:</label>
        <input type="number" id="maxTemperature" v-model="settings.maxTemperature" required>
      </div>

      <div class="form-group">
        <label for="acRate">空调费率:</label>
        <input type="number" id="acRate" v-model="settings.rate" required>
      </div>

      <div class="form-group">
        <label for="acSpeed">默认风速:</label>
        <select id="acSpeed" v-model="settings.defaultFanSpeed">
          <option value="LOW">低</option>
          <option value="MEDIUM">中</option>
          <option value="HIGH">高</option>
        </select>
      </div>

      <div class="form-group">
        <label for="acMode">空调模式:</label>
        <select id="acMode" v-model="settings.acMode">
          <option value="COOL">制冷</option>
          <option value="HEAT">制热</option>
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
        settingID: null,
        lastEditTime: null,
        minTemperature: '',
        maxTemperature: '',
        rate: '',
        defaultFanSpeed: 'LOW',
        defaultTemperature: 25,
        acMode: 'COOL',
      },
      latestSettings:{
        settingID: null,
        lastEditTime: null,
        minTemperature: '',
        maxTemperature: '',
        rate: '',
        defaultFanSpeed: 'LOW',
        defaultTemperature: 25,
        acMode: 'COOL',
      },
    };
  },

  mounted() {
    this.fetchSettings();
  },

  methods: {
    async fetchSettings() {
      try {
        const response = await axios.get(`${window.apiBaseUrl}/settings`);
        this.latestSettings = response.data;
        this.settings = response.data;
      } catch (error) {
        console.error('Error fetching accounts:', error);
        alert(error);
      }
    },

    async submitSettings() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${window.apiBaseUrl}/settings`, this.settings, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('空调参数设置成功！');
        await this.fetchSettings()
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
