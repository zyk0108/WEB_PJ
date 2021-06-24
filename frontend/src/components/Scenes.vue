<template>
  <div id="bg">
    <div id="header" style="width: 100%">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" @click="toHome()">Home</el-menu-item>
        <el-submenu index="2">
          <template slot="title">WorkBench</template>
          <el-menu-item index="2-1">WB1</el-menu-item>
          <el-menu-item index="2-2">WB2</el-menu-item>
          <el-menu-item index="2-3">WB3</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" @click="backgroundData()">BackgroundData</el-menu-item>
        <el-menu-item index="4" @click="turnToQuiz" >Quiz</el-menu-item>
        <el-menu-item index="5" style="float: right;margin-right: 2%" @click="logoutAccount()">Logout</el-menu-item>
        <el-menu-item index="6" style="float: right">Account: {{this.username}}</a></el-menu-item>
      </el-menu>
    </div>

    <div class="main">
      <h4 style="text-align: left">
        You can tour the 3D scene by the next two steps.
      </h4>
      <div style="text-align: left">
        <h4 style="text-align: left">
          1.Select one of the models:
        </h4>
        <!--<span style="font-weight: bold">1.</span>
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" v-on:click="createScene()">Create new Scene</el-button>-->

      </div>
      <div v-if="this.isForm">
        <el-card style="padding: 20px;margin: 20px;width: 80%;text-align: left;">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
            <el-form-item label="Select the model" prop="model">
              <el-radio-group v-model="ruleForm.model">
                <el-radio label="Model1" v-bind:onclick="changeBackgroundColour()"></el-radio>
                <el-radio label="Model2"></el-radio>
                <el-radio label="Model3"></el-radio>
              </el-radio-group>
            </el-form-item>
            <!--<div style="text-align: left">
              <el-button type="primary" v-on:click="goToScene()">
                Create(Submit)
              </el-button>
            </div>-->
          </el-form>
          <img :src="this.modelImages[0]" style="height: 300px;width: 20%" id="model1">
          <img :src="this.modelImages[1]" style="height: 300px;width: 20%" id="model2">
          <img :src="this.modelImages[2]" style="height: 300px;width: 20%" id="model3">
        </el-card>
      </div>
      <hr>
      <h4 style="text-align: left">
        2.Select one of the scenes below here(if not empty):
      </h4>
      <hr>
      <el-row >
        <el-col :span="8" v-for="(data,index) in this.sceneData" :key="index" style="padding: 0 20px 20px 0;margin: 20px">
          <el-card>
            <img :src="data.img" class="image">
            <div style="padding: 16px;text-align: left">
              <div>Scene creator: {{data.createUser}}</div>
              <div>Scene Name: {{data.sceneName}}</div>
              <div class="bottom">
                <time class="time">Scene created time: {{ data.createTime }}</time>
                <br>
                <el-button type="primary" plain size="mini" v-on:click="goToScene(index+1)">Add this scene</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>

    <div id="footer">
      <span id="footer_font">This is an 3D demo System created by @[advance web tech Group]</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'scenes',
    data () {
      return {
        username: null,
        history: true,
        isForm: true,

        ruleForm: {
          model: '',
        },
        modelImages:[
          '../../static/img/models/model1.JPG',
          '../../static/img/models/model2.JPG',
          '../../static/img/models/model3.JPG'
        ],
        rules: {
          model: [
            { required: true, message: 'Please select the model', trigger: 'change' }
          ],
        },


        sceneData:[
          {
            img:"../../static/img/scene01.png",
            createUser:"the administrator",
            createTime:"2021/06/08",
            sceneName: 'CarExhibitionHall1',
          },
          {
            img:"../../static/img/scene.png",
            createUser:"the administrator",
            createTime:"2021/06/12",
            sceneName: 'CarExhibitionHall2',
          },
        ]
      }
    },
    mounted () {
      this.username = localStorage.getItem('username');
    },
    methods: {
      changeBackgroundColour(){
        let dom1 = document.getElementById("model1");
        let dom2 = document.getElementById("model2");
        let dom3 = document.getElementById("model3");
        switch (this.ruleForm.model) {
          case "Model1":
            dom1.style.opacity="1";
            dom2.style.opacity="0.1";
            dom3.style.opacity="0.1";
            break;
          case "Model2":
            dom1.style.opacity="0.1";
            dom2.style.opacity="1";
            dom3.style.opacity="0.1";
            break;
          case "Model3":
            dom1.style.opacity="0.1";
            dom2.style.opacity="0.1";
            dom3.style.opacity="1";
            break;
          default:
            break;
        }
      },
      goToScene(id){
        if (this.ruleForm.model === '') {
          this.$message({
            message: 'Please select the model first!',
            type: 'warning'
          });
          console.log("hh");
        }else{
          console.log(this.ruleForm.model);
          switch (id) {
            case 1 :
              localStorage.setItem("scene","hall1");
              break;
            case 2:
              localStorage.setItem("scene","hall2");
              break;
          }
          this.$router.replace("./CarExhibitionHall");
        }
      },

      //create scene
      createScene(){
        this.isForm=!this.isForm;
      },

      //get the log
      getLog(){
        const that=this;
        this.$axios.get('/getLog')
          .then(function (response) {
            console.log(response);
            that.historyData=[];
            for (let i = 0; i < response.data.length; i++) {
              that.historyData.push({
                id:response.data[i].id,
                username:response.data[i].username,
                timestamp:response.data[i].time,
                content:response.data[i].log
              })
            }
            console.log(that.historyData);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //路由跳转
      logoutAccount () {
        let token = this.$store.state.token;
        if (token != null) {
          // 如果初始登录存在token，则移除
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.$store.state.token = null
        }
        this.$router.replace({path: '/'})
      },
      turnToQuiz () {
        this.$router.push('/User')
      },
      toHome() {
        this.$router.replace({path: '/Home'})
      },
      backgroundData(){
        this.$router.replace({path: '/BackgroundData'})
      }
    }
  }
</script>

<style scoped>
  #bg{
    background: url("../assets/Home_background.jpg") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  .main{
    width: 100%;
    height: 84%;
    background-color: #b4bccc;
    opacity: 0.8;
    border-radius: 3px;
    border: solid 3px #8c939d;
    padding: 20px;
    overflow: auto;
    /*display: flex;*/
  }
  #footer{
    width: 100%;
    height: 4%;
    background-color:#545c64;
    bottom: 0;
    position: absolute;
  }
  #footer_font{
    bottom: 5px;
    left: 40%;
    position: absolute;
  }
  .key:hover{
    cursor: pointer;
  }
  #inner_content{
    text-align: left;
  }
</style>
<style>
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
  .image {
    width: 100%;
    height: 200px;
    display: block;
  }
</style>
