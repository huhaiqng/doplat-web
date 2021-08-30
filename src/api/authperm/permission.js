import request from '@/utils/request'

export function getPermissionList(query) {
  return request({
    url: '/api/permission/',
    method: 'get',
    params: query
  })
}
