// jsgui
// it's like ImGui but worse
// except it's not an immediate mode gui library lol
// it looks similar
// no idea if a project with the same name exists and I don't care

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
        this.windows.push(window);
        return window;
    }

    createLabel(window, text) {
        const element = document.createElement("p");
        element.textContent = text;
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
        // Create the container element
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

        // Create the title bar element
        const titleBar = document.createElement("div");
        titleBar.style.display = "flex";
        titleBar.style.alignItems = "center";
        titleBar.style.justifyContent = "space-between";
        titleBar.textContent = window.title;
        titleBar.style.userSelect = "none";
        container.appendChild(titleBar);

        const buttons = document.createElement("div");

        // Create the close button element
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
            // Remove the window from the list of windows
            const index = this.windows.indexOf(window);
            if (index >= 0) {
                this.windows.splice(index, 1);
            }
            // Remove the window's container from the DOM
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

        // Add mousemove and mouseup event listeners for dragging
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
