function injectScript(contents) {
    var script = document.createElement("script");
    script.src = browser.runtime.getURL(contents);
    script.onload = function () {
        script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

injectScript("jsgui.js");
injectScript("usermedia_hook.js");