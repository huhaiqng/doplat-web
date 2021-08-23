import request from '@/utils/request'

// Project
export function getProjectInfo() {
  return request({
    url: '/api/getProjectInfo/',
    method: 'get'
  })
}
export function getOneProjectInfo(id) {
  return request({
    url: `/api/project/${id}/`,
    method: 'get'
  })
}
export function getProjectForConfig() {
  return request({
    url: '/api/project-for-config/',
    method: 'get'
  })
}
export function getProjectMain(query) {
  return request({
    url: '/api/project-main/',
    method: 'get',
    params: query
  })
}
