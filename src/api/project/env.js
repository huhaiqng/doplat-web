import request from '@/utils/request'

// 环境
export function getEnv() {
  return request({
    url: '/api/getEnv/',
    method: 'get'
  })
}
