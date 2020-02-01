//'use strict';
const cloud = require('wx-server-sdk')

/**
 * 从小程序端调用云函数时，开发者可以在云函数内使用 wx-server-sdk 提供的 getWXContext 方法获取到每次调用的上下文（appid、openid 等），
 * 无需维护复杂的鉴权机制，即可获取天然可信任的用户登录态（openid）。
 */
exports.main = (event, context) => {
    let { OPENID, APPID, UNIONID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
    return {
        OPENID,
        APPID,
        UNIONID
    }
    /*
    wx.request({ // 获取session_key+openid
        method: 'GET',
        header: {
            //
        },
        url: JSCODE_URL,
        data: {
            grant_type: 'authorization_code',
            appid: APIKEY,
            secret: APISECRET,
            js_code: loginRes.code
        },
        success: e => {
            if (e.statusCode == 200) {
                console.log('jscode2session:' + JSON.stringify(e.data));
                let openid = '';
                openid = uni.getStorageSync('OPENID');
                if (openid || openid.length == 0) {
                    // 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
                    uni.setStorageSync('OPENID', e.data.openid);
                } else {
                    //console.log('Openid:' + openid);
                }
                console.log('Openid:' + openid);
                // 加载以往录音cloud文件的map
                wxCloud.userRecordFileMap(Vue.prototype.Database);
            } else {
                console.log('jscode2session Error:' + JSON.stringify(e));
            }
        },
        fail: e => {
            //
        },
        complete() {
            //uni.hideLoading()
        }
    });
    */
};
