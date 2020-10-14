<template>
  <div class="login_component">
    <div class="login_box">
      <div class="login_img">
        <img src="../assets/微信图片_20201014185926.jpg" alt="" />
      </div>
      <el-form ref="form" :rules="rules" :model="LoginForm" class="login_form">
        <el-form-item prop="account" :model="LoginForm">
          <el-input
            placeholder="请输入内容"
            v-model="LoginForm.account"
            class="login_account"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="LoginForm.password"
            class="login_password"
            show-password
          ></el-input
        ></el-form-item>
        <el-form-item class="login_but">
          <el-button @click="Login" type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      LoginForm: {
        account: '', // 账户
        password: '' // 密码
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    Login: function () {
      console.log(this.LoginForm.value)
    }
  }
}
</script>

<style lang="less" scoped>
.login_component {
  height: 100%;
  background-color: #000;
  .login_box {
    box-shadow: 0 0 40px rgb(13, 184, 252);
    border: 2px solid rgb(243, 140, 6);
    border-radius: 3px;
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .login_img {
      width: 130px;
      height: 130px;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      right: 50%;
      transform: translate(50%, -50%);
      padding: 10px;
      box-shadow: 0 0 40px rgb(13, 184, 252);
      img {
        background-color: #eee;
        width: 100%;
        border-radius: 50%;
      }
    }
  }
  .login_form {
    box-sizing: border-box;
    width: 100%;
    padding: 25px 25px;
  }
  .login_account {
    margin-top: 80px;
    // padding-bottom: 25px;
  }
  .login_but {
    position: absolute;
    bottom: 0%;
    right: 6%;
  }
}
</style>
