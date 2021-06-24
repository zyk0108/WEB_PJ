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
        <el-menu-item index="3" v-on:click="goToScenes()">Cars 3D Exhibition Hall Scenes</el-menu-item>
        <el-menu-item index="4" @click="turnToQuiz" >Quiz</el-menu-item>
        <el-menu-item index="5" style="float: right;margin-right: 2%" @click="logoutAccount()">Logout</el-menu-item>
        <el-menu-item index="6" style="float: right">Account: {{this.username}}</a></el-menu-item>
      </el-menu>
    </div>

    <div class="main">

      <el-row :gutter="20">
        <el-col :span="6">
          <div style="text-align: left;padding:0  0 0 30px;overflow: auto">
            <h3>
              The background data of {{this.username}}:
            </h3>
          </div>
          <div style="text-align: left;padding:0  0 20px 30px;overflow: auto">
            <el-button @click="changeContent(1)">
              History record store in the BG database
            </el-button>
          </div>
          <div style="text-align: left;padding-left: 30px;overflow: auto">
            <el-button @click="changeContent(2)">
              View the background data of charts type
            </el-button>
          </div>
          <div style="text-align: left;padding:0  0 0 30px;overflow: auto">
            <h5>
              Hints:<br> In order to see the data directly of the e-chart type, you should enter the scene first.
              And put the cursor on the chart, you will see the detail.
            </h5>
          </div>
        </el-col>
        <el-col :span="18">
          <div v-if="this.history" style="width: 80%;background-color: #e4e7ed;padding: 20px;height: 500px;overflow: auto">
            <el-card style="margin-bottom: 20px">
              <h4 style="text-align: left;margin: 0">
                The {{this.username}}'s activities history:
              </h4>
            </el-card>
            <el-timeline :reverse="true">
              <el-timeline-item
                v-for="(item , index) in this.historyData"
                :key="index"
                :timestamp="item.timestamp"
                placement="top">
                <el-card>
                  <h4>
                    {{item.content}}
                  </h4>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-if="!this.history">
            <div id="chart1" style="width: 60%;height: 320px">

            </div>

            <div id="chart2" style="width: 60%;height: 320px;padding-top: 20px">

            </div>
          </div>
        </el-col>
      </el-row>

    </div>

    <div id="footer">
      <span id="footer_font">This is an 3D demo System created by @[advance web tech Group]</span>
    </div>
  </div>
</template>

<script>
  import * as ECharts from 'echarts';

  export default {
    name: 'BG',
    data () {
      return {
        username: null,
        history: true,

        //history data
        historyData:[],
        //data
        option :{
          title: {
            text: 'History data analysis(PIE)',
            subtext: 'Data come from database record',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: 'come from',
              type: 'pie',
              radius: '50%',
              data: [
                {value: 0, name: 'Num of enter the scene'},
                {value: 0, name: 'Num of send message'},
                {value: 0, name: 'Num of play/pause/replay movie'},
                {value: 0, name: 'Num of out the scene'},
                {value: 0, name: 'Sum of the records'},
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },

        //bar
        barOption: {
          title: {
            text: 'History data analysis',
            subtext: 'Data come from database record'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['Sum of the records', 'Num of the record']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['Num of enter the scene', 'Num of send message', 'Num of play/pause/replay movie', 'Num of out the scene']
          },
          series: [
            {
              name: 'Sum of the records',
              type: 'bar',
              data: [0,0,0,0]
            },
            {
              name: 'Num of the record',
              type: 'bar',
              data: [0,0,0,0]
            }
          ]
        }
      }
    },
    mounted () {
      this.username = localStorage.getItem('username');
      this.getLog();
    },
    methods: {
      //get the log
      getLog(){
        const that=this;
        // 新建一个promise对象
        let newPromise = new Promise((resolve) => {
          resolve()
        });
        //然后异步执行
        newPromise.then(() => {
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
        })
      },

      changeContent(id){
        if (id === 1) {
          this.history = true;
        }else if (id === 2) {
          this.history = false;
          // 新建一个promise对象
          let newPromise = new Promise((resolve) => {
            resolve()
          });
          //然后异步执行Echarts的初始化函数
          newPromise.then(() => {
            //画图
            let chartDom = document.getElementById('chart1');
            let pieChart = ECharts.init(chartDom,'dark');//深色主题
            pieChart.setOption(this.option);

            chartDom = document.getElementById('chart2');
            let barChart = ECharts.init(chartDom,'dark');//深色主题
            barChart.setOption(this.barOption);
          });
        }
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
      goToScenes(){
        this.$router.replace("/Scenes")
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
    height: 82%;
    background-color: #b4bccc;
    opacity: 0.6;
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
    background-color: #000000;  /*滚动条的背景颜色*/
  }
</style>
<style>
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
</style>
