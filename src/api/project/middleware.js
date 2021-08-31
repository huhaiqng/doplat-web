import request from '@/utils/request'

// Middleware
export function getMiddlewareList(query) {
  return request({
    url: '/api/middleware-list/',
    method: 'get',
    params: query
  })
}
export function addMiddleware(data) {
  return request({
    url: '/api/middleware/',
    method: 'post',
    data
  })
}
export function updateMiddleware(data) {
  return request({
    url: `/api/middleware/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteMiddleware(id) {
  return request({
    url: `/api/middleware/${id}/`,
    method: 'delete'
  })
}
// Middleware Perm
export function getMiddlewarePerm(query) {
  return request({
    url: '/api/middleware-perm/',
    method: 'get',
    params: query
  })
}
