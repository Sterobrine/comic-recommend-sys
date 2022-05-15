<template>
  <div class="container">
    <div class="header">
      <common-header></common-header>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import CommonHeader from "./CommonHeader.vue";
export default {
  components: { CommonHeader },
  name: "MainFrame",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
@min_width:400px;
@max_width:1200px;
.container {
  overflow: hidden;
  width: 100%;
  min-width: @min_width;
  min-height: 100vh;
  position: relative;
  .header {
    background-color: #e4e4e4;
    width: 100%;
  }
  .main {
    min-width: @min_width;
    max-width: @max_width;
    // min-height: 500px;
    // max-height: 2000px;
    margin: 20px auto;
    margin-bottom: 0;
  }
  .footer {
    background-color: #e4e4e4;
    width: 100%;
    min-width: @min_width;
    min-height: 60px;
    position: absolute;
    bottom: 0px;
    margin-top: 20px;
  }
}
.container:after{
  content: '';
  display: block;
  clear: both;
}
.container:before{
  content: '';
  display: block;
  clear: both;
}
</style>