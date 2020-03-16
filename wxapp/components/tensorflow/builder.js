import * as tf from '@tensorflow/tfjs-core'

import * as posenet from '@tensorflow-models/posenet'
import * as blazeface from '@tensorflow-models/blazeface'

const utils = require('utils.js');
const POSENET_URL = 'https://beatsadgame.beats-digital.com/ARmodels/posenet/model.json'

export class RecognizeFace {
    //相机前置或后置
    cameraPosition
    //图像显示尺寸结构体 { width: Number, height: Number }
    displaySize
    //模型
    poseNet
    blazeFace
    //ready
    resdy
    //识别中
    recognizing
    //上一次的识别数据
    lastPose

    constructor(cameraPosition, displaySize) {
        this.cameraPosition = cameraPosition

        this.displaySize = {
            width: displaySize.width,
            height: displaySize.height
        }

        this.ready = false
        this.recognizing = false
    }

    /**
     * 加载识别模型
     */
    load() {
        return new Promise((resolve, reject) => {
            let load1 = posenet
                .load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    inputResolution: 193,
                    multiplier: 0.5,
                    modelUrl: POSENET_URL
                });
            let load2 = blazeface.load();
            Promise.all([load1, load2])
                .then((res) => {
                    this.poseNet = res[0]
                    this.blazeFace = res[1]
                    this.ready = true
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /**
     * 处理序列帧图像
     * @param {*} frame 
     */
    detectSinglePose(frame) {
        this.recognizing = true;
        return new Promise((resolve, reject) => {
            const video = tf.tidy(() => {
                const temp = tf.tensor(new Uint8Array(frame.data), [frame.height, frame.width, 4])
                const sliceOptions = utils.getFrameSliceOptions(this.cameraPosition, frame.width, frame.height, this.displaySize.width, this.displaySize.height)

                return temp.slice(sliceOptions.start, sliceOptions.size).resizeBilinear([this.displaySize.height, this.displaySize.width])
            })

            // since images are being fed from a webcam
            const flipHorizontal = false
            let deal1 = this.poseNet.estimateSinglePose(video, { flipHorizontal })
            let deal2 = this.blazeFace.estimateFaces(video, flipHorizontal)
            Promise.all([deal1, deal2]).then(res => {
                video.dispose()
                this.recognizing = false
                let pose = utils.fomartData(res)
                pose = this.optimizeData(pose);
                resolve(pose)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 优化数据
     */
    optimizeData(pose) {
        if (this.lastPose && pose) {
            const offset = 15;
            for (const key in this.lastPose) {
                if (this.lastPose.hasOwnProperty(key)) {
                    for (const i in this.lastPose[key]) {
                        if (i != "score") {
                            pose[key][i] = Math.abs(pose[key][i] - this.lastPose[key][i]) < offset ? this.lastPose[key][i] : pose[key][i];
                        }
                    }
                }
            }
        }
        if(pose) this.lastPose = pose;

        return pose;
    }

    /**
     * 通过位置信息画点
     * @param {*} ctx 
     * @param {*} pose 
     */
    drawSinglePose(ctx, pose) {
        if (!ctx && !pose) {
            return
        }

        ctx.setFillStyle('rgba(255,255,0,0.3)');
        ctx.fillRect(pose.face.top, pose.face.left, pose.face.bottom - pose.face.top, pose.face.right - pose.face.left)

        for (let i in pose) {
            if (i != "face") {
                const ele = pose[i];
                ctx.beginPath()
                ctx.arc(ele.x, ele.y, 5, 0, 2 * Math.PI)
                ctx.setFillStyle('blue')
                ctx.fill()
            }
        }

        ctx.draw()
    }

    /**
     * 是否在识别中
     */
    isRecognizing() {
        return this.recognizing
    }

    /**
     * 模型是否加载完毕
     */
    isReady() {
        return this.ready
    }

    /**
     * 消除对象
     */
    dispose() {
        this.poseNet.dispose()
    }
}