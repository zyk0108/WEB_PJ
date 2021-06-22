<template>
  <div class="asDiv">
    <div class="question" v-for="(son, index) in question_list" :key="index">
      <div class="question_content" >{{son.question}}</div>
      <div class="answer">
        <ul class="answerUl">
          <li v-for="(sson,index1) in son.choice" :key="index1">
            <span>{{sson.value}}</span>
            <input type="radio" :name="son.name" :value="sson.value" @change="get_value(index)" v-model="checkedValue[index]">
          </li>
        </ul>
        <div style="clear: both"></div>
      </div>
    </div>
    <button @click="finalCheck" style="background-color:black;color: #42b983 ">提交</button>
  </div>
</template>

<script>
export default {
  name: 'AnswerSheet',
  data () {
    return {
      all_list: [], // 存放答案
      checkedValue: [] // 单选
    }
  },
  props: [ 'question_list' ],
  methods: {
    finalCheck: function () {
      if (this.question_list.length !== this.all_list.length) {
        console.log('答案没有选择完')
      } else {
        console.log('答案选择完了')
        this.$emit('transfer', this.all_list)
      }
    },
    get_value: function (index) {
      this.all_list[index] = (this.checkedValue[index])
    }
  }
}
</script>

<style scoped>
.asDiv{
  margin: 6px 0;
  background: grey;
  width: 100%;
}
.answer{
  margin: auto;
}
.answer input{
 display: inline ;
  margin-right: 20px;
}
.answer li{
  display: inline;
}
.question_content{
  text-align: center;
  width: 300px;
  background: black;
  color: #42b983;
  margin: auto;
}
</style>
