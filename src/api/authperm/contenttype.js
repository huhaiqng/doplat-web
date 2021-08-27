import request from '@/utils/request'

// Group API
export function getContentType() {
  return request({
    url: '/api/contenttype/',
    method: 'get'
  })
}
