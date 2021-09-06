import request from '@/utils/request'

// Config
export function getConfig(query) {
  return request({
    url: '/api/config/',
    method: 'get',
    params: query
  })
}
export function addConfig(data) {
  return request({
    url: '/api/config/',
    method: 'post',
    data
  })
}
export function updateConfig(data) {
  return request({
    url: `/api/config/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteConfig(id) {
  return request({
    url: `/api/config/${id}/`,
    method: 'delete'
  })
}
