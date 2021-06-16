<template>
  <div class="rank-wrapper">
    <el-row  >
      <el-table
        :data="rankList"
        max-height="800px"
        style="width: 100%;  color: #f3a771" >
        <el-table-column
          label="姓名"
          prop="name"
          width="120"
          style="color: #f3a771; background-color: deepskyblue"
        >
        </el-table-column>
        <el-table-column
          label="分数"
          prop="point"
          width="120">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Level',
  data () {
    return {
      rankList: [
        {
          name: 'test1',
          point: '120'
        },
        {
          name: 'test2',
          point: '130'
        },
        {
          name: 'test3',
          point: '140'
        }
      ]
    }
  },
  methods: {
    fetchRankList () {
      this.$axios.post('/getRankList')
        .then(resp => {
          if (resp.status === 200) {
            console.log(resp.data)
            this.rankList = resp.data
          } else {
            this.$message.error('获取列表失败')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message.error('获取列表失败')
        })
    },
    goToTest () {
      this.$router.push('/Test')
    }
  },
  mounted () {
    this.fetchRankList()
  }
}
</script>

<style scoped>
.rank-wrapper {
  background-color: deepskyblue;
}
</style>
