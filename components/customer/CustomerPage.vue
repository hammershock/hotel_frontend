<template>
  <div class="title">
    <button @click="logout" class="back-button left">退出登录</button>
  </div>
  <h2 class="hotel-title">欢迎回来，{{ this.username }}!</h2>
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
<!--      <button @click="getRoomDetails"> 查看消费详情</button>-->
    </div>

    <div class="chart-container">
<!--    <RoomTemperatureChart :roomDetails="roomDetails"></RoomTemperatureChart>-->
    <button @click="downloadAsCSV">下载 CSV</button>
  </div>
  </div>
</template>


<script>
import axios from "axios";
// import RoomTemperatureChart from './RoomTemperatureChart.vue';

export default {
  // components: {RoomTemperatureChart: RoomTemperatureChart},
  created() {
    this.username = this.$route.params.roomID;
    this.getRoomDetails();
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

      roomState:
          {roomID: null,
            roomName: null,
            roomDescription: null,
            consumption: 0.0,
            roomTemperature: null,
            acTemperature: null,
            fanSpeed: null,
            acMode: null,
            initialTemperature: null,
            queueState: 'IDLE',
            firstRunTime: null,
            customerSessionID: null,
            checkInTime: null,
            occupied: false,
            roomDetails: null
          },

      isOn: false,
      temperatureMin: 16,
      acTemperature: 22,
      temperatureMax: 30,
      mode: 'cool', // 制冷模式
      consumption: null, // 累计消费
      roomTemperature: 22,
      rate: null,  // 空调费率
      username: null,

      roomDetails: []
    };
  },

  methods: {
    togglePower() {
      this.isOn = !this.isOn;
    },
    setFanSpeed(speed) {
      this.fanSpeed = speed;
    },
    logout(role) {
      this.$router.push('/');
    },

    async getRoomDetails() {
      try {
        // 假设后端提供了一个API来获取房间状态
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        const checkRoomStatusApi = window.apiBaseUrl + '/room-details';

        const response = await axios.get(checkRoomStatusApi, {
          headers: {
            Authorization: `Bearer ${token}` // 添加 token 到请求头
          }
        });

        // 更新组件的数据属性
        this.roomDetails = response.data.roomDetails;
        console.log(this.roomDetails);
      } catch (error) {
        console.error('Error updating room status:', error);
        // alert(error);
        // this.$router.push('/');
        // 可以添加错误处理逻辑
      }
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
        this.$router.push('/');
        // 可以添加错误处理逻辑
      }

      await this.getRoomDetails();
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

    downloadAsCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // 添加标题行
    const headers = 'Record ID,Room Number,Customer Session ID,Room Temperature,Timestamp,AC Is On,AC Temperature,AC Speed,AC Mode,AC Rate,consumption\n';
    csvContent += headers;

    // 添加数据行
    this.roomDetails.forEach(detail => {
      const row = [
        detail.recordID,
        detail.roomName,
        detail.customerSessionID,
        detail.roomTemperature,
        detail.timestamp,
        detail.acIsOn ? 'On' : 'Off',
        detail.acTemperature,
        detail.acSpeed,
        detail.acMode,
        detail.acRate,
        detail.consumption
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

.chart-container {
  max-width: 600px; /* 控制图表的最大宽度 */
  margin: auto; /* 使图表居中显示 */
  padding: 20px; /* 在图表周围添加一些内边距 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 10px; /* 圆角边框 */
  background-color: #fff; /* 背景颜色 */
  box-sizing: border-box;
}
</style>
