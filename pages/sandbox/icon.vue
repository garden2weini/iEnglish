<template>
    <!-- 1. 学习uni-icon vue -->
    <!-- 2. 学习iconfont及ttf使用 -->
    <view>
        <view>
            <span class="iconfont">&#xe669;</span>
            
        </view>
        <view>
            <uni-icon type="forward" size="30" color="red" @click="test"></uni-icon>
            <uni-icon type="back" size="30" color="black" @click="test"></uni-icon>
            <uni-icon type="starhalf" size="30" color="blue" @click="test"></uni-icon>
            <uni-icon type="star" size="30" color="blue" @click="test"></uni-icon>
            <uni-icon type="star-filled" size="30" color="gold" @click="test"></uni-icon>
            <uni-icon :type="playIcon.type" size="30" :color="playIcon.color" @click="hanlerPaly" />
            <uni-icon type="sound" size="30" color="grey" @click="test" />
            <uni-icon type="sound-filled" size="30" color="black" @click="test" />
            <uni-icon type="headphones" size="30" color="grey" @click="test" />
            <uni-icon type="headphones" size="30" color="black" @click="test" />
            <uni-icon type="mic" size="30" color="grey" @click="test" />
            <uni-icon type="mic-filled" size="30" color="black" @click="test" />
        </view>
        <view>
            <uni-icon type="" class="iconfont icon-search"></uni-icon>
        </view>
    </view>
</template>

<script>
    // REF: https://uniapp.dcloud.io/extendUI?id=icon-%e5%9b%be%e6%a0%87
    import uniIcon from "@/components/uni-icons/uni-icons.vue"
    
    export default {
        components: {
            uniIcon
        },
        data() {
            return {
                playIcon: { //
                    type: 'sound',
                    color: 'grey'
                },
            }
        },
        methods: {
            test() {
                console.log("uni-icon ok!");
            },
        }
    }
</script>

<style scoped>
    
    @font-face {
        font-family: 'iconfont_new';
        src: url('~@/static/fonts/iconfont.ttf') format('truetype');
    }
    .iconfont {
      font-family: "iconfont_new" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
</style>
