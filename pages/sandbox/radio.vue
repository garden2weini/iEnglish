<template>
    <view>
        <div class="audio">
            <div class="slider">
                <div class="time">
                    <span class="running-time">nowTime:{{ nowTime }}</span>
                    <br />
                    <span class="total-time">totalTime:{{ totalTime }}</span>
                </div>
                <slider block-size="14" block-color="#ffad36" backgroundColor="#d8d8d8" activeColor="#ffad36" @change="sliderChange" step="1" :value="sliderProgress" />
            </div>
            <div class="operation">
                <button class="jump-back" @click="hanlerJump(-15)">back</button>
                <button class="upper">upper</button>
                <image class="play" @click="hanlerPaly" :src="playImg" mode="aspectFit" style="width: 20px; height: 20px;" />
                <button class="next">next</button>
                <button class="jump-pre" @click="hanlerJump(15)">pre</button>
            </div>
        </div>
    </view>
</template>

<script>
import common from '../../common/js/common.js';
export default {
    data() {
        return {
            innerAudioContext: null, // 音频对象
            isPlay: false, // 是否播放
            sliderProgress: 0, // 滑动控制条进度
            totalTime: 0, // 音频总时长
            nowTime: 0, // 音频当前播放时长
            playImg: '/static/img/start.jpg' // 播放或者暂停图片
        };
    },
    created() {
        // 创建音频播放对象
        this.innerAudioContext = wx.createInnerAudioContext();
        // 设置音频播放来源
        
        var param = {
            tex: 'Hello, Merlin',
            tok: '24.937212cc4a4ed7d5989c8102a6d63183.2592000.1581553689.282335-18261040',
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
        console.log(fullUrl)
        
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
    destroyed() {
        this.innerAudioContext.destroy();
    },
    methods: {
        // 播放暂停
        hanlerPaly() {
            this.isPlay = !this.isPlay;
        },
        // 快进快退
        hanlerJump(num) {
            this.innerAudioContext.seek(this.innerAudioContext.currentTime + num);
        },
        // 滑动条拖动
        sliderChange(e) {
            let duration = this.innerAudioContext.duration;
            let currentTime = (duration * e.target.value) / 100;
            // 音频快进
            this.innerAudioContext.seek(currentTime);
            // 设置滑动条位置
            this.sliderProgress = ((currentTime * 1000000) / (duration * 1000000)) * 100;
            this.isPlay = true;
        }
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

<style></style>
