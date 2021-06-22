<template>
  <div id="first">
    <div id="header" style="width: 100%">
      <el-menu
        :default-active="'1'"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">Home</el-menu-item>
        <el-submenu index="2">
          <template slot="title">WorkBench</template>
          <el-menu-item index="2-1">WB one</el-menu-item>
          <el-menu-item index="2-2">WB two</el-menu-item>
          <el-menu-item index="2-3">WB three</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">Message</el-menu-item>
        <el-menu-item index="4" style="float: right;margin-right: 2%">Logout</el-menu-item>
        <el-menu-item index="5" style="float: right" @click="goToLogin()">Login</a></el-menu-item>
      </el-menu>
    </div>

    <div id="instruction">
      <div>
        <span class="key" @click="changeContent(1)">3D scene</span>
        <el-divider direction="vertical"></el-divider>
        <span class="key" @click="changeContent(2)">Actions</span>
        <el-divider direction="vertical"></el-divider>
        <span class="key" @click="changeContent(3)">Chat Direction</span>
      </div>
      <hr style="margin-top: 15px">
      <div id="the_content" v-show="this.visible">
        <p>
          Here are some instructions about what you just selected.
        </p>
        <div id="inner_content" v-for="(item , index) in this.data" :key="index">
          <el-divider content-position="left">{{item.type}}</el-divider>
          <p>{{item.content}}</p>
        </div>
      </div>
      <div style="text-align: left;line-height: 20px">
        <span style="font-size: 20px">TIPS:</span>
        <br>
        Here are some router linkers on the right card. you can click the corresponding button
        to direct to different pages to explore your journey. Please read the introduction info
        upon, with the direction you will have a good time.
      </div>
    </div>
    <div class="contain">
      <el-card style="padding: 20px;">
        <div style="text-align: left">
          <span style="font-size: 20px">HINTS:</span>
          <br>
          Here are some router linkers. you can click the button below direct to different pages
          to explore your journey.
        </div>
        <div>
          <router-link to="Login">
            <el-button type="primary"
                       style="margin:10px auto 0px auto;width: 100%;background: #5299db;line-height: 0.8">login</el-button>
          </router-link>
          <router-link to="Register">
            <el-button type="primary"
                       style="margin:10px auto 0px auto;width: 100%;background: #5299db;line-height: 0.8">Register</el-button>
          </router-link>
          <router-link to="CarExhibitionHall">
            <el-button type="primary"
                       style="margin:10px auto 0px auto;width: 100%;background: #5299db;line-height: 0.8">Cars 3D Exhibition Hall</el-button>
          </router-link>
        </div>
      </el-card>
    </div>

    <div id="footer">
      <span id="footer_font">This is an 3D demo System created by @[advance web tech Group]</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        visible: true,
        flag: 1,
        data:[],
        threeData:[
          {
            type: 'Three Models',
            content: 'After you add in the scene, you will see some models in this scene'
          },
          {
            type: 'Move In Map',
            content: 'If you add in the scene, you can move your position to the location ' +
              'of the map anywhere.'
          },
          {
            type: 'Learn In Scene',
            content: 'In the scene, you can learn something new.'
          },
        ],
        actionData:[
          {
            type: 'Move Yourself',
            content: 'You can move your position by using (up,down,right,left) or (W,A,S,D) to ' +
              'any position in the Map.'
          },
          {
            type: 'Move Camera and Play the Video',
            content: 'You can move camera position up and down by using (Y,U) or (V,B) to ' +
              'certain position in the Map. Can [play the video|pause|replay] by using ( P , \' \' ,' +
              'R) after closing the video.'
          },
          {
            type: 'Chat Dialog',
            content: 'You can use the key [t] to pop the chat dialog to chat with others.'
          },
        ],
        chatData:[
          {
            type: 'Group Chat',
            content: 'After you add in one scene, you will take part in one public ' +
              'group automatically, you can chat with other users in this group.'
          },
          {
            type: 'Single Chat',
            content: 'After you add in one scene, you will have a list of users ' +
              'in this group, you can click anyone, then chat with him(her).'
          },
          {
            type: 'Self Chat',
            content: 'After you add in one scene, the userList will contains you ' +
              'automatically, you can send some info to yourself.'
          },
        ],
      }
    },
    mounted(){
      let token = this.$store.state.token;
      if (token != null) {
        // 如果初始登录存在token，则移除
        localStorage.removeItem('token');
        this.$store.state.token = null;
      }
      this.data = this.actionData;
    },
    methods:{
      changeContent(flag){
        if (this.flag === flag) {
          this.visible = !this.visible;
        }else {
          this.flag = flag;
          this.visible = true;
        }
        if (this.visible === true) {
          switch (flag) {
            case 1:
              this.data = this.threeData;
              break;
            case 2:
              this.data = this.actionData;
              break;
            case 3:
              this.data = this.chatData;
              break;
            default:
              console.log("Change content error");
          }
        }
      },
      goToLogin(){
        localStorage.setItem('mark', 'empty')
        this.$router.replace({path: '/Login'});
      },
    }
  }
</script>

<style scoped>
  #first{
    background: url("../assets/Home_background.jpg") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  .contain{
    opacity: 0.68;
    position: absolute;
    max-width: 25%;
    left: 75%;
    top: 50%;
    transform: translate(-50%,-56%);/*向上60%*/
  }
  #instruction{
    width: 40%;
    height: 63%;
    background-color: #b4bccc;
    margin-top: 5%;
    opacity: 0.6;
    margin-left: 9%;
    border-radius: 3px;
    border: solid 3px #8c939d;
    padding: 20px;
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
</style>
