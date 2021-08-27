import request from '@/utils/request'

export function getL2Menu(data) {
  return request({
    url: '/api/getL2Menu/',
    method: 'get',
    params: data
  })
}

export function getL2MenuContentType() {
  return request({
    url: '/api/getL2MenuContentType/',
    method: 'get'
  })
}
