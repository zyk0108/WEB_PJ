// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入Element-UI
import Element_UI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入store全局存储
import store from './vuex/store'
// 引入axios
import axios from 'axios'

// 使用UI
Vue.use(Element_UI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store
  components: { App },
  template: '<App/>'
});


// Axios配置，Axios挂载到prototype，全局可以使用this.$axios访问
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json;charset=UTF-8";

// axios实现http request 拦截器
axios.interceptors.request.use(
  config => {
    if(store.state.token) {
      // 判断是否有token，若存在，每个http header加上token
      config.headers.Authorization = 'Bearer '+localStorage.getItem("token");
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

// axios实现http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log(error.response);
    if(error) {
      // 清除token 如果不是register/login, 跳转至login
      store.commit('logout');
      router.currentRoute.path !== '/login' &&
      router.currentRoute.path !== '/register' &&
      router.currentRoute.path !== '/' &&
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.path }
      })
    }
    return Promise.reject(error.response.data)
  }
);
