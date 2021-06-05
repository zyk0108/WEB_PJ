<template>
  <div id="base_register">
    <el-form :model="registerForm" :rules="rules" class="register_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="registerForm">
      <h3 class="register_title">Register</h3>
      <el-form-item prop="username">
        <el-input type="text" class="register_input"
                  prefix-icon="el-icon-user-solid"
                  v-model="registerForm.username"
                  auto-complete="off" placeholder="username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" class="register_input"
                  prefix-icon="el-icon-lock"
                  v-model="registerForm.password"
                  auto-complete="off" placeholder="password"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input type="email" class="register_input"
                  prefix-icon="el-icon-message"
                  v-model="registerForm.email"
                  auto-complete="off" placeholder="email"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input type="text" class="register_input"
                  prefix-icon="el-icon-phone"
                  v-model="registerForm.phone"
                  auto-complete="off" placeholder="phone"></el-input>
      </el-form-item>
      <el-form-item prop="area">
        <el-input type="text" class="register_input"
                  prefix-icon="el-icon-location"
                  v-model="registerForm.area"
                  auto-complete="off" placeholder="area"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="margin: 10px auto 0px auto;height: 40px;width: 100%;background: #3a58db;"
                   v-on:click="register(registerForm)">register</el-button>
      </el-form-item>

      <el-form-item style="width: 100%;margin: 0px auto">
        <router-link to="Login">
          Already have an account? Login now!
        </router-link>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data () {
      const dataValid = (rule, value, callback) => {
        //always false,so don't use it
        /*if(!value || value === '') {
          return callback(new Error('Can\'t be empty'))
        }*/
        return callback()
      };

      //验证username
      const checkusername = (rule, value, callback) => {
        const username_reg=/^[a-zA-Z\-][a-zA-Z0-9_\-]{4,32}$/;

        if (!username_reg.test(value)) {
          return callback(new Error('Please input valid username(invalid)'))
        }
        return callback()
      }

      //验证password
      const checkpassword = (rule, value, callback) => {
        const password_reg=/(?!^(\d+|[a-zA-Z]+|[_\-]+)$)^[\w_\-]{5,32}$/;

        let s=value.toString();
        let e=this.registerForm.username.toString();
        if(s.indexOf(e)!=-1){
          console.log('密码不能包含用户名！');
          return callback(new Error("Please input valid password(invalid)"))
        }
        if (!password_reg.test(value)) {
          return callback(new Error("Please input valid password(invalid*)"))
        }
        return callback()
      };

      //验证email
      const checkemail = (rule, value, callback) => {
        const username_reg=/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;

        if (!username_reg.test(value)) {
          return callback(new Error('Please input valid email(check)'))
        }
        return callback()
      };

      return {
        registerForm: {
          username: '',
          password: '',
          email: '',
          phone:'',
          area: ''
        },
        rules: {
          // blur 失去鼠标焦点时触发验证
          username: [{required: true, message: 'Please input valid username', trigger: 'blur'}, {validator: checkusername, trigger: 'blur'}],
          password: [{required: true, message: 'Please input valid password', trigger: 'blur'}, {validator: checkpassword, trigger: 'blur'}],
          email: [{required: true, message: 'Please input valid email address', trigger: 'blur'}, {validator: checkemail, trigger: 'blur'}],
          phone: [{required: true, message: 'Please input valid phone number', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}],
          area: [{required: true, message: 'Please input valid area', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}]
        },
        loading: false,
      }
    },


    methods: {
      register (formName) {
        this.$refs[formName].validate(valid => {
          if(valid){
            this.$axios.post('/register', {
                username: this.registerForm.username,
                password: this.registerForm.password,
                /*email: this.registerForm.email,
                phone:this.registerForm.phone,
                area:this.registerForm.area*/
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                if(resp.status === 200) {
                  // 跳转到login
                  this.success_register();
                  this.$router.replace('/login')
                } else{
                  this.failure_register();
                }
              })
              .catch(error => {
                console.log(error);
                this.failure_register();
              })
          } else {
            //几种情况
            this.failure_register();
          }
        })
      },

      failure_register() {
        this.$alert('Please ensure the valid information committed and please make sure full all conformation!', 'Register error:', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      },

      success_register() {
        this.$alert('you have registered successfully.', 'Success register:', {
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
  #base_register{
    background: url("../assets/Login_background.jpg") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    overflow: auto;
  }
  .register_container{
    opacity: 0.7;
    border-radius: 15px;
    background-clip: padding-box;
    margin: 65px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .register_title{
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }

  /deep/ input{
    height:37px;
    margin-top: 10px;
  }

</style>
