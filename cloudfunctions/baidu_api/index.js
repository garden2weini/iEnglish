// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')

cloud.init()

let APIKEY = "wB8N5GX2gVfbtygycU1k0A5t"
let APISECRET = "ERRLhkvCG4MS2vV9eK9cwUGCb4mccSRH"
let VOICE_AUTH_URL = "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials"
let accessToken = ""

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    
    if(accessToken == "") {
        let tokenUrl = VOICE_AUTH_URL + "&client_id=" + APIKEY + "&client_secret=" + APISECRET
        let tokenResponse = await got(tokenUrl)
        accessToken = JSON.parse(tokenResponse.body).access_token
        // expires_in 表示 2592000秒后该token失效
    }
    
    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        token: accessToken,
    }
}
