import { login, refreshToken } from '@/api/authperm/login'
import { getToken, getRefreshToken, setToken, setRefreshToken, setUserName, removeToken, removeRefreshToken, removeUserName, removeUserInfo } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: null,
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.access_token)
        setToken(response.access_token)
        setRefreshToken(response.refresh_token)
        setUserName(username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      // commit('SET_USERINFO', null)
      removeToken()
      removeRefreshToken()
      // resetRouter()
      removeUserName()
      removeUserInfo()
      // dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // reset token
  resetToken({ commit }) {
    return new Promise(resolve => {
      var refresh_token = getRefreshToken()
      refreshToken(refresh_token).then(response => {
        setToken(response.access_token)
        setRefreshToken(response.refresh_token)
        commit('SET_TOKEN', response.access_token)
        resolve()
      })
      // removeToken()
      // commit('RESET_STATE')
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
