<template>
    <view>
        <view class="content">
            <view class="image"><image :src="bookImage" mode="aspectFit" style="width: 200px; height: 200px;" /></view>
            <view class="story">
                <h4>#. {{ curChapterName }}</h4>
                <text>{{ storyContent }}</text>
            </view>
            <view>
                <button @click="goBack" class="mini-btn" type="primary" size="mini">{{ leftArraw }}</button>
                <text space="ensp" decode="true">{{ whiteSpace }}</text>
                <button @click="goForward" class="mini-btn" type="primary" size="mini">{{ rightArraw }}</button>
            </view>
            <view>
                <!-- Raw Audio -->
                <image @click="hanlerPaly" :src="playImg" mode="aspectFit" style="width: 40px; height: 40px;" />
                <text space="ensp" decode="true">{{ whiteSpace }}{{ whiteSpace }}{{ whiteSpace }}</text>
                <image @click="hanlerRecord" :src="recordImg" mode="aspectFit" style="width: 40px; height: 40px;" />
                <!-- Record Audio -->
                <text space="ensp" decode="true">{{ whiteSpace }}{{ whiteSpace }}{{ whiteSpace }}</text>
                <image @click="parseAudioPro" :src="playImg" mode="aspectFit" style="width: 40px; height: 40px;" />
            </view>
            <view class="uni-textarea"><textarea placeholder-style="color:#F76260" :placeholder="voiceText" /></view>
        </view>
    </view>
</template>

<script>
import common from '../../common/js/common.js';
// NOTE: 获取App录音功能, 改为index.vue中进行授权

const recorderManager = uni.getRecorderManager();
//const recorderManager = wx.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();

innerAudioContext.autoplay = true;

