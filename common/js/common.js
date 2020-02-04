var levenshtein = require('fast-levenshtein');

/**
 * 判断原文本与对比文本的差异度(百分比*100). 0-100, 值越高差异越大!
 * @param {Object} str1 原文本
 * @param {Object} str2 录音识别出得文本
 */
export function evaluateRecord(str1, str2) {
    var rate = 100;
    // 去除str1/str2中字母+kongge外的其他字符
    var reg = new RegExp("[^A-z0-9 ]", "g");

    var param1 = str1.toString().replace(reg, "");
    param1 = param1.toLowerCase();
    var param2 = str2.toString().replace(reg, "");
    //console.log("String1:" + param1);
    //console.log("String2:" + param2);

    var distance = levenshtein.get(param1, param2);
    //console.log("distance:" + distance);
    var rawLength = param1.length;
    rate = Math.round(distance * 100 / rawLength);
    //console.log("distanceRate:" + rate);
    return rate;
}

/**
 * 时间秒数格式化
 * @param s 时间戳（单位：秒）
 * @returns {*} 格式化后的时分秒
 */
export function secToTime(s) {
    let t = ''
    if (s > -1) {
        let min = Math.floor(s / 60) % 60
        let sec = s % 60

        if (min < 10) {
            t = '0'
        }
        t += min + ':'
        if (sec < 10) {
            t += '0'
        }
        t += sec.toFixed(2).split('.')[0]
    }
    return t
}

export function empty4delay() {
    // do nothing!
}

export default {
    secToTime,
    evaluateRecord,
    empty4delay,
}
