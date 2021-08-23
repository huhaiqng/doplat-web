import request from '@/utils/request'

export function getL1Menu() {
  return request({
    url: '/api/getL1Menu/',
    method: 'get'
  })
}
