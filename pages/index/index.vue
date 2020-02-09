<template>
    <view>
        <view class="title">Good English 7</view>
        <view>
            <image class="story_column" @click="gotoStroyX('7-1')" src="../../static/img/book/7-1.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-2')" src="../../static/img/book/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-3')" src="../../static/img/book/7-3.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-4')" src="../../static/img/book/7-4.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-5')" src="../../static/img/book/7-5.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-6')" src="../../static/img/book/7-6.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-7')" src="../../static/img/book/7-7.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-8')" src="../../static/img/book/7-8.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-9')" src="../../static/img/book/7-9.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-10')" src="../../static/img/book/7-10.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-11')" src="../../static/img/book/7-11.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-12')" src="../../static/img/book/7-12.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-13')" src="../../static/img/book/7-13.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-14')" src="../../static/img/book/7-14.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-15')" src="../../static/img/book/7-15.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-16')" src="../../static/img/book/7-16.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-17')" src="../../static/img/book/7-17.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroyX('7-18')" src="../../static/img/book/7-18.jpg" mode="aspectFit" />
        </view>
        <view class="title">SandBox</view>
        <view>
            <!--
            <image class="story_column" @click="test()" src="../../static/logo.png" mode="aspectFit" />
            -->
            <image class="story_column" @click="startup()" src="../../static/logo.png" mode="aspectFit" />
            
        </view>
        <!--
        <view class="title">Good English 8</view>
        <view>
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
        </view>
        <view class="title">Good English 9</view>
        <view>
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
        </view>
        -->
    </view>
</template>

<script>
    // 获取App录音功能
    uni.authorize({
        scope: 'scope.record',
        success() {
            uni.getRecorderManager();
        }
    })
    
export default {
    data() {
        return {
            //
        };
    },
    onLoad() {},
    methods: {
        gotoStroy(book) {
            uni.redirectTo({
                url: '../index/BookX?book=' + book
            });
        },
        gotoStroyX(book) { // Just Test
            uni.redirectTo({
                //url: '../sandbox/text'
                url: '../index/Book?book=' + book
            });
        },
        test() { // Just Test
            uni.redirectTo({
                //url: '../sandbox/record'
                url: '../sandbox/tryit'
            });
        },
        startup() { // Just Test
            uni.redirectTo({
                url: '../sandbox/startup'
            });
        }
    },
    mounted() {}
};
</script>

<style>
.story_column {
    width: 186rpx;
    height: 100px;
    margin-right: 0rpx;
}
.title {
    font-size: 30rpx;
    color: #8f8f94;
}
</style>
