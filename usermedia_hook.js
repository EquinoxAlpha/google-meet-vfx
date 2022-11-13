var realGetUserMedia = navigator.mediaDevices.getUserMedia
var ctx = undefined
var video = undefined
var ran = false
function drawLoop() {
    var check = document.getElementById("freeze")
    if (video && !check.checked) {
        ctx.drawImage(video, 0, 0, 640, 480);
    }
    window.requestAnimationFrame(drawLoop)
}

window.navigator.mediaDevices.getUserMedia = async function (constraints) {
    if (constraints.video.deviceId) {
        onUserMedia()
        var canvas = document.createElement("canvas")
        canvas.setAttribute("id", "sourceCanvas");
        canvas.setAttribute("style", "display:none;");
        canvas.width = 640
        canvas.height = 480
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d")
        //ctx.translate(canvas.width, 0);
        //ctx.scale(1, 1)
        ctx.fillRect(0, 0, 1, 1)
        window.requestAnimationFrame(drawLoop)

        var stream = await realGetUserMedia.call(navigator.mediaDevices, constraints)
        var res = canvas.captureStream(16);
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

function onUserMedia() {
    if (ran) { return }
    ran = true
    realGetUserMedia.call(navigator.mediaDevices, { "audio": false, "video": true }).then((stream) => {
        console.log("creating window")
        video = document.createElement("video")
        video.style.display = "none"
        beginWindow("intercepting mediastreams since 2022")
        label("freeze")
        video.srcObject = stream
        document.body.appendChild(video)
        check = checkbox("freeze")
        endWindow()
        video.play()
    })
}