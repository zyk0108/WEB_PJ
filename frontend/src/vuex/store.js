import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 导出使用
export default new Vuex.Store({
  state: {
    token:localStorage.getItem('token') || null,
  },
  mutations: {
    login(state,data){
      state.token=data.token;
      localStorage.setItem('token',data.token)
    },
    logout(state){
      state.token=null;
      localStorage.removeItem('token')
    }
  },
  actions: {
    // just nothing now
  }
})
