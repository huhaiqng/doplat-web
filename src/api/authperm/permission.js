import request from '@/utils/request'

export function getPermissionList() {
  return request({
    url: '/api/permission/',
    method: 'get'
  })
}
