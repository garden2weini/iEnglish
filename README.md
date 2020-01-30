# 给宝宝的英语自学工具

## TODO List
[] 图书的每一页加上页码；
[] 语音识别不够准确（没什么办法估计）；
[] 返回以往页时，如果已经有录音，可以播放最近的录音（前提；分用户保存）；
- 先从本地缓存find file name：uni.getStorageSync('storage_key');
- file name is null--直接录音；not null--从storage中照对应的文件
[] 录音过关（至少一星）可以下一句；
[] 

## Prepare
```
npm install font-awesome --save
//npm install --save weixin-js-sdk
npm install --save copy-webpack-plugin
npm install --save wx-server-sdk@latest
npm install --save got
npm install --save baidu-aip-sdk //百度AI依赖

sudo npm install -g npm
npm install webpack
npm install @dcloudio/uni-ui
# 编辑距离: An efficient Javascript implementation of the Levenshtein algorithm with locale-specific collator support.
npm install fast-levenshtein

brew install ffmpeg
```

## Ref
- [uni-app+云函数](https://www.cnblogs.com/xhxdd/p/12022051.html)
- [百度语音识别](https://ai.baidu.com/ai-doc/SPEECH/Vk38lxily)
- [小程序云函数调用API接口的方法](https://www.jb51.net/article/161434.htm)
- [uni-app 全局变量的几种实现方式](https://blog.csdn.net/Mrchai521/article/details/89348881)
- [百度-开发智能小程序](https://smartprogram.baidu.com/docs/develop/api/media/recorder_RecorderManager/)
- [微信登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)

### 知识点
- rpx 即响应式px，一种根据屏幕宽度自适应的动态单位。以750宽的屏幕为基准，750rpx恰好为屏幕宽度。屏幕变宽，rpx 实际显示效果会等比放大。

## FAQ
### 微信小程序配置合法域名
参考：[微信小程序配置](https://mp.weixin.qq.com/wxamp/devprofile/get_profile)
添加“request合法域名”，服务器域名请在 「小程序后台-开发-开发设置-服务器域名」 中进行配置，配置后小程序才可以访问如下资源：
- https://tsn.baidu.com
- https://vop.baidu.com

### 微信小程序开发获取AppID 和 AppSecret
1 进入https://mp.weixin.qq.com 登录
2 左侧菜单选择【开发】
3 右侧tab选择【开发设置】
4 AppSecret栏右侧点击重置
会弹出一个二维码，需要开发者扫描二维码才可以重置AppSecret。出现AppSecret后点击复制，并保存你的AppSecret。

### uni-app 引入本地iconfont的正确姿势
iconfont文件里面包含 iconfont.ttf、iconfont.css， 将 iconfont.ttf文件转位 base64。
推荐转换工具地址：https://www.giftofspeed.com/base64-encoder/

然后打开 iconfont.css文件，修改 @font-face 部分，将转换好的 base64代码粘贴到对应位置，并且设置 代码如下：
```
@font-face {  
  font-family: "iconfont";  
  src: url(data:font/truetype;charset=utf-8;base64,转换的base64内容) format('truetype');  
}  
.iconfont {  
  display: inline-block;  
}
```
最后则再项目中App.vue中引入iconfont.css文件
```
<style>  
@import "./font/iconfont.css";  
</style>
```
在任意组件中使用方法：
```
<view class="iconfont icon-XXX"></view>
```
经测试在H5及小程序中可以正常使用

备注：
iconfont文件是使用的阿里图标库： https://www.iconfont.cn