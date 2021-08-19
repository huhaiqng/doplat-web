// import Cookies from 'js-cookie'

// tonken
export function getToken() {
  return sessionStorage.getItem('access_token')
}

export function setToken(token) {
  return sessionStorage.setItem('access_token', token)
}

export function removeToken() {
  return sessionStorage.removeItem('access_token')
}

// refresh_token
export function getRefreshToken() {
  return sessionStorage.getItem('refresh_token')
}

export function setRefreshToken(token) {
  return sessionStorage.setItem('refresh_token', token)
}

export function removeRefreshToken() {
  return sessionStorage.removeItem('refresh_token')
}

// userNmae
export function setUserName(username) {
  return sessionStorage.setItem('doplat_username', username)
}

export function removeUserName() {
  return sessionStorage.removeItem('doplat_username')
}

export function getUserName() {
  return sessionStorage.getItem('doplat_username')
}

// userInfo
export function setUserInfo(userInfo) {
  return sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function setIsSuperuser(is_superuser) {
  return sessionStorage.setItem('is_superuser', is_superuser)
}

export function getIsSuperuser() {
  return sessionStorage.getItem('is_superuser')
}

export function setMyPerms(my_perms) {
  return sessionStorage.setItem('my_perms', my_perms)
}

export function getMyPerms() {
  return sessionStorage.getItem('my_perms')
}

export function getUserInfo() {
  return sessionStorage.getItem('userInfo')
}

export function removeUserInfo() {
  return sessionStorage.removeItem('userInfo')
}
