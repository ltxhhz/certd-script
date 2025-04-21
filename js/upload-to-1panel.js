// v2
// 上传证书到1panel
// 没有apiKey的1panel版本用上一个版本

//#region 修改
const HOST = 'http://192.168.33.102:27580'
const description = '同步自 certd'
const apiKey = ''
//#endregion

const BASEURL = `${HOST}/api/v1`
const sslID = 0

const crypto = await import('crypto')
/**
 * @type {import('axios').AxiosInstance}
 */
const axios = ctx.http.request

// const token = await login(host, safeEntry, username, password)
await uploadCertificate(ctx.self.cert, sslID)

// testApi(host)

function uploadCertificate(cert, sslID) {
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

  return axios({
    url: '/websites/ssl/upload',
    baseURL: BASEURL,
    method: 'POST',
    headers: getAuthHeader(),
    data: uploadData,
  }).then(res => {
    if (res.code != 200) {
      throw new Error(`上传失败：${res.message}`)
    }
  })
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

function timestamp() {
  return Math.round(Date.now() / 1000)
}

function getToken() {
  return md5(`1panel${apiKey}${timestamp()}`)
}

function getAuthHeader() {
  return {
    '1Panel-Token': getToken(),
    '1Panel-Timestamp': timestamp()
  }
}
