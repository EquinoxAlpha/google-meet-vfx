// jsgui
// it's like ImGui but worse
// no idea if a project with the same name exists and I don't care

var jsgui = {
    currentOperation: null,
    frame: null,
    last: null,
    nextIsInline: false
}

function drawText(ctx, text, x, y) {
    var metrics = ctx.measureText(text)
    var width = metrics.width
    var height = metrics.actualBoundingBoxAscent
    ctx.fillText(text, x - width / 2, y + height / 2)
}

function drawRect(ctx, x, y, w, h) {
    ctx.fillRect(x - w / 2, y - h / 2, w, h)
}

function dragElement(elmnt, header) {   
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function beginWindow(name) {
    if (jsgui.currentOperation != null) {
        console.error("Error: beginWindow: endWindow not called before beginning a new one!")
    }

    jsgui.frame = document.createElement("div")
    jsgui.frame.style = "position: absolute; left: 50px; top: 50px; background-color: #202020; color: #ffffff; padding: 0px; font-family:monospace;"
    var elements = document.getElementsByTagName("*");
    var highest_index = 0;

    for (var i = 0; i < elements.length - 1; i++) {
        if (parseInt(elements[i].style.zIndex) > highest_index) {
            highest_index = parseInt(elements[i].style.zIndex)
        }
    }
    jsgui.frame.style.zIndex = highest_index + 1

    jsgui.currentOperation = document.createElement("div")
    jsgui.currentOperation.style = "background-color: #202020; color: #ffffff; padding: 10px"

    var header = document.createElement("div")
    header.style = "background-color: #064c88; color: #ffffff; padding: 10px; font-family:monospace;"
    header.innerHTML = name
    dragElement(jsgui.frame, header)
    jsgui.frame.appendChild(header)
    jsgui.frame.appendChild(jsgui.currentOperation)
}

function inlineCheck(element) {
    if (jsgui.nextIsInline) {
        element.style.display = "inline"
        jsgui.nextIsInline = false
    }
    return element
}

//Adds some text to the current window.
function label(text) {
    var label = inlineCheck(document.createElement("p"))
    label.innerHTML = text
    jsgui.currentOperation.appendChild(label)
    jsgui.last = label
    return label
}

function textArea(id) {
    var area = inlineCheck(document.createElement("textarea"))
    area.id = id
    jsgui.currentOperation.appendChild(area)
    jsgui.last = area
    return area
}

function checkbox(id) {
    var box = inlineCheck(document.createElement("input"))
    box.type = "checkbox"
    box.id = id
    jsgui.currentOperation.appendChild(box)
    jsgui.last = box
    return checkbox
} 

function lineBreak() {
    jsgui.currentOperation.appendChild(document.createElement("p"))
}

function sameLine() {
    jsgui.nextIsInline = true
}

//Allows you to add a custom HTML5 element.
function customElement(element) {
    jsgui.currentOperation.appendChild(inlineCheck(element))
    jsgui.last = element
}

function endWindow() {
    if (jsgui.currentOperation == null) {
        console.error("Error: endWindow: not creating a window")
    }
    
    document.body.appendChild(jsgui.frame)
    jsgui.currentOperation = null;
    jsgui.frame = null;
    jsgui.last = null
}