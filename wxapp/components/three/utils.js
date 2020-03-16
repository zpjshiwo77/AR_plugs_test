const imath = require('../../utils/util.js');

var GlassMath = {
    scale:{
        x: 1,
        y: 1,
        z: 1
    },

    position: {
        x: 0,
        y: 0,
        z: 0
    },

    rotation: {
        x: 0,
        y: 0,
        z: 0
    },

    standFacePos: {
        'nose':{
            x:187,
            y:270               
        },
        'leftEye':{
            x:280,
            y:165               
        },
        'rightEye':{
            x:95,
            y:165
        },
        'leftEar':{
            x:365,
            y:215               
        },
        'rightEar':{
            x:10,
            y:215
        },
        "width": 340,
        "dis": 50
    },

    /**
     * 计算脸的缩放值
     * @param {*} x1 
     * @param {*} x2 
     */
    countFaceScale(x1,x2){
        let scale = (x2 - x1) * 0.00223 + 0.02892;
        this.scale.x = scale;
        this.scale.y = scale;
    },

    /**
     * 计算脸的位置
     * @param {*} pos 
     */
    countFacePostion(pos){
        this.position.x = (pos.x - this.standFacePos.nose.x) * 0.0055 + 0.02;
        this.position.y = (this.standFacePos.nose.y - pos.y) * 0.0047 - 0.015;
    },
    
    /**
     * 计算侧脸的旋转角度
     * @param {*} data 
     */
    countSideFaceRotation(data){
        let leftEye = data.leftEye;
        let rightEye = data.rightEye;
        let nose = data.nose
        let dist = (leftEye.x - nose.x) - (nose.x - rightEye.x);
        let dergee = (1.279 - dist) / 3.577;
        let radian = imath.toRadian(dergee);
        this.rotation.y = radian;
    },

    /**
     * 计算正脸的倾斜角度
     * @param {*} left 
     * @param {*} right 
     */
    countForntFaceRotation(left,right){
        let x = right.x - left.x;
        let y = right.y - left.y;
        let radian = -Math.asin(y / x);
        this.rotation.z = radian;
    },

    /**
     * 计算抬头低头的旋转角度
     * @param {*} eye 
     * @param {*} nose 
     */
    countFaceUpDownRotation(eye,ear){
        let dis = ear.y - eye.y;
        let radian = (this.standFacePos.dis - dis) * this.scale.x * 0.0058 - 0.0233;
        this.rotation.x = radian;
    }
};

module.exports = GlassMath;