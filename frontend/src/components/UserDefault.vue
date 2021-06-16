<template>
  <div class="user-default">
    <el-carousel :interval="5000" arrow="always" :height="imgHeight">
      <el-carousel-item  v-for="item in imgList" :key="item.id">
        <img :src="item.idView" class="img-wrapper">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'UserDefault',
  data () {
    return {
      imgHeight: '500px',
      imgList: [
        {id: 0, idView: require('../assets/user1.jpg')},
        {id: 1, idView: require('../assets/user2.jpg')},
        {id: 2, idView: require('../assets/user3.jpg')}
      ]
    }
  }
}
</script>

<style scoped>
.img-wrapper{
  height: 100%;
}
</style>
