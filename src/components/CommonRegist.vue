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
        <div class="warn" v-show="!usernameError">
          <span>用户名只能包含字母和数字,且长度不小于4位</span>
        </div>
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
        <div class="warn" v-show="!passwordError">
          <span>密码长度不能小于6位</span>
        </div>
      </div>
      <div class="repeatPassword">
        <span>确认密码：</span>
        <el-input
          placeholder="请再次输入密码"
          v-model="repeatPassword"
          show-password
          class="input"
          @input="checkRepeatPassword"
        ></el-input>
        <div class="warn" v-show="!repeatPasswordError">
          <span>两次输入的密码不一致</span>
        </div>
      </div>
      <div class="gender">
        <span>性&nbsp;&nbsp;&nbsp;别：</span>
        <div class="gender-wrap">
          <el-radio v-model="gender" :label="1">男</el-radio>
        <el-radio v-model="gender" :label="2">女</el-radio>
        </div>
      </div>
      <div class="birth">
        <span>出生日期：</span>
        <el-date-picker v-model="birth" value-format="yyyy/M/d"></el-date-picker>
      </div>
      <div class="signature">
        <span>个性签名：</span>
        <el-input type="textarea" :rows="3" resize="none" v-model="signature"></el-input>
      </div>
    </div>
    <div class="submit">
      <el-button type="info" :disabled="!isRegist" @click="regist">注册</el-button>
    </div>
  </div>
</template>

<script>
import loginApi from '../../api/login'
export default {
  name: "CommonRegist",
  data() {
    return {
      username: "",
      password: "",
      repeatPassword: "",
      usernameError: true,
      passwordError: true,
      repeatPasswordError: true,
      signature:"",
      gender:1,
      birth:""
    };
  },
  methods: {
    checkUsername() {
      if(this.username===""){
        this.usernameError=true;
        return;
      }
      let rule = new RegExp("^\\w{4,}$");
      this.usernameError = rule.test(this.username);
    },
    checkPassword() {
      if(this.password===""){
        this.passwordError=true;
        return;
      }
      let rule = new RegExp("^\\w{6,}$");
      this.passwordError = rule.test(this.password);
    },
    checkRepeatPassword() {
      if(this.repeatPassword===""){
        this.repeatPasswordError=true;
        return;
      }
      this.repeatPasswordError = this.password === this.repeatPassword;
    },
    regist(){
      loginApi.regist({user:{username:this.username,password:this.password,birth:this.birth,gender:this.gender===1?'男':'女',signature:this.signature}}).then(res => {
        if(res.data.code === 200){
          this.$messageBox.alert("注册成功").then(()=>{
            this.$router.push({name:'CommonLogin'});
          });
        }
      });
    }
  },
  computed:{
    isRegist(){
      if(this.username===""|| this.password==="") return false;
      return this.usernameError && this.passwordError && this.repeatPasswordError;
    }
  }
};
</script>

<style lang="less" scoped>
.test {
  width: 100%;
  
  .wrap {
    color: rgb(88, 88, 88);
    background-color: #fff;
    width: 370px;
    margin: 0 auto;
    // height: 200px;
    .username {
      margin-top: 20px;
      height: 50px;
    }
    .password {
      margin-top: 20px;
      height: 50px;
    }
    .repeatPassword{
      margin-top: 20px;
      height: 50px;
      .input{
        width: 280px;
      }
    }
    .gender{
      width: 100%;
      height: 50px;
      line-height: 50px;
      .gender-wrap{
        display: inline;
        width: 300px;
        height: 100%;
        margin-left: 30px;
      }
    }
    .birth{
      width: 100%;
      height: 50px;
      line-height: 50px;
    }
    .signature{
      width: 100%;
      height: 100px;
      margin-top: 20px;
      .el-textarea{
        width: 360px;
        margin-top: 10px;
      }
    }
    .warn {
      margin-left: 80px;
      margin-top: 4px;
      font-size: 14px;
      color: rgb(185, 1, 1);
    }
    .input {
      width: 300px;
    }
  }
  .submit {
    margin-top: 30px;
    width: 100%;
    text-align: center;
  }
}
</style>