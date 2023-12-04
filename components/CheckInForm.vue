<template>
  <button v-if="step > 1" @click="goBack" class="back-button left">返回上一步</button>

  <!-- 登记入住流程 -->
    <!-- 步骤 1: 入住表单 -->
    <div v-if="step === 1" class="step-container">
      <h3>入住登记</h3>
      <form @submit.prevent="goNext" class="form">
        <div class="form-group">
          <label for="idCard">身份证号:</label>
          <div class="input-group">
            <input type="text" id="idCard" v-model="customer.idCard" required>
          </div>
        </div>
        <div class="form-group">
          <label for="phone">手机号:</label>
          <div class="input-group">
            <input type="text" id="phone" v-model="customer.phone" required>
          </div>
        </div>
        <div class="form-group">
          <label for="roomType">房间类型:</label>
          <div class="input-group">
            <select id="roomType" v-model="customer.roomType">
              <option value="大床房">大床房</option>
              <option value="标准间">标准间</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="days">入住天数:</label>
          <div class="input-group">
            <input type="number" id="days" v-model="customer.days" required min="1">
          </div>
        </div>
        <button type="submit" class="action-button">提交</button>
      </form>
    </div>

    <!-- 步骤 2: 收取押金提示 -->
    <div v-else-if="step === 2" class="step-container">
      <h2>请收取押金</h2>
      <button @click="goNext" class="action-button">收取完毕</button>
    </div>

<!-- 步骤 3: 选择房间 -->
  <div v-else-if="step === 3" class="step-container">
    <h2>选择房间</h2>
    <div class="rooms">
      <button
        v-for="room in rooms"
        :key="room.number"
        :class="['room-button', { 'occupied': room.occupied }]"
        @click="room.occupied ? null : selectRoom(room.number)"
        :disabled="room.occupied"
      >
        {{ room.number }}
      </button>
    </div>
  </div>

    <!-- 步骤 4: 注册账号 -->
    <div v-else-if="step === 4" class="step-container">
      <h2>注册账号</h2>
      <form @submit.prevent="registerAccount" class="form">
        <div class="form-group">
          <label>账号 (房间号):</label>
          <span>{{ selectedRoom }}</span>
        </div>
        <div class="form-group">
          <label>设置密码:</label>
          <input type="password" v-model="account.password" required>
        </div>
        <button type="submit" class="action-button">注册</button>
      </form>
    </div>

      <!-- 步骤指示器 -->
    <div class="progress-indicator">
      <div v-for="num in 4" :key="num" :class="['circle', step >= num ? 'filled' : '']"></div>
    </div>


</template>

<script>
export default {
  data() {
    return {
      customer: {
        idCard: '',
        phone: '',
        roomType: '大床房',
        days: 1
      },

      rooms: [
        { number: 101, occupied: false },
        { number: 102, occupied: true },
        { number: 203, occupied: true },
        { number: 201, occupied: false },
        { number: 210, occupied: false }
        // 示例：已入住的房间
        // ... 其他房间 ...
      ],


      selectedRoom: null,
      step: 1,
      account: {
        password: ''
      }
    };
  },

  methods: {
    goBack(){this.step -= 1;},
    goNext(){this.step += 1;},

    selectRoom(room) {
      this.selectedRoom = room;
      this.step = 4;
    },
    registerAccount() {
      // alert(`账号: ${this.selectedRoom}，密码: ${this.account.password}`);
      // 在这里处理账号注册逻辑
      alert('注册成功！');
      this.$emit('goBackToMenu');
    },

  }
};
</script>

<style scoped>
.hotel-reception {
  text-align: center;
}

.main-menu {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.menu-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.menu-button:hover:not(.disabled) {
  transform: scale(1.1);
  background-color: #0056b3;
}

.menu-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.menu-button.active {
  background-color: #2d92dd; /* 活动菜单项的背景颜色 */
}

.progress-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: None;
  margin: 0 5px;
  transition: background-color 0.3s ease;
}

.back-button {
  background-color: #f8f9fa;
  color: #007BFF;
  border: 1px solid #007BFF;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
  margin-top: 10px;
}

.back-button {
  position: absolute;
  top: 10px;
  background-color: transparent;
  color: #007BFF;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
}

.back-button.left {
  left: 10px;
}

.back-button.right {
  right: 10px;
}

.back-button:hover {
  background-color: #f8f9fa;
}

.filled {
  background-color: #007BFF;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
}

.step-container {
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 20px;
  transition: transform 0.3s ease-in-out;
}


.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin: 10px 0;
  display: flex;
  align-items: center; /* 垂直居中元素 */
}

label {
  font-weight: bold;
  font-size: 16px;
  width: 120px; /* 固定标签的宽度 */
}

.input-group select {
  width: 200px; /* 拉长房间类型选框的长度 */
}

.input-group input[type="number"] {
  width: 80px; /* 拉长入住天数输入框的长度 */
}

input[type="text"],
input[type="password"],
select,
button[type="submit"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  margin-top: 5px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
}

.action-button:hover {
  background-color: #0056b3;
}

.rooms {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.room-button.occupied {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.room-button {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
}

.room-button.occupied:hover {
  /* 禁用悬停效果 */
  background-color: #ccc;
  color: #666;
}

.room-button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* 添加悬停时的缩放效果 */
}
</style>
