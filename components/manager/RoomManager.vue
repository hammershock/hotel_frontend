<template>
  <div class="account-management">
<!--    <h1>帐号管理</h1>-->
    <div class="account-list">
      <ul>
        <li v-for="room in rooms" :key="room.id" :class="getRoomTypeClass(room)">
          <strong>{{ room.id }}</strong> ({{ room.type }})
          <br>
          入住天数: {{ room.days }}
          <br>
          消费金额: {{ room.consumption }}

          <button @click="deleteRoom(room.id); ">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      rooms: []
    };
  },
  mounted() {
    this.fetchRooms(); // 首次加载时立即更新状态
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
        alert('删除成功！');
        // 在此处执行更新帐号列表的操作，例如重新加载帐号数据
      } catch (error) {
        console.error('Error during account logout:', error);
        alert(error);
      }
    },
  }
};
</script>


<style scoped>
.account-management {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  max-height: 400px; /* 设置最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.account-list ul {
  list-style: none;
  padding: 0;
}

.account-list li {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 水平布局，内容分布在两端 */
  align-items: center; /* 垂直居中对齐 */
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.big {
  color: #4CAF50;
}

.normal {
  color: #2196F3;
}


.account-info {
  flex: 1; /* 占据可用空间的比例，这里占据左边的空间 */
}

.account-details {
  flex: 1; /* 占据可用空间的比例，这里占据右边的空间 */
  text-align: right; /* 右对齐文本 */
}
</style>