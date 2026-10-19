# Scratchboard

A BetterDiscord plugin that puts a pencil button in the chat bar. Click it, doodle something, hit Send, and the drawing gets attached to your message as a PNG.

## Install

1. Install [BetterDiscord](https://betterdiscord.app) if you don't have it.
2. Drop `Scratchboard.plugin.js` into your plugins folder. On Windows that's `%appdata%\BetterDiscord\plugins`.
3. Turn it on under User Settings > Plugins.

## Using it

The pencil shows up next to the emoji/gif buttons. In the drawing window you get:

- brush, eraser and fill bucket
- a handful of colors plus a custom color picker
- brush size slider (pen pressure works if you have a tablet)
- undo, redo, clear
- white, dark or transparent background

Send attaches the image to the chat box, so you can type a caption before pressing Enter. Copy puts it on your clipboard instead.

Closing the window doesn't throw your drawing away. It'll still be there next time you open it.

Keyboard shortcuts, if you want them:

| Key | Does |
| --- | --- |
| B / E / F | brush / eraser / fill |
| [ and ] | smaller / bigger brush |
| Ctrl+Z, Ctrl+Y | undo, redo |
| Ctrl+C | copy |
| Ctrl+Enter | send |
| Esc | close |

## If sending stops working

Discord updates sometimes rename the internals the plugin uses to attach files. When that happens it tries pasting the image into the chat box, and if that fails too it copies the image to your clipboard so you can paste it yourself. Open an issue if you hit this.

## Note

Client mods are against Discord's terms of service. People don't really get banned for cosmetic stuff like this, but use it at your own risk.
