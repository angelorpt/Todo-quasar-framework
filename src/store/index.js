import Vue from 'vue'
import Vuex from 'vuex'
import token from './token'
import axios from 'axios'

Vue.use(Vuex)
Vue.use(axios)

export const store = new Vuex.Store({
  modules: {
    token
  }
})

export default store
