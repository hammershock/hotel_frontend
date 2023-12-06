<template>
  <div class="air-conditioner-admin-panel">
    <button @click="logout" class="back-button left">退出登录</button>
    <h2>空调运行状态</h2>
    <div class="rooms">
      <button
        v-for="room in rooms"
        :key="room.number"
        class="room-button"
        @click="selectRoom(room)"
      >
        房间 {{ room.number }}
        <span :class="['status-indicator', room.status]"></span>
      </button>
    </div>

    <div v-if="selectedRoom" class="details-panel">
      <h3>房间 {{ selectedRoom.number }} - 空调详情</h3>
      <p>状态: {{ selectedRoom.status }}</p>
      <!-- 添加更多空调使用详情 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [
        { number: 101, status: 'on' },
        { number: 102, status: 'off' },
        { number: 103, status: 'on' },
        { number: 104, status: 'off' },
        { number: 105, status: 'on' },
        { number: 106, status: 'off' },
        // 添加更多房间及其状态
      ],
      selectedRoom: null
    };
  },
  methods: {
    selectRoom(room) {
      this.selectedRoom = room;
    },
    logout(role){
      this.$emit('logout', '管理员')
    }
  }
};
</script>

<style scoped>
.air-conditioner-admin-panel {
  /* 面板样式 */
}

.rooms {
  display: flex;
  flex-wrap: wrap;
}

.room {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}

.status-indicator {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 5px;
}

.status-indicator.on {
  background-color: green;
}

.status-indicator.off {
  background-color: red;
}

.room-button {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f5f5f5;
}

.room-button:hover {
  background-color: #e9e9e9;
}

.details-panel {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

</style>
