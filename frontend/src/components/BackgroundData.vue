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
        <el-menu-item index="3">Message</el-menu-item>
        <el-menu-item index="4" @click="turnToQuiz" >Quiz</el-menu-item>
        <el-menu-item index="5" style="float: right;margin-right: 2%" @click="logoutAccount()">Logout</el-menu-item>
        <el-menu-item index="6" style="float: right">Account: {{this.username}}</a></el-menu-item>
      </el-menu>
    </div>

    <div class="main">
      <div id="chart1" style="width: 45%;height: 60%">

      </div>

      <div id="chart2" style="width: 45%;height: 60%;margin-left: 2%">

      </div>
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
        visible: true,

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

      //画图
      let chartDom = document.getElementById('chart1');
      let pieChart = ECharts.init(chartDom,'dark');//深色主题
      pieChart.setOption(this.option);

      chartDom = document.getElementById('chart2');
      let barChart = ECharts.init(chartDom,'dark');//深色主题
      barChart.setOption(this.barOption);
    },
    methods: {

      //路由跳转
      logoutAccount () {
        let token = this.$store.state.token
        if (token != null) {
          // 如果初始登录存在token，则移除
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          this.$store.state.token = null
        }
        this.$router.replace({path: '/'})
      },
      turnToQuiz () {
        this.$router.push('/User')
      },
      toHome() {
        this.$router.replace({path: '/Home'})
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
    height: 100%;
    background-color: #b4bccc;
    opacity: 0.6;
    border-radius: 3px;
    border: solid 3px #8c939d;
    padding: 20px;
    display: flex;
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
</style>
