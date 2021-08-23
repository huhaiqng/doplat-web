import request from '@/utils/request'

export function getL2Menu(data) {
  return request({
    url: '/api/getL2Menu/',
    method: 'get',
    params: data
  })
}
