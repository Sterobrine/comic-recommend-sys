<template>
  <div class="test">
    <div class="wrap">
      <div class="username">
        <span>用户名：</span>
        <el-input
          placeholder="请输入用户名"
          v-model="username"
          @input="checkUsername"
          class="input"
        ></el-input>
        <div class="warn" v-show="!usernameError"><span>用户名只能包含字母和数字,且长度不小于4位</span></div>
      </div>
      <div class="password">
        <span>密&nbsp;&nbsp;&nbsp;码：</span>
        <el-input
          placeholder="请输入密码"
          v-model="password"
          show-password
          class="input"
          @input="checkPassword"
        ></el-input>
        <div class="warn" v-show="!passwordError"><span>密码长度不能小于6位</span></div>
      </div>
    </div>
    <div class="submit">
      <el-button type="info" :disabled="!isLogin" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>
import loginApi from '../../api/login';
export default {
  name: "CommonLogin",
  data() {
    return {
      username: "",
      password: "",
      usernameError: true,
      passwordError: true,
    };
  },
  methods: {
    checkUsername() {
      let rule = new RegExp('^\\w{4,}$');
      this.usernameError = rule.test(this.username);
    },
    checkPassword() {
      let rule = new RegExp('^\\w{6,}$');
      this.passwordError = rule.test(this.password);
    },
    login(){
      loginApi.login({user:{username:this.username,password:this.password}}).then(res => {
        if(res.data.code === 404){
          this.$messageBox.alert("用户名或密码错误");
        }
        else if(res.data.code === 200){
          this.$store.commit('clearToken');
          this.$store.commit('setToken',res.data.token);
          this.$router.push({name:'Home'});
        }
      });
    }
  },
  computed:{
    isLogin(){
      if(this.username===""|| this.password==="") return false;
      return this.usernameError && this.passwordError;
    }
  },
  mounted() {
  },
};
</script>

<style lang="less" scoped>
.test {
  width: 100%;
  height: 300px;
  .wrap {
      color: rgb(88,88,88);
    background-color: #fff;
    width: 370px;
    margin: 0 auto;
    // height: 200px;
    .username{
        margin-top: 20px;
        height: 50px;
    }
    .password{
        margin-top: 20px;
        height: 50px;
    }
    .warn{
            margin-left: 65px;
            margin-top: 4px;
            font-size: 14px;
            color: rgb(185, 1, 1);
        }
    .input {
      width: 300px;
    }
  }
  .submit{
        margin-top: 30px;
        width: 100%;
        text-align: center;
    }
}
</style>