<template>
  <div>
    <!-- Form -->
    <!--####################这个按钮仅为测试时使用#####################-->
    <!--<el-button type="mini" @click="showDialogForm()" style="margin: 0">open chat room</el-button>-->

    <el-dialog title="THE CHAT DIALOG" :visible.sync="dialogFormVisible" style="opacity: 1">
      <el-row type="flex" justify="center">
        <el-col :md="24">
          <!--头部-->
          <el-card :body-style="{ padding: '10px' }" style="background-color: #E8E8E8; border: 1px solid #DDDDDD; border-bottom: 0;">
            <div>{{dialogName}}</div>
          </el-card>

          <!--body-->
          <el-card :body-style="{ padding: '0' }" style="border: 1px solid #DDDDDD; border-top: 0;">
            <el-row>
              <!--左边用户栏-->
              <el-col :md="6" style=" height: 400px; border-right: 2px solid #DDDDDD; overflow: auto;">
                <div v-for="(item, index) in listName" :key="index" style="padding:2px 5px">
                  <a href="javascript:void(0);" @click="toggleChat(item)">
                    <el-card shadow="never" id="userItem">
                      <el-row >
                        <el-col :span="7">
                          <el-avatar v-if="item === 'Group'" shape="square" icon="el-icon-user-solid"></el-avatar>
                          <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                        </el-col>
                        <el-col :span="17">
                          <div style="text-align: center;line-height: 40px">
                            {{item}}
                          </div>
                        </el-col>
                      </el-row>
                    </el-card>
                  </a>
                </div>

              </el-col>
              <!--发消息的主体-->
              <el-col :md="18" style=" height: 400px; border-right: 2px solid #DDDDDD; overflow: auto;" id="chatBody">
                <el-card :body-style="{ padding: '5px' }" shadow="never">
                  <div v-for="(item,index) in this.data" :key="index" :id="item.message">

                    <!--case1：系统消息-->
                    <p v-if="item.type===0" style="background-color: #f3f3f3;width: 50%;margin-left: 25%;border-radius: 5px">{{item.message}}</p>

                    <!--case2：其他用户消息-->
                    <div v-if="item.type===1" style="margin-bottom: 15px">
                      <el-row style="width: 20%">
                        <el-col :span="7">
                          <el-avatar style="width: 20px; height: 20px;" shape="square" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                        </el-col>
                        <el-col :span="17">
                          <div style="text-align: center;line-height: 1">
                            {{item.name}}
                          </div>
                        </el-col>
                      </el-row>
                      <div style="background-color: #b4bccc;width: 70%;border-radius: 5px;text-align: left;padding: 5px">{{item.message}}</div>
                    </div>

                    <!--case3：本人发送的消息-->
                    <div v-if="item.type===2" style="margin-bottom: 15px">
                      <el-row style="width: 20%;margin-left: 80%">
                        <el-col :span="17">
                          <div style="text-align: center;line-height: 1">
                            {{item.name}}
                          </div>
                        </el-col>
                        <el-col :span="7">
                          <el-avatar style="width: 20px; height: 20px;" shape="square" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                        </el-col>
                      </el-row>

                      <div style="background-color: #9FE86C;width: 70%;border-radius: 5px;margin-left: 29%;text-align: left; padding: 5px">{{item.message}}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-card :body-style="{'padding-top': '11px', 'padding-bottom': '12px', 'padding-left': '10px', 'padding-right': '12px' }" shadow="never">
              <div style="text-align: right">
                <el-input
                  size="mini"
                  style="width:67%"
                  placeholder="please input here"
                  v-model="input">
                </el-input>
                <el-button type="primary" size="mini" @click="webSocketSend()">Send</el-button>
              </div>
            </el-card>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import JWT from 'jwt-decode'
  export default {
    name: "Chat",
    data() {
      return {
        dialogFormVisible: false,
        dialogName: "Group",
        groupName: "Group",
        input: '',
        infoList: [], //[0]为群聊信息的存储
        webSocket : null,
        userName: '',
        toUser: '',
        data: [],

        //用户名列表
        listName:[],

        //其他用户的位置
        allOtherUsersPosition:[],

        //更新的某个用户的坐标
        thePosition:[],

        //上下线的人
        changeUser: null,

        //场景
        scene: 'museum'
      }
    },
    mounted() {
      let token = this.$store.state.token;
      if(token==null){
        console.log("Token is null");
        this.$router.replace({path: '/Login'})
      }else {
        console.log("Init the websocket...");
        this.userName=JWT(token).sub;
        let scene = this.scene;
        this.webSocket = new WebSocket('ws://localhost:8080/game/scene=' + scene + '/token=' + token);
        this.initWebSocket();
      }

      //群聊
      this.listName.push(this.groupName);
      this.infoList.push({name:this.groupName, data:[]});  //data=[{type,name,data}]
      //自聊
      this.listName.push(this.userName);
      this.infoList.push({name:this.userName, data:[]});
    },
    methods: {
      showDialogForm(){
        this.dialogFormVisible = true;
      },

      initWebSocket() {
        this.webSocket.onerror = this.onError;  // 通讯异常
        this.webSocket.onopen = this.onOpen;  // 连接成功
        this.webSocket.onmessage = this.onMessage;  // 收到消息时回调
        this.webSocket.onclose = this.onClose;  // 连接关闭时回调
      },
      onError() {
        console.log("websocket error...")
      },
      onOpen() {
        console.log("websocket start...");
      },
      onMessage(event) {
        console.log("Get the message from the backend");
        console.log("message:", event.data);
        let recv_data = JSON.parse(event.data);
        console.log("message after parse:", recv_data);
        //recv_data={isSystem: true, type: "online", fromUsername: "System", content: "admin123"}

        //add the receive data to the content
        let isSystem = recv_data.isSystem;
        let type = recv_data.type;
        let fromUsername = recv_data.fromUsername;
        let content = recv_data.content;

        if (isSystem === true) {//系统消息：除去私聊信息以外
          //this.dialogName = this.groupName;
          if (type === 'online' || type === 'offline') {
            //群聊上线、下线群广播
            if (type === 'online') {
              //上线
              console.log(this.listName);
              if (this.listName.indexOf(content) === -1) {
                this.listName.push(content);
                let flag = false;
                for (let i = 0; i < this.infoList.length; i++) {
                  if (this.infoList[i].name === content) {
                    flag = true;
                    break;
                  }
                }
                if (!flag) {
                  this.infoList.push({name: content, data: []});
                }
                //add
                this.changeUser = content;

                content = content + ' is ' + type;
              }else{
                //add
                this.changeUser = content;

                content = content + ' is ' + type + ' again!';
              }
            }else{
              //下线
              console.log(content);
              console.log('before offline:',this.listName);
              let index = this.listName.indexOf(content);
              if (index > -1) {
                this.listName.splice(index,1);
                console.log(index);
              }

              //add
              this.changeUser = content;

              console.log('after offline:',this.listName);
              content = content + ' is ' + type +'!';
            }
            //this.data = this.infoList[0].data;
            this.addMessage(this.infoList[0].data, 0, 'system', content);
            //console.log(this.data);
            //滚动到底部
            this.scroll();
          }else if (type === 'chat') {
            //群聊：信息广播
            //this.data = this.infoList[0].data;
            this.addMessage(this.infoList[0].data, 1, fromUsername, content);
            //滚动到底部
            this.scroll();
          }else{
            // type = coordinate : 处理坐标
            if (fromUsername === 'system') {
              //加入场景的时候返回所有的用户信息
              this.allOtherUsersPosition = [];
              let obj = null, userId;
              let x,y,z;
              for (let i = 0; i < content.length; i++) {
                obj = JSON.parse(content[i]);
                userId = obj.userID;
                x = obj.x;
                y = obj.y;
                z = obj.z;
                if ( userId !== this.userName ) {
                  this.listName.push(userId);
                  this.infoList.push({name: userId, data: []});
                  //各个用户的坐标的加入scene
                  this.allOtherUsersPosition.push({id: userId, x: x, y: y, z: z});
                }
              }
            }else{
              //对特定的用户userId进行坐标的更新
              let userId = content.username;
              let x = content.x;
              let y = content.y;
              let z = content.z;
              //this.thePosition = [];
              this.thePosition.push({userId: userId, x: x, y: y, z: z});
              console.log(this.thePosition,"chat true mmmmmmmmm");
              console.log(this.thePosition[0],"chat true mmmmmmmmm");
            }
          }
        }else{
          //私聊：聊天消息
          if (fromUsername === this.userName) {
            //add nothing
            //this.dialogName = this.userName + ' [ME]';
          }else {
            //this.dialogName = this.groupName+'('+fromUsername+')';
            let flag = false;
            let addData=[];
            for (let i = 0; i < this.infoList.length; i++) {
              if (this.infoList[i].name === fromUsername) {
                flag = true;
                addData = this.infoList[i].data;
                break;
              }
            }
            if (flag) {
              this.addMessage(addData, 1, fromUsername, content);
              //滚动到底部
              this.scroll();
            }else {
              this.listName.push(fromUsername);
              this.infoList.push({name: fromUsername, data:[{type:1, name:fromUsername, message: content}]});
            }
          }
        }
      },
      onClose() {
        console.log("websocket close ...");
      },

      webSocketSend(username, x, y, z) {
        //发送消息
        let len = arguments.length;
        if (len === 0) {//判断是否为发送信息
          let message = this.input;
          if (message === '') {
            this.$message.error('Input can not be empty!');
          }else {
            if (this.dialogName === this.groupName) {
              //群发消息
              let send_data = {isSystem: true, type: "chat", toUsername: 'system', content: message};
              send_data = JSON.stringify(send_data);
              this.webSocket.send(send_data);
              this.input = '';
              this.data = this.infoList[0].data;
              this.addMessage(this.data, 2, this.userName, message);
              //设置滚动条
              this.scroll();
            }else {
              //私聊
              let send_data = {isSystem: false, type: "chat", toUsername: this.toUser, content: message};
              send_data = JSON.stringify(send_data);
              this.webSocket.send(send_data);
              this.input = '';
              this.addMessage(this.data, 2, this.userName, message);
              //设置滚动条
              this.scroll();
            }
          }
        }else{//发送：更新坐标
          let content = {
            username: username,
            x: x,
            y: y,
            z: z
          };
          let send_data = {isSystem: true, type: "coordinate", toUsername: 'not_used', content: content};
          send_data = JSON.stringify(send_data);
          this.webSocket.send(send_data);
        }
      },
      webSocketClose() {//关闭连接
        this.webSocket.close();
        this.$router.replace({path:'/'});
      },

      addMessage(data, type, name, message) {
        data.push({type:type, name:name, message:message});
      },


      toggleChat(toUser) {
        this.toUser = toUser;
        console.log(this.toUser);
        //改变群名:群聊、私聊
        if (toUser === this.groupName) {
          //群聊
          this.dialogName = this.groupName;
          this.data = this.infoList[0].data;
          //设置滚动条
          this.scroll();
        }else {
          //私聊
          if (this.userName === toUser) {
            this.dialogName = toUser + ' [ME]';
          }else {
            this.dialogName = this.groupName+'('+toUser+')';
          }

          let flag = false;
          for (let i = 0; i < this.infoList.length; i++) {
            if (toUser === this.infoList[i].name) {
              this.data = this.infoList[i].data;
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.data = [];
          }
          //设置滚动条
          this.scroll();
        }
      },

      //滚动到最底
      scroll(){
        //nextTick在DOM完成后在执行
        this.$nextTick(() => {
          let element = document.getElementById('chatBody');  // 获取对象
          if (element != null) {
            element.scrollTop = element.scrollHeight;  // 滚动高度
          }
        })
      },

      //得到所有其他用户的位置
      getAllOtherUsersPosition(){
        return this.allOtherUsersPosition;
      }
    },
  }
</script>

<style scoped>
  .limitTitleDirectory {
    width: 120px;		/* 限制文本宽度 */
    overflow: hidden;		/* 超出的文本隐藏 */
    text-overflow: ellipsis;	/* 溢出的文本内容用 ... 代替 */
    white-space: nowrap;		/* 溢出不换行*/
  }

  .el-menu-item {
    font-size: 14px;
    color: #303133;
    cursor: pointer;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar
  {
    width: 5px;  /*滚动条宽度*/
    height: 5px;  /*滚动条高度*/
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track
  {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    border-radius: 10px;  /*滚动条的背景区域的圆角*/
    /*background-color: red;!*滚动条的背景颜色*!*/
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;  /*滚动条的圆角*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
    background-color: #b8b8bc;  /*滚动条的背景颜色*/
  }

  .el-dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
  }
</style>
<style>
  .el-dialog__body {
    padding: 0px 20px 10px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-card__body{
    padding: 2px 0 0 0;
  }
  #userItem:hover{
    background: #b4bccc;
  }
</style>
