<template>
  <div class="room-edit-page">
    <h2>房间{{ this.roomName }}</h2>
    <ACPanel :roomName="this.roomName"></ACPanel>
    <button @click="goBack();">返回</button>
    <button v-if="this.occupied" @click="checkout();">办理退房</button>
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
      occupied: false
    };
  },
  created() {
    this.roomName = this.$route.params.roomName;
    this.occupied = localStorage.getItem('occupied') === 'true';
  },
  methods: {
    // 其他方法...
    goBack() {
      this.$router.go(-1);
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
        alert('办理退房成功!！');
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
