import request from '@/utils/request'

// Config
export function getProjectmodule(query) {
  return request({
    url: '/api/projectmodule/',
    method: 'get',
    params: query
  })
}
export function addProjectmodule(data) {
  return request({
    url: '/api/projectmodule/',
    method: 'post',
    data
  })
}
export function updateProjectmodule(data) {
  return request({
    url: `/api/projectmodule/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteProjectmodule(id) {
  return request({
    url: `/api/projectmodule/${id}/`,
    method: 'delete'
  })
}
