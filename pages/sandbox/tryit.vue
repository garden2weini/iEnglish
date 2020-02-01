<template>
    <view>
        <uni-icon type="sound" size="30" color="grey" @click="test" />
        <uni-icon type="sound-filled" size="30" color="green" @click="test" />
        <uni-icon type="headphones" size="30" color="grey" @click="test" />
        <uni-icon type="headphones" size="30" color="green" @click="test" />
        <uni-icon type="micoff" size="30" color="grey" @click="test" />
        <uni-icon type="mic-filled" size="30" color="green" @click="test" />
        
        <uni-icon :type="playIcon.type" size="30" :color="playIcon.color" @click="hanlerPaly" />
    </view>
</template>

<script>
    import uniIcon from '../../components/uni-icons/uni-icons.vue';
    
    export default {
        components: { uniIcon },
        data() {
            return {
                playIcon: { //
                    type: 'sound',
                    color: 'grey'
                },
            }
        },
        onLoad(e) {
            console.log("File ID:" + wx.getStorageSync('recordfiles/oJWHz5AJ-GiRmDPhRkno76qc_26I-7-1-0-0.acc'));
        }
    }
</script>

<style scoped>

</style>
