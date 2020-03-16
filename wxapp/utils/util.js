const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const toRadian = function (degree) { //角度转弧度
    return degree * Math.PI / 180;
}

const toDegree = function (radian) { //弧度转角度
    return radian / Math.PI * 180;
}

module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    toRadian: toRadian,
    toDegree: toDegree
}
