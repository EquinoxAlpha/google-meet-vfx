class JsGui {
    constructor() {
        this.windows = [];
        this.BORDER_COLOR = "1px solid #6D6D7F";
    }

    createWindow(title, x, y, width, height) {
        const window = {
            title,
            x,
            y,
            width,
            height,
            dragging: false,
            minimized: false,
            widgets: [],
            container: document.createElement("div"),
            widgetContainer: document.createElement("div")
        };
        window.container.style.zIndex = 999;
        this.windows.push(window);
        return window;
    }

    createLabel(window, text, size = null) {
        const element = document.createElement("p");
        element.textContent = text;
        if (size) { element.style.fontSize = size }
        window.widgetContainer.appendChild(element);
        const widget = { type: "label", text: text, element: element };
        return widget;
    }

    createButton(window, text, onClick) {
        const element = document.createElement("button");
        element.textContent = text;
        element.style.fontFamily = "monospace";
        element.style.fontWeight = "400";
        element.style.color = "#E9E9E9";
        element.style.backgroundColor = "transparent";
        element.style.border = this.BORDER_COLOR;
        element.style.cursor = "pointer";
        element.addEventListener("click", onClick);
        window.widgetContainer.appendChild(element);
        const widget = { type: "label", text: text, element: element };
        return widget;
    }

    createImage(window, source, width = "auto", height = "auto") {
        const element = document.createElement("img")
        element.src = source;
        if (width != "auto") {
            if (width === "fill") {
                element.style.maxWidth = "100%"
            } else {
                element.width = width;
            }
        }
        if (height != "auto") {
            if (height === "fill") {
                element.style.maxHeight = "100%"
            } else {
                element.height = height;
            }
        }
        window.widgetContainer.appendChild(element);
        const widget = { type: "image", source: source, width: width, height: height, element: element };
        return widget;
    }

    createTextInput(window, placeholder, onChange, text = "", width = 100) {
        const element = document.createElement("input");
        element.value = text;
        element.type = "text";
        element.placeholder = placeholder;
        element.style.border = this.BORDER_COLOR;
        element.style.boxSizing = "border-box";
        element.style.backgroundColor = "transparent";
        element.style.color = "#E9E9E9";
        element.style.marginBottom = "2px";
        element.style.outline = "none";
        element.style.width = "100%"
        element.addEventListener("input", onChange);
        window.widgetContainer.appendChild(element);
        const widget = { type: "input", input: "text", placeholder: placeholder, width: width, onChange: onChange, element: element };
        return widget;
    }

    createContainer(window) {
        const element = document.createElement("div");
        window.widgetContainer.appendChild(element)
        const widget = { type: "container", widgets: [], widgetContainer: element, element: element };
        return widget;
    }

    createNewLine(window, amount = 1) {
        if (amount == 1) {
            const element = document.createElement("p");
            window.widgetContainer.appendChild(element)
            const widget = { type: "newline", element: element };
            return widget;
        }
        const widgets = [];
        for (let i = 0; i < amount; i++) {
            const element = document.createElement("p");
            window.widgetContainer.appendChild(element)
            const widget = { type: "newline", element: element };
            widgets.push(widget);
        }
        return widgets;
    }

    createLineSeparator(window, text = null) {
        const element = document.createElement("div");
        element.style.maxWidth = "100%"
        element.style.borderBottom = this.BORDER_COLOR;
        element.textContent = text;
        window.widgetContainer.appendChild(element)
        const widget = { type: "lineSeparator", text: text, element: element };
        return widget;
    }

    createCheckbox(window, text = null, toggled = false, onToggle = null) {
        const element = document.createElement("input");
        element.type = "checkbox"
        element.style.maxWidth = "100%"
        element.style.borderBottom = this.BORDER_COLOR;
        element.textContent = text;
        element.addEventListener("input", onToggle);
        window.widgetContainer.appendChild(element)
        const widget = { type: "checkbox", text: null, element: element};
        if (text != null) {
            const label = this.createLabel(window, text)
            label.element.style.display = "inline"
            widget.text = label
        }
        return widget;
    }

    endWindow(window) {
        this.renderWindowHeader(window);
        window.container.appendChild(window.widgetContainer);
        window.container.style.position = "absolute";
        window.container.style.left = `${window.x}px`;
        window.container.style.top = `${window.y}px`;
        window.container.style.width = `${window.width}px`;
        window.container.style.height = `${window.height}px`;
        window.container.style.color = "#E9E9E9";
        window.container.style.fontFamily = "monospace";
        window.widgetContainer.style.backgroundColor = "#0F0F0FF0";
        window.widgetContainer.style.padding = "10px";
        window.widgetContainer.style.boxSizing = "border-box";
        window.widgetContainer.style.border = this.BORDER_COLOR;
        window.widgetContainer.style.borderTop = "none";
        window.widgetContainer.style.width = `${window.width}px`;
        document.body.appendChild(window.container);
    }

    renderWindowHeader(window) {
        const container = document.createElement("div");
        container.style.backgroundColor = "#294A7A";
        container.style.padding = "10px";
        container.style.borderLeft = this.BORDER_COLOR;
        container.style.borderRight = this.BORDER_COLOR;
        container.style.borderTop = this.BORDER_COLOR;
        container.style.boxSizing = "border-box";
        container.style.cursor = "move";
        container.addEventListener("mousedown", event => {
            window.dragging = true;
            window.dragOffsetX = event.clientX - window.x;
            window.dragOffsetY = event.clientY - window.y;
        });
        window.container.appendChild(container);

        const titleBar = document.createElement("div");
        titleBar.style.display = "flex";
        titleBar.style.alignItems = "center";
        titleBar.style.justifyContent = "space-between";
        titleBar.textContent = window.title;
        titleBar.style.userSelect = "none";
        container.appendChild(titleBar);

        const buttons = document.createElement("div");

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.style.float = "right";
        closeButton.style.padding = "0";
        closeButton.style.marginLeft = "15px";
        closeButton.style.border = "none";
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.color = "white";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => {
            const index = this.windows.indexOf(window);
            if (index >= 0) {
                this.windows.splice(index, 1);
            }
            window.container.remove();
        });
        buttons.appendChild(closeButton);

        const minimizeButton = document.createElement("button");
        minimizeButton.textContent = "-";
        minimizeButton.style.padding = "0";
        minimizeButton.style.margin = "0";
        minimizeButton.style.border = "none";
        minimizeButton.style.backgroundColor = "transparent";
        minimizeButton.style.color = "white";
        minimizeButton.style.cursor = "pointer";
        minimizeButton.addEventListener("click", () => {
            window.minimized = !window.minimized;
            if (window.minimized) {
                window.widgetContainer.hidden = true;
                container.style.borderBottom = this.BORDER_COLOR;
                minimizeButton.textContent = "+";
            } else {
                window.widgetContainer.hidden = false;
                container.style.borderBottom = "none";
                minimizeButton.textContent = "-";
            }
        });
        buttons.appendChild(minimizeButton);

        titleBar.appendChild(buttons);

        document.addEventListener("mousemove", event => {
            if (window.dragging) {
                window.x = event.clientX - window.dragOffsetX;
                window.y = event.clientY - window.dragOffsetY;
                window.container.style.left = `${window.x}px`;
                window.container.style.top = `${window.y}px`;
            }
        });
        document.addEventListener("mouseup", () => {
            window.dragging = false;
        });
    }

    removeWidget(widget) {
        widget.element.parentElement.removeChild(widget.element);
    }
}



