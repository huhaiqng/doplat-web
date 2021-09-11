import request from '@/utils/request'

export function getOriginJenkinsJob() {
  return request({
    url: '/jenkins/api/json',
    method: 'get',
    auth: {
      username: 'admin',
      password: '114bba68b8c1a0f93f1e2d71436026ad77'
    }
  })
}

export function getJenkinsJob(query) {
  return request({
    url: '/api/jenkinsjob/',
    method: 'get',
    params: query
  })
}
export function addJenkinsJob(data) {
  return request({
    url: '/api/jenkinsjob/',
    method: 'post',
    data
  })
}
export function updateJenkinsJob(data) {
  return request({
    url: `/api/jenkinsjob/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteJenkinsJob(id) {
  return request({
    url: `/api/jenkinsjob/${id}/`,
    method: 'delete'
  })
}
