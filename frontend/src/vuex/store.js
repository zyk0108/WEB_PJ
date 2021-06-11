import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 导出使用
export default new Vuex.Store({
  state: {
    token:localStorage.getItem('token') || null,
    position:{
      x:-300,
      y:20,
      z:-100
    }
  },
  mutations: {
    login(state,data){
      state.token=data.token;
      localStorage.setItem('token',data.token)
    },
    logout(state){
      state.token=null;
      localStorage.removeItem('token')
    },
    setPosition(state,position){
      state.position.x=position.x;
      state.position.y=position.y;
      state.position.z=position.z;
    }
  },
  actions: {
    // just nothing now
  }
})
