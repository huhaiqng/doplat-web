import request from '@/utils/request'

export function getLoginUser() {
  return request({
    url: '/api/getLoginUser/',
    method: 'get'
  })
}

export function getUserInfo(data) {
  return request({
    url: '/api/user/',
    method: 'get',
    params: data
  })
}

export function getUserHostedInfo() {
  return request({
    url: '/api/getUserHostedInfo/',
    method: 'get'
  })
}

// User API
export function getUser(data) {
  return request({
    url: '/api/getUserInfo/',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/userInfo/',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/userInfo/${id}/`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: `/api/userInfo/${data.id}/`,
    method: 'put',
    data
  })
}
