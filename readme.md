# certd-script

用于此项目
[certd/certd: 开源 SSL 证书管理工具；全自动证书申请、更新、续期；通配符证书，泛域名证书申请；证书自动化部署到阿里云、腾讯云、主机、群晖、宝塔；https 证书，pfx 证书，der 证书，TLS 证书，nginx 证书自动续签自动部署](https://github.com/certd/certd)

任务步骤选择运行 js 脚本，添加进去，修改所需的变量即可

| 脚本列表                                         | 说明                                                                                                                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [上传证书到 1panel](./js/upload-to-1panel.js)       | 没有apiKey的旧版1panel使用[v1](https://github.com/ltxhhz/certd-script/blob/6e49a345604acc583a135de920fb7cbf6d40f6ce/js/upload-to-1panel.js) |
| [更换1panel最新证书](./js/update-website-1panel.js) | 将1panel中指定网站的证书更新为最新上传的证书 |
| [发送OneBot群消息](./js/send-onebot-group-msg.js) | 通过OneBot协议向群组发送证书申请结果通知 |