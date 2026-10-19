/**
 * @name Scratchboard
 * @author peterlee1022
 * @authorLink https://github.com/peterlee1022
 * @source https://github.com/peterlee1022/discord-scratchboard
 * @website https://github.com/peterlee1022/discord-scratchboard
 * @description Adds a pencil button to the chat bar that opens a little sketchpad. Draw something and send it to the current channel as an image.
 * @version 1.0.0
 */

const W = 960, H = 600;
const MAX_UNDO = 25;
const SWATCHES = [
    "#111111", "#ffffff", "#8a8f98", "#e5484d", "#f76b15", "#ffc53d",
    "#46a758", "#12a594", "#3e63dd", "#8e4ec6", "#e93d82", "#8b5a2b"
];
const SHAPES = ["line", "rect", "ellipse"];
const BACKGROUNDS = { paper: "#ffffff", dark: "#313338", clear: null };

const ICON_PENCIL = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const ICON_ERASER = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 19"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`;
const ICON_FILL = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>`;
const ICON_BRUSH = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const ICON_LINE = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 19 19 5"/></svg>`;
const ICON_RECT = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="1"/></svg>`;
const ICON_ELLIPSE = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="8.5" ry="6.5"/></svg>`;
const ICON_UNDO = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>`;
const ICON_REDO = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>`;
const ICON_TRASH = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

const CSS = `
.sb-chatbtn { display:flex; align-items:center; justify-content:center; width:32px; height:32px; margin:0 2px; cursor:pointer;
  color: var(--interactive-normal, #b5bac1); border-radius:6px; flex-shrink:0; }
.sb-chatbtn:hover { color: var(--interactive-hover, #dbdee1); }
.sb-overlay { position:fixed; inset:0; z-index:2000; background:rgba(0,0,0,.7); display:flex; align-items:center; justify-content:center;
  animation: sb-fade .12s ease-out; }
@keyframes sb-fade { from { opacity:0 } to { opacity:1 } }
.sb-panel { width:min(1000px, 94vw); max-height:94vh; display:flex; flex-direction:column; gap:10px; padding:14px;
  background: var(--modal-background, var(--background-primary, #313338)); color: var(--text-normal, #dbdee1);
  border-radius:12px; box-shadow:0 12px 40px rgba(0,0,0,.5); font-family: var(--font-primary, sans-serif); }
.sb-head { display:flex; align-items:center; justify-content:space-between; }
.sb-title { font-size:18px; font-weight:700; color: var(--header-primary, #f2f3f5); }
.sb-x { cursor:pointer; font-size:22px; line-height:1; padding:2px 8px; border-radius:6px; color: var(--interactive-normal, #b5bac1); }
.sb-x:hover { background: var(--background-modifier-hover, rgba(255,255,255,.06)); color: var(--interactive-hover, #fff); }
.sb-bar { display:flex; flex-wrap:wrap; align-items:center; gap:10px; }
.sb-group { display:flex; align-items:center; gap:4px; padding:4px; border-radius:8px; background: var(--background-secondary, #2b2d31); }
.sb-tool { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:6px; cursor:pointer;
  color: var(--interactive-normal, #b5bac1); border:none; background:none; }
.sb-tool:hover { background: var(--background-modifier-hover, rgba(255,255,255,.06)); color: var(--interactive-hover, #fff); }
.sb-tool.sb-on { background: var(--brand-500, #5865f2); color:#fff; }
.sb-tool:disabled { opacity:.35; cursor:default; background:none; }
.sb-swatch { width:22px; height:22px; border-radius:50%; cursor:pointer; box-shadow: inset 0 0 0 1px rgba(0,0,0,.35); transition: transform .08s; }
.sb-swatch:hover { transform: scale(1.15); }
.sb-swatch.sb-on { outline:2px solid var(--brand-500, #5865f2); outline-offset:2px; }
.sb-custom { width:26px; height:26px; padding:0; border:none; background:none; cursor:pointer; }
.sb-size { width:110px; accent-color: var(--brand-500, #5865f2); }
.sb-sizedot { width:28px; height:28px; display:flex; align-items:center; justify-content:center; }
.sb-sizedot > div { border-radius:50%; background:currentColor; }
.sb-bgbtn { font-size:12px; padding:5px 9px; border-radius:6px; cursor:pointer; color: var(--interactive-normal, #b5bac1); }
.sb-bgbtn:hover { color: var(--interactive-hover, #fff); }
.sb-bgbtn.sb-on { background: var(--background-modifier-selected, rgba(255,255,255,.12)); color: var(--interactive-active, #fff); }
.sb-stage { position:relative; width:100%; aspect-ratio: ${W} / ${H}; max-height: calc(94vh - 170px); margin:0 auto; border-radius:8px;
  overflow:hidden; cursor:none; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
.sb-stage.sb-bg-clear { background: repeating-conic-gradient(#3a3c42 0 25%, #2f3136 0 50%) 0 0 / 20px 20px; }
.sb-stage canvas { position:absolute; inset:0; width:100%; height:100%; touch-action:none; }
.sb-stage.sb-fill { cursor: crosshair; }
.sb-cursor { position:absolute; pointer-events:none; border-radius:50%; border:1px solid rgba(0,0,0,.7);
  box-shadow: 0 0 0 1px rgba(255,255,255,.7); transform: translate(-50%,-50%); display:none; }
.sb-foot { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.sb-hint { font-size:12px; color: var(--text-muted, #949ba4); }
.sb-btn { padding:8px 16px; border-radius:6px; border:none; cursor:pointer; font-size:14px; font-weight:600; }
.sb-btn-secondary { background: var(--button-secondary-background, #4e5058); color:#fff; }
.sb-btn-secondary:hover { filter: brightness(1.1); }
.sb-btn-primary { background: var(--brand-500, #5865f2); color:#fff; }
.sb-btn-primary:hover { filter: brightness(1.1); }
`;

