<template>
  <el-container class="user-main-container">
    <el-header class="user-header">
      <NavBar/>
    </el-header>
    <el-container>
      <el-main >
        <div class="user-main">
          <router-view>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import NavBar from './NavBar'
export default {
  name: 'user',
  components: {
    NavBar
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.user-main-container {
  background-color: grey;
}
.user-header {
  margin-bottom: 15px;
  background-color: grey;
  color: white;
}
</style>
