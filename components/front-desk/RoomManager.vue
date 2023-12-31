<template>
  <div class="room-management">

    <div class="controls">
      <input type="text" v-model="searchQuery" placeholder="搜索房间... " class="search-bar">
      <select v-model="selectedDimension" class="dimension-selector">
        <option value="consumption">累计消费</option>
        <option value="occupied">入住状态</option>
        <option value="duration">入住时间</option>
        <option value="roomTemperature">房间温度</option>
        <option value="queueState">空调状态</option>
        <option value="acTemperature">空调设定温度</option>
        <option value="fanSpeed">风速</option>
      </select>

      <div v-if="selectedDimension === 'consumption'" class="range-selector">
        <input type="number" v-model.number="minValue" placeholder="最小金额">
        <input type="number" v-model.number="maxValue" placeholder="最大金额">
      </div>

      <div v-else-if="selectedDimension === 'occupied'" class="filter-selector">
        <select v-model="filterValue" class="filter-selector">
          <option value="">选择类型</option>
          <option value="true">已入住</option>
          <option value="false">空闲</option>
        </select>
      </div>

      <div v-else-if="selectedDimension === 'duration'" class="range-selector">
        <input type="number" v-model.number="minValue" placeholder="最小天数" min="1">
        <input type="number" v-model.number="maxValue" placeholder="最大天数" min="1">
      </div>

      <div v-else-if="selectedDimension === 'roomTemperature'" class="range-selector">
        <input type="number" v-model.number="minValue" placeholder="最低温度">
        <input type="number" v-model.number="maxValue" placeholder="最高温度">
      </div>

      <div v-else-if="selectedDimension === 'queueState'" class="filter-selector">
        <select v-model="filterValue" class="filter-selector">
          <option value="">选择状态</option>
          <option value="PENDING">等待</option>
          <option value="RUNNING">运行中</option>
          <option value="IDLE">空闲</option>
        </select>
      </div>

      <div v-else-if="selectedDimension === 'acTemperature'" class="range-selector">
        <input type="number" v-model.number="minValue" placeholder="最低温度" min="10">
        <input type="number" v-model.number="maxValue" placeholder="最高温度" max="40">
      </div>

      <div v-else-if="selectedDimension === 'fanSpeed'" class="filter-selector">
        <select v-model="filterValue" class="filter-selector">
          <option value="">选择风速</option>
          <option value="LOW">低</option>
          <option value="MEDIUM">中</option>
          <option value="HIGH">高</option>
        </select>
      </div>
    </div>

    <div class="room-list">
      <transition-group name="room-fade" tag="div" class="room-list">

      <div v-for="room in filteredRooms"
           :key="room.id"
           :class="['room-card'] "
           :style="{ backgroundColor: getRoomColor(room) }">

        <h2>房间{{ room.roomName }}</h2>
        <p>编号: {{ room.roomID }}</p>
        <p>类型: {{ room.roomDescription }}</p>
        <p>入住状态: {{ room.occupied ? "已入住": "空闲"}} </p>
        <p>空调状态: {{ room.queueState }} </p>
<!--        <p >剩余时间: {{ room.timeLeft }} </p>-->
        <p >空调设定温度: {{ room.acTemperature }} </p>
        <p >房间温度: {{ room.roomTemperature }} </p>
        <p >房间初始温度: {{ room.initialTemperature }} </p>
        <p>风速: {{ room.fanSpeed}} </p>
        <p>累计消费: {{ room.consumption }} </p>
        <p>房间单价: {{ room.unitPrice }} </p>
        <!-- 删除房间 -->

        <button v-if="room.occupied" @click="deleteRoom(room.roomName)" @click.stop="deleteRoom(room.roomName)" class="delete-btn">办理退房</button>
      </div></transition-group>

    </div>
  </div>
</template>



<script>
import axios from "axios";