module.exports = class Scratchboard {
    constructor(meta) {
        this.meta = meta;
        this.overlay = null;
        this.canvas = null;
        this.undoStack = [];
        this.redoStack = [];
        this.prefs = Object.assign(
            { color: "#111111", size: 6, tool: "pen", bg: "paper" },
            BdApi.Data.load("Scratchboard", "prefs") || {}
        );
        this.onKey = this.onKey.bind(this);
    }

    start() {
        BdApi.DOM.addStyle("Scratchboard", CSS);
        // The drawing survives closing the modal so an accidental Esc doesn't lose it.
        this.canvas = document.createElement("canvas");
        this.canvas.width = W;
        this.canvas.height = H;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        this.inject();
    }

    stop() {
        this.close();
        document.querySelectorAll(".sb-chatbtn").forEach(el => el.remove());
        BdApi.DOM.removeStyle("Scratchboard");
    }

    // BetterDiscord calls this on every DOM mutation; re-add the button when Discord re-renders the chat bar.
    observer() {
        this.inject();
    }

    inject() {
        for (const area of document.querySelectorAll('[class*="channelTextArea"]')) {
            if (area.closest('[class*="messageListItem"]')) continue; // skip message edit boxes
            const buttons = area.querySelector('[class*="buttons"]');
            if (!buttons || buttons.querySelector(".sb-chatbtn")) continue;
            const btn = document.createElement("div");
            btn.className = "sb-chatbtn";
            btn.setAttribute("role", "button");
            btn.setAttribute("aria-label", "Open Scratchboard");
            btn.title = "Scratchboard";
            btn.innerHTML = ICON_PENCIL;
            btn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                this.open(area);
            });
            buttons.prepend(btn);
        }
    }

    savePrefs() {
        BdApi.Data.save("Scratchboard", "prefs", this.prefs);
    }

    // ---------- modal ----------

    open(area) {
        if (this.overlay) return;
        this.targetArea = area;

        const o = document.createElement("div");
        o.className = "sb-overlay";
        o.innerHTML = `
          <div class="sb-panel">
            <div class="sb-head">
              <div class="sb-title">Scratchboard</div>
              <div class="sb-x" data-act="close" title="Close (Esc)">×</div>
            </div>
            <div class="sb-bar">
              <div class="sb-group">
                <button class="sb-tool" data-tool="pen" title="Brush (B), Alt+click to pick a color, right-drag to erase">${ICON_BRUSH}</button>
                <button class="sb-tool" data-tool="eraser" title="Eraser (E)">${ICON_ERASER}</button>
                <button class="sb-tool" data-tool="line" title="Line (L)">${ICON_LINE}</button>
                <button class="sb-tool" data-tool="rect" title="Rectangle (R), hold Shift for a square">${ICON_RECT}</button>
                <button class="sb-tool" data-tool="ellipse" title="Ellipse (O), hold Shift for a circle">${ICON_ELLIPSE}</button>
                <button class="sb-tool" data-tool="fill" title="Fill (F)">${ICON_FILL}</button>
              </div>
              <div class="sb-group sb-swatches">
                ${SWATCHES.map(c => `<div class="sb-swatch" data-color="${c}" style="background:${c}"></div>`).join("")}
                <input type="color" class="sb-custom" title="Custom color">
              </div>
              <div class="sb-group">
                <div class="sb-sizedot"><div></div></div>
                <input type="range" class="sb-size" min="1" max="60" title="Brush size ([ and ])">
              </div>
              <div class="sb-group">
                <button class="sb-tool" data-act="undo" title="Undo (Ctrl+Z)">${ICON_UNDO}</button>
                <button class="sb-tool" data-act="redo" title="Redo (Ctrl+Y)">${ICON_REDO}</button>
                <button class="sb-tool" data-act="clear" title="Clear">${ICON_TRASH}</button>
              </div>
              <div class="sb-group">
                ${Object.keys(BACKGROUNDS).map(b => `<div class="sb-bgbtn" data-bg="${b}">${b}</div>`).join("")}
              </div>
            </div>
            <div class="sb-stage"><div class="sb-cursor"></div></div>
            <div class="sb-foot">
              <div class="sb-hint">Ctrl+Enter to send · Ctrl+C to copy · Esc to close</div>
              <div style="display:flex;gap:8px">
                <button class="sb-btn sb-btn-secondary" data-act="copy">Copy</button>
                <button class="sb-btn sb-btn-primary" data-act="send">Send</button>
              </div>
            </div>
          </div>`;

        this.overlay = o;
        this.stage = o.querySelector(".sb-stage");
        this.cursor = o.querySelector(".sb-cursor");
        this.stage.prepend(this.canvas);

        o.addEventListener("mousedown", e => { if (e.target === o) this.close(); });
        o.addEventListener("click", e => this.onClick(e));
        o.querySelector(".sb-size").addEventListener("input", e => this.setSize(+e.target.value));
        o.querySelector(".sb-custom").addEventListener("input", e => this.setColor(e.target.value));

        this.canvas.onpointerdown = e => this.pointerDown(e);
        this.canvas.onpointermove = e => this.pointerMove(e);
        this.canvas.onpointerup = this.canvas.onpointercancel = e => this.pointerUp(e);
        this.canvas.oncontextmenu = e => e.preventDefault();
        this.canvas.onpointerleave = () => { this.cursor.style.display = "none"; };
        this.canvas.onpointerenter = () => { if (this.prefs.tool !== "fill") this.cursor.style.display = "block"; };

        // Take focus off Discord's chat box so keys and pastes don't end up in it.
        document.activeElement?.blur?.();
        document.body.appendChild(o);
        window.addEventListener("keydown", this.onKey, true);
        this.refreshUI();
    }

    close() {
        if (!this.overlay) return;
        window.removeEventListener("keydown", this.onKey, true);
        this.stroke = null;
        this.canvas.remove();
        this.overlay.remove();
        this.overlay = null;
    }

    refreshUI() {
        const o = this.overlay;
        if (!o) return;
        const { tool, color, size, bg } = this.prefs;
        o.querySelectorAll("[data-tool]").forEach(b => b.classList.toggle("sb-on", b.dataset.tool === tool));
        o.querySelectorAll(".sb-swatch").forEach(s => s.classList.toggle("sb-on", s.dataset.color.toLowerCase() === color.toLowerCase()));
        o.querySelectorAll("[data-bg]").forEach(b => b.classList.toggle("sb-on", b.dataset.bg === bg));
        o.querySelector(".sb-custom").value = color;
        o.querySelector(".sb-size").value = size;
        const dot = o.querySelector(".sb-sizedot > div");
        const d = Math.max(3, Math.min(26, size * 0.6));
        dot.style.width = dot.style.height = d + "px";
        dot.parentElement.style.color = color;
        o.querySelector('[data-act="undo"]').disabled = !this.undoStack.length;
        o.querySelector('[data-act="redo"]').disabled = !this.redoStack.length;

        this.stage.style.background = BACKGROUNDS[bg] || "";
        this.stage.classList.toggle("sb-bg-clear", bg === "clear");
        this.stage.classList.toggle("sb-fill", tool === "fill");
        if (tool === "fill") this.cursor.style.display = "none";
        this.updateCursorSize();
    }

    onClick(e) {
        const t = e.target.closest("[data-tool],[data-color],[data-bg],[data-act]");
        if (!t) return;
        if (t.dataset.tool) this.setTool(t.dataset.tool);
        else if (t.dataset.color) this.setColor(t.dataset.color);
        else if (t.dataset.bg) { this.prefs.bg = t.dataset.bg; this.savePrefs(); this.refreshUI(); }
        else if (t.dataset.act === "close") this.close();
        else if (t.dataset.act === "undo") this.undo();
        else if (t.dataset.act === "redo") this.redo();
        else if (t.dataset.act === "clear") this.clear();
        else if (t.dataset.act === "copy") this.copy();
        else if (t.dataset.act === "send") this.send();
    }

    // Capture-phase listener so Discord doesn't steal keystrokes (it focuses the chat box on any key).
    onKey(e) {
        if (!this.overlay) return;
        e.stopPropagation();
        const k = e.key.toLowerCase();
        const mod = e.ctrlKey || e.metaKey;
        if (k === "escape") this.close();
        else if (mod && k === "z") e.shiftKey ? this.redo() : this.undo();
        else if (mod && k === "y") this.redo();
        else if (mod && k === "enter") this.send();
        else if (mod && k === "c") this.copy();
        else if (!mod && k === "b") this.setTool("pen");
        else if (!mod && k === "e") this.setTool("eraser");
        else if (!mod && k === "f") this.setTool("fill");
        else if (!mod && k === "l") this.setTool("line");
        else if (!mod && k === "r") this.setTool("rect");
        else if (!mod && k === "o") this.setTool("ellipse");
        else if (!mod && k === "[") this.setSize(this.prefs.size - (this.prefs.size > 10 ? 4 : 1));
        else if (!mod && k === "]") this.setSize(this.prefs.size + (this.prefs.size >= 10 ? 4 : 1));
        else return;
        e.preventDefault();
    }

    setTool(tool) { this.prefs.tool = tool; this.savePrefs(); this.refreshUI(); }
    setSize(size) { this.prefs.size = Math.max(1, Math.min(60, size)); this.savePrefs(); this.refreshUI(); }
    setColor(color) {
        this.prefs.color = color;
        if (this.prefs.tool === "eraser") this.prefs.tool = "pen";
        this.savePrefs();
        this.refreshUI();
    }

    // ---------- drawing ----------

    toCanvas(e) {
        const r = this.canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    }

    updateCursorSize() {
        if (!this.overlay) return;
        const r = this.canvas.getBoundingClientRect();
        const px = Math.max(4, this.prefs.size * (r.width / W || 1));
        this.cursor.style.width = this.cursor.style.height = px + "px";
    }

    moveCursor(e) {
        const r = this.stage.getBoundingClientRect();
        this.cursor.style.left = (e.clientX - r.left) + "px";
        this.cursor.style.top = (e.clientY - r.top) + "px";
    }

    snapshot() {
        this.undoStack.push(this.ctx.getImageData(0, 0, W, H));
        if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
        this.redoStack = [];
    }

    pointerDown(e) {
        // Right mouse button and a pen's eraser end (button 5) erase no matter which tool is picked.
        const erase = e.button === 2 || e.button === 5;
        if (e.button !== 0 && !erase) return;
        const p = this.toCanvas(e);
        if (e.altKey && !erase) {
            this.pickColor(Math.floor(p.x), Math.floor(p.y));
            return;
        }
        const tool = erase ? "eraser" : this.prefs.tool;
        if (tool === "fill") {
            this.snapshot();
            this.floodFill(Math.floor(p.x), Math.floor(p.y), this.prefs.color);
            this.refreshUI();
            return;
        }
        this.canvas.setPointerCapture(e.pointerId);
        this.snapshot();
        // `before` is the canvas as it was when the stroke started, so previews can be redrawn from scratch.
        this.stroke = { tool, start: p, last: p, mid: p, pressure: this.pressureOf(e), before: this.undoStack[this.undoStack.length - 1] };
        // A tap with no movement should still leave a dot.
        if (!SHAPES.includes(tool)) this.drawSegment(p, p, p);
        this.refreshUI();
    }

    pointerMove(e) {
        this.updateCursorSize();
        this.moveCursor(e);
        if (!this.stroke) return;
        const s = this.stroke;
        // Shapes, and brush strokes with Shift held, are previews that get redrawn on every move.
        if (SHAPES.includes(s.tool) || e.shiftKey || s.straight) {
            if (!SHAPES.includes(s.tool)) s.straight = true;
            s.last = this.toCanvas(e);
            s.moved = true;
            this.ctx.putImageData(s.before, 0, 0);
            this.drawShape(s.straight ? "line" : s.tool, s.start, s.last, e.shiftKey);
            return;
        }
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        for (const ev of (events.length ? events : [e])) {
            const p = this.toCanvas(ev);
            const mid = { x: (s.last.x + p.x) / 2, y: (s.last.y + p.y) / 2 };
            s.pressure = this.pressureOf(ev);
            this.drawSegment(s.mid, s.last, mid);
            s.mid = mid;
            s.last = p;
        }
    }

    pointerUp(e) {
        if (!this.stroke) return;
        const s = this.stroke;
        if (SHAPES.includes(s.tool) || s.straight) {
            // A click without dragging draws nothing, so don't leave an empty undo step behind.
            if (!s.moved) { this.undoStack.pop(); this.refreshUI(); }
        } else {
            this.drawSegment(s.mid, s.last, s.last);
        }
        this.stroke = null;
    }

    pressureOf(e) {
        // Mice report 0.5 constantly; only pens get pressure-sensitive width.
        return e.pointerType === "pen" && e.pressure > 0 ? 0.25 + e.pressure * 1.25 : 1;
    }

    // Sets up stroke style for the current tool, runs `path` to build the path, then strokes it.
    strokePath(width, path) {
        const c = this.ctx;
        const eraser = (this.stroke?.tool ?? this.prefs.tool) === "eraser";
        c.save();
        c.globalCompositeOperation = eraser ? "destination-out" : "source-over";
        c.strokeStyle = eraser ? "#000" : this.prefs.color;
        c.lineWidth = width * (eraser ? 1.5 : 1);
        c.lineCap = c.lineJoin = "round";
        c.beginPath();
        path(c);
        c.stroke();
        c.restore();
    }

    drawSegment(from, ctrl, to, pressure = this.stroke.pressure) {
        this.strokePath(this.prefs.size * pressure, c => {
            c.moveTo(from.x, from.y);
            c.quadraticCurveTo(ctrl.x, ctrl.y, to.x, to.y);
            if (from.x === to.x && from.y === to.y) c.lineTo(to.x + 0.01, to.y);
        });
    }

    // `constrain` (Shift) snaps lines to 45 degree steps and makes rectangles and ellipses square.
    drawShape(shape, a, b, constrain) {
        let dx = b.x - a.x, dy = b.y - a.y;
        if (constrain && shape === "line") {
            const step = Math.PI / 4;
            const ang = Math.round(Math.atan2(dy, dx) / step) * step;
            const len = Math.hypot(dx, dy);
            dx = Math.cos(ang) * len;
            dy = Math.sin(ang) * len;
        } else if (constrain) {
            const m = Math.max(Math.abs(dx), Math.abs(dy));
            dx = Math.sign(dx || 1) * m;
            dy = Math.sign(dy || 1) * m;
        }
        this.strokePath(this.prefs.size, c => {
            if (shape === "line") {
                c.moveTo(a.x, a.y);
                c.lineTo(a.x + dx, a.y + dy);
            } else if (shape === "rect") {
                c.rect(a.x, a.y, dx, dy);
            } else {
                c.ellipse(a.x + dx / 2, a.y + dy / 2, Math.abs(dx / 2), Math.abs(dy / 2), 0, 0, Math.PI * 2);
            }
        });
    }

    // Picks the color under the cursor as it would look in the sent image, background included.
    pickColor(x, y) {
        const [r, g, b, a] = this.ctx.getImageData(x, y, 1, 1).data;
        const bg = BACKGROUNDS[this.prefs.bg];
        if (!a && !bg) return;
        const n = bg ? parseInt(bg.slice(1), 16) : 0;
        const under = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        const k = bg ? a / 255 : 1;
        const hex = [r, g, b].map((v, i) => Math.round(v * k + under[i] * (1 - k)).toString(16).padStart(2, "0")).join("");
        this.setColor("#" + hex);
    }

    floodFill(x, y, hex) {
        if (x < 0 || y < 0 || x >= W || y >= H) return;
        const img = this.ctx.getImageData(0, 0, W, H);
        const d = img.data;
        const i0 = (y * W + x) * 4;
        const t = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]];
        const n = parseInt(hex.slice(1), 16);
        const f = [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
        if (t.every((v, k) => v === f[k])) return;
        const TOL = 48;
        const match = i => Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) + Math.abs(d[i + 3] - t[3]) <= TOL;
        const seen = new Uint8Array(W * H);
        const stack = [x, y];
        while (stack.length) {
            const py = stack.pop(), px0 = stack.pop();
            let px = px0;
            while (px >= 0 && !seen[py * W + px] && match((py * W + px) * 4)) px--;
            px++;
            let up = false, down = false;
            while (px < W && !seen[py * W + px] && match((py * W + px) * 4)) {
                const p = py * W + px, i = p * 4;
                seen[p] = 1;
                d[i] = f[0]; d[i + 1] = f[1]; d[i + 2] = f[2]; d[i + 3] = 255;
                if (py > 0) {
                    const ok = !seen[p - W] && match(i - W * 4);
                    if (ok && !up) stack.push(px, py - 1);
                    up = ok;
                }
                if (py < H - 1) {
                    const ok = !seen[p + W] && match(i + W * 4);
                    if (ok && !down) stack.push(px, py + 1);
                    down = ok;
                }
                px++;
            }
        }
        // Grow the fill by one pixel so antialiased line edges don't leave a halo.
        const out = new Uint8ClampedArray(d);
        for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
            const p = py * W + px;
            if (seen[p]) continue;
            if ((px > 0 && seen[p - 1]) || (px < W - 1 && seen[p + 1]) || (py > 0 && seen[p - W]) || (py < H - 1 && seen[p + W])) {
                const i = p * 4, a = d[i + 3] / 255;
                out[i] = d[i] * a + f[0] * (1 - a);
                out[i + 1] = d[i + 1] * a + f[1] * (1 - a);
                out[i + 2] = d[i + 2] * a + f[2] * (1 - a);
                out[i + 3] = 255;
            }
        }
        img.data.set(out);
        this.ctx.putImageData(img, 0, 0);
    }

    undo() {
        if (!this.undoStack.length) return;
        this.redoStack.push(this.ctx.getImageData(0, 0, W, H));
        this.ctx.putImageData(this.undoStack.pop(), 0, 0);
        this.refreshUI();
    }

    redo() {
        if (!this.redoStack.length) return;
        this.undoStack.push(this.ctx.getImageData(0, 0, W, H));
        this.ctx.putImageData(this.redoStack.pop(), 0, 0);
        this.refreshUI();
    }

    clear() {
        if (this.isBlank()) return;
        this.snapshot();
        this.ctx.clearRect(0, 0, W, H);
        this.refreshUI();
    }

    isBlank() {
        const d = this.ctx.getImageData(0, 0, W, H).data;
        for (let i = 3; i < d.length; i += 4) if (d[i]) return false;
        return true;
    }

    // ---------- output ----------

    exportBlob() {
        const out = document.createElement("canvas");
        out.width = W;
        out.height = H;
        const c = out.getContext("2d");
        const bg = BACKGROUNDS[this.prefs.bg];
        if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); }
        c.drawImage(this.canvas, 0, 0);
        return new Promise(res => out.toBlob(res, "image/png"));
    }

    async copy() {
        try {
            const blob = await this.exportBlob();
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            BdApi.UI.showToast("Sketch copied to clipboard", { type: "success" });
        } catch (err) {
            BdApi.UI.showToast("Couldn't copy: " + err.message, { type: "error" });
        }
    }

    findUploader() {
        const W_ = BdApi.Webpack;
        return W_.getByKeys?.("promptToUpload")
            || W_.getModule(m => typeof m?.promptToUpload === "function")
            || null;
    }

    async send() {
        if (this.isBlank()) {
            BdApi.UI.showToast("Draw something first!", { type: "info" });
            return;
        }
        const blob = await this.exportBlob();
        const file = new File([blob], `scratch-${Date.now()}.png`, { type: "image/png" });

        // 1) Discord's own uploader: stages the image as an attachment on the chat bar.
        try {
            const uploader = this.findUploader();
            const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
            const channel = channelId && BdApi.Webpack.getStore("ChannelStore")?.getChannel(channelId);
            if (uploader && channel) {
                uploader.promptToUpload([file], channel, 0);
                return this.afterSend();
            }
        } catch (err) {
            console.warn("[Scratchboard] promptToUpload failed, falling back to paste", err);
        }

        // 2) Pretend the image was pasted into the chat box.
        const box = this.chatBox();
        if (box) {
            const dt = new DataTransfer();
            dt.items.add(file);
            this.close();
            box.focus();
            box.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
            return this.afterSend();
        }

        // 3) Last resort: clipboard.
        await this.copy();
        BdApi.UI.showToast("Couldn't find the chat box, paste it with Ctrl+V instead", { type: "warning" });
    }

    afterSend() {
        this.close();
        this.snapshot(); // so Ctrl+Z next time brings the last sketch back
        this.ctx.clearRect(0, 0, W, H);
        BdApi.UI.showToast("Sketch attached, press Enter to send", { type: "success" });
        setTimeout(() => this.chatBox()?.focus(), 50);
    }

    // The chat box the board was opened from, or the main one if Discord re-rendered it since.
    chatBox() {
        const area = (this.targetArea?.isConnected && this.targetArea) || document.querySelector('[class*="channelTextArea"]');
        return area?.querySelector('[role="textbox"]');
    }
};
