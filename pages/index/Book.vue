<template>
    <view>
        <view class="content">
            <view class="image"><image :src="bookImage" mode="aspectFit" style="width: 200px; height: 200px;" /></view>
            <view class="story" style="height: 160rpx;width: 660rpx;">
                <text style="font-weight: 600; font-style: italic; color:#F76260;">{{ curChapterName }}</text>
                <br />
                <text style="height: 20rpx;width: 660rpx; font-size: 30rpx;">{{contentIndex+1}}. {{ storyContent }}</text>
            </view>
            <view>
                <button @click="goBack" class="mini-btn" type="primary" size="mini">{{ leftArraw }}</button>
                <text space="ensp" decode="true">{{ whiteSpace }}</text>
                <button @click="goForward" class="mini-btn" type="primary" size="mini">{{ rightArraw }}</button>
            </view>
            <view>
                <!-- Raw Audio -->
                <uni-icon :type="playIcon.type" size="30" :color="playIcon.color" @click="hanlerPaly" />
                <text space="ensp" decode="true">{{ whiteSpace }}{{ whiteSpace }}{{ whiteSpace }}</text>
                <uni-icon :type="recordIcon.type" size="35" :color="recordIcon.color" @click="hanlerRecord" />
                <!-- Record Audio -->
                <text space="ensp" decode="true">{{ whiteSpace }}{{ whiteSpace }}{{ whiteSpace }}</text>
                <uni-icon :type="playRecordedIcon.type" size="30" :color="playRecordedIcon.color" @click="playRecorded" />
            </view>
            <view class="story">
                <!--<text>{{ correctRate }}</text>-->
                <uni-icon :type="star1" size="30" :color="starColor" @click="test"></uni-icon>
                <uni-icon :type="star2" size="30" :color="starColor" @click="test"></uni-icon>
                <uni-icon :type="star3" size="30" :color="starColor" @click="test"></uni-icon>
            </view>
            <view class="uni-textarea">
                <textarea placeholder-style="color:#F76260" :placeholder="voiceText" />
                <text placeholder-style="color:#F76260" :placeholder="correctRate" />
            </view>
        </view>
    </view>
</template>

<script>
import uniIcon from '@/components/uni-icons/uni-icons.vue';
import book from '@/common/js/book.js';
import common from '@/common/js/common.js';
import wxCloud from '@/common/js/cloud_service.js';

// NOTE: 获取App录音功能, 改为index.vue中进行授权
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
const innerAudioContext4record = uni.createInnerAudioContext();

// 评星的定义
const StarDef = {
    Zero: 60,
    One: 70,
    OneHalf: 80,
    Two: 90,
    TwoHalf: 95,
    Full: 100
};

// 定义各Icon的含义
const ICONs = {
    Play_Start: {
        // 播放文字声音
        type: 'sound-filled',
        color: 'black'
    },
    Play_Stop: {
        // 停止播放文字声音
        type: 'sound',
        color: 'grey'
    },
    PlayMic_None: {
        // 禁用播放录音
        type: 'headphones',
        color: 'white'
    },
    PlayMic_Pause: {
        // 暂停播放录音
        type: 'headphones',
        color: 'grey'
    },
    PlayMic_Play: {
        // 播放录音
        type: 'headphones',
        color: 'black'
    },
    Record: {
        // 开始录音
        type: 'mic-filled',
        color: 'black'
    },
    Record_Stop: {
        // 结束录音
        type: 'micoff',
        color: 'grey'
    }
};
innerAudioContext.autoplay = true;
innerAudioContext4record.autoplay = true;