export default {
  created() {
    const selectedDimension = sessionStorage.getItem('selectedDimension');
    if (selectedDimension){this.selectedDimension = selectedDimension};

  },
  data() {
    return {
      rooms: [],
      selectedRoom: null,

      searchQuery: '',
      selectedType: '',
      newRoom: {
        roomName: null,
        roomDescription: '',
        unitPrice: null
      },

      selectedDimension: 'consumption',
      filterValue: '',
      minValue: null,
      maxValue: null,

    };
  },
  watch: {
    selectedDimension(newValue, oldValue) {
      if (newValue !== oldValue) {
        sessionStorage.setItem('selectedDimension', newValue);
        this.updateFilterOptions();
      }
    }
  },

  computed: {
  filteredRooms() {
    return this.rooms.filter(room => {
      const matchesDimensionFilter = ['roomTemperature', 'duration', 'consumption', 'acTemperature'].includes(this.selectedDimension) ?
          ((!this.minValue || room[this.selectedDimension] >= this.minValue) && (!this.maxValue || room[this.selectedDimension] <= this.maxValue)) :
          (room[this.selectedDimension].toString() === this.filterValue || !this.filterValue)
      // console.log(room[this.selectedDimension], this.filterValue, room[this.selectedDimension] === this.filterValue)
      const matchesSearchQuery = this.searchQuery ?
        room.roomName.toString().includes(this.searchQuery) :
        true;

      return matchesDimensionFilter && matchesSearchQuery;
    });
  }
},

  mounted() {
    this.fetchRooms();
    this.intervalId = setInterval(this.fetchRooms, 1000);
  },

  beforeUnmount() {
    clearInterval(this.intervalId); // 清除定时器
  },
  methods: {
    updateFilterOptions() {
      // 重置筛选选项
      this.filterValue = '';
      this.minValue = null;
      this.maxValue = null;
    },

    async updateRoomStatus() {
      // 发送更新请求到后端 API
      // 关闭模态框并刷新房间列表...
    },

    async fetchRooms() {
      try {
        const response = await axios.get(`${window.apiBaseUrl}/rooms`);
        this.rooms = response.data['roomsInfo'];
      } catch (error) {
        console.error('Error fetching accounts:', error);
        alert(error);
      }
    },

async deleteRoom(roomName) {
  try {
    const token = localStorage.getItem('token');
    const payload = {
      "roomName": roomName,
    };

    await axios.post(`${window.apiBaseUrl}/account/delete`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await this.fetchRooms();
  } catch (error) {
    console.error('Error during room deletion:', error.message);
  }
},

    async createRoom() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${window.apiBaseUrl}/room/create`, this.newRoom, {
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

    getRoomColor(room) {
    const colorPalette = {
      type: {
        '大床房': '#848365',
        '标准间': '#658665'
      },
      occupied: {
        true: '#dddda8', // 浅黄色
        false: '#9b9191' // 浅灰色
      },
      queueState: {
        'RUNNING': '#456a4c',
        'IDLE': '#d3d3d3',
        'PENDING': '#8c8c29'
      },
      fanSpeed: {
        'LOW': '#7f929a',
        'MEDIUM': '#7f9d7f',
        'HIGH': '#a392a3' // 浅紫色
      },
      acMode: {
        'cool': '#688a96', // 天蓝色
        'heat': '#b17655' // 橙色
      }
    };

    if (['roomTemperature', 'duration', 'consumption', 'acTemperature'].includes(this.selectedDimension)) {
      // 为连续变量计算渐变颜色
      const minColor = '#766796'; // 冷色调
      const maxColor = '#b4a97c'; // 热色调
      const { minValue, maxValue } = this.getMinMaxValuesForDimension(this.selectedDimension);

      const factor = this.normalizeValue(room[this.selectedDimension], minValue, maxValue);
      return this.interpolateColor(minColor, maxColor, factor);

    }
    if (this.selectedDimension === 'queueState' && room[this.selectedDimension] !== 'IDLE' && !room.occupied)return '#ac7e35'
    return colorPalette[this.selectedDimension][room[this.selectedDimension]];
  },

    normalizeValue(value, minValue, maxValue) {
    return (value - minValue) / (maxValue - minValue);
  },

  getMinMaxValuesForDimension(dimension) {
    const values = this.rooms.map(room => parseFloat(room[dimension]));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values) + 0.01;
    return { minValue, maxValue };
  },

    interpolateColor(color1, color2, factor) {
      if (factor > 1) factor = 1;
      if (factor < 0) factor = 0;

      const result = color1.slice(1).match(/.{2}/g).map((hex, index) =>
        Math.round(parseInt(hex, 16) * (1 - factor) + parseInt(color2.slice(1).match(/.{2}/g)[index], 16) * factor)
          .toString(16).padStart(2, '0')
      );

      return `#${result.join('')}`;
    }

  }
};
</script>

<style>
.room-management {
  padding: 20px;
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



.controls {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5; /* 轻微灰色背景 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微的阴影 */
  margin-bottom: 20px;
}

.search-bar {
  flex: 1; /* 搜索栏占据多余空间 */
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px; /* 较大的字体大小 */
}

.dimension-selector,
.filter-selector select,
.range-selector input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px; /* 保持间距一致 */
}

.range-selector {
  display: flex;
  align-items: center;
}

.range-selector input {
  width: 100px; /* 控制输入框宽度 */
}

.filter-selector, .range-selector {
  flex-grow: 1; /* 这些选择器平分剩余空间 */
}

.filter-selector select, .range-selector input {
  width: 100%; /* 占满父容器宽度 */
  box-sizing: border-box; /* 包括padding和border在内的宽度 */
}

</style>
