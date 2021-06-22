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
          <div >
            <el-button @click="changeContent()">
              View the background data of mine(change)
            </el-button>
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
            <div id="chart1" style="width: 60%;height: 200px">

            </div>

            <div id="chart2" style="width: 60%;height: 200px;padding-top: 20px">

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
        historyData:[
          // {
          //   timestamp:"2018/4/3",
          //   username:"zyk",
          //   content: "Enter the 3D car models scene.",
          // }
        ],
        //data
        option :{
          title: {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
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
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
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
            text: '世界人口总量',
            subtext: '数据来自网络'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['2011年', '2012年']
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
            data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
          },
          series: [
            {
              name: '2011年',
              type: 'bar',
              data: [18203, 23489, 29034, 104970, 131744, 630230]
            },
            {
              name: '2012年',
              type: 'bar',
              data: [19325, 23438, 31000, 121594, 134141, 681807]
            }
          ]
        }
      }
    },
    mounted () {
      this.username = localStorage.getItem('username');

      // //画图
      // let chartDom = document.getElementById('chart1');
      // let pieChart = ECharts.init(chartDom,'dark');//深色主题
      // pieChart.setOption(this.option);
      //
      // chartDom = document.getElementById('chart2');
      // let barChart = ECharts.init(chartDom,'dark');//深色主题
      // barChart.setOption(this.barOption);
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

      changeContent(){
        this.history=!this.history;
        if (this.history === false) {
          console.log("kkkkkkk");
          // 新建一个promise对象
          let newPromise = new Promise((resolve) => {
            resolve()
          });
          //然后异步执行echarts的初始化函数
          newPromise.then(() => {
            //	此dom为echarts图标展示dom
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
    height: 800px;
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
