<template>
  <div class="room-monitor">
    <div v-if="loading">加载中...</div>
    <div class="rooms-grid">
      <div v-for="room in rooms" :key="room.roomNumber"
           :class="['room-block', getRoomStatusClass(room), { 'selected': selectedRoom === room }]"
           @click="selectedRoom = selectedRoom === room ? null : room">
        <p>{{ room.roomNumber }}</p>
      </div>
    </div>
    <div v-if="selectedRoom" class="room-details">
      <h2>房间号: {{ selectedRoom.roomNumber }}</h2>
      <p>状态: {{ selectedRoom.occupied ? '占用' : '空闲' }}</p>
      <p>类型: {{ selectedRoom.type }}</p>
      <!-- 其他房间信息 -->
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      rooms: [],
      loading: true,
      selectedRoom: null
    };
  },
  created() {
    this.fetchRoomsState();
  },
  methods: {
    async fetchRoomsState() {
      try {
        const response = await axios.get(`${window.apiBaseUrl}/rooms-state`);  // 使用你的后端接口
        this.rooms = response.data;
      } catch (error) {
        console.error('Error fetching rooms state:', error);
        alert(error)
      } finally {
        this.loading = false;
      }
    },
    getRoomStatusClass(room) {
      if (room.occupied && room.acIsOn) return 'occupied-on';
      if (room.occupied && !room.acIsOn) return 'occupied-off';
      if (!room.occupied && room.acIsOn) return 'vacant-on';
      return 'vacant-off';
    }
  }
};
</script>


<style>
.room-monitor {
  /* 面板样式 */
}
.rooms-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 居中布局 */
}

.room-block {
  width: 40px; /* 调整宽度 */
  height: 40px; /* 调整高度 */
  margin: 15px;
  border-radius: 10px; /* 圆角矩形 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease; /* 过渡动画 */
}

.selected {
  transform: scale(1.2); /* 选中时放大 */
  z-index: 1; /* 确保在其他元素上方 */
}

.occupied-on {
  background-color: #2d5a2d;
}
.occupied-off {
  background-color: #317e92;
}
.vacant-on {
  background-color: #9d2727;
}
.vacant-off {
  background-color: lightgrey;
}
.room-details {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 10px;
}
</style>