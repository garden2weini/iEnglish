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
Vue.prototype.CloudRoot = 'cloud://weini-home-b5ggv.7765-weini-home-b5ggv-1301119393/';
// 对应每个微信用户+章节+句子索引的录音文件名.
Vue.prototype.RecordFile = function(bookName, chapter, sentenceIdx) {
	let openid = uni.getStorageSync('OPENID');
    let recordFile = "recordfiles/" + openid + '-' + bookName + '-' + chapter + '-' + sentenceIdx + ".acc";
    //console.log("record file:" + recordFile);
    return recordFile;
}

Vue.prototype.FileName = function(bookName, chapter, sentenceIdx) {
    let sentenceFile = "rawfiles/" + bookName + '-' + chapter + '-' + sentenceIdx + ".acc";
    //console.log("FileName..............." + sentenceFile);
    
    return sentenceFile;
}

// 以下为业务逻辑
uni.authorize({
    scope: 'scope.userInfo',
    success() {
        console.log("authorize scope.userInfo, ok!")
    }
})
        
// 微信登录. Ref: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
uni.login({
    provider: 'weixin',
    success: function(loginRes) {
        console.log('微信登录:' + JSON.stringify(loginRes));
        if (loginRes.code) {
            // 通过云函数过去openid(by wx.setStorageSync)
            wxCloud.getWxOpenId('need not wx code.');
            
        } else {
            console.log('登录失败！' + res.errMsg)
        }

    }
});
