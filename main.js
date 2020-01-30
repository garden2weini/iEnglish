import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// 以下为业务逻辑
uni.authorize({
    scope: 'scope.userInfo',
    success() {
        console.log("authorize scope.userInfo, ok!")
    }
})

let APIKEY = 'wx56dda72f065e7c06';
let APISECRET = '8a9dc394eefec9932750a7b3f8699d7f';
let JSCODE_URL = 'https://api.weixin.qq.com/sns/jscode2session';
        
// 微信登录. Ref: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
uni.login({
    provider: 'weixin',
    success: function(loginRes) {
        console.log('App.vue-微信登录:' + JSON.stringify(loginRes));
        
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
                        console.log('Openid:' + openid);
                    }
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

    }
});
