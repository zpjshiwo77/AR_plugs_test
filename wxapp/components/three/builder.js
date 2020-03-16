const GlassMath = require('utils.js');

import * as THREE from '/three.js';
import OBJLoader from '/OBJloader.js';

export class GlassBuilder {
    //画布
    canvas

    //场景
    scene

    //相机
    camera

    //渲染器
    renderer

    //眼镜模型
    glass

    //眼镜模型的mesh
    glassMesh

    //是否准备好了
    ready

    constructor(canvasId) {
        this.senceInit(canvasId);
        this.ready = false
    }

    /**
     * 场景初始化
     */
    senceInit(canvasId) {
        wx.createSelectorQuery()
            .select(canvasId)
            .node()
            .exec((res) => {
                this.canvas = THREE.global.registerCanvas(res[0].node);

                this.camera = new THREE.PerspectiveCamera(10, this.canvas.width / this.canvas.height, 1, 1000);
                this.camera.position.z = 13;

                // this.camera = new THREE.OrthographicCamera(this.canvas.width / -2, this.canvas.width / 2, this.canvas.height / -2, this.canvas.height / 2, 1, 1000);
                // this.camera.position.z = 500;

                // this.camera = new THREE.CubeCamera(1, 1000,100);
                // this.camera.position.z = 2;

                this.scene = new THREE.Scene();
                this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

                this.render();

                this.ready = true;

                // this.creatCube();
            })
    }

    /**
     * 加载眼镜模型
     * @param {*} glassModelUrl 
     */
    loadGlass(glassModelUrl) {
        return new Promise((resolve, reject) => {
            let loader = new OBJLoader();
            loader.load(glassModelUrl, (obj) => {
                this.glass = obj

                obj.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        this.glassMesh = child;
                        this.glassMesh.position.x = 10
                        // this.glassMesh.scale.y = 0.5
                    }
                });

                this.scene.add(obj);

                resolve();
            });
        })
    }

    /**
     * 渲染页面
     */
    render() {
        this.canvas.requestAnimationFrame(() => {
            this.render();
        });
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 创建一个测试的立方体
     */
    creatCube() {
        //创建Cube几何体
        var cubeGeo = new THREE.CubeGeometry(1, 1, 1);
        //创建材质，设置材质为基本材质（不会反射光线，设置材质颜色为绿色）
        var mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        //创建Cube的Mesh对象
        var cube = new THREE.Mesh(cubeGeo, mat);
        //设置Cube对象的位置
        cube.position.set(0, 0, 0);
        cube.rotation.set(0.3, 0.3, 0);
        //将Cube加入到场景中
        this.scene.add(cube);
    }

    /**
     * 处理人脸的数据
     * @param {*} pose 
     */
    dealFaceData(pose) {
        this.setGlassMeshPosition(pose.nose);
        this.setSideFaceRotation(pose);
        this.setFontFaceRotation(pose.leftEye, pose.rightEye);
        this.setFaceUpDownRotation(pose);
        this.setGlassMeshScale(pose.face.left,pose.face.right);
    }

    /**
     * 设置抬头低头的旋转角度
     * @param {*} eye 
     * @param {*} nose 
     */
    setFaceUpDownRotation(data) {
        GlassMath.countFaceUpDownRotation(data.leftEye, data.leftEar);
        this.glassMesh.rotation.x = GlassMath.rotation.x;
    }

    /**
     * 设置正脸的倾斜角度
     * @param {*} left 
     * @param {*} right 
     */
    setFontFaceRotation(left, right) {
        GlassMath.countForntFaceRotation(left, right);
        this.glassMesh.rotation.z = GlassMath.rotation.z;
    }

    /**
     * 设置眼镜的缩放值
     * @param {*} c1 
     * @param {*} c2 
     */
    setGlassMeshScale(c1, c2) {
        GlassMath.countFaceScale(c1, c2);
        this.glassMesh.scale.x = GlassMath.scale.x
        this.glassMesh.scale.y = GlassMath.scale.y

    }

    /**
     * 设置眼镜的位置
     * @param {*} pos 
     */
    setGlassMeshPosition(pos) {
        GlassMath.countFacePostion(pos);

        this.glassMesh.position.x = GlassMath.position.x
        this.glassMesh.position.y = GlassMath.position.y
    }

    /**
     * 设置侧脸时眼镜的位置
     */
    setSideFaceRotation(data) {
        GlassMath.countSideFaceRotation(data);
        this.glassMesh.rotation.y = GlassMath.rotation.y;
    }


}