var initialized = false
var gui = null

const data = {
    "context": undefined,
    "video_stream": undefined
}

var settings = {
    "freeze": false,
    "invert_colors": false,
    "invert_image": true,
    "overlay": {
        "text": "",
        "color": "white",
        "font": "30px monospace"
    }
}

var defaults = {
    "freeze": false,
    "invert_colors": false,
    "invert_image": true,
    "overlay": {
        "text": "",
        "color": "white",
        "font": "30px monospace"
    }
}

// hardcoded, might change later
const camera_width = 640
const camera_height = 480

// centered text drawing function
function drawText(ctx, text, x, y) {
    var metrics = ctx.measureText(text)
    var width = metrics.width
    var height = metrics.actualBoundingBoxAscent
    ctx.fillText(text, x - width / 2, y + height / 2)
}

function drawLoop() {
    if (data.video_stream) {
        try {
            if (settings.freeze && !data.video_stream.paused) {
                data.video_stream.pause()
            } else if (!(settings.freeze && data.video_stream.paused)) {
                data.video_stream.play()
            }
            if (settings.invert_image) {
                data.context.translate(camera_width, 0);
                data.context.scale(-1, 1);
            }
            data.context.drawImage(data.video_stream, 0, 0, camera_width, camera_height);
            if (settings.invert_image) {
                data.context.translate(camera_width, 0);
                data.context.scale(-1, 1);
            }
            if (settings.invert_colors) {
                data.context.globalCompositeOperation = 'difference';
                data.context.fillStyle = 'white';
                data.context.fillRect(0, 0, camera_width, camera_height);
                data.context.globalCompositeOperation = 'source-over';
            }
            data.context.font = settings.overlay.font || defaults.overlay.font;
            data.context.fillStyle = settings.overlay.color || defaults.overlay.color;
    
            drawText(data.context, settings.overlay.text, 320, 120);
        } catch (error) {
            //console.log(error);
        }
    }
    this.window.requestAnimationFrame(drawLoop)
}

