import request from '@/utils/request'

// Project
export function getProjectList(query) {
  return request({
    url: '/api/project/',
    method: 'get',
    params: query
  })
}
export function addProject(data) {
  return request({
    url: '/api/project/',
    method: 'post',
    data
  })
}
export function updateProject(data) {
  return request({
    url: `/api/project/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteProject(id) {
  return request({
    url: `/api/project/${id}/`,
    method: 'delete'
  })
}
export function getProjectInfo() {
  return request({
    url: '/api/getProjectInfo/',
    method: 'get'
  })
}
export function getOneProjectInfo(id) {
  return request({
    url: `/api/project-one/${id}/`,
    method: 'get'
  })
}
export function getProjectName() {
  return request({
    url: '/api/project-name/',
    method: 'get'
  })
}
export function getProjectNameNeedPerm() {
  return request({
    url: '/api/project-name-need-perm/',
    method: 'get'
  })
}
