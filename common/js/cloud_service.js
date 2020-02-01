// WX云服务接口(如微信云函数/云数据库/云存储,后台函数等)

/**
 * 当前WX用户的所有录音记录<RecordFilePath, FileID>, 从数据库中获取
 * RecordFilePath: 相对文件路径+文件名，通过Vue.prototype.RecordFile获取
 * FileID: WX Cloud file path.
 */
function userRecordFileMap(database) {
    if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
        wx.cloud.init({
            traceUser: true,
        })
    }

    // 1. 获取数据库引用
    const db = wx.cloud.database({
        env: database,
    });
    //console.log("Get File Map for openid");
    var openid = wx.getStorageSync('OPENID');
    //console.log("Get File Map for " + openid);
    // 2. 构造查询语句(NOTE:每次只能获取20条记录)
    db.collection('UserRecordFile')
        .where({
            openid: openid,
        })
        .get({
            success: function(res) {
                //console.log("Files:" + JSON.stringify(res.data[0]));
                if (res.data[0].files) {
                    var files = res.data[0].files;
                    //console.log("Files:" + JSON.stringify(files));
                    for (var i = 0; i < files.length; i++) {
                        try {
                            var filemap = files[i];
                            console.log('FileID:' + filemap.FileID);
                            console.log('RecordFilePath:' + filemap.RecordFilePath);
                            wx.setStorageSync(filemap.RecordFilePath, filemap.FileID);
                        } catch (e) {
                            console.log(JSON.stringify(e));
                        }
                    }
                }

            },
            fail: function(res) {
                console.log('Files:' + JSON.stringify(res));
            }
        });
}

/**
 * 将小程序临时文件上传至云端存储
 */
function uploadFile2WxCloud(source, dist) {
    var fileId = '';
    wx.cloud.uploadFile({
        cloudPath: dist, //'example.png', // 上传至云端的路径
        filePath: source, //'', // 小程序临时文件路径
        success: res => {
            // 返回文件 ID
            console.log(res.fileID);
            fileId = res.fileID;
        },
        fail: console.error
    })
    return fileId;
}

function getWxOpenId(_code) {
    wx.cloud.init(); //调用前需先调用init
    wx.cloud
        .callFunction({
            name: 'getOpenID',
            data: {
                code: _code
            }
        })
        .then(res => {
           wx.setStorageSync('OPENID', res.result.OPENID);
        }).catch(console.error);
}

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
    uploadFile2WxCloud,
    userRecordFileMap,
    getWxOpenId,
    testCloud,
}
