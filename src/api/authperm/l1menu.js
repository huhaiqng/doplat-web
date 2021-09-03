import request from '@/utils/request'

export function getL1Menu(data) {
  return request({
    url: '/api/l1menu/',
    method: 'get',
    params: data
  })
}

export function addL1Menu(data) {
  return request({
    url: '/api/l1menu/',
    method: 'post',
    data
  })
}

export function deleteL1Menu(id) {
  return request({
    url: `/api/l1menu/${id}/`,
    method: 'delete'
  })
}

export function updateL1Menu(data) {
  return request({
    url: `/api/l1menu/${data.id}/`,
    method: 'put',
    data
  })
}
