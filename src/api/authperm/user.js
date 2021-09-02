import request from '@/utils/request'

export function getLoginUser() {
  return request({
    url: '/api/getLoginUser/',
    method: 'get'
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
    url: '/api/userinfo/',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/userinfo/',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/userinfo/${id}/`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: `/api/userinfo/${data.id}/`,
    method: 'put',
    data
  })
}
