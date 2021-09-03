import request from '@/utils/request'

export function getL2Menu(data) {
  return request({
    url: '/api/l2menu/',
    method: 'get',
    params: data
  })
}
export function getL2MenuList(data) {
  return request({
    url: '/api/l2menu/',
    method: 'get',
    params: data
  })
}
export function addL2Menu(data) {
  return request({
    url: '/api/l2menu/',
    method: 'post',
    data
  })
}
export function deleteL2Menu(id) {
  return request({
    url: `/api/l2menu/${id}/`,
    method: 'delete'
  })
}
export function updateL2Menu(data) {
  return request({
    url: `/api/l2menu/${data.id}/`,
    method: 'put',
    data
  })
}

export function getL2MenuContentType() {
  return request({
    url: '/api/getL2MenuContentType/',
    method: 'get'
  })
}
