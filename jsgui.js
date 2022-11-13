var currentOperation = null;
var frame = null;

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
    if (currentOperation != null) {
        console.error("Error: beginWindow: endWindow not called before beginning a new one!")
    }

    frame = document.createElement("div")
    frame.style = "position: absolute; left: 50px; top: 50px; background-color: #202020; color: #ffffff; padding: 0px; font-family:monospace;"
    var elements = document.getElementsByTagName("*");
    var highest_index = 0;

    for (var i = 0; i < elements.length - 1; i++) {
        if (parseInt(elements[i].style.zIndex) > highest_index) {
            highest_index = parseInt(elements[i].style.zIndex)
        }
    }
    frame.style.zIndex = highest_index + 1

    currentOperation = document.createElement("div")
    currentOperation.style = "background-color: #202020; color: #ffffff; padding: 10px"

    var header = document.createElement("div")
    header.style = "background-color: #064c88; color: #ffffff; padding: 10px; font-family:monospace;"
    header.innerHTML = name
    dragElement(frame, header)
    frame.appendChild(header)
    frame.appendChild(currentOperation)
}

//Adds some text to the current window.
function label(text) {
    var label = document.createElement("p")
    label.innerHTML = text
    currentOperation.appendChild(label)
}

function checkbox(text) {
    var box = document.createElement("input")
    box.type = "checkbox"
    box.id = text
    currentOperation.appendChild(box)
    return checkbox
} 

//Allows you to add a custom HTML5 element.
function customElement(element) {
    currentOperation.appendChild(element)
}

function endWindow() {
    if (currentOperation == null) {
        console.error("Error: endWindow: not creating a window")
    }
    
    document.body.appendChild(frame)
    currentOperation = null;
    frame = null;
}