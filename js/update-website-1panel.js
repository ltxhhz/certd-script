// v1
// 将指定网站证书更新到最新

//#region 修改
const HOST = 'http://192.168.33.102:27580'
const websiteID = 3
const apiKey = ''
//#endregion

const BASEURL = `${HOST}/api/v1`

const crypto = await import('crypto')
/**
 * @type {import('axios').AxiosInstance}
 */
const axios = ctx.http.request

await updateWithLatestCert()

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

// 获取证书列表
async function getCertificates(data) {
  return await axios({
    url: '/websites/ssl/search',
    method: 'POST',
    data,
    baseURL: BASEURL,
    headers: getAuthHeader()
  })
}

// 获取网站3的HTTPS配置
async function getHttpsConfig() {
  return await axios({
    url: `/websites/${websiteID}/https`,
    baseURL: BASEURL,
    method: 'GET',
    headers: getAuthHeader()
  })
}

// 设置网站3的HTTPS配置
async function setHttpsConfig(data) {
  return await axios({
    url: `/websites/${websiteID}/https`,
    baseURL: BASEURL,
    data,
    method: 'POST',
    headers: getAuthHeader()
  })
}

async function updateWithLatestCert() {
  // 获取证书列表
  const certificates = await getCertificates({
    acmeAccountID: '0'
  })
  if (!certificates.data?.length) throw new Error('未找到可用证书')

  // 找到最新证书（按 expireDate 最晚）
  const latestCert = certificates.data.reduce((prev, curr) => {
    return new Date(curr.expireDate) > new Date(prev.expireDate) ? curr : prev
  })
  ctx.logger.info(`使用证书ID：${latestCert.id}`)
  const currentConfig = (await getHttpsConfig()).data

  const updatedConfig = {
    SSLProtocol: currentConfig.SSLProtocol,
    acmeAccountID: 0,
    algorithm: currentConfig.algorithm,
    certificate: '',
    certificatePath: '',
    enable: currentConfig.enable,
    hsts: currentConfig.hsts,
    httpConfig: currentConfig.httpConfig,
    importType: 'paste',
    privateKey: '',
    privateKeyPath: '',
    type: 'existed',
    websiteId: websiteID,
    websiteSSLId: latestCert.id
  }

  // 5. 更新配置
  const res = await setHttpsConfig(updatedConfig)
  if (res.code !== 200) throw new Error('更新失败')
  return updatedConfig
}
