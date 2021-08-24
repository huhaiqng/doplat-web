import request from '@/utils/request'

// Group API
export function getGroup(data) {
  return request({
    url: '/api/getGroups/',
    method: 'get',
    params: data
  })
}

export function addGroup(data) {
  return request({
    url: '/api/groups/',
    method: 'post',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: `/api/groups/${id}/`,
    method: 'delete'
  })
}

export function updateGroup(data) {
  return request({
    url: `/api/groups/${data.id}/`,
    method: 'put',
    data
  })
}

// 获取组的二级菜单权限
export function getGroupL2menu(data) {
  return request({
    url: '/api/getGroupL2menu/',
    method: 'get',
    params: data
  })
}

// 设置组的权限
export function setGroupObjectPerms(data) {
  return request({
    url: '/api/setGroupObjectPerms/',
    method: 'post',
    data
  })
}