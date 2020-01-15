/**
 * 时间秒数格式化
 * @param s 时间戳（单位：秒）
 * @returns {*} 格式化后的时分秒
 */
export function secToTime (s) {
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

export default {
  secToTime,
}