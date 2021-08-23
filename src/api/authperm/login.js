import request from '@/utils/request'

export function login(data) {
  var loginData = new FormData()
  loginData.append('username', data.username)
  loginData.append('password', data.password)
  loginData.append('grant_type', 'password')
  loginData.append('scope', 'write')
  loginData.append('client_id', 'QtAHW8JbkYA3dOgEzTjn2veQphnplznzeE6A8kDk')
  loginData.append('client_secret', 'ON01I8ocs6zSQQOP32vecYvGY3eDc8Q7C2w2soXOk8e2TcL4i9wrUImwQ7E9b3ncbskTVGaOj2wjN0T0gi46iiyjftFuWEqYWGtLOCcnyuw1a8u2VVISon3OyPOEDWsR')

  return request({
    url: '/api/o/token/',
    method: 'post',
    data: loginData
  })
}

export function refreshToken(token) {
  var refreshTokenData = new FormData()
  refreshTokenData.append('grant_type', 'refresh_token')
  refreshTokenData.append('refresh_token', token)
  refreshTokenData.append('client_id', 'QtAHW8JbkYA3dOgEzTjn2veQphnplznzeE6A8kDk')
  refreshTokenData.append('client_secret', 'ON01I8ocs6zSQQOP32vecYvGY3eDc8Q7C2w2soXOk8e2TcL4i9wrUImwQ7E9b3ncbskTVGaOj2wjN0T0gi46iiyjftFuWEqYWGtLOCcnyuw1a8u2VVISon3OyPOEDWsR')

  return request({
    url: '/api/o/token/',
    method: 'post',
    data: refreshTokenData
  })
}
