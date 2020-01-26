# 给宝宝的英语自学工具

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

## 微信小程序配置
参考：[微信小程序配置](https://mp.weixin.qq.com/wxamp/devprofile/get_profile)
添加“request合法域名”，服务器域名请在 「小程序后台-开发-开发设置-服务器域名」 中进行配置，配置后小程序才可以访问如下资源：
- https://tsn.baidu.com
- https://vop.baidu.com
注：

## Ref
- [uni-app+云函数](https://www.cnblogs.com/xhxdd/p/12022051.html)
- [百度语音识别](https://ai.baidu.com/ai-doc/SPEECH/Vk38lxily)
- [小程序云函数调用API接口的方法](https://www.jb51.net/article/161434.htm)
- [uni-app 全局变量的几种实现方式](https://blog.csdn.net/Mrchai521/article/details/89348881)
- [百度-开发智能小程序](https://smartprogram.baidu.com/docs/develop/api/media/recorder_RecorderManager/)