<template>
<h2>欢迎回来，用户{{ this.username }}！</h2>
  <div class="room-edit-page">
    <div class="menu-bar">


    </div>

  <ACPanel/>
<!--    <button @click="goBack();">返回</button>-->
<!--    <button @click="checkout();">check-out</button>-->
<button @click="logout" class="back-button left">
        <img src="/logout.png" alt="Logout" width="16" height="16">
        退出登录</button>
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
