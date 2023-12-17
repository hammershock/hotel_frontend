<template>
  <div class="air-conditioner-control-panel">
    <h2 class="hotel-title">波普特酒店{{ this.roomData.roomName }}房间</h2>
    <h3 class="hotel-title">{{ this.roomData.roomDescription }}</h3>
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
      <p>环境温度: {{ this.roomData.initialTemperature }}°C</p>
      <p>空调状态: {{ this.roomData.queueState }} </p>
      <p>入住时间: {{ this.roomData.checkInTime }} </p>

    </div>

    <!-- 累计消费 -->
    <div class="consumption-info">
      <span>累计消费: {{ this.roomData.consumption }}元</span>
    </div>
  </div>

  <button @click="downloadDetails">下载详单</button>
  <button @click="downloadSummary">下载账单</button>
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
        timeLeft: null,
        customerSessionID: null,
        consumption: null,
        unitPrice: null,
        days: null
      },
      acState: false,
      fanSpeed: 'LOW',
      details: [],
      summary: []
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
        const checkRoomStatusApi = window.apiBaseUrl + `/room`;

        const response = await axios.get(checkRoomStatusApi, {
          headers: {
            Authorization: `Bearer ${token}` // 添加 token 到请求头
          }
        });
        this.roomData = response.data['roomInfo'];

        if (this.roomData.fanSpeed){this.fanSpeed = this.roomData.fanSpeed;}
        if (this.roomData.queueState){this.acState = !(this.roomData.queueState === 'IDLE')}

      } catch (error) {
        console.error('Error updating room status:', error);
        alert(error);
        this.$router.push('/');
      }
    },

    async fetchRoomDetails() {
      try {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        const checkRoomStatusApi = window.apiBaseUrl + `/room/details`;

        const response = await axios.get(checkRoomStatusApi, {
          headers: {
            Authorization: `Bearer ${token}` // 添加 token 到请求头
          }
        });

        this.details = response.data['roomInfo'].roomDetails;

      } catch (error) {
        console.error('Error updating room status:', error);
        alert(error);
        this.$router.push('/');
      }
    },

    async send() {
      try {
        const token = localStorage.getItem('token');
        const updateStatusApi = window.apiBaseUrl + `/room`;
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

    async downloadSummary() {

      console.log(this.details);
      let csvContent = "data:text/csv;charset=utf-8,";

      // 添加标题行
      const headers = 'Room name,Room id,Room description,Session id,CheckIn time,current time,consumption,Unit price,Total\n';
      csvContent += headers;
      // 添加数据行
      const row = [this.roomData.roomName, this.roomData.roomID, this.roomData.roomDescription,
        this.roomData.customerSessionID, this.roomData.checkInTime, this.roomData.currentTime, this.roomData.consumption,
      this.roomData.unitPrice, this.roomData.days * this.roomData.unitPrice + this.roomData.consumption].join(',');
      csvContent += row + '\n';
      // 创建下载链接并触发下载
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "room_summary.csv");
      document.body.appendChild(link); // 必须追加到 body
      link.click();
      document.body.removeChild(link); // 清理
    },

    async downloadDetails() {
      await this.fetchRoomDetails();
      let csvContent = "data:text/csv;charset=utf-8,";

      // 添加标题行
      const headers = 'Record ID,Duration,Request Time,Serve Start Time, Serve End Time,Fan speed,AC Mode,Rate,Consumption,Accumulated Consumption\n';
      csvContent += headers;
      // 添加数据行
      this.summary.forEach(summary => {
        const row = [
          summary.id,
          summary.duration,
          summary.requestTime,
          summary.serveStartTime,
          summary.serveEndTime,
            summary.fanSpeed,
            summary.acMode,
            summary.rate,
            summary.consumption,
            summary.accumulatedConsumption
        ].join(',');
        csvContent += row + '\n';
      });

      // 创建下载链接并触发下载
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "room_details.csv");
      document.body.appendChild(link); // 必须追加到 body
      link.click();
      document.body.removeChild(link); // 清理
    }
  }
};
</script>

<style scoped>
.air-conditioner-control-panel {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
  background: rgba(255, 255, 255, 0);
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
