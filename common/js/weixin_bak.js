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
