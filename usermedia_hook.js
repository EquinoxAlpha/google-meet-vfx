var realGetUserMedia = navigator.mediaDevices.getUserMedia
var ctx = undefined
var video = undefined
var ran = false

const camera_width = 640
const camera_height = 480

function drawLoop() {
    var freeze = document.getElementById("freeze").checked
    var inverted = document.getElementById("invert").checked

    var overlayText = document.getElementById("overlayText").value
    var selectedFont = document.getElementById("selectedFont").value || "30px monospace"
    var selectedStyle = document.getElementById("selectedStyle").value || "white"
    var invertImage = true // TODO: add checkbox

    if (video && freeze && !video.paused) {
        video.pause()
    } else if (video && (!freeze && video.paused)) {
        video.play()
    }

    if (video) {
        if (invertImage) {
            ctx.translate(camera_width,0);
            ctx.scale(-1,1);
        }
        ctx.drawImage(video, 0, 0, camera_width, camera_height);
        if (invertImage) {
            ctx.translate(camera_width,0);
            ctx.scale(-1,1);
        }

        if (inverted) {
            ctx.globalCompositeOperation = 'difference';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, camera_width, camera_height);
            ctx.globalCompositeOperation = 'source-over';
        }

        try {
            ctx.font = selectedFont
            ctx.fillStyle = selectedStyle
        } catch (e) {
            ctx.font = "30px monospace"
            ctx.fillStyle = "white"
        }
        drawText(ctx, overlayText, 320, 120)

    }
    window.requestAnimationFrame(drawLoop)
}

window.navigator.mediaDevices.getUserMedia = async function (constraints) {
    if (constraints.video.deviceId) {
        onUserMedia()
        var canvas = document.createElement("canvas")
        canvas.setAttribute("id", "sourceCanvas");
        canvas.setAttribute("style", "display:none;");
        canvas.width = camera_width
        canvas.height = camera_height
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d")
        ctx.fillRect(0, 0, 1, 1)
        window.requestAnimationFrame(drawLoop)

        var stream = await realGetUserMedia.call(navigator.mediaDevices, constraints)
        var res = canvas.captureStream(30);
        var videoTrack = res.getVideoTracks()[0]
        var videoTrackStop = videoTrack.stop;
        videoTrack.stop = function () {
            stream.getVideoTracks()[0].stop()
            videoTrackStop.call(videoTrack)
        }
        return res
    } else {
        return await realGetUserMedia.call(navigator.mediaDevices, constraints);
    }
}

console.log("Installed getUserMedia hook")

function initVideo(stream) {
    video = document.createElement("video")
    video.style.display = "none"
    video.srcObject = stream
    document.body.appendChild(video)
    video.play()
}

function onUserMedia() {
    if (ran) { return }
    ran = true
    realGetUserMedia.call(navigator.mediaDevices, { "audio": false, "video": true }).then((stream) => {
        beginWindow("you are now breathing manually.")

        checkbox("freeze")
        sameLine()
        label(" Freeze camera")

        lineBreak()

        checkbox("invert")
        sameLine()
        label(" Invert colors")

        lineBreak()

        label("Overlay text controls")
        textArea("overlayText").style.resize = "vertical"
        lineBreak()
        textArea("selectedFont").style.resize = "none"
        lineBreak()
        textArea("selectedStyle").style.resize = "none"


        //lineBreak()

        //label("Set background image (aspect ratio of 4:3 recommended)")
        //textArea("backgroundUrl").style.resize = "none"

        endWindow()

        initVideo(stream)
    })
}