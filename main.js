import Vue from 'vue'
import App from './App'
import wxCloud from '@/common/js/cloud_service.js';

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// NOTE: 业务常量
// WX Cloud Database Name.
Vue.prototype.Database = 'weini-home-b5ggv';
// 对应每个微信用户+章节+句子索引的录音文件名.
Vue.prototype.RecordFile = function(bookName, chapter, sentenceIdx) {
	let openid = uni.getStorageSync('OPENID');
    let recordFile = "recordfiles/" + openid + '-' + bookName + '-' + chapter + '-' + sentenceIdx + ".acc";
    console.log("record file:" + recordFile);
    return recordFile;
}

// 以下为业务逻辑
uni.authorize({
    scope: 'scope.userInfo',
    success() {
        console.log("authorize scope.userInfo, ok!")
    }
})

//let APIKEY = 'wx56dda72f065e7c06';
//let APISECRET = '8a9dc394eefec9932750a7b3f8699d7f';
//let JSCODE_URL = 'https://api.weixin.qq.com/sns/jscode2session';
        
// 微信登录. Ref: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
uni.login({
    provider: 'weixin',
    success: function(loginRes) {
        console.log('App.vue-微信登录:' + JSON.stringify(loginRes));
        if (loginRes.code) {
            wxCloud.getWxOpenId('need not wx code.');
            /*
            uni.request({ // 获取session_key+openid
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
        } else {
            console.log('登录失败！' + res.errMsg)
        }

    }
});
