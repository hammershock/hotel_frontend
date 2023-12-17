<template>
  <div class="page-container">
    <h2>欢迎回来，用户{{ this.username }}！</h2>
    <div class="room-edit-page">
      <!-- 内容部分 -->
    </div>
    <ACPanel class="semi-transparent" />
    <button @click="logout" class="back-button left">
      <img src="/logout.png" alt="Logout" width="16" height="16">
      退出登录
    </button>
  </div>
</template>


<script>
import ACPanel from "./ControlPage.vue";
import axios from "axios";
export default {
  components:{ACPanel},
  data() {
    return {
      roomName: '',
      username: null,
    };
  },
  created() {
    this.username = this.$route.params.username;
  },
  methods: {
    logout(){
      this.$router.push('/');
    },


  }
};
</script>

<!-- 添加样式 -->
<style>

.page-container {
  background-image: url('/room.jpeg'); /* 设置背景图片的URL */
  background-size: cover; /* 使背景图片充满容器 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  background-attachment: fixed; /* 固定背景图片，使其不随内容滚动 */
  position: absolute; /* 设置定位为绝对定位 */
  top: 0; /* 距离顶部距离为0 */
  right: 0; /* 距离右侧距离为0 */
  bottom: 0; /* 距离底部距离为0 */
  left: 0; /* 距离左侧距离为0 */
  width: 100%; /* 宽度为100% */
  height: 100%; /* 高度为100% */
  /* 其他样式 */
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
</style>