var realGetUserMedia = navigator.mediaDevices.getUserMedia
window.navigator.mediaDevices.getUserMedia = async function (constraints) {
    if (constraints.video.deviceId) {
        onUserMedia()
        var canvas = document.createElement("canvas")
        canvas.setAttribute("id", "sourceCanvas");
        canvas.setAttribute("style", "display:none;");
        canvas.width = camera_width
        canvas.height = camera_height
        document.body.appendChild(canvas);
        data.context = canvas.getContext("2d")
        data.context.fillRect(0, 0, 1, 1)
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

console.log("[google meet vfx extension] installed getUserMedia hook")

function initVideo(stream) {
    data.video_stream = document.createElement("video")
    data.video_stream.style.display = "none"
    data.video_stream.srcObject = stream
    document.body.appendChild(data.video_stream)
    data.video_stream.play()
}

function onUserMedia() {
    if (initialized) return
    initialized = true
    realGetUserMedia.call(navigator.mediaDevices, { "audio": false, "video": true }).then((stream) => {
        gui = new JsGui()
        const window = gui.createWindow("Visual Effects", 100, 100, 300)
        console.log("[google meet vfx extension] loading gui and hooking video stream")
        gui.createLineSeparator(window, "toggles")
        gui.createNewLine(window)
        gui.createCheckbox(window, "Freeze camera", defaults.freeze, (input) => {
            settings.freeze = input.target.checked;
        })
        gui.createNewLine(window)
        gui.createCheckbox(window, "Invert colors", defaults.invert_colors, (input) => {
            settings.invert_colors = input.target.checked;
        })
        gui.createNewLine(window, 2)
        gui.createLineSeparator(window, "overlay")
        gui.createNewLine(window)

        gui.createTextInput(window, "overlay text", (input) => {
            settings.overlay.text = input.target.value;
        })
        gui.createTextInput(window, "selected font (default: 30px monospace)", (input) => {
            settings.overlay.font = input.target.value;
        })
        gui.createTextInput(window, "selected color (in english, or hexadecimal)", (input) => {
            settings.overlay.color = input.target.value;
        })
        gui.createLabel(window, "text will appear inverted, but others will see it fine", "8px")
        gui.endWindow(window)

        drawLoop()

        initVideo(stream)
    })
}