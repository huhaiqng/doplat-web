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

export function getGroupName() {
  return request({
    url: '/api/group-name/',
    method: 'get'
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

// 组对象权限
export function getGroupObjectPerm(data) {
  return request({
    url: '/api/groupobjectpermission/',
    method: 'get',
    params: data
  })
}

export function addGroupObjectPerm(data) {
  return request({
    url: '/api/groupobjectpermission/',
    method: 'post',
    data
  })
}

export function deleteGroupObjectPerm(id) {
  return request({
    url: `/api/groupobjectpermission/${id}/`,
    method: 'delete'
  })
}
