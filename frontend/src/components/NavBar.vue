<template>
  <div class="nav-wrapper">
    <el-menu class="NavMenu">
      <el-menu-item index="0" v-on:click="goToRank" style="color: #42b983; display: inline;">
        <i class="el-icon-tickets" style="color: #42b983" ></i>
        Rank
      </el-menu-item>
      <el-menu-item index="1" v-on:click="goToTest" style="color: #42b983; display: inline">
        <i class="el-icon-news" style="color: #42b983"></i>
        Quiz
      </el-menu-item>
      <el-menu-item index="2" v-on:click="goToHome" style="color: #42b983; display: inline">
        <i class="el-icon-house" style="color: #42b983"></i>
        Home
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  methods: {
    goToRank () {
      if (this.$router.currentRoute.fullPath === '/User/Rank') {
        return
      }
      console.log('Rank page')
      this.$router.replace({path: '/User/Rank'})
    },
    goToTest () {
      if (this.$router.currentRoute.fullPath === '/User/Test') {
        return
      }
      console.log('Test page')
      this.$router.replace({path: '/User/Test'})
    },
    goToHome () {
      this.$router.replace({path: '/Home'})
    }
  }
}
</script>

<style scoped>
.NavMenu{
  width: 100%;
  height:60px ;
  background-color: black;
}
</style>
