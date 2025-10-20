// v1
// 发送 onebot 群消息

//#region 修改
const HOST = 'http://napcat:6100'
const TOKEN = 'ltxhhz'
const GROUP_ID = '1051912409'
//#endregion

const axios = ctx.http

const result = []
const reqCert = ctx.pipeline.stages.find(stage => stage.title === '证书申请阶段')?.tasks?.[0]
const reqCertResult = reqCert?.status?.result

if (reqCert) {
  result.push({
    title: reqCert.title,
    result: reqCertResult,
    expires: new ctx.CertReader(ctx.self.cert).expires
  })
}

ctx.logger.info(Object.keys(ctx.self))
// ctx.logger.info(ctx.inputChanged)
// ctx.logger.info(JSON.stringify(ctx.pipeline))

if (reqCertResult === 'error') {
  const reqCertProcess = reqCert.processes.find(process => process.title === '处理证书阶段')
  for (let i = 0; i < reqCertProcess.tasks.length; i++) {
    const task = reqCertProcess.tasks[i]
    for (let j = 0; j < task.steps.length; j++) {
      const step = task.steps[j]
      if (step.disabled === false) {
        result.push({
          title: `${task.title}/${step.title}`,
          result: step.status.result
        })
      }
    }
  }
}

ctx.logger.info(JSON.stringify(result))

await axios({
  url: `${HOST}/send_group_msg`,
  method: 'POST',
  headers: {
    Authorization: `Bearer ${TOKEN}`
  },
  data: {
    group_id: GROUP_ID,
    message: `证书申请结果
=============
${result.map(item => `${item.title}: ${item.result}${item.expires ? `\n距离到期: ${Math.floor((item.expires - new Date()) / 1000 / 60 / 60 / 24)}天` : ''}`).join('\n\n')}`
  }
}).then(e => {
  ctx.logger.info('status', e.status)
  ctx.logger.info('data', JSON.stringify(e.data))
  if (!e.data) {
    throw new Error('发送通知失败')
  }
})
