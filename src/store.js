import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    adminInfo: {
      name: localStorage.getItem('adminName') || '',
      email: localStorage.getItem('adminEmail') || ''
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setAdminInfo(state, adminInfo) {
      state.adminInfo.name = adminInfo.user.name
      state.adminInfo.email = adminInfo.user.email
    }
  }
})
