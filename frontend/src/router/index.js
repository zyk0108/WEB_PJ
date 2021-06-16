import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Home from '@/components/Home'
import ThreeDemo from '@/components/ThreeDemo'
import CarExhibitionHall from '../components/CarExhibitionHall'
import Chat from '../components/Chat'
import First from '../components/First'
import User from '../components/User'
import UserDefault from '../components/UserDefault'
import Rank from '../components/Rank'
import Test from '../components/Test'
import Check from '../components/Check'

Vue.use(Router)

export default new Router({
  // 设置路由位history模式
  mode: 'history',
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'First',
      component: First
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: Register,
      component: Register
    },
    {
      path: '/threeDemo',
      name: 'ThreeDemo',
      component: ThreeDemo
    },
    {
      path: '/CarExhibitionHall',
      name: 'CarExhibitionHall',
      component: CarExhibitionHall
    },
    {
      path: '/Chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/User',
      name: 'User',
      component: User,
      children: [
        {path: '/', component: UserDefault},
        {path: 'Test', component: Test},
        {path: 'Rank', component: Rank},
        {path: 'Check', component: Check}
      ]
    }
  ]
})
