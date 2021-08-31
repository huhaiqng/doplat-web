import request from '@/utils/request'

// MySQL
export function getMySQL(query) {
  return request({
    url: '/api/mysql/',
    method: 'get',
    params: query
  })
}
export function addMySQL(data) {
  return request({
    url: '/api/mysql/',
    method: 'post',
    data
  })
}
export function updateMySQL(data) {
  return request({
    url: `/api/mysql/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteMySQL(id) {
  return request({
    url: `/api/mysql/${id}/`,
    method: 'delete'
  })
}
// MySQL Perm
export function getMySQLPerm(query) {
  return request({
    url: '/api/mysql-perm/',
    method: 'get',
    params: query
  })
}
