// Book.vue中使用的业务逻辑函数

/**
 * 将文字构造成百度语音合成的URL,并赋值给播放器
 * @param {Object} storyContent 待合成文字
 * @param {Object} innerAudioContext 播放器Context
 */
function buildAudioUrl(storyContent, innerAudioContext) {
    var baseUrl = 'https://tsn.baidu.com/text2audio?';
    var accessToken = wx.getStorageSync('WXAccessToken');
    // 设置音频播放来源.
    // NOTE: 此方法仅在用户点击播放StoryContent时调用，最大限度保证Baidu Access Token已经获取到
    var param = {
        tex: storyContent,
        tok: accessToken,
        spd: 5, // 语速，取值0-15，默认为5中语速
        pit: 5, // 音调，取值0-15，默认为5中语调
        vol: 15, // 音量，取值0-15，默认为5中音量
        //per: 4 ,// 基础音库, 选择男声／女生; 度小宇=1，度小美=0，度逍遥=3，度丫丫=4;
        per: 5 // 精品音库 度博文=106，度小童=110，度小萌=111，度米朵=103，度小娇=5
        //aue: 3, // 3为mp3格式(默认), 4为pcm-16k, 5为pcm-8k, 6为wav（内容同pcm-16k）
    };

    // 创建form参数
    var data = {};
    for (var p in param) {
        data[p] = param[p];
    }

    // 赋值预定义参数
    data.cuid = data.cuid || data.tok;
    data.ctp = 1;
    data.lan = data.lan || 'zh';
    data.aue = data.aue || 3;

    // 序列化参数列表
    var fd = [];
    for (var k in data) {
        fd.push(k + '=' + encodeURIComponent(data[k]));
    }
    var tail = fd.join('&');
    var rawEnPath = baseUrl + tail; // 原文合成声音URL路径
    //console.log('Raw Eng Path:' + rawEnPath);
    innerAudioContext.src = rawEnPath;
}

export default {
    buildAudioUrl,
}
