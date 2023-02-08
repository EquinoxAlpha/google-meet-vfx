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

## Installing
On Linux, run
```bash
git clone https://github.com/EquinoxAlpha/google-meet-vfx.git
cd google-meet-vfx
zip -r -FS google-meet-vfx.zip src/* --exclude '*.git*' '*.md'
```
to pack the files into an extension. Then add it as any other unsigned addon.

## Known issues
The camera output (& overlay) may appear inverted horizontally, but other people will see it normally. Didn't test this on other machines.

## License
The Unlicense. Do whatever you want with this public-domain project.
