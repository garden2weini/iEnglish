<template>
    <!-- WX: Get UserInfo. -->
    <!-- https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01 -->
    <!-- https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html -->
    <view>
        <open-data type="userGender" lang="zh_CN"></open-data>
        <br />
        <open-data type="userNickName"></open-data>
        <br />
        <open-data type="userCountry"></open-data>
        <br />
        <open-data type="userProvince"></open-data>
        <br />
        <open-data type="userCity"></open-data>
        <br />
        <open-data type="userAvatarUrl"></open-data>
        <br />
        <!-- 需要使用 button 来授权登录 -->
        <button v-if="canIUse" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo">授权登录</button>
        <text v-else>请升级微信版本</text>
        
    </view>
</template>

<script>
    export default {
        data() {
            return {
                canIUse: wx.canIUse('button.open-type.getUserInfo'),
            }
        },
        onLoad(e) {
            console.log("button.open-type.getUserInfo:" + this.canIUse);
            // 查看是否授权
            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: function(res) {
                                console.log(res.userInfo);
                            }
                        });
                    }
                }
            });
        },
        methods:{
            getuserinfo: function(e) {
                console.log(e.detail.errMsg);
                console.log(e.detail.userInfo);
                console.log(e.detail.rawData);
            },
        }
    }

</script>

<style scoped>
.button-hover {
    background-color: red;
}
/** 添加自定义button点击态样式类**/
.other-button-hover {
    background-color: blue;
}
button {
    margin: 10px;
}
</style>
