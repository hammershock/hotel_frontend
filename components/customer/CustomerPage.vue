<template>
  <div class="title">
    <button @click="logout" class="back-button left">退出登录</button>
    <h2 class="hotel-title">波普特酒店{{ this.roomID }}房间</h2>
  </div>

  <div class="air-conditioner-control-panel">
    <button @click="togglePower();onStatusChange()" :class="{ 'active': isOn }">{{
        isOn ? '关闭空调' : '打开空调'
      }}
    </button>

    <div v-if="isOn" class="controls">
      <!-- 模式设置 -->
      <div class="mode-control">
        <label>模式:</label>
        <button :class="{ 'active': mode === 'cool' }" @click="setMode('cool');onStatusChange()">制冷</button>
        <button :class="{ 'active': mode === 'heat' }" @click="setMode('heat');onStatusChange()">制热</button>
      </div>

      <!-- 温度控制 -->
      <div class="temperature-control">
        <label for="temperature">温度: {{ acTemperature }}°C</label>
        <input type="range" id="temperature" v-model="acTemperature" :min="temperatureMin" :max="temperatureMax"
               @change="onStatusChange">
      </div>

      <!-- 风速控制 -->
      <div class="fan-speed-control">
        <label>风速:</label>
        <button :class="{ 'active': fanSpeed === 'low' }" @click="setFanSpeed('low');onStatusChange()">低</button>
        <button :class="{ 'active': fanSpeed === 'medium' }" @click="setFanSpeed('medium');onStatusChange()">中</button>
        <button :class="{ 'active': fanSpeed === 'high' }" @click="setFanSpeed('high');onStatusChange()">高</button>
      </div>
    </div>

    <!-- 房间温度 -->
    <div class="room-temperature">
      <label>房间温度: {{ roomTemperature }}°C</label>
    </div>

    <!-- 累计消费和详情链接 -->
    <div class="consumption-info">
      <span>累计消费: {{ consumption }}元</span>
      <a href="/consumption-details" target="_blank">查看消费详情</a>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  created() {
    this.roomID = this.$route.params.roomID;
  },
  mounted() {
    this.updateRoomStatus(); // 首次加载时立即更新状态
    this.intervalId = setInterval(this.updateRoomStatus, 5000); // 设置定时器
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // 清除定时器
  },
  data() {
    return {
      isOn: false,
      temperatureMin: 16,
      acTemperature: 22,
      temperatureMax: 30,
      fanSpeed: 'medium',
      mode: 'cool', // 制冷模式
      consumption: null, // 累计消费
      roomTemperature: 22,
      rate: null,  // 空调费率
      roomID: null
    };
  },

  methods: {
    togglePower() {
      this.isOn = !this.isOn;
    },
    setFanSpeed(speed) {
      this.fanSpeed = speed;
    },
    setMode(mode) {
      this.mode = mode;
    },
    logout(role) {
      this.$router.push('/');
    },
    async updateRoomStatus() {
      try {
        // 假设后端提供了一个API来获取房间状态
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        const checkRoomStatusApi = window.apiBaseUrl + '/room-status';

        const response = await axios.get(checkRoomStatusApi, {
          headers: {
            Authorization: `Bearer ${token}` // 添加 token 到请求头
          }
        });
        // 更新组件的数据属性
        this.isOn = response.data.isOn;
        this.temperatureMin = response.data.temperatureMin;
        this.acTemperature = response.data.acTemperature;
        this.temperatureMax = response.data.temperatureMax;
        this.fanSpeed = response.data.fanSpeed;
        this.mode = response.data.mode;
        this.consumption = response.data.consumption;
        this.roomTemperature = response.data.roomTemperature;
        this.rate = response.data.rate;  // 空调费率
      } catch (error) {
        console.error('Error updating room status:', error);
        alert(error);
        this.$emit('logout', '客户');
        // 可以添加错误处理逻辑
      }
    },

    async sendStatusToBackend() {
      try {
        const token = localStorage.getItem('token');
        const updateStatusApi = window.apiBaseUrl + '/update-status';
        const payload = {
          isOn: this.isOn,
          temperature: this.acTemperature,
          fanSpeed: this.fanSpeed,
          mode: this.mode, // 制冷模式
          roomTemperature: this.roomTemperature,
        };

        await axios.post(updateStatusApi, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // alert('update success!');

      } catch (error) {
        console.error('Error sending status to backend:', error);
        alert('更新失败！');
        // 可以添加错误处理逻辑
      }
    },

    onStatusChange() {
      this.sendStatusToBackend();
    },


  }
};
</script>

<style scoped>
.air-conditioner-control-panel {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
}

.controls {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.mode-control, .temperature-control, .fan-speed-control {
  margin: 10px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 5px;
}

button.active {
  background-color: #0056b3;
}

button:hover {
  background-color: #0069d9;
}

.consumption-info {
  margin-top: 20px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
