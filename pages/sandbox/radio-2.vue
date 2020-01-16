<template>
    <view class="content">
        <image class="logo" src="/static/logo.png"></image>
        <view class="text-area">
            <text class="title">{{ title }}</text>
        </view>
        <view>
            <input type="text" id="text" value="Hello World" style="width: 500px;align-content: center;" />
            <button onclick="tts()">合成</button>
            <button onclick="play()" id="playBtn">准备中</button>
            <button onclick="pause()">暂停</button>
            <button onclick="cancel()">取消</button>
           
        </view>
    </view>
</template>

<script>
import baidu_tts from '../../common/js/baidu_tts_cors.js';
export default {
    data() {
        return {
            title: 'i乐园',
            audio: null,
            playBtn: null,
        };
    },
    onLoad() {},
    methods: {
        // 合成按钮
        tts: function () {
                let text = document.getElementById('text').value;
                this.playBtn.innerText = '准备中';
        
                // 调用语音合成接口
                // 参数含义请参考 https://ai.baidu.com/docs#/TTS-API/41ac79a6
                this.audio = baidu_tts.btts({
                    tex: text,
                    tok: '24.2c992568b8812338c0b8b3db13d11ffd.2592000.1581492362.282335-18261040',
                    spd: 5,
                    pit: 5,
                    vol: 15,
                    per: 1 // 基础音库, 选择男声／女生
                }, {
                    volume: 0.3,
                    autoDestory: true,
                    timeout: 10000,
                    hidden: false,
                    onInit: function (htmlAudioElement) {
        
                    },
                    onSuccess: function(htmlAudioElement) {
                        this.audio = htmlAudioElement;
                        this.playBtn.innerText = '播放';
                    },
                    onError: function(text) {
                        alert(text)
                    },
                    onTimeout: function () {
                        alert('timeout')
                    }
                });
            },
            play: function () {
                // 播放按钮
                if (this.audio === null) {
                    alert('请先点击合成')
                } else {
                    this.audio.play();
                }
            },
            pause: function () {
                // 暂停按钮
                if (this.audio === null) {
                    alert('请先点击合成')
                } else {
                    this.audio.pause();
                }
            },
            cancel: function () {
                // 取消按钮
                if (this.audio === null) {
                    alert('请先点击合成')
                } else {
                    this.audio.pause();
                    document.body.removeChild(audio);
                    this.audio = null;
                    this.playBtn.innerText = '准备中';
                }
            }
    },
    mounted() {
        this.playBtn = document.getElementById('playBtn');
        var doc = document;
        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', function() {
                callback();
            }, false);
        } else if (doc.attachEvent) {
            doc.attachEvent('onreadystatechange', function() {
                if (doc.readyState === 'complete') {
                    callback();
                }
            });
        }
    }
};
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}
</style>
