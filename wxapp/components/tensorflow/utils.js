const getFrameSliceOptions = function (devicePosition, frameWidth, frameHeight, displayWidth, displayHeight) {
    const systemInfo = wx.getSystemInfoSync()

    let result = {
        start: [0, 0, 0],
        size: [-1, -1, 3]
    }

    const ratio = displayHeight / displayWidth

    let direction = 'top-down' // bottom-up

    if (systemInfo.platform === 'android' && devicePosition === 'back') {
        direction = 'bottom-up'
    }

    if (direction === 'top-down') {
        if (ratio > frameHeight / frameWidth) {
            result.start = [0, Math.ceil((frameWidth - Math.ceil(frameHeight / ratio)) / 2), 0]
            result.size = [-1, Math.ceil(frameHeight / ratio), 3]
        } else {
            result.start = [Math.ceil((frameHeight - Math.floor(ratio * frameWidth)) / 2), 0, 0]
            result.size = [Math.ceil(ratio * frameWidth), -1, 3]
        }
    } else {
        if (ratio > frameHeight / frameWidth) {
            result.start = [0, Math.ceil((frameWidth - Math.ceil(frameHeight / ratio)) / 2), 0]
            result.size = [-1, Math.ceil(frameHeight / ratio), 3]
        } else {
            result.start = [Math.ceil((frameHeight - Math.floor(ratio * frameWidth)) / 2), 0, 0]
            result.size = [Math.ceil(ratio * frameWidth), -1, 3]
        }
    }

    return result
}

const fomartData = function (data) {
    let res = false;
    if (data[1].length > 0) {
        res = {}
        let pose1 = data[0].keypoints;
        let pose2 = data[1][0];
        res.face = {
            top: pose2.topLeft[0],
            right: pose2.bottomRight[1],
            bottom: pose2.bottomRight[0],
            left: pose2.topLeft[1],
            score: pose2.probability[0]
        };

        for (let i = 0; i < 5; i++) {
            const ele = pose1[i];
            if (ele.score > 0.2) {
                res[ele.part] = {
                    x: ele.position.x,
                    y: ele.position.y,
                    score: ele.score
                }
            }
            else if (ele.part == "leftEar") {
                res[ele.part] = {
                    x: pose2.landmarks[5][0],
                    y: pose2.landmarks[5][1],
                    score: 1
                }
            }
            else if (ele.part == "rightEar") {
                res[ele.part] = {
                    x: pose2.landmarks[4][0],
                    y: pose2.landmarks[4][1],
                    score: 1
                }
            }
        }
        res["mouth"] = {
            x: pose2.landmarks[3][0],
            y: pose2.landmarks[3][1],
            score: 1
        }
    }

    return res;
}

module.exports = {
    getFrameSliceOptions: getFrameSliceOptions,
    fomartData: fomartData
}