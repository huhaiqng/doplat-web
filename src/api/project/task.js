import request from '@/utils/request'

// Task
export function getTaskResult(data) {
  return request({
    url: '/api/taskresult/',
    method: 'get',
    params: data
  })
}
