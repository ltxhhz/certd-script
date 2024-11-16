const host = 'http://192.168.31.102:27580'
const safeEntry = ''
const username = 'ltxhhz'
const password = ''
const description = '同步自 certd'
const sslID = 0

const token = await login(host, safeEntry, username, password)
const uploadRes = await uploadCertificate(host, token, ctx.self.cert, sslID)

function login(host, safeEntry, username, password) {
  host = host.replace(/\/$/, '')
  return ctx.http
    .request({
      url: `${host}/api/v1/auth/login`,
      method: 'POST',
      headers: {
        EntranceCode: Buffer.from(safeEntry).toString('base64')
      },
      data: {
        name: username,
        password,
        captcha: '',
        captchaID: '',
        ignoreCaptcha: true,
        language: 'zh',
        authMethod: 'jwt'
      }
    })
    .then(res => {
      if (res.code != 200) {
        throw new Error('登录失败', res)
      } else {
        return res.data.token
      }
    })
}

function uploadCertificate(host, token, cert, sslID) {
  const privateKey = cert.key
  const certificate = cert.crt

  const uploadData = {
    privateKey,
    certificate,
    privateKeyPath: '', //this.keyPath,
    certificatePath: '', //this.certPath,
    type: 'paste',
    sslID,
    description
  }

  return ctx.http.request({
    url: `${host}/api/v1/websites/ssl/upload`,
    method: 'POST',
    headers: {
      PanelAuthorization: token
    },
    data: uploadData
  })
}