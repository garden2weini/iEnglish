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
    console.log("String1:" + param1);
    console.log("String2:" + param2);

    var distance = levenshtein.get(param1, param2);
    console.log("distance:" + distance);
    var rawLength = param1.length;
    rate = Math.round(distance * 100 / rawLength);
    console.log("distanceRate:" + rate);
    return rate;
}

export default {
    evaluateRecord,
}