// import Cookies from 'js-cookie'

// tonken
export function getToken() {
  return localStorage.getItem('access_token')
}

export function setToken(token) {
  return localStorage.setItem('access_token', token)
}

export function removeToken() {
  return localStorage.removeItem('access_token')
}

// refresh_token
export function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

export function setRefreshToken(token) {
  return localStorage.setItem('refresh_token', token)
}

export function removeRefreshToken() {
  return localStorage.removeItem('refresh_token')
}

// userNmae
export function setUserName(username) {
  return localStorage.setItem('doplat_username', username)
}

export function removeUserName() {
  return localStorage.removeItem('doplat_username')
}

export function getUserName() {
  return localStorage.getItem('doplat_username')
}

// userInfo
export function setUserInfo(userInfo) {
  return sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function getUserInfo() {
  return sessionStorage.getItem('userInfo')
}

export function removeUserInfo() {
  return sessionStorage.removeItem('userInfo')
}
