const app = getApp()

const GLASS_MODEL_URL = 'https://beatsadgame.beats-digital.com/ARmodels/glass.obj';

import { GlassBuilder } from '../../components/three/builder.js'
import { RecognizeFace } from '../../components/tensorflow/builder.js'

Page({
    glassBuilder: null,
    recognizeFace: null,
    testCtx: null,

    data: {
        waiting: false,
        pose:[]
    },

    /**
       * 监听页面初次渲染完成
       */
    onReady: function () {
        this.initGlassBuilder();
        // this.initRecognizeFace();
        // this.testCtx = wx.createCanvasContext('testcanvas');
    },

    showLoadingToast() {
        wx.showLoading({
            title: '拼命加载中...',
        })
    },

    hideLoadingToast() {
        wx.hideLoading()
    },

    /**
     * 初始化眼镜
     */
    initGlassBuilder() {
        this.glassBuilder = new GlassBuilder('#mycanvas');

        this.showLoadingToast()

        setTimeout(() => {
            if (this.glassBuilder.ready) {
                let load = this.glassBuilder.loadGlass(GLASS_MODEL_URL);
                load.then(() => {
                    this.initRecognizeFace();
                })
            }
        }, 200);
    },

    /**
     * 初始化人脸识别
     */
    initRecognizeFace() {
        const systemInfo = wx.getSystemInfoSync();
        this.recognizeFace = new RecognizeFace('front', {
            width: systemInfo.windowWidth,
            height: 500
        });

        this.recognizeFace.load()
            .then(() => {
                this.requestAnimationFrame();
                this.hideLoadingToast();
            })
            .catch(err => {
                console.log(err)
                wx.showToast({
                    title: '网络连接异常',
                    icon: 'none'
                })
            })
    },

    /**
     * 动画
     */
    requestAnimationFrame() {
        const context = wx.createCameraContext()
        const listener = context.onCameraFrame((frame) => {
            this.dealFrameData(frame)
        })
        listener.start()
    },

    /**
     * 处理图像数据
     * @param {*} frame 
     */
    dealFrameData(frame){
        if(this.recognizeFace && this.recognizeFace.isReady() && !this.recognizeFace.isRecognizing() && !this.data.waiting){
            this.data.waiting = true;
            this.recognize(frame);
            setTimeout(()=>{
                this.data.waiting = false;
            },66)
        }
    },

    /**
     * 识别
     * @param {*} frame 
     */
    recognize(frame){
        this.recognizeFace.detectSinglePose(frame)
            .then((pose) => {
                // console.log(pose)
                // this.recognizeFace.drawSinglePose(this.testCtx,pose);
                if(pose) this.glassBuilder.dealFaceData(pose);
                // if(pose) this.setPoseData(pose);
            })
            .catch((err) => {
                console.log("err:", err, err.stack);
            });
    },

    /**
     * 设置数据
     * @param {*} pose 
     */
    setPoseData(pose){
        var res = [];

        for (const key in pose) {
            if(key != "face"){
                res.push({
                    name:key,
                    x:parseInt(pose[key].x),
                    y:parseInt(pose[key].y)
                })
            }
            else{
                res.push({
                    name:key,
                    x:parseInt(pose[key].left),
                    y:parseInt(pose[key].right)
                })
            }
        }
        this.setData({
            pose:res
        })
    }
})
