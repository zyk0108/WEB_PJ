<template>
  <div class="asDiv">
    <h2>final grade: {{this.mark}}</h2>
    <div class="question" v-for="(son, index) in subQ" :key="index">
      <div class="question_content" style="background-color: grey">{{son.question}}</div>
      <div class="answer">
        <ul class="answerUl" v-for="(sson,index1) in son.choice" :key="index1">
          <li v-if="sson.value.charAt(0) === subA[index]">{{sson.value}}</li>
        </ul>
        <span>{{'你的答案:' + msg[index]}}</span>
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

</style>
