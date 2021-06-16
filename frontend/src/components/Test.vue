<template>
  <div class="test-wrapper">
    <AnswerSheet :question_list="subQuestionList" @transfer = 'postAnswer'/>
  </div>
</template>

<script>
import AnswerSheet from './AnswerSheet'
export default {
  name: 'test',
  components: {AnswerSheet},
  data () {
    return {
      question_list: [
        {'name': '1',
          'question': '现代汽车工业的先驱者之一，人称“汽车鼻祖”的人是?',
          'choice': [
            {'value': 'A.戈特利布·戴姆勒'},
            {'value': 'B.卡尔本茨'},
            {'value': 'C.亨利福特'},
            {'value': 'D.巴特勒'}]},
        {'name': '2',
          'question': '那一年中国进口第一辆汽车?',
          'choice': [
            {'value': 'A.1902'},
            {'value': 'B.1903'},
            {'value': 'C.1901'},
            {'value': 'D.1904'}]},
        {'name': '3',
          'question': '世界上第一辆四轮汽车是命名为什么？',
          'choice': [
            {'value': 'A.戴姆勒 1 号'},
            {'value': 'B.奔驰 1 号'},
            {'value': 'C.超音速汽车'},
            {'value': 'D.威廉一号'}]},
        {'name': '4',
          'question': '日本最大的汽车生产商为（  ）汽车公司',
          'choice': [
            {'value': 'A.三菱'},
            {'value': 'B.丰田'},
            {'value': 'C.本田'}]},
        {'name': '5',
          'question': '阻碍汽车运动的制动力不仅仅取决于制动力矩，还取决于轮胎和路面间的',
          'choice': [
            {'value': 'A.压力'},
            {'value': 'B.摩擦力'},
            {'value': 'C.附着条件'}
          ]},
        {'name': '6',
          'question': 'ＧＰＳ是几个英文字母的缩写、其中文意思是',
          'choice': [
            {'value': 'A.全球定位系统'},
            {'value': 'B.全球监测系统'},
            {'value': 'C.全球导航系统'}
          ]},
        {'name': '7',
          'question': '车灯玻璃设计有网格是为了?',
          'choice': [
            {'value': 'A.美观'},
            {'value': 'B.防眩'},
            {'value': 'C.使光线平行'}
          ]},
        {'name': '8',
          'question': '法国标致汽车公司的标志是什么 ？',
          'choice': [
            {'value': 'A.狮'},
            {'value': 'B.猫'},
            {'value': 'C.桥'},
            {'value': 'D.苹果'}]},
        {'name': '9',
          'question': '法国标致汽车公司的标志是什么 ？',
          'choice': [
            {'value': 'A.狮'},
            {'value': 'B.猫'},
            {'value': 'C.桥'},
            {'value': 'D.苹果'}]},
        {'name': '10',
          'question': ' N 档是指   （    ）？',
          'choice': [
            {'value': 'A.空档'},
            {'value': 'B.行车档'},
            {'value': 'C.倒档'},
            {'value': 'D.驻车档'}]}
      ],
      answer_list: [
        'B', 'C', 'A', 'B', 'B', 'A', 'B', 'A', 'A', 'A',
        'D', 'A', 'A', 'C', 'B', 'B', 'B', 'A', 'C', 'B',
        'D', 'B', 'C', 'A', 'A', 'C', 'A', 'A', 'A', 'B',
        'B', 'D', 'B', 'A', 'B', 'C', 'C', 'C', 'B', 'B',
        'B'
      ],
      subQuestionList: [],
      subAnswerList: []
    }
  },
  created () {
    this.getSubList()
  },
  methods: {
    getSubList: function () {
      let range = 10
      let rand = Math.random()
      let num = Math.round(rand * range)
      for (let i = 0; i < 5; i++) {
        let index = num + i
        if (index > 10) {
          index -= 10
        }
        console.log(index)
        this.subQuestionList[i] = this.question_list[index]
        this.subAnswerList[i] = this.answer_list[index]
      }
      console.log(this.subQuestionList[0])
    },
    postAnswer: function (msg) {
      let point = 0
      for (let i = 0; i < 5; i++) {
        if (this.subAnswerList[i] === msg[i].charAt(0)) {
          point += 5
        }
      }
      console.log(msg)
      console.log(point)
      let grade = new FormData()
      grade.append('identity', localStorage.getItem('username'))
      grade.append('points', point.toString())
      console.log(grade.get('points'))
      this.$axios.post('/updatePoint', grade)
        .then(resp => {
          if (resp.status === 200) {
            console.log('Success')
          } else {
            this.$message.error('Fail to update')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message.error('Fail to update')
        })
      localStorage.setItem('mark', point.toString())
      this.$router.push({
        path: 'Check',
        query: {
          subQ: this.subQuestionList,
          subA: this.subAnswerList,
          msg: msg
        }})
    }
  }
}
</script>

<style scoped>
</style>
