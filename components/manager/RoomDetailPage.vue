<template>
  <div class="room-edit-page">
    <h2>房间{{ this.roomName }}</h2>
    <ACPanel :roomName="this.roomName"></ACPanel>
    <button @click="goBack();">返回</button>
    <button @click="checkout();">check-out</button>
  </div>
</template>


<script>
import ACPanel from "./ControlPage.vue";
import axios from "axios";
export default {
  components:{ACPanel},
  data() {
    return {
      roomName: ''
    };
  },
  created() {
    this.roomName = this.$route.params.roomName;
  },
  methods: {
    updateRoomStatus() {
      // 发送更新请求到后端 API
    },
    // 其他方法...
    goBack() {
      const username = localStorage.getItem('username');
      this.$router.push(`/manager/${username}`);
    },
    async checkout() {
      try {
        const token = localStorage.getItem('token');
        const payload = {
          "roomName": this.roomName,
        };
        const response = await axios.post(
            `${window.apiBaseUrl}/account/delete`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        alert('checkout成功!！');
        // 在此处执行更新帐号列表的操作，例如重新加载帐号数据
      } catch (error) {
        console.error('Error during account logout:', error);
        alert(error);
      }
    },
  }
};
</script>

<!-- 添加样式 -->
