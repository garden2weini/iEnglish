<template>
    <view>
        <view class="content">
            <view class="image"><image :src="bookImage" mode="aspectFit" style="width: 200px; height: 200px;" /></view>
            <view class="story">
                <h4>#. {{ curChapterName }}</h4>
                <text>{{ storyContent }}</text>
                <image @click="hanlerPaly" :src="playImg" mode="aspectFit" style="width: 20px; height: 20px;" />
            </view>
            <view>
                <button @click="goBack"  class="mini-btn" type="primary" size="mini">{{leftArraw}}</button>
                <button @click="goForward"  class="mini-btn" type="primary" size="mini">{{rightArraw}}</button>
            </view>
        </view>
    </view>
</template>

<script>
import common from '../../common/js/common.js';
export default {
    data() {
        return {
            leftArraw: "<" ,
            rightArraw: ">",
            storyContent: 'None',
            innerAudioContext: null, // 音频对象
            isPlay: false, // 是否播放
            sliderProgress: 0, // 滑动控制条进度
            totalTime: 0, // 音频总时长
            nowTime: 0, // 音频当前播放时长
            playImg: '/static/img/start.jpg', // 播放或者暂停图片
            testParams: { cloudContent: 'hello?' },
            cloudContent: 'hello api, Default data.',
            accessToken: 'baidu api token...',
            bookImage: '/static/logo.png',
            curBook: '', // 当前图书编号，即库表名称
            chapterIndex: -1,
            contentIndex: -1,
            chapters: null, // 当前图书章节及内容，从数据库中读取json数据
            curChapterName: 'None',
        };
    },
    onLoad(e) {
        this.curBook = e.book;
        this.bookImage = '/static/img/' + e.book + '.jpg';
        this.getChapters(this.curBook);
    },
    methods: {
        goBack() {
            this.isPlay = false
            let chapterLen = this.chapters.length
            let curContents = this.chapters[this.chapterIndex]
            let contentLen = this.chapters[this.chapterIndex].contents.length
            
            if(this.contentIndex === 0) {
                if(this.chapterIndex === 0) {
                    return
                } else {
                    this.chapterIndex--
                    this.contentIndex = 0
                }
            } else {
                this.contentIndex--
            }
            this.curChapterName = this.chapters[this.chapterIndex].name
            this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content
        },
        goForward() {
            this.isPlay = false
            let chapterLen = this.chapters.length
            let curContents = this.chapters[this.chapterIndex]
            let contentLen = this.chapters[this.chapterIndex].contents.length
            
            if(this.contentIndex === contentLen - 1) {
                if(this.chapterIndex === chapterLen - 1) {
                    return
                } else {
                    this.chapterIndex++
                    this.contentIndex = 0
                }
            } else {
                this.contentIndex++
            }
            console.log("ChapterLen:"+chapterLen + ",ContentLen:"+ contentLen)
            console.log("ChapterIdx:"+this.chapterIndex + ",ContentIdx:"+ this.contentIndex)
            this.curChapterName = this.chapters[this.chapterIndex].name
            this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content
        },
        getChapters(bookTable) { // 获取章节列表
            var self = this
            // 1. 获取数据库引用
            const db = wx.cloud.database({
                env: 'weini-home-b5ggv'
            });
            // 2. 构造查询语句(NOTE:每次只能获取20条记录)
            // collection 方法获取一个集合的引用
            // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
            // get 方法会触发网络请求，往数据库取数据
            console.log("TableName:" + bookTable)
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
                        self.chapters = res.data
                        console.log(self.chapters)
                    },
                    
                });
        },
        hanlerPaly() {
            // 播放暂停
            this.isPlay = !this.isPlay;
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
                spd: 5,
                pit: 5,
                vol: 15,
                per: 1 // 基础音库, 选择男声／女生
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
    mounted() {
        
    },
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
        chapters(val, oldVal) {
            // NOTE: 获取到章节及内容后，进行初始化逻辑
            //console.log(val);
            this.chapterIndex = 0
            this.contentIndex = 0
            this.curChapterName = val[this.chapterIndex].name
            this.storyContent = val[this.chapterIndex].contents[this.contentIndex].content
            this.updateAudioUrl(this.storyContent, this.accessToken);
        },
        storyContent(val, oldVal) {
            console.log("CurrentContent:" + val);
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
    align-items: center;
    background-color: white;
    width: 100vw;
    height: 100vh;
    margin-top: 10px;
}
.image {
    background-color: white;
    border: 1upx solid #ffffff;
}
.story {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 1px;
    
}
</style>
