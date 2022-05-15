<template>
  <div class="header">
    <div class="header-main">
      <div class="icon">
        <ul class="menu">
          <li v-for="item in $store.state.menu.menuList" :key="item.name">
            <router-link :to="item.path"
              ><span :class="item.style">{{ item.label }}</span></router-link
            >
          </li>
        </ul>
      </div>
      <div class="search">
        <el-input
          placeholder="请输入要查询的电影名"
          v-model="searchContent"
          class="search-frame"
          min="200"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div class="user">
        <div class="operate" v-if="!hasLogin">
          <span class="login" @click="login">登录</span>
          <span class="regist" @click="regist">注册</span>
        </div>
        <div class="drop-down" v-if="hasLogin">
          <el-dropdown>
          <span><img :src="imgurl" alt=""></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="toPersonal">个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logOut">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginApi from '../../api/login'
export default {
  name: "CommonHeader",
  data() {
    return {
      searchContent: "",
      imgurl: require('../assets/user_icon.jpg'),
      hasLogin:false,
    };
  },
  methods: {
    toPersonal(){
      this.$router.push({name:'Personal'})
    },
    logOut(){
      this.$store.commit('clearToken');
      this.hasLogin = false;
    },
    login(){
      this.$router.push({name:'CommonLogin'});
    },
    regist(){
      this.$router.push({name:'CommonRegist'});
    },
    search(){
      this.$router.push('/search/' + this.searchContent.replace(/^\s*|\s*$/g, '').split(' ').join('&'));
      this.searchContent = "";
    }
  },
  mounted() {
    loginApi.loginCheck().then(res => {
      if(res.data.code === 200) this.hasLogin = true;
      else if(res.data.code === 401) this.hasLogin = false;
    });
  },
};
</script>

<style lang="less" scoped>
@min_width:400px;
@max_width:1200px;
.header {
  width: 100%;
  height: 60px;
  .header-main {
    max-width: @max_width;
    min-width: @min_width;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      min-width: 150px;
      max-width: 200px;
      height: 40px;
      .menu {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        li {
          // float: left;
          list-style: none;
          // margin-left: 25px;
          height: 100%;
          line-height: 40px;
          text-align: center;
          color: #97999a;
          a {
            text-decoration: none;
          }
          .menu-item {
            color: #97999a;
            transition: color 0.3s;
          }
          .menu-item:hover {
            color: rgb(88, 88, 88);
            transition: color 0.3s;
          }
          .menu-item-active{
            font-size: 18px;
            color: rgb(88, 88, 88);
          }
        }
        // li:nth-child(1) {
        //   margin-left: 0px;
        // }
      }
    }
    .search {
      width: 400px;
      margin-right: 100px;
    }
    .user {
      color: #97999a;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      .operate{
        width: 45px;
        height: 45px;
        span{
          transition: color .5s;
        }
        span:hover{
          transition: color .5s;
          color: rgb(88, 88, 88);
          cursor: pointer;
        }
      }
      .drop-down{
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: #97999a;
        img{
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }
}
</style>