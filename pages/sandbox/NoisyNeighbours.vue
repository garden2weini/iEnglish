<template>
    <view>
        <view class="content">
            <view class="image"><image src="/static/img/7-2.jpg" mode="aspectFit" style="width: 200px; height: 200px;" /></view>
            <view>{{testParams.cloudContent}}</view>
            <view class="story">
                <text>{{ storyContent }}</text>
                <image @click="hanlerPaly" :src="playImg" mode="aspectFit" style="width: 20px; height: 20px;" />
            </view>
        </view>
    </view>
</template>

<script>
import common from '../../common/js/common.js';
import service from '../../common/js/cloud_service.js';
export default {
    data() {
        return {
            storyContent: 'In a grim, grey house in a grim, grey town lived an unhappy man.',
            innerAudioContext: null, // 音频对象
            isPlay: false, // 是否播放
            sliderProgress: 0, // 滑动控制条进度
            totalTime: 0, // 音频总时长
            nowTime: 0, // 音频当前播放时长
            playImg: '/static/img/start.jpg', // 播放或者暂停图片
            testParams: {cloudContent:'hello?'},
            cloudContent: 'hello api, Default data.',
            accessToken: 'baidu api token...'
        };
    },
    methods: {
        // 播放暂停
        hanlerPaly() {
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
                    console.log(res.result);
                    if (res.result.code == 300) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '获取语音失败！'
                        });
                        //return
                        this.accessToken = 'Ops!';
                    } else {
                        this.accessToken = res.result.token;
                        this.buildAudioUrl(this.storyContent, this.accessToken);
                    }
                });
        },
        testCloud() {
            // 测试调用云函数
            wx.cloud.init(); //调用前需先调用init
            wx.cloud
                .callFunction({
                    name: 'hello',
                    data: {
                        content: '...'
                    }
                })
                .then(res => {
                    //console.log(res.result)
                    if (res.result.code == 300) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '不支持进行下一步操作'
                        });
                        //return
                        this.cloudContent = 'Ops!';
                    } else {
                        this.cloudContent = res.result.msg;
                    }
                });
        },
        buildAudioUrl(storyContent, accessToken) {
            // 创建音频播放对象
            this.innerAudioContext = wx.createInnerAudioContext();
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
        }
    },
    created() {
        this.testCloud();
        service.testCloud(testParams);
        this.getBaiduToken();
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
