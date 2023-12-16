<template>
  <div class="air-conditioner-control-panel">
    <h2 class="hotel-title">波普特酒店{{ this.roomName }}房间</h2>
    <button @click="togglePower();onStatusChange()" :class="{ 'active': this.acState }">{{
        this.acState ? '关闭空调' : '打开空调'
      }}
    </button>

    <div v-if="acState" class="controls">
      <!-- 温度控制 -->
      <div class="temperature-control">
        <label for="temperature">温度: {{ this.roomData.acTemperature }}°C</label>
        <input type="range"
               id="temperature"
               v-model="this.roomData.acTemperature"
               :min="this.roomData.minTemperature"
               :max="this.roomData.maxTemperature"
               @change="onStatusChange">
      </div>

      <!-- 风速控制 -->
      <div class="fan-speed-control">
        <label>风速:</label>
        <button :class="{ 'active': this.fanSpeed === 'LOW' }" @click="setFanSpeed('LOW');onStatusChange()">低</button>
        <button :class="{ 'active': this.fanSpeed === 'MEDIUM' }" @click="setFanSpeed('MEDIUM');onStatusChange()">中</button>
        <button :class="{ 'active': this.fanSpeed === 'HIGH' }" @click="setFanSpeed('HIGH');onStatusChange()">高</button>
      </div>
    </div>

    <!-- 房间温度 -->
    <div class="room-temperature">
      <p>房间温度: {{ this.roomData.roomTemperature }}°C</p>
      <p>环境温度: {{ this.roomData.initialTemperature }}°C </p>
      <p>入住状态: {{ this.roomData.occupied ? '已入住': '空闲' }} </p>
      <p>房间状态: {{ this.roomData.queueState }} </p>
    </div>

    <!-- 累计消费 -->
    <div class="consumption-info">
      <span>累计消费: {{ this.roomData.consumption }}元</span>
    </div>
  </div>
</template>


<script>
import axios from "axios";


export default {
  mounted() {
    this.updateRoomStatus(); // 首次加载时立即更新状态
    this.intervalId = setInterval(this.updateRoomStatus, 1000); // 每隔5秒更新房间显示
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // 清除定时器
  },
  props: {
    roomName: String, // 声明props，接收名为message的字符串属性
  },
  data() {
    return {
      roomData: {
        roomID: null,
        roomName: null,
        roomDescription: null,
        roomTemperature: null,
        acTemperature: null,
        fanSpeed: null,
        acMode: null,
        initialTemperature: null,
        queueState: 'IDLE',
        minTemperature: null,
        maxTemperature: null,
        firstRunTime: null,
        checkInTime: null,
        occupied: null,
        roomDetails: null,
        timeLeft: null
      },
      acState: false,
      fanSpeed: 'LOW'
    };
  },

  methods: {
    togglePower() {
      this.acState = !this.acState;
    },
    setFanSpeed(speed) {
      this.fanSpeed = speed;
    },
    logout(role) {
      this.$router.push('/');
    },

    async updateRoomStatus() {
      try {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        const checkRoomStatusApi = window.apiBaseUrl + `/room/${this.roomName}/details`;

        const response = await axios.get(checkRoomStatusApi, {
          headers: {
            Authorization: `Bearer ${token}` // 添加 token 到请求头
          }
        });
        this.roomData = response.data['roomInfo'];
        console.log(this.roomData.fanSpeed)
        if (this.roomData.fanSpeed){this.fanSpeed = this.roomData.fanSpeed;console.log(this.roomData.fanSpeed)}
        if (this.roomData.queueState){this.acState = !(this.roomData.queueState === 'IDLE')}

      } catch (error) {
        console.error('Error updating room status:', error);
        alert(error);
        this.$router.push('/');
      }
    },

    async send() {
      try {
        const token = localStorage.getItem('token');
        const updateStatusApi = window.apiBaseUrl + `/room/${this.roomName}`;
        const payload = {
          acState: this.acState,
          acTemperature: this.roomData.acTemperature,
          fanSpeed: this.fanSpeed
        };
        await axios.post(updateStatusApi, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error sending status to backend:', error);
        alert('更新失败！');
      }
    },

    onStatusChange() {
      this.send(); // 发送新的房间状态到服务端
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
  background-color: #004c90;
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
