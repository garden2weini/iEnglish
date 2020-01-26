
var levenshtein = require('fast-levenshtein');

/**
 * 判断原文本与对比文本的差异度(百分比*100). 0-100, 值越高差异越大!
 * @param {Object} str1 原文本
 * @param {Object} str2 录音识别出得文本
 */
export function evaluateRecord(str1, str2) {
    var rate = 100;
    // 去除str1/str2中字母外的其他字符
    var reg = new RegExp("[^A-z]", "g");
    
    var param1 = str1.toString().replace(reg, "");
    var param2 = str2.toString().replace(reg, "");
    console.log("String1:" + param1);
    console.log("String2:" + param2);
    
    // var distance = levenshtein.get('我愛你', '我叫你');
    var distance = levenshtein.get(param1, param2);
    var rawLength = param1.length;
    rate = Math.round(distance*100/rawLength);
    return rate;
}

export default {
    evaluateRecord,
}
/**
 * 比较两个字符串差异度. 比较str1与str2差异度，就是将str1修改为str2最少需要修改的字符个数。
 * 编辑距离:一个字符串变为另一个最少需要的步骤 (操作方面：1.修改一个字符;2.增加一个字符;3.删除一个字符)
 * @param {Object} str1
 * @param {Object} str2
 */
function Levenshtein(str1, str2) {
    var len1 = str1.length;
    var len2 = str2.length;
    var dif = [];
    for (var a = 0; a <= len1; a++) {
        dif[a] = [];
        dif[a][0] = a;
    }
    for (a = 0; a <= len2; a++) {
        dif[0][a] = a;
    }
    var temp;
    for (var i = 1; i <= len1; i++) {
        for (var j = 1; j <= len2; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                temp = 0;
            } else {
                temp = 1;
            }
            //取三个值中最小的 
            dif[i][j] = min([dif[i - 1][j - 1] + temp, dif[i][j - 1] + 1, dif[i - 1][j] + 1]);
        }
    }
    return dif[len1][len2]; //差异步骤
}

/**
 * 获取N个数中最小的 
 * @param {Object} ints N个数
 */
function min(ints) {
    var min = 10000;
    for (var i = 0; i < ints.length; i++) {
        if (min > ints[i]) {
            min = ints[i];
        }
    }
    return min;
}
