var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HealthComp_instances, _HealthComp_consume;
class Util {
    static str(o, space) {
        return JSON.stringify(o, null, space);
    }
    static clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
}
const NoFunc = (() => { });
class NoContextError extends Error {
    constructor() {
        super("Cannot get context 2D.");
        this.name = "NoContextError";
    }
}
class NoCanvasError extends Error {
    constructor() {
        super("Did not receive HTMLCanvasElement or HTMLElement in scene.");
        this.name = "NoCanvasError";
    }
}
class ExistingProcessError extends Error {
    constructor() {
        super("A process already exists, cannot create new process.");
        this.name = "ExistingProcessError";
    }
}
class NoProcessError extends Error {
    constructor() {
        super("A process does not exist.");
        this.name = "NoProcessError";
    }
}
class AlreadyUsingError extends Error {
    constructor() {
        super("Already using this component, cannot use again.");
        this.name = "AlreadyUsingError";
    }
}
class Store {
    constructor() {
        this.store = new Map();
    }
    get(key) {
        return this.store.get(key);
    }
    set(key, value) {
        this.store.set(key, value);
    }
    has(key) {
        return this.store.has(key);
    }
    del(key) {
        return this.store.delete(key);
    }
    keys() {
        return this.store.keys();
    }
    values() {
        return this.store.values();
    }
    items() {
        return this.store.entries();
    }
}
class PhantomEvent {
    constructor(name) {
        this.name = name;
    }
}
class PhantomAliveEvent extends PhantomEvent {
    constructor() { super("alive"); }
}
class PhantomAddedEvent extends PhantomEvent {
    constructor() { super("added"); }
}
class PhantomRemovedEvent extends PhantomEvent {
    constructor() { super("removed"); }
}
class PhantomHealthCompHurtEvent extends PhantomEvent {
    constructor() { super("hurt"); }
}
class PhantomHealthCompDieEvent extends PhantomEvent {
    constructor() { super("die"); }
}
class PhantomHealthCompHealEvent extends PhantomEvent {
    constructor() { super("heal"); }
}
class Comp {
    constructor(ent) {
        this.ent = ent;
    }
    consume(k, e) {
        this.ent.consume(k, e);
    }
}
class HealthComp extends Comp {
    constructor(ent, opts) {
        var _a;
        super(ent);
        _HealthComp_instances.add(this);
        this.hp = (_a = opts.hp) !== null && _a !== void 0 ? _a : 0;
        this.mhp = opts.mhp;
        this.onHurt = opts.onHurt;
        this.onDie = opts.onDie;
        this.onHeal = opts.onHeal;
    }
    hurt(dmg) {
        this.hp -= dmg;
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onHurt, "hurt", new PhantomHealthCompHurtEvent());
        if (this.hp <= 0)
            this.die();
    }
    die() {
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onDie, "die", new PhantomHealthCompDieEvent());
    }
    heal(hp) {
        this.hp += hp;
        if (this.mhp)
            this.hp = Math.min(this.hp, this.mhp);
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onHeal, "heal", new PhantomHealthCompHealEvent());
    }
}
_HealthComp_instances = new WeakSet(), _HealthComp_consume = function _HealthComp_consume(fn, k, e) {
    if (fn)
        fn(e);
    else
        this.consume(k, e);
};
class InvComp extends Comp {
    constructor(ent, opts) {
        super(ent);
        this.size = opts.size;
        this.inv = [];
    }
    add(...items) {
        for (let i = 0; i < items.length; i++) {
            if (this.size && this.inv.length >= this.size)
                continue;
            this.inv.push(items[i]);
        }
    }
    rm(...items) {
        for (const i of items)
            if (this.has(i))
                this.inv.splice(this.idxOf(i), 1);
    }
    has(...items) {
        return items.every(i => this.inv.includes(i));
    }
    idxOf(i) {
        return this.inv.indexOf(i);
    }
    len() {
        return this.inv.length;
    }
    at(i) {
        return this.inv[i];
    }
}
const PhantomCompRecord = {
    health: HealthComp,
    inv: InvComp
};
class SceneComp {
    constructor(scene) {
        this.scene = scene;
    }
}
class SceneTilesComp extends SceneComp {
    constructor(scene, opts) {
        var _a;
        super(scene);
        this.size = (_a = opts.size) !== null && _a !== void 0 ? _a : 0;
        this.nth = opts.nth;
    }
}
const PhantomSceneCompRecord = {
    tiles: SceneTilesComp
};
const KeyCodeMap = {
    "a": "KeyA", "b": "KeyB", "c": "KeyC", "d": "KeyD", "e": "KeyE", "f": "KeyF",
    "g": "KeyG", "h": "KeyH", "i": "KeyI", "j": "KeyJ", "k": "KeyK", "l": "KeyL",
    "m": "KeyM", "n": "KeyN", "o": "KeyO", "p": "KeyP", "q": "KeyQ", "r": "KeyR",
    "s": "KeyS", "t": "KeyT", "u": "KeyU", "v": "KeyV", "w": "KeyW", "x": "KeyX",
    "y": "KeyY", "z": "KeyZ",
    "1": "Digit1", "2": "Digit2", "3": "Digit3", "4": "Digit4", "5": "Digit5",
    "6": "Digit6", "7": "Digit7", "8": "Digit8", "9": "Digit9",
    "shift": ["ShiftLeft", "ShiftRight"], "lshift": "ShiftLeft", "rshift": "ShiftRight",
    "ctrl": ["ControlLeft", "ControlRight"], "lctrl": "ControlLeft", "rctrl": "ControlRight",
    "alt": ["AltLeft", "AltRight"], "lalt": "AltLeft", "ralt": "AltRight",
    "f1": "F1", "f2": "F2", "f3": "F3", "f4": "F4", "f5": "F5", "f6": "F6", "f7": "F7",
    "f8": "F8", "f9": "F9", "f10": "F10", "f11": "F11", "f12": "F12",
    "esc": "Escape", "tab": "Tab", "back": "Backspace", "bkquote": "Backquote", "quote": "Quote",
    "comma": "Comma", "dot": "Period", "fslash": "Slash", "bslash": "Backslash",
    "caps": "CapsLock", "ctx": "ContextMenu", "meta": ["MetaLeft", "MetaRight"],
    "lmeta": "MetaLeft", "rmeta": "MetaRight", "ent": "Enter", "ins": "Insert",
    "del": "Delete", "home": "Home", "pgu": "PageUp", "pgd": "PageDown", "numlk": "NumLock",
    "end": "End", "pause": "Pause", "scrlk": "ScrollLock", "ndiv": "NumpadDivide",
    "nmult": "NumpadMultiply", "nsub": "NumpadSubtract", "nadd": "NumpadAdd",
    "nent": "NumpadEnter", "ndel": "NumpadDecimal",
    "n7": "Numpad7", "n8": "Numpad8", "n9": "Numpad9", "n4": "Numpad4", "n5": "Numpad5",
    "n6": "Numpad6", "n1": "Numpad1", "n2": "Numpad2", "n3": "Numpad3", "n0": "Numpad0",
    "space": "Space", "arw": ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
    "arwl": "ArrowLeft", "arwr": "ArrowRight", "arwu": "ArrowUp", "arwd": "ArrowDown"
};
const KeyCodeMapReverse = {};
for (const [k, v] of Object.entries(KeyCodeMap)) {
    if (Array.isArray(v))
        continue;
    KeyCodeMapReverse[v] = k;
}
class Phantom2dEntity {
    constructor(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.collide = (_a = opts.collide) !== null && _a !== void 0 ? _a : ((o) => { });
        this.upd = (_b = opts.upd) !== null && _b !== void 0 ? _b : NoFunc;
        this.x = (_c = opts.x) !== null && _c !== void 0 ? _c : 0;
        this.y = (_d = opts.y) !== null && _d !== void 0 ? _d : 0;
        this.rot = (_e = opts.rot) !== null && _e !== void 0 ? _e : 0;
        this.width = (_f = opts.width) !== null && _f !== void 0 ? _f : 0;
        this.height = (_g = opts.height) !== null && _g !== void 0 ? _g : 0;
        this.evStore = new Store();
        this.color = (_h = opts.color) !== null && _h !== void 0 ? _h : "#fff";
        if (opts.custom)
            for (const [k, v] of Object.entries(opts.custom)) {
                this[k] = v;
            }
        this.comps = new Store();
    }
    setPos(x, y) {
        if (typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        }
        else if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
    }
    setRot(rad) {
        this.rot = rad;
    }
    setWidth(w) {
        this.width = w;
    }
    setHeight(h) {
        this.height = h;
    }
    getFVec() {
        const dx = Math.cos(this.rot);
        const dy = Math.sin(this.rot);
        return new Vector(dx, dy);
    }
    move(dist, axis) {
        if (axis == "x" || axis == 0)
            this.x += dist;
        else if (axis == "y" || axis == 1)
            this.y += dist;
    }
    moveX(dist) {
        this.move(dist, "x");
    }
    moveY(dist) {
        this.move(dist, "y");
    }
    clampPos(min, max, axis) {
        if (axis == "x" || axis == 0)
            this.x = Util.clamp(this.x, min, max);
        else if (axis == "y" || axis == 1)
            this.y = Util.clamp(this.y, min, max);
    }
    clampPosX(min, max) {
        this.clampPos(min, max, "x");
    }
    clampPosY(min, max) {
        this.clampPos(min, max, "y");
    }
    getPos() {
        return new Vector(this.x, this.y);
    }
    getPosX() {
        return this.x;
    }
    getPosY() {
        return this.y;
    }
    setPosX(x) {
        this.x = x;
    }
    setPosY(y) {
        this.y = y;
    }
    on(event, handle) {
        this.evStore.set(event, handle);
    }
    off(event) {
        this.evStore.del(event);
    }
    consume(title, event) {
        const handle = this.evStore.get(title);
        if (handle) {
            handle(event);
        }
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    update() {
        this.upd();
    }
    toString() {
        return Util.str(this);
    }
    apply(preset) {
        preset.apply(this);
    }
    preset() {
        return new Preset(this);
    }
    center() {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    scrPos() {
        return new Vector(this.x + this.width, this.y + this.height);
    }
    scrX() {
        return this.scrPos().x;
    }
    scrY() {
        return this.scrPos().y;
    }
    use(c, opts = {}) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        this.comps.set(c, new (PhantomCompRecord[c])(this, opts));
    }
    unuse(c) {
        this.comps.del(c);
    }
    uses(c) {
        return this.comps.has(c);
    }
    comp(c) {
        return this.comps.get(c);
    }
    static from(opts) {
        return new Phantom2dEntity(opts);
    }
}
class StaticObject extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
    }
    static from(opts) {
        return new StaticObject(opts);
    }
}
class PhysicsObject extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
        this.strength = opts.strength;
        this.gravspd = 0;
    }
    update() {
        this.gravspd += this.strength;
        this.y += this.gravspd;
        super.update();
    }
    static from(opts) {
        return new PhysicsObject(opts);
    }
}
class MovingObject extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
        this.dirX = opts.dirX;
        this.dirY = opts.dirY;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
        this.bouncy = opts.bouncy;
    }
    update() {
        if (this.extLeft >= this.x && this.bouncy && this.dirX == 0) {
            this.x += this.spd;
            this.dirX = 1;
        }
        else if (this.extRight <= this.x && this.bouncy && this.dirX == 1) {
            this.x -= this.spd;
            this.dirX = 0;
        }
        else if (this.extLeft < this.x && !this.bouncy && this.dirX == 0) {
            this.x -= this.spd;
        }
        else if (this.extRight > this.x && this.bouncy && this.dirX == 1) {
            this.x += this.spd;
        }
        if (this.extBtm >= this.y && this.bouncy && this.dirY == 0) {
            this.y += this.spd;
            this.dirY = 1;
        }
        else if (this.extBtm <= this.y && this.bouncy && this.dirY == 1) {
            this.y -= this.spd;
            this.dirY = 0;
        }
        else if (this.extTop < this.y && !this.bouncy && this.dirY == 0) {
            this.y -= this.spd;
        }
        else if (this.extTop > this.y && !this.bouncy && this.dirY == 1) {
            this.y += this.spd;
        }
        super.update();
    }
    static from(opts) {
        return new MovingObject(opts);
    }
}
class BulletObject extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
        this.rot = opts.rot;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
        this.scene = opts.scene;
    }
    update() {
        const fVec = this.getFVec();
        fVec.scale(this.spd);
        this.x += fVec.x;
        this.y += fVec.y;
        // test if its on-screen
        // tolerance of 15px
        const x = this.scrX();
        const y = this.scrY();
        const w = this.scene.width;
        const h = this.scene.height;
        if (x - 15 < w || x + 15 > w || y + 15 > h || y - 15 < h) {
            // self-destruct if its not
            this.scene.rm(this);
        }
    }
    static from(opts) {
        return new BulletObject(opts);
    }
}
class Character extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
        this.gspd = 0;
    }
    setGSpd(spd) {
        this.gspd = spd;
    }
    getGSpd() {
        return this.gspd;
    }
    jump(h) {
        this.gspd = -(h);
    }
}
class PlayableCharacter extends Character {
    constructor(opts) {
        var _a;
        super(opts);
        this.binds = (_a = opts.binds) !== null && _a !== void 0 ? _a : new Store();
        this.keys = new Store();
        window.addEventListener("keydown", (e) => {
            this.keys.set(e.code, true);
        });
        window.addEventListener("keyup", (e) => {
            this.keys.set(e.code, false);
        });
    }
    bind(code, exec) {
        this.binds.set(code, exec);
    }
    unbind(code) {
        this.binds.del(code);
    }
    isBind(code) {
        return this.binds.has(code);
    }
    bindOf(code) {
        return this.binds.get(code);
    }
    update() {
        for (const [k, v] of this.keys.items()) {
            if (v) {
                const exec = this.binds.get(KeyCodeMapReverse[k]);
                if (exec) {
                    exec();
                }
            }
        }
        super.update();
    }
}
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }
}
class Pixel {
    constructor(pxl) {
        this.r = pxl.r;
        this.g = pxl.g;
        this.b = pxl.b;
        this.a = pxl.a;
    }
    static from(data) {
        if (data instanceof ImageData) {
            return Pixel.from(data.data);
        }
        else {
            return new Pixel({ r: data[0], g: data[1], b: data[2], a: data[3] });
        }
    }
}
class Sound {
    constructor(opts) {
        this.src = opts.src;
        this.mime = opts.mime;
        this.aud = new Audio();
        const source = document.createElement("source");
        source.src = this.src;
        source.type = this.mime.startsWith("audio") ? this.mime : `audio/${this.mime}`;
        this.aud.appendChild(source);
    }
    play() {
        this.aud.play();
    }
    pause() {
        this.aud.pause();
    }
    get time() {
        return this.aud.currentTime;
    }
    set time(t) {
        this.aud.currentTime = t;
    }
    get len() {
        return this.aud.duration;
    }
}
class Img {
    constructor(src) {
        this.img = new Image();
        this.img.src = src;
    }
}
class Items {
    constructor() {
        this.items = [];
    }
    add(...items) {
        this.items.push(...items);
        items.forEach(i => i.consume("added", new PhantomAddedEvent()));
    }
    rm(...items) {
        for (const item of items) {
            if (this.has(item)) {
                this.items.splice(this.idxOf(item), 1);
                item.consume("removed", new PhantomRemovedEvent());
            }
        }
    }
    has(...items) {
        return items.every(i => this.items.includes(i));
    }
    idxOf(item) {
        return this.items.indexOf(item);
    }
    filter(cb) {
        return this.items.filter(cb);
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    at(i) {
        return this.items[i];
    }
}
/**
 * The root canvas to display content.
 * @since v0.0.0
 */
class Scene {
    constructor(opts) {
        var _a, _b, _c, _d;
        if (!opts.canvas)
            throw new NoCanvasError();
        this.canvas = opts.canvas instanceof HTMLCanvasElement ? opts.canvas : opts.canvas;
        this.canvas.width = (_a = opts.w) !== null && _a !== void 0 ? _a : 0;
        this.canvas.height = (_b = opts.h) !== null && _b !== void 0 ? _b : 0;
        this.canvas.style.width = (_c = opts.cssW) !== null && _c !== void 0 ? _c : "0px";
        this.canvas.style.height = (_d = opts.cssH) !== null && _d !== void 0 ? _d : "0px";
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new NoContextError();
        this.ctx = ctx;
        this.items = new Items();
        this.evStore = new Store();
        this.lvlStore = new Store();
        this.mousePos = new Vector(0, 0);
        window.addEventListener("mousemove", (e) => {
            this.mousePos = new Vector(e.clientX, e.clientY);
        });
        this.runtime = new Runtime();
        this.comps = new Store();
    }
    get width() {
        return this.canvas.width;
    }
    set width(w) {
        this.canvas.width = w;
    }
    get cssWidth() {
        return this.canvas.style.width;
    }
    set cssWidth(w) {
        this.canvas.style.width = w;
    }
    get height() {
        return this.canvas.height;
    }
    set height(h) {
        this.canvas.height = h;
    }
    get cssHeight() {
        return this.canvas.style.height;
    }
    set cssHeight(h) {
        this.canvas.style.height = h;
    }
    add(...items) {
        this.items.add(...items);
    }
    rm(...items) {
        this.items.rm(...items);
    }
    has(...items) {
        return this.items.has(...items);
    }
    idxOf(item) {
        return this.items.idxOf(item);
    }
    filter(cb) {
        return this.items.filter(cb);
    }
    on(name, handle) {
        this.evStore.set(name, handle);
        this.canvas.addEventListener(name, handle);
    }
    off(name, handle) {
        if (handle)
            this.canvas.removeEventListener(name, handle !== null && handle !== void 0 ? handle : this.evStore.get(name));
        this.evStore.del(name);
    }
    getImgData(pos) {
        return this.ctx.getImageData(pos.x, pos.y, 1, 1);
    }
    setImgData(pos, data) {
        this.ctx.putImageData(data, pos.x, pos.y);
    }
    getPixel(pos) {
        return Pixel.from(this.getImgData(pos));
    }
    setPixel(pos, rgba) {
        const d = this.getImgData(pos);
        d.data[0] = rgba.r;
        d.data[1] = rgba.g;
        d.data[2] = rgba.b;
        d.data[3] = rgba.a;
        this.setImgData(pos, d);
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    getLvl(lvlName) {
        return this.lvlStore.get(lvlName);
    }
    setLvl(lvlName, lvl) {
        this.lvlStore.set(lvlName, lvl);
    }
    hasLvl(lvlName) {
        return this.lvlStore.has(lvlName);
    }
    delLvl(lvlName) {
        this.lvlStore.del(lvlName);
    }
    get color() {
        return this.ctx.fillStyle;
    }
    set color(color) {
        this.ctx.fillStyle = color;
    }
    img(img, x, y, w, h) {
        this.ctx.drawImage(img instanceof HTMLImageElement ? img : img.img, x, y, w, h);
    }
    rect(x, y, w, h, color) {
        this.color = color;
        this.ctx.fillRect(x, y, w, h);
    }
    bg(color) {
        this.rect(0, 0, this.width, this.height, color);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    update() {
        this.forEach(i => i.update());
        this.testCols();
    }
    testCols() {
        this.forEach(a => {
            this.forEach(b => {
                if (a == b)
                    return;
                if (isCol(a, b)) {
                    a.collide(b);
                }
            });
        });
    }
    render() {
        this.items.forEach(i => {
            this.ctx.save();
            this.ctx.rotate(i.rot);
            this.rect(-i.width / 2, -i.height / 2, i.width, i.height, i.color);
            this.ctx.restore();
        });
    }
    start(postUpd = NoFunc) {
        this.runtime.start(() => {
            this.update();
            this.clear();
            postUpd();
            this.render();
        });
    }
    stop() {
        this.runtime.stop();
    }
    save(file) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
    saveLvl(lvlName, file) {
        const s = new SaveJSON(file);
        s.save(this.getLvl(lvlName), 4);
    }
    fScrOn() {
        this.canvas.requestFullscreen();
    }
    fScrOff() {
        document.exitFullscreen();
    }
    pLockOn() {
        this.canvas.requestPointerLock();
    }
    pLockOff() {
        document.exitPointerLock();
    }
    get delta() {
        return this.runtime.delta;
    }
    use(c, opts = {}) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        this.comps.set(c, new (PhantomSceneCompRecord[c])(this, opts));
    }
    unuse(c) {
        this.comps.del(c);
    }
    uses(c) {
        return this.comps.has(c);
    }
    comp(c) {
        return this.comps.get(c);
    }
    bounds() {
        return this.canvas.getBoundingClientRect();
    }
    clickAt(e) {
        const rect = this.bounds();
        return new Vector(e.clientX - rect.left, e.clientY - rect.top);
    }
}
class Level {
    constructor() {
        this.items = new Items();
    }
    add(...items) {
        this.items.add(...items);
    }
    rm(...items) {
        this.items.rm(...items);
    }
    has(...items) {
        return this.items.has(...items);
    }
    idxOf(item) {
        return this.items.idxOf(item);
    }
    filter(cb) {
        return this.items.filter(cb);
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    save(file) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
}
class Save {
    constructor(opts) {
        this.file = opts.file;
        this.mime = opts.mime;
        this.ext = opts.ext;
    }
    save(cont) {
        const blob = new Blob([cont], { type: this.mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${this.file}.${this.ext}`;
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
class SaveJSON extends Save {
    constructor(file) {
        super({ file, mime: "application/json", ext: "json" });
    }
    save(cont, indent = 4) {
        super.save(Util.str(cont, indent));
    }
}
class Preset {
    constructor(ent) {
        this.atts = {};
        Object.assign(this.atts, ent);
    }
    save(out) {
        const s = new SaveJSON(out);
        s.save(this, 4);
    }
    apply(ent) {
        Object.assign(ent, this.atts);
    }
}
class Raycast {
    constructor(opts) {
        this.origin = opts.origin;
        this.angle = opts.angle;
        this.dist = opts.dist;
        this.scene = opts.scene;
    }
    cast() {
        let res = null;
        const dir = new Vector(Math.cos(this.angle), Math.sin(this.angle));
        for (const i of this.scene.items.items) {
            const hit = rayInterRect(this.origin, dir, i, this.scene);
            if (hit) {
                if (res && hit < res.dist)
                    res = new RaycastIntersecton(hit, i, new Vector(this.origin.x + dir.x * hit, this.origin.y + dir.y * hit));
            }
        }
        return res;
    }
}
class RaycastIntersecton {
    constructor(dist, obj, point) {
        this.dist = dist;
        this.obj = obj;
        this.point = point;
    }
}
class Runtime {
    constructor() {
        this.processId = -1;
        this.delta = 0;
    }
    start(fn) {
        if (this.processId != -1)
            throw new ExistingProcessError();
        const out = () => {
            fn();
            this.delta++;
            this.processId = requestAnimationFrame(out);
        };
        out();
    }
    stop() {
        if (this.processId == -1)
            throw new NoProcessError();
        cancelAnimationFrame(this.processId);
        this.delta = 0;
    }
}
class Geom {
    constructor(name) {
        this.name = name;
    }
}
class GeomRect extends Geom {
    constructor() { super("rect"); }
}
class GeomCirlce extends Geom {
    constructor() { super("circle"); }
}
function isCol(a, b) {
    const w1 = a.width;
    const h1 = a.height;
    const x1 = a.x;
    const y1 = a.y;
    const w2 = b.width;
    const h2 = b.height;
    const x2 = b.x;
    const y2 = b.y;
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}
function rayInterRect(origin, dir, rect, scene) {
    const uv = uvVec(dir, scene.width, scene.height);
    const t1 = (rect.x - origin.x) / uv.x;
    const t2 = (rect.scrX() - origin.x) / uv.x;
    const t3 = (rect.y - origin.y) / uv.y;
    const t4 = (rect.scrY() - origin.y) / uv.y;
    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    if (tmax < 0 || tmin > tmax)
        return null;
    return tmin >= 0 ? tmin : tmax;
}
function uvVec(p, w, h) {
    let u = p.x / (w - 1);
    let v = p.y / (h - 1);
    u = u * 2 - 1;
    v = v * 2 - 1;
    let aspect = w / h;
    u *= aspect;
    return new Vector(u, v);
}
export { NoFunc, NoContextError, ExistingProcessError, NoCanvasError, NoProcessError, PhantomEvent, PhantomAliveEvent, PhantomAddedEvent, PhantomRemovedEvent, Phantom2dEntity, StaticObject, PhysicsObject, MovingObject, BulletObject, Scene, Character, PlayableCharacter, Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel, Raycast, RaycastIntersecton, isCol, rayInterRect, uvVec };
