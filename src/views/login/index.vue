<template>
  <div class="wrap">
    <div class="login" :class="tabStatus==='regist'?'long':''">
      <el-tabs type="border-card" v-model="tabStatus" @tab-click="switchPage">
        <el-tab-pane label="登录" name="login"><div v-show="tabStatus==='login'"><keep-alive><router-view></router-view></keep-alive></div></el-tab-pane>
        <el-tab-pane label="注册" name="regist"><div v-show="tabStatus==='regist'"><keep-alive><router-view></router-view></keep-alive></div></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      tabStatus: "login",
    };
  },
  methods: {
    switchPage() {
      if (this.tabStatus === "login")
        this.$router.push({ name: "CommonLogin" });
      else this.$router.push({ name: "CommonRegist" });
    },
  },
  mounted(){
      if(this.$route.name === "CommonRegist") this.tabStatus = "regist";
      else if(this.$route.name === "CommonLogin") this.tabStatus = "login";
  },
  updated() {
    if(this.$route.name === "CommonRegist") this.tabStatus = "regist";
    else if(this.$route.name === "CommonLogin") this.tabStatus = "login";
  },
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #e4e4e4;
  overflow: hidden;
  .login {
    overflow: hidden;
    width: 450px;
    transition: all .5s;
    height:300px;
    margin: 0 auto;
    margin-top: 150px;
    .el-tabs--border-card {
        height: 100%;
      /deep/.el-tabs__header .el-tabs__item.is-active {
        color: rgb(88, 88, 88);
      }
      /deep/.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
        color: rgb(88, 88, 88);
      }
    }
  }
  .long{
      height: 600px;
      transition: all .5s;
  }
}
</style>