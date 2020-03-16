var fetchWechat = require('fetch-wechat')
var tf = require('@tensorflow/tfjs-core')
var plugin = requirePlugin('tfjsPlugin')

//app.js
App({
    onLaunch: function () {
        this.tensorflowInit();
    },

    /**
     * 图像识别初始化
     */
    tensorflowInit() {
        plugin.configPlugin({
            fetchFunc: fetchWechat.fetchFunc(),
            tf,
            canvas: wx.createOffscreenCanvas()
        })
    },

    globalData: {
        userInfo: null
    }
})