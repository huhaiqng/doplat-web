import request from '@/utils/request'

export function getGitlabRepo(query) {
  return request({
    url: '/api/gitlabrepo/',
    method: 'get',
    params: query
  })
}
export function addGitlabRepo(data) {
  return request({
    url: '/api/gitlabrepo/',
    method: 'post',
    data
  })
}
export function updateGitlabRepo(data) {
  return request({
    url: `/api/gitlabrepo/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteGitlabRepo(id) {
  return request({
    url: `/api/gitlabrepo/${id}/`,
    method: 'delete'
  })
}
