import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Home from '@/components/Home'
import ThreeDemo from '@/components/ThreeDemo'
import ThreeMapDemo from '../components/ThreeMapDemo'
import Chat from '../components/Chat'
import First from '../components/First'

Vue.use(Router);

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
      path: '/ThreeMapDemo',
      name: 'ThreeMapDemo',
      component: ThreeMapDemo
    },
    {
      path: '/Chat',
      name: 'Chat',
      component: Chat
    }
  ]
})
