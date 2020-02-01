/* 备份函数 Nonsense */
// 百度语音识别普通版调用样例
function parseAudio4Baidu() {
    // 获取录音的转换文字，并比较正确率
    let RATE = 16000;
    let DEV_PID = 1536; //  1737,英语+无标点; 1536,普通话(支持简单的英文识别)+搜索模型+无标点
    let FORMAT = 'm4a'; // m4a for mp3, 
    let CUID = 'weini-garden-2020';
    //let AUDIO_FILE = this.voicePath;
    let AUDIO_FILE = '/static/16k-48000.m4a';
    //let AUDIO_FILE = '/static/hello.mp3';
    //console.log("File2Decode:" + this.voicePath);
    let speech_file = wx.getFileSystemManager().readFileSync(AUDIO_FILE);
    console.log('Raw:' + speech_file);
    let length = speech_file.byteLength;
    console.log('Length:' + length);
    let speech = uni.arrayBufferToBase64(speech_file);

    uni.request({
        url: 'http://vop.baidu.com/server_api',
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        data: {
            dev_pid: DEV_PID,
            //"lm_id" : LM_ID,    #测试自训练平台开启此项
            format: FORMAT,
            channel: 1,
            rate: RATE,
            token: this.accessToken,
            cuid: CUID,
            channel: 1,
            speech: speech,
            len: length
        },
        success: res => {
            console.log(res.data);
            console.log(res.data.result);
            this.voiceText = res.data.result;
            this.text = 'request success';
        },
        fail: result => {
            console.log('Parse Error:' + result);
        }
    });
}

/**
 * 比较两个字符串差异度. 比较str1与str2差异度，就是将str1修改为str2最少需要修改的字符个数。
 * 编辑距离:一个字符串变为另一个最少需要的步骤 (操作方面：1.修改一个字符;2.增加一个字符;3.删除一个字符)
 * @param {Object} str1
 * @param {Object} str2
 */
function Levenshtein(str1, str2) {
    var len1 = str1.length;
    var len2 = str2.length;
    var dif = [];
    for (var a = 0; a <= len1; a++) {
        dif[a] = [];
        dif[a][0] = a;
    }
    for (a = 0; a <= len2; a++) {
        dif[0][a] = a;
    }
    var temp;
    for (var i = 1; i <= len1; i++) {
        for (var j = 1; j <= len2; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                temp = 0;
            } else {
                temp = 1;
            }
            //取三个值中最小的 
            dif[i][j] = min([dif[i - 1][j - 1] + temp, dif[i][j - 1] + 1, dif[i - 1][j] + 1]);
        }
    }
    return dif[len1][len2]; //差异步骤
}

/**
 * 获取N个数中最小的 
 * @param {Object} ints N个数
 */
function min(ints) {
    var min = 10000;
    for (var i = 0; i < ints.length; i++) {
        if (min > ints[i]) {
            min = ints[i];
        }
    }
    return min;
}

// ERROR: 线上环境中不能通过小程序内部获得openid, 只能通过后台函数获得
function getOpenId_Error() {
    //let APIKEY = 'wx56dda72f065e7c06';
    //let APISECRET = '8a9dc394eefec9932750a7b3f8699d7f';
    //let JSCODE_URL = 'https://api.weixin.qq.com/sns/jscode2session';
    
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
}