export default {
    data() {
        return {
            whiteSpace: '&nbsp;&nbsp;&nbsp;',
            leftArraw: '<',
            rightArraw: '>',
            storyContent: 'None',
            innerAudioContext: null, // 音频对象
            isPlay: false, // 是否播放
            sliderProgress: 0, // 滑动控制条进度
            totalTime: 0, // 音频总时长
            nowTime: 0, // 音频当前播放时长
            playImg: '/static/img/start.jpg', // 播放或者暂停图片
            isRecord: false, // 是否开始录音
            recordImg: '/static/img/record/record.gif',
            cloudContent: 'baidu api, Default data.',
            accessToken: 'baidu api token...',
            bookImage: '/static/logo.png',
            curBook: '', // 当前图书编号，即库表名称
            chapterIndex: -1,
            contentIndex: -1,
            chapters: null, // 当前图书章节及内容，从数据库中读取json数据
            curChapterName: 'None',
            voicePath: '', // 录制音频的文件路径
            voiceText: 'not yet~' // 百度API识别到的语音文字
        };
    },
    onLoad(e) {
        // 准备加载图书数据
        this.curBook = e.book;
        this.bookImage = '/static/img/' + e.book + '.jpg';
        this.getChapters(this.curBook);

        // 准备加载录音引擎
        let self = this;
        recorderManager.onStop(function (res) {
            console.log('recorder stop:' + JSON.stringify(res));
            self.voicePath = res.tempFilePath;
        });
    },
    methods: {
        parseAudioPro() {
            // NOTE: 标记使用百度语音识别的标准版(默认)还是极速版
            var isBaiDuPro = false;
            let ARS_URL = "https://vop.baidu.com/server_api"; 
            // NOTE(普通版)： 1737,英语+无标点; 1536,普通话(支持简单的英文识别)+搜索模型+无标点
            let DEV_PID = 1737; 
            
            if(isBaiDuPro) {
                //NOTE(极速版)：80001：普通话(纯中文识别)	极速版输入法模型	有标点
                DEV_PID = 80001;
                ARS_URL = "https://vop.baidu.com/pro_api";     
            }
            // 获取录音的转换文字，并比较正确率
            let RATE = 16000;
            let FORMAT = 'm4a'; // m4a for mp3,
            let CUID = 'weini-garden-2020';
            var AUDIO_FILE = this.voicePath;
            if(this.voicePath) {
                this.voiceText = this.voicePath;
                innerAudioContext.src = this.voicePath;
                innerAudioContext.play();
            }
            
            console.log('parseAudioPro:' + AUDIO_FILE);
            //let AUDIO_FILE = '/static/16k-48000.m4a';
            //let AUDIO_FILE = '/static/hello.mp3';
            //console.log("File2Decode:" + this.voicePath);
            let speech_file = wx.getFileSystemManager().readFileSync(AUDIO_FILE);

            console.log('Raw:' + speech_file);
            let length = speech_file.byteLength;
            console.log('Length:' + length);
            let speech = uni.arrayBufferToBase64(speech_file);
            console.log('Base64Speeh:' + speech);
            uni.request({
                //url: 'https://vop.baidu.com/pro_api',
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
                    if (res.data.result) {
                        this.voiceText = res.data.result;
                    } else {
                        this.voiceText = JSON.stringify(res.data);
                    }
                    console.log(this.voiceText);
                    this.text = 'request success';
                },
                fail: result => {
                    this.voiceText = JSON.stringify(result);
                    console.log('Parse Error:' + result);
                }
            });
        },
        goBack() {
            this.isPlay = false;
            let chapterLen = this.chapters.length;
            let curContents = this.chapters[this.chapterIndex];
            let contentLen = this.chapters[this.chapterIndex].contents.length;

            if (this.contentIndex === 0) {
                if (this.chapterIndex === 0) {
                    return;
                } else {
                    this.chapterIndex--;
                    this.contentIndex = 0;
                }
            } else {
                this.contentIndex--;
            }
            this.curChapterName = this.chapters[this.chapterIndex].name;
            this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content;
        },
        goForward() {
            this.isPlay = false;
            let chapterLen = this.chapters.length;
            let curContents = this.chapters[this.chapterIndex];
            let contentLen = this.chapters[this.chapterIndex].contents.length;

            if (this.contentIndex === contentLen - 1) {
                if (this.chapterIndex === chapterLen - 1) {
                    return;
                } else {
                    this.chapterIndex++;
                    this.contentIndex = 0;
                }
            } else {
                this.contentIndex++;
            }
            //console.log('ChapterLen:' + chapterLen + ',ContentLen:' + contentLen);
            //console.log('ChapterIdx:' + this.chapterIndex + ',ContentIdx:' + this.contentIndex);
            this.curChapterName = this.chapters[this.chapterIndex].name;
            this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content;
        },
        getChapters(bookTable) {
            // 获取章节列表
            var self = this;
            // 1. 获取数据库引用
            const db = wx.cloud.database({
                env: 'weini-home-b5ggv'
            });
            // 2. 构造查询语句(NOTE:每次只能获取20条记录)
            //console.log('TableName:' + bookTable);
            db.collection(bookTable)
                .where({
                    //chapter: _.gte(1) // 大于或等于(>=)
                })
                .field({
                    //chapter: true,
                    //name: true
                })
                .orderBy('chapter', 'asc')
                .get({
                    success: function(res) {
                        self.chapters = res.data;
                        console.log(self.chapters);
                    }
                });
        },
        hanlerPaly() {
            // 播放暂停
            this.isPlay = !this.isPlay;
        },
        hanlerRecord() {
            // 录音暂停
            this.isRecord = !this.isRecord;
        },
        getBaiduToken() {
            // 通过调用云函数获得baidu access token
            wx.cloud.init(); //调用前需先调用init
            wx.cloud
                .callFunction({
                    name: 'baidu_api',
                    data: {
                        //"content": "..."
                    }
                })
                .then(res => {
                    //console.log(res.result);
                    if (res.result.code == 300) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '获取语音失败！'
                        });
                        //return
                        this.accessToken = 'Ops!';
                    } else {
                        this.accessToken = res.result.token;
                        //this.buildAudioUrl(this.storyContent, this.accessToken);
                    }
                });
        },
        initAudioContext() {
            // 创建音频播放对象
            this.innerAudioContext = wx.createInnerAudioContext();

            // 音频进入可以播放状态
            this.innerAudioContext.onCanplay(res => {
                this.isPlay = false;
            });
            // 音频自然播放结束事件
            this.innerAudioContext.onEnded(res => {
                // 当音频播放结束后，将滑动条滑到末尾
                this.sliderProgress = 100;
                this.isPlay = false;
            });
            // 音频播放中
            this.innerAudioContext.onTimeUpdate(res => {
                let duration = this.innerAudioContext.duration;
                // 获取音频播放时长，单位s，保留小数点后六位，转为分钟
                this.totalTime = common.secToTime(duration);
                let currentTime = this.innerAudioContext.currentTime;
                // 设置当前音频播放位置
                this.nowTime = common.secToTime(currentTime);
                // 设置滑动条位置，小数计算不精确，转为整数计算
                this.sliderProgress = ((currentTime * 1000000) / (duration * 1000000)) * 100;
            });
        },
        updateAudioUrl(storyContent, accessToken) {
            // 设置音频播放来源
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
            var fullUrl = 'https://tsn.baidu.com/text2audio?' + tail;
            this.innerAudioContext.src = fullUrl;
            //console.log(fullUrl)
        }
    },
    created() {
        this.getBaiduToken();
        this.initAudioContext();
    },
    mounted() {},
    destroyed() {
        this.innerAudioContext.destroy();
    },
    watch: {
        isPlay(val, oldVal) {
            this.innerAudioContext.offCanplay();
            if (val) {
                this.playImg = '/static/img/stop.jpg';
                this.innerAudioContext.play();
            } else {
                this.playImg = '/static/img/start.jpg';
                this.innerAudioContext.pause();
            }
        },
        isRecord(val, oldVal) {
            if (val) {
                // REF: https://uniapp.dcloud.io/api/media/record-manager
                // REF: https://smartprogram.baidu.com/docs/develop/api/media/recorder_RecorderManager/
                var options = {
                    // 6bit 位深 * 16000 sampleRate = 96000 encodeBitRate
                    //duration: 5000, // 指定录音的时长，单位 ms
                    sampleRate: 16000, // 采样率，有效值 8000/16000(百度仅适用此值！)/44100
                    numberOfChannels: 1, // 录音通道数，有效值 1/2
                    encodeBitRate: 96000, // 编码码率（比特率／码率－bitrate，每秒钟用多少比特的数据量去表示）
                    format: 'm4a' // 音频格式，有效值 aac/mp3
                };
                // 编写开始录音的逻辑
                this.recordImg = '/static/img/record/stop.jpg';
                // WARN: 提供options参数在真机模式下有问题，暂不使用。无参数即可满足百度语音识别要求!
                //recorderManager.start(options);
                recorderManager.start();
                
            } else {
                // 编写结束录音的逻辑
                this.recordImg = '/static/img/record/play.png';
                recorderManager.stop();
                
                if (this.voicePath) {
                    console.log('recorderManager.stop:' + this.voicePath);
                } else {
                    console.log('voicePath is null!');
                }
            }
        },
        chapters(val, oldVal) {
            // NOTE: 获取到章节及内容后，进行初始化逻辑
            //console.log(val);
            this.chapterIndex = 0;
            this.contentIndex = 0;
            this.curChapterName = val[this.chapterIndex].name;
            this.storyContent = val[this.chapterIndex].contents[this.contentIndex].content;
            this.updateAudioUrl(this.storyContent, this.accessToken);
        },
        storyContent(val, oldVal) {
            console.log('CurrentContent:' + val);
            this.updateAudioUrl(val, this.accessToken);
        }
    }
};
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: white;
    align-items: center;
    width: 100vw;
    height: 100vh;
}
.image {
    margin-top: 10px;
    border: 1upx solid #ffffff;
}
.story {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 1px;
}
</style>
