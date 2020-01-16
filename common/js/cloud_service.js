// 云服务接口(如微信云函数,后台函数等)

// TODO: 尝试引用方式传值
function testCloud(params) {
    // 测试调用云函数
    wx.cloud.init(); //调用前需先调用init
    wx.cloud
        .callFunction({
            name: 'hello',
            data: {
                //content: '...'
            }
        })
        .then(res => {
            //console.log(res.result)
            if (res.result.code == 300) {
                uni.showModal({
                    title: '温馨提示',
                    content: '不支持进行下一步操作'
                });
                params.cloudContent = 'Ops!';
            } else {
                params.cloudContent = res.result.msg;
                console.log(params.cloudContent);
            }
        });
    
}

export default {
  //getBaiduToken,
  testCloud,
}