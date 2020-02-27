export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    updateToken (state, value) {
      state.token = value
    }
  },
  actions: {
    updateToken ({ commit }, value) {
      commit('updateToken', value)
    },
  },
  getters: {
    token (state) {
      return state.token
    }
  }
}