export default {
    components: { uniIcon },
    data() {
        return {
            star1: 'star', // star, starhalf, star-filled
            star2: 'star',
            star3: 'star',
            starColor: 'grey',
            whiteSpace: '&nbsp;&nbsp;&nbsp;',
            isParsedRecord: false, // 是否已经进行过录音的识别
            leftArraw: '<',
            rightArraw: '>',
            storyContent: '<Story Sentence>',
            innerAudioContext: null, // 音频对象
            innerAudioContext4record: null, // 录音的音频对象
            isPlay: false, // 是否播放
            //sliderProgress: 0, // 滑动控制条进度
            //totalTime: 0, // 音频总时长
            //nowTime: 0, // 音频当前播放时长
            
            playIcon: null, // 播放或者暂停图片
            playRecordedIcon: null,  // 录音播放的按钮
            recordIcon: null,
            
            isRecord: false, // 是否开始录音
            isRecorded: false, // 是否已经录音完毕
            isPlayRecorded: false, // 是否已经点击录音播放
            
            accessToken: null,
            bookImage: '/static/logo.png',
            curBook: '', // 当前图书编号，即库表名称
            chapterIndex: -1,
            contentIndex: -1,
            chapters: null, // 当前图书章节及内容，从数据库中读取json数据
            curChapterName: '<Chapter Name>',
            
            voicePath: '', // 录制音频的文件路径
            voiceText: '', // 百度API识别到的语音文字
            cloudFileId: '' // WX cloud storage file id.
        };
    },
    created() {
        this.initAudioContext();
    },
    beforeMount() {
        this.playIcon = ICONs.Play_Start;
        this.playRecordedIcon = ICONs.PlayMic_None;
        this.recordIcon = ICONs.Record;
    },
    mounted() {},
    onLoad(e) {
        // 准备加载图书数据
        this.curBook = e.book;

        this.bookImage = '/static/img/book/' + e.book + '.jpg';
        this.getChapters(this.curBook);

        // 准备加载录音引擎
        let self = this;
        recorderManager.onStop(function(res) {
            //console.log('recorder stop:' + JSON.stringify(res));
            self.voicePath = res.tempFilePath;
            self.isRecorded = true;
            self.isParsedRecord = false;
        });
    },
    methods: {
        resetStatus() {  // 用于goBack(),goForward(),watch.chapters
            this.resetStars();
            //this.innerAudioContext.src = null;
            
            // 获取当前句子是否有录音
            var curFilePath = this.RecordFile(this.curBook, this.chapterIndex, this.contentIndex);
            var curFileId = uni.getStorageSync(curFilePath);
            //console.log('resetStatus -- Current File ID:' + curFileId);
            if (curFileId && curFileId.length > 0) {
                this.voicePath = curFileId;
                this.innerAudioContext4record.src = this.voicePath;
                this.isRecorded = true;
                this.isParsedRecord = true;
                //console.log("resetStatus:"+ this.voicePath);
            }
        },
        resetStars() { // only for hanlerRecord()录音按钮事件 和resetStatus()
            // 停止播放声音
            this.innerAudioContext.stop();
            this.innerAudioContext4record.stop();
            
            this.starColor = 'grey';
            this.star1 = 'star';
            this.star2 = 'star';
            this.star3 = 'star';
            this.voiceText = '';
            this.isRecorded = false;
            this.isPlayRecorded = false;
            this.isParsedRecord = false;
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
            this.resetStatus();
            this.curChapterName = this.chapters[this.chapterIndex].name;
            this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content;
        },
        goForward() {
            // NOTE:判断当前是否哟与合格录音，没有则不能下一句
            var haveFile = wx.getStorageSync(this.RecordFile(this.curBook, this.chapterIndex, this.contentIndex));
            if (!haveFile) {
                return;
            }
        
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
            this.resetStatus();
            this.curChapterName = this.chapters[this.chapterIndex].name;
            this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content;
        },
        playRecorded() { // 播放刚录制的声音，或以往保存的cloud录音
            
            if (this.voicePath) {
                this.innerAudioContext4record.src = this.voicePath;
            }
            
            this.isPlayRecorded = !this.isPlayRecorded;
            
            if (this.isParsedRecord) {
                //
            } else {
                this.isParsedRecord = true;
                this.parseAudioPro();
            }
        },
        parseAudioPro() {  // 解析录音为文字；评星；过关保存录音+下一句
            // NOTE: 标记使用百度语音识别的标准版(默认)还是极速版
            var isBaiDuPro = false;
            let ARS_URL = 'https://vop.baidu.com/server_api';
            // NOTE(普通版)： 1737,英语+无标点; 1536,普通话(支持简单的英文识别)+搜索模型+无标点
            let DEV_PID = 1737;

            if (isBaiDuPro) {
                //NOTE(极速版)：80001：普通话(纯中文识别)	极速版输入法模型	有标点
                DEV_PID = 80001;
                ARS_URL = 'https://vop.baidu.com/pro_api';
            }
            // 获取录音的转换文字，并比较正确率
            let RATE = 16000;
            let FORMAT = 'm4a'; // m4a for mp3,
            let CUID = 'weini-garden-2020';
            var AUDIO_FILE = this.voicePath;

            //console.log('parseAudioPro:' + AUDIO_FILE);

            let speech_file = wx.getFileSystemManager().readFileSync(AUDIO_FILE);

            //console.log('Raw:' + speech_file);
            let length = speech_file.byteLength;
            //console.log('Length:' + length);
            let speech = uni.arrayBufferToBase64(speech_file);
            //console.log('Base64Speeh:' + speech);
            this.accessToken = wx.getStorageSync('WXAccessToken');
            uni.request({
                url: ARS_URL,
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
                    //console.log(res.data);
                    if (res.data.result) {
                        this.voiceText = res.data.result;
                    } else {
                        this.voiceText = JSON.stringify(res.data);
                    }
                    var evalResult = common.evaluateRecord(this.storyContent, this.voiceText);
                    //console.log('evalResult:' + evalResult);
                    evalResult = 100 - evalResult;
                    //this.correctRate = '准确度: ' + (100 - evalResult);
                    this.starColor = 'gold';
                    if (evalResult <= StarDef.Zero) {
                        // do nothing
                    } else if (evalResult <= StarDef.One) {
                        this.star1 = 'star-filled'; //star, starhalf, star-filled
                        this.star2 = 'star';
                        this.star3 = 'star';
                    } else if (evalResult <= StarDef.OneHalf) {
                        this.star1 = 'star-filled';
                        this.star2 = 'starhalf';
                        this.star3 = 'star';
                    } else if (evalResult <= StarDef.Two) {
                        this.star1 = 'star-filled';
                        this.star2 = 'star-filled';
                        this.star3 = 'star';
                    } else if (evalResult <= StarDef.TwoHalf) {
                        this.star1 = 'star-filled';
                        this.star2 = 'star-filled';
                        this.star3 = 'starhalf';
                    } else {
                        this.star1 = 'star-filled';
                        this.star2 = 'star-filled';
                        this.star3 = 'star-filled';
                    }
                    if (evalResult > StarDef.Zero) { // one start or upper
                        // 只要录音质量可以标星，则保存到云存储，同时更新缓存map and 更新数据库
                        var filePath = this.RecordFile(this.curBook, this.chapterIndex, this.contentIndex);
                        if(wx.getStorageSync(filePath)) {
                            // 如果已经保存过录音，则暂不更新缓存和数据库，仅更新存储中的录音文件（文件名相同的）
                            wxCloud.uploadFile2WxCloud(this.Database, this.voicePath, filePath, evalResult, false);
                        } else {
                            wxCloud.uploadFile2WxCloud(this.Database, this.voicePath, filePath, evalResult, true);
                        }
                        
                        // NOTE: 播放录音完成+过关3秒后自动到下一句
                        var delay = this.innerAudioContext4record.duration;
                        if (!delay) {
                            delay = 0;
                        }
                        delay = (delay + 3) * 1000;
                        var timeoutID = setTimeout(this.goForward, delay, null);
                    }
                    //console.log(this.voiceText);
                },
                fail: result => {
                    this.voiceText = JSON.stringify(result);
                    console.log('Parse Error:' + result);
                }
            });
        },
        getChapters(bookTable) {
            // 获取章节列表
            var self = this;
            // 1. 获取数据库引用
            const db = wx.cloud.database({
                env: this.Database
            });
            // 2. 构造查询语句(NOTE:每次只能获取20条记录)
            db.collection(bookTable)
                .where({
                    //
                })
                .field({
                    //
                })
                .orderBy('chapter', 'asc')
                .get({
                    success: function(res) {
                        self.chapters = res.data;
                        //console.log(self.chapters);
                    }
                });
        },
        hanlerPaly() {
            // 播放暂停
            this.isPlay = !this.isPlay;
        },
        hanlerRecord() {
            this.resetStars();
            
            // 录音暂停
            this.isRecord = !this.isRecord;
        },
        initAudioContext() {
            // 创建音频播放对象
            this.innerAudioContext = wx.createInnerAudioContext();
            this.innerAudioContext4record = wx.createInnerAudioContext();
            
            // 音频进入可以播放状态
            this.innerAudioContext.onCanplay(res => {
                this.isPlay = false;
            });
            this.innerAudioContext4record.onCanplay(res => {
                this.isPlayRecorded = false;
            });
            
            // 音频自然播放结束事件
            this.innerAudioContext.onEnded(res => {
                // 当音频播放结束后，将滑动条滑到末尾
                this.isPlay = false;
            });
            this.innerAudioContext4record.onEnded(res => {
                // 当音频播放结束后，将滑动条滑到末尾
                this.isPlayRecorded = false;
            });
            
            // 音频播放中
            this.innerAudioContext.onTimeUpdate(res => {
                //
            });
            this.innerAudioContext4record.onTimeUpdate(res => {
                //
            });
        }
    },
    destroyed() {
        this.innerAudioContext.destroy();
        this.innerAudioContext4record.destroy();
    },
    watch: {
        isPlayRecorded(val, oldVal) {
            this.innerAudioContext4record.offCanplay();
            
            console.log("isPlayRecorded:"+ val);
            if (val) {
                // 先停止原音播放
                this.innerAudioContext.stop();
                this.isPlay = false;
                
                this.playRecordedIcon = ICONs.PlayMic_Pause;
                //this.innerAudioContext4record.src = this.voicePath;
                //var timeoutID = setTimeout(common.empty4delay, 500, null);
                console.log('this.voicePath to play:' + this.voicePath);
                this.innerAudioContext4record.play();
                
            } else {
                this.playRecordedIcon = ICONs.PlayMic_Play;
                this.innerAudioContext4record.pause();
            }
        },
        isPlay(val, oldVal) {
            this.innerAudioContext.offCanplay();
            if (val) {
                // 先停止录音播放
                this.innerAudioContext4record.stop();
                this.isPlayRecorded = false;
                
                this.playIcon = ICONs.Play_Stop;
                //this.updateAudioUrl(this.storyContent);
                this.innerAudioContext.play();
                console.log('Play Content Src:' + this.innerAudioContext.src);
            } else {
                this.playIcon = ICONs.Play_Start;
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
                this.recordIcon = ICONs.Record_Stop;
                // WARN: 提供options参数在真机模式下有问题，暂不使用。无参数即可满足百度语音识别要求!
                //recorderManager.start(options);
                recorderManager.start();
                this.isRecorded = false;
            } else {
                // 编写结束录音的逻辑
                this.recordIcon = ICONs.Record;
                recorderManager.stop();
            }
        },
        chapters(val, oldVal) {
            // NOTE: 获取到章节及内容后，进行初始化逻辑
            this.chapterIndex = 0;
            this.contentIndex = 0;
            // NOTE: 只有book num和content都获取，chapter+sentence索引更新后，才能进行reset
            this.resetStatus();

            this.curChapterName = val[this.chapterIndex].name;
            this.storyContent = val[this.chapterIndex].contents[this.contentIndex].content;
        },
        storyContent(val, oldVal) {
            // 每次原文语句更新都重新构造新的语音合成url，并赋值给播放器. 百度合成语音先保存到本地，再关联播放组件
            var tmpFile = this.FileName(this.curBook, this.chapterIndex, this.contentIndex);
            //console.log('...' + this.curBook + ';' + this.chapterIndex + ';' + this.contentIndex);
            //console.log('...' + this.CloudRoot + ';' + tmpFile);
            book.buildAudioUrl(val, this.innerAudioContext, this.CloudRoot, tmpFile);
        },
        isRecorded(val, oldVal) {
            if (val) {
                this.playRecordedIcon = ICONs.PlayMic_Play;
            } else {
                this.playRecordedIcon = ICONs.PlayMic_None;
            }
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
.button {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
}
.button1 {
    width: 30px;
    height: 30px;
    background-color: #ffffff;
}
</style>
