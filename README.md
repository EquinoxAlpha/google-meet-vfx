# Google Meet Visual Effects

This browser extension adds an overlay window to every Google Meet tab that allows you to enable various visual effects.
The draggable window will open when Google Meet tries to access the user's camera.

Visual effects currently supported:
* Freeze camera
* Invert colors
* Text overlay with selectable fonts, colors and sizes.

Visual effects planned:
* Custom image uploading

This extension is untested on Chromium-based browsers.
This should theoretically work with any video calling service, you can try it by editing the manifest file.

## Installing
On Linux, run
```bash
git clone https://github.com/EquinoxAlpha/google-meet-vfx.git
cd google-meet-vfx
zip -r -FS google-meet-vfx.zip * --exclude '*.git*' '*.md'
```
to pack the files into an extension. Then add it as any other unsigned addon.

## Images
![image](https://user-images.githubusercontent.com/93602271/217653790-12aa22b1-5a0a-49a4-99a0-5d870f6d060d.png)

## Known issues
The camera output (& overlay) may appear inverted horizontally, but other people will see it normally. Didn't test this on other machines.

## How does this work?
If you want to make your own version of this extension, this might be useful:
* Inject the script into the website by creating a script tag and setting it's source URL to the file in the extension.
* Replace the window.navigator.getUserMedia function with your own (and save the original)
* In the hooked function, set up the canvas and context, then call the original. The original function returns useful data such as the MediaStream.
* Then initialize a media stream of the canvas element, then call the function that loads our GUI and a draw loop.
* After all of that is done that, return the media stream of the canvas element.
* The draw loop repeatedly draws the actual video stream on the canvas and stops/plays the video stream depending on the current settings, then applies effects such as invert colors or overlay text.

## License
The Unlicense. Do whatever you want with this public domain project.
