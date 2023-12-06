<template>
  <div class="room-management">
    <div class="controls">
      <input type="text" v-model="searchQuery" placeholder="搜索房间..." class="search-bar">
      <select v-model="selectedType" class="room-filter">
        <option value="">所有类型</option>
        <option value="大床房">大床房</option>
        <option value="标准间">标准间</option>
      </select>
    </div>
    <div class="room-list">
      <transition-group name="room-fade" tag="div" class="room-list">
      <div v-for="room in filteredRooms" :key="room.id" :class="['room-card', getRoomTypeClass(room)]">
        <h2>房间号: {{ room.id }}</h2>
        <p>类型: {{ room.type }}</p>
        <p>入住天数: {{ room.days }}</p>
        <p>消费金额: {{ room.consumption }} 元</p>
        <button @click="deleteRoom(room.id)" class="delete-btn">删除</button>
      </div></transition-group>
    </div>
    <div class="room-creation">
    <h2>创建新房间</h2>
    <form @submit.prevent="createRoom">
      <div class="form-group">
        <label for="roomNumber">房间号:</label>
        <input type="number" id="roomNumber" v-model.number="newRoom.roomNumber" min="1" required>
      </div>
      <div class="form-group">
        <label for="roomType">房间类型:</label>
        <select id="roomType" v-model="newRoom.roomType" required>
          <option value="">选择类型</option>
          <option value="大床房">大床房</option>
          <option value="标准间">标准间</option>
        </select>
      </div>
      <div class="form-group">
        <label for="roomDuration">入住天数:</label>
        <input type="number" id="roomDuration" v-model.number="newRoom.roomDuration" min="1" required>
      </div>
      <button type="submit" class="submit-btn">添加房间</button>
    </form>
  </div>
  </div>
</template>



<script>
import axios from "axios";

export default {
  data() {
    return {
      rooms: [],
      searchQuery: '',
      selectedType: '',
      newRoom: {
        roomNumber: null,
        roomType: '',
        roomDuration: null
      }
    };
  },

  computed: {
    filteredRooms() {
      return this.rooms.filter(room => {
        return (
          (this.selectedType === '' || room.type === this.selectedType) &&
          room.id.toString().includes(this.searchQuery)
        );
      });
    }
  },
  mounted() {
    this.fetchRooms();
  },
  methods: {
    getRoomTypeClass(account) {
      switch (account.type) {
        case "大床房":
          return "big";
        case "标准间":
          return "normal";
        default:
          return "";
      }
    },

    async fetchRooms() {
      try {
        const response = await axios.get(`${window.apiBaseUrl}/view-rooms`);
        this.rooms = response.data; // 将响应数据赋值给 accounts
      } catch (error) {
        console.error('Error fetching accounts:', error);
        alert(error);
      }
    },

    async deleteRoom(roomID) {
      try {
        const token = localStorage.getItem('token');
        const payload = {
          "roomID": roomID,
        };

        const response = await axios.post(
            `${window.apiBaseUrl}/delete-room`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        await this.fetchRooms();
        // alert('删除成功！');
        // 在此处执行更新帐号列表的操作，例如重新加载帐号数据
      } catch (error) {
        console.error('Error during account logout:', error);
        alert(error);
      }
    },

    async createRoom() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${window.apiBaseUrl}/create-room`, this.newRoom, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // 处理房间创建成功后的逻辑
        // 如清空表单
        this.newRoom = { roomNumber: null, roomType: '', roomDuration: null };
        // 更新房间列表
        await this.fetchRooms();
        // alert('房间创建成功！');
      } catch (error) {
        console.error('Error creating room:', error);
        alert('房间创建失败：' + error);
      }
    },

  }
};
</script>

<style>
.room-management {
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar, .room-filter {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.room-list {
  display: flex;
  flex-wrap: wrap;
}

.room-card {
  width: 250px;
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.room-card:hover {
  transform: scale(1.05);
}

.big {
  background-color: #e6f7ff;
}

.normal {
  background-color: #fffbe6;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #ff7875;
}

.room-fade-enter-active, .room-fade-leave-active {
  transition: opacity 0.5s ease;
}
.room-fade-enter, .room-fade-leave-to /* 2.1.8版及更高版本 */ {
  opacity: 0;
}

.room-creation {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
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