import request from '@/utils/request'

// Config
export function getUrl(query) {
  return request({
    url: '/api/url/',
    method: 'get',
    params: query
  })
}
export function addUrl(data) {
  return request({
    url: '/api/url/',
    method: 'post',
    data
  })
}
export function updateUrl(data) {
  return request({
    url: `/api/url/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteUrl(id) {
  return request({
    url: `/api/url/${id}/`,
    method: 'delete'
  })
}
