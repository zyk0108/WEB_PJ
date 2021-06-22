<template>
  <div class="asDiv">
    <h2 style="color: white">FINAL GRADE: {{this.mark}}</h2>
    <div class="question" v-for="(son, index) in subQ" :key="index">
      <div class="question_content" >{{son.question}}</div>
      <div class="answer">
        <div class="answerUl" v-for="(sson,index1) in son.choice" :key="index1">
          <span v-if="sson.value.charAt(0) === subA[index] ">{{'正确答案: ' +sson.value}}</span>
        </div>
        <div class="Y-answer" v-if="subA[index] === msg[index].charAt(0)" style="background-color: #42b983;color:black;" >{{'你的答案: ' + msg[index]}}</div>
        <div class="Y-answer" v-if="subA[index] !== msg[index].charAt(0)" style="background-color: red">{{'你的答案: ' + msg[index]}}</div>
        <hr>
        <div style="clear: both"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Check',
  data () {
    return {
      subQ: [],
      subA: [],
      msg: [],
      mark: null
    }
  },
  created () {
    this.subQ = this.$route.query.subQ
    this.subA = this.$route.query.subA
    this.msg = this.$route.query.msg
    this.mark = localStorage.getItem('mark')
  },
  methods: {
    chekVal: function () {
      console.log(this.$route.query.grade)
    }
  },
  mounted () {
    this.chekVal()
  }
}
</script>

<style scoped>
.question_content{
  text-align: center;
  width: 310px;
  background: black;
  color: #42b983;
  margin: auto;
}
.Y-answer{
  width: 310px;
  text-align: center;
  margin: auto;
}
.answerUl{
  margin: auto;
  color: black;
}
.answerUl span{
}
</style>
