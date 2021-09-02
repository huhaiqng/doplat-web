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
