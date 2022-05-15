<template>
  <div class="personal">
    <div class="personal-detail">
      <div class="face">
        <img :src="faceUrl" alt="" style="width: 80px; height: 80px" />
      </div>
      <div class="detail">
        <div class="username"><span>{{personalDetail.username}}</span></div>
        <div class="signature"><span>{{personalDetail.signature}}</span></div>
      </div>
    </div>
    <div class="nav">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        active-text-color="rgb(88, 88, 88)"
      >
        <el-menu-item index="1" @click="changeMenu(1)">我的订阅</el-menu-item>
        <el-menu-item index="2" @click="changeMenu(2)">个性标签</el-menu-item>
      </el-menu>
      <router-view class="detail" :uid="personalDetail.uid"></router-view>
    </div>
  </div>
</template>

<script>
import personalApi from '../../../api/personal';
export default {
  name: "Personal",
  data() {
    return {
      faceUrl: require("../../assets/user_icon.jpg"),
      activeMenu: "1",
      personalDetail:{}
    };
  },
  props: ["uid"],
  methods: {
    changeMenu(index){
      if(index === 1){
        this.$router.push({name:"SubscribeList"});
        this.activeMenu = "1";
      }
      else{
        this.$router.push({name:"Tags"});
        this.activeMenu = "2";
      }
    },
    getPersonalDetail(){
      return personalApi.getDetail();
    }
  },
  mounted(){
    this.getPersonalDetail().then(res => {
      if(res.data.code === 200) this.personalDetail = res.data.list[0];
    })
  },
  updated() {
    if(this.$route.name === 'SubscribeList') this.activeMenu = "1";
    else if(this.$route.name === 'Tags') this.activeMenu = "2";
  },
};
</script>

<style lang='less' scoped>
.personal {
  width: 100%;
  margin-top: 40px;
  .personal-detail{
      .face{
          width: 80px;
          height: 80px;
          float: left;
          margin-left: 20px;
          border: 2px solid #e4e4e4;
          border-radius: 50%;
          overflow: hidden;
      }
      .detail{
          float: left;
          padding-left: 10px;
          color: rgb(88, 88, 88);
          .username{
              font-size: 20px;
              margin-top: 10px;
              padding-left:10px;
              span{
                  font-weight: bold;
              }
          }
          .signature{
              max-width: 600px;
              margin-top: 10px;
              font-size: 15px;
              border-radius: 5px;
              padding: 0 10px;
              transition-property: background-color,color;
              transition-duration: .5s;
          }
          .signature:hover{
              transition-property: background-color,color;
              transition-duration: .5s;
              background-color: #97999a;
              color: #ffff;
          }
      }
  }
  .personal-detail:after{
      content:'';
      display: block;
      clear: both;
  }
  .nav {
    width: 100%;
    margin-top: 20px;
    .el-menu-item {
      width: 100px;
      text-align: center;
      font-size: 16px;
      padding: 0;
    }
    .el-menu-item.is-active {
      padding: 0;
    }
  }
}
</style>