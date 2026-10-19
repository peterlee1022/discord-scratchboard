# Scratchboard

A BetterDiscord plugin that puts a pencil button in the chat bar. Click it, doodle something, hit Send, and the drawing gets attached to your message as a PNG.

## Install

1. Install [BetterDiscord](https://betterdiscord.app) if you don't have it.
2. Drop `Scratchboard.plugin.js` into your plugins folder. On Windows that's `%appdata%\BetterDiscord\plugins`.
3. Turn it on under User Settings > Plugins.

## Using it

The pencil shows up next to the emoji/gif buttons. In the drawing window you get:

- brush, eraser, fill bucket, and line/rectangle/ellipse tools
- a handful of colors plus a custom color picker
- brush size slider (pen pressure works if you have a tablet)
- undo, redo, clear
- white, dark or transparent background

Some mouse tricks:

- Right-drag erases, whatever tool you have selected. The eraser end of a pen does the same.
- Alt+click picks up a color from the drawing.
- Hold Shift for straight lines, or perfect squares and circles with the shape tools.

You can paste (Ctrl+V) or drag an image onto the board to scribble on top of it, which is handy for marking up screenshots.

Send attaches the image to the chat box, so you can type a caption before pressing Enter. Copy puts it on your clipboard instead.

Your drawing sticks around until you send it, even if you close the window or restart Discord.

Keyboard shortcuts, if you want them:

| Key | Does |
| --- | --- |
| B / E / F | brush / eraser / fill |
| L / R / O | line / rectangle / ellipse |
| [ and ] | smaller / bigger brush |
| Ctrl+Z, Ctrl+Y | undo, redo |
| Ctrl+C | copy |
| Ctrl+Enter | send |
| Esc | close |

## If sending stops working

Discord updates sometimes rename the internals the plugin uses to attach files. When that happens it tries pasting the image into the chat box, and if that fails too it copies the image to your clipboard so you can paste it yourself. Open an issue if you hit this.

## Note

Client mods are against Discord's terms of service. People don't really get banned for cosmetic stuff like this, but use it at your own risk.
