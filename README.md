# Google Meet Visual Effects

This browser extension adds an overlay window to every Google Meet tab that allows you to enable various visual effects.
The draggable window will open when Google Meet tries to access the user's camera.

Visual effects currently supported:
* Freeze camera
* Invert colors
* Text overlay with selectable fonts, colors and sizes.

Visual effects planned:
* Custom image uploading

## Installing
On Linux, clone this repository and then run

```bash
cd google-meet-camera-freeze && zip -r -FS ../googlemeet.zip * --exclude '*.git*'
```

to pack the files into an extension. Then add it as any other unsigned addon. This procedure may be different for Chrome and Chromium-based browsers.

## Known issues
Everything may appear inverted horizontally, but other people will see it normally.

## License
The Unlicense. Do whatever you want with this public-domain project.
