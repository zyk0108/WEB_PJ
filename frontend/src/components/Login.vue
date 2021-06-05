<template>
  <div id="base_login">
    <el-form :model="loginForm"
             :rules="rules"
             class="login_container"
             label-position="left"
             label-width="0px"
             v-loading="loading">
      <h3 class="login_title">Login</h3>
      <el-form-item prop="username">
        <el-input type="text"
                  class="login_input"
                  prefix-icon="el-icon-user-solid"
                  v-model="loginForm.username"
                  auto-complete="off"
                  placeholder="username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  class="login_input"
                  prefix-icon="el-icon-lock"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="password"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary"
                   style="margin:10px auto 0px auto;width: 100%;background: #5299db;line-height: 0.8"
                   v-on:click="login">login</el-button>
      </el-form-item>
      <el-form-item style="width: 100%;margin: 0px auto">
        <router-link to="Register">
          Don't have an account yet? Create one
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        loginForm: {
          username: '',
          password: '',
          active:'active'
        },
        rules: {
          username: [{required: true, message: 'Please input the valid username', trigger: 'blur'}],
          password: [{required: true, message: 'Please input the valid password', trigger: 'blur'}]
        },
        loading: false
      }
    },
    methods: {
      login () {
        this.$axios.post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
          .then(resp => {
            console.log(resp.status);
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              this.$store.commit('login', resp.data);
              console.log(this.$router);
              //跳转相应的页面
              localStorage.setItem("username",this.loginForm.username);
              this.$router.replace({path: '/Home'})
            } else{
              this.check_login();
            }
          })
          .catch(error => {
            console.log(error);
            this.check_login();
          })
      },

      check_login() {
        this.$alert('Please ensure the valid username and password!', 'Login error:', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      }
    }
  }
</script>

<style scoped>
  #base_login{
    background: url("../assets/Login_background.jpg") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0px;
  }
  .login_container{
    opacity: 0.8;
    border-radius: 15px;
    background-clip: padding-box;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    /*margin: 90px auto;*/

    /*让left和top都是50%，这在水平方向上让div的最左与屏幕的最左相距50%，垂直方向上一样，所以再用transform向左（上）平移它自己宽度（高度）的50%，也就达到居中效果了*/
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-60%);/*向上60%*/
  }
  .login_title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #494e8f;
  }

  /deep/ input{
    height:37px;
    margin-top: 10px;
  }
</style>
