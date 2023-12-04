<template>
  <div class="title">
    <button @click="logout" class="back-button left">退出登录</button>
  <h2 class="hotel-title">波普特酒店{{this.roomID}}房间</h2>
  </div>

  <div class="air-conditioner-control-panel">
    <button @click="togglePower" :class="{ 'active': isOn }">{{ isOn ? '关闭空调' : '打开空调' }}</button>

    <div v-if="isOn" class="controls">
      <!-- 模式设置 -->
      <div class="mode-control">
        <label>模式:</label>
        <button :class="{ 'active': mode === 'cool' }" @click="setMode('cool')">制冷</button>
        <button :class="{ 'active': mode === 'heat' }" @click="setMode('heat')">制热</button>
      </div>

      <!-- 温度控制 -->
      <div class="temperature-control">
        <label for="temperature">温度: {{ temperature }}°C</label>
        <input type="range" id="temperature" v-model="temperature" min="16" max="30"/>
      </div>

      <!-- 风速控制 -->
      <div class="fan-speed-control">
        <label>风速:</label>
        <button :class="{ 'active': fanSpeed === 'low' }" @click="setFanSpeed('low')">低</button>
        <button :class="{ 'active': fanSpeed === 'medium' }" @click="setFanSpeed('medium')">中</button>
        <button :class="{ 'active': fanSpeed === 'high' }" @click="setFanSpeed('high')">高</button>
      </div>
    </div>

    <!-- 房间温度 -->
    <div class="room-temperature">
      <label>房间温度: {{ getRoomTemperature() }}°C</label>
    </div>

    <!-- 累计消费和详情链接 -->
    <div class="consumption-info">
      <span>累计消费: {{ consumption }}元</span>
      <a href="/consumption-details" target="_blank">查看消费详情</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomID: String, // 父组件传递的房间 ID
  },
  data() {
    return {
      isOn: false,
      temperature: 22,
      fanSpeed: 'medium',
      mode: 'cool', // 制冷模式
      consumption: 0.2, // 累计消费
      fanBladeImage: 'spinning-fan.gif',
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
      this.$emit('logout', '客户')
    },
    getRoomTemperature(){
      return 22;
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
