import request from '@/utils/request'

// Host
export function getHosts(query) {
  return request({
    url: '/api/hosts/',
    method: 'get',
    params: query
  })
}
export function addHost(data) {
  return request({
    url: '/api/hosts/',
    method: 'post',
    data
  })
}
export function updateHost(data) {
  return request({
    url: `/api/hosts/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteHost(id) {
  return request({
    url: `/api/hosts/${id}/`,
    method: 'delete'
  })
}
export function getHostsSimple() {
  return request({
    url: '/api/hosts/',
    method: 'get',
    params: { simple: true }
  })
}
// Host Perm
export function getHostsPerm(query) {
  return request({
    url: '/api/hosts/',
    method: 'get',
    params: query
  })
}
