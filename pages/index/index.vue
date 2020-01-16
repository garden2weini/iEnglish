<template>
    <view>
        <view class="title">Good English 7</view>
        <view>
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-1.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy1('7-2')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-3.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-4.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-5.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-6.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-7.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-8.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-9.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-10.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-11.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-12.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-12.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-13.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-14.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-15.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-16.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-17.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-18.jpg" mode="aspectFit" />
        </view>
        <!--
        <view class="title">Good English 8</view>
        <view>
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
        </view>
        <view class="title">Good English 9</view>
        <view>
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
        </view>
        <view class="title">Good English 10</view>
        <view>
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
            <image class="story_column" @click="gotoStroy('goodenglish7', 'NoisyNeighbours')" src="../../static/img/7-2.jpg" mode="aspectFit" />
        </view>
        -->
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    onLoad() {},
    methods: {
        gotoStroy(colName, bookName) {
            uni.redirectTo({
                url: '../' + colName + '/' + bookName + "?"
            });
        },
        gotoStroy1(book) {
            uni.redirectTo({
                url: '../index/Book?book=' + book
            });
        }
    },
    mounted() {}
};
</script>

<style>
.story_column {
    width: 80px;
    height: 100px;
    margin-right: 2px;
    margin-left: 2px;
}
.title {
    font-size: 30rpx;
    color: #8f8f94;
}
</style>
