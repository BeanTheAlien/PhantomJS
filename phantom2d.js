var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HealthComp_instances, _HealthComp_consume, _Img_instances, _a, _Img_realSrc, _Scene_instances, _Scene_tagTest, _Cooldown_instances, _Cooldown_handle;
/**
 * Various utilities.
 * @since v0.0.0
 */
class Util {
    static str(o, space) {
        return JSON.stringify(o, null, space);
    }
    static clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
    static strOf(o) {
        return typeof o == "string" ? o : Util.str(o);
    }
}
class ArrayUtil {
    static add(arr, ...items) {
        arr.push(...items);
    }
    static rm(arr, ...items) {
        for (const i of items) {
            if (ArrayUtil.has(arr, i)) {
                arr.splice(arr.indexOf(i), 1);
            }
        }
    }
    static has(arr, ...items) {
        return items.every(i => arr.includes(i));
    }
}
/**
 * A simple, no-exec function shorthand.
 * @since v0.0.0
 */
const NoFunc = (() => { });
/**
 * A simplified class for creating errors.
 * @since v1.0.5
 */
class ErrRoot extends Error {
    constructor(name, msg) {
        super(msg);
        this.name = name;
    }
}
/**
 * Thrown when `CanvasRenderingContext2D` cannot be gotten.
 * @since v0.0.0
 */
class NoContextError extends ErrRoot {
    constructor() {
        super("NoContextError", "Cannot get context 2D.");
    }
}
/**
 * Thrown when the `Scene` constructor does not receive an `HTMLCanvasElement` or `HTMLElement`.
 * @since v0.0.0
 * @example
 * ```
 * const el = document.getElementById("not-exists")
 * const scene = new Scene({ canvas: el }); // cannot convert undefined to HTMLCanvasElement
 * ```
 */
class NoCanvasError extends ErrRoot {
    constructor() {
        super("NoCanvasError", "Did not receive HTMLCanvasElement or HTMLElement in scene.");
    }
}
/**
 * Thrown when attempting to run a process while it's running.
 * @since v0.0.0
 * @example
 * ```
 * const rt = new Runtime();
 * rt.start(() => {}); // started process
 * rt.start(() => {}); // process already started
 * ```
 */
class ExistingProcessError extends ErrRoot {
    constructor() {
        super("ExistingProcessError", "A process already exists, cannot create new process.");
    }
}
/**
 * Thrown when attempting to stop a process that does not exist.
 * @since v0.0.0
 * @example
 * ```
 * const rt = new Runtime();
 * rt.stop(); // no process has been started
 * ```
 */
class NoProcessError extends ErrRoot {
    constructor() {
        super("NoProcessError", "A process does not exist.");
    }
}
/**
 * Thrown by trying to use a component that's already in use.
 * @since v0.0.0
 * @example
 * ```
 * const ent = new Entity({});
 * ent.use("health"); // use HealthComp
 * ent.use("health"); // cannot use again
 * ```
 */
class AlreadyUsingError extends ErrRoot {
    constructor() {
        super("AlreadyUsingError", "Already using this component, cannot use again.");
    }
}
/**
 * Thrown when a component requires a reference to the scene, but there is none.
 *
 * Only thrown during `Comp.protoype.update`.
 * @since v0.0.0
 * @example
 * ```
 * const canvas = document.getElementById("canvas");
 * const scene = new Scene({ canvas });
 * const ent = new Entity({});
 * ent.use("sprite", { frames: ["frame0.jpg"] }); // no scene property
 * scene.add(ent);
 * scene.start(); // cannot render without scene
 * ```
 */
class NoSceneAvailableError extends ErrRoot {
    constructor() {
        super("NoSceneAvailableError", "A component requires a scene reference, but none was provided.");
    }
}
/**
 * Thrown when attempting to get a crucial value and failed.
 *
 * Caused when an index exceeds the length of an array.
 * @since v0.0.0
 * @example
 * ```
 * const canvas = document.getElementById("canvas");
 * const scene = new Scene({ canvas });
 * const ent = new Entity({});
 * ent.use("sprite", { scene: canvas }); // no frames property (frames[0] is undefineds)
 * scene.add(ent);
 * scene.start(); // throws error on first tick of ent
 * ```
 */
class OutOfBoundsError extends ErrRoot {
    constructor() {
        super("OutOfBoundsError", "Index exceeds length; could not get crucial value.");
    }
}
/**
 * A storage for items.
 * @since v0.0.0
 */
class Store {
    constructor() {
        this.store = new Map();
    }
    /**
     * Retrieves an entry.
     * @param key The key to get.
     * @returns {TO | undefined} The entry or nothing.
     * @since v0.0.0
     */
    get(key) {
        return this.store.get(key);
    }
    /**
     * Sets an entry.
     * @param key The key to set.
     * @param value The value of the new entry.
     * @since v0.0.0
     */
    set(key, value) {
        this.store.set(key, value);
    }
    /**
     * Returns whether this store contains an item.
     * @param key The key to get.
     * @returns {boolean} If this item is contained.
     * @since v0.0.0
     */
    has(key) {
        return this.store.has(key);
    }
    /**
     * Removes an entry from this storage.
     * @param key The key to delete.
     * @returns {boolean} If the key was deleted.
     * @since v0.0.0
     */
    del(key) {
        return this.store.delete(key);
    }
    /**
     * Returns an iterator for this keys.
     * @returns {Iter<TI>} The iterator.
     * @since v0.0.0
     */
    keys() {
        return this.store.keys();
    }
    /**
     * Returns an iterator for this values.
     * @returns {Iter<TI>} The iterator.
     * @since v0.0.0
     */
    values() {
        return this.store.values();
    }
    /**
     * Returns an iterator for this entries.
     * @returns {Iter<[TI, TO]>} The iterator.
     * @since v0.0.0
     */
    items() {
        return this.store.entries();
    }
}
/**
 * A metaphorical "box" of items.
 *
 * Useful for array-based classes.
 * @since v1.0.8
 */
class ItemBox {
    constructor() {
        this.stuff = [];
    }
    add(...stuff) {
        ArrayUtil.add(this.stuff, stuff);
    }
    rm(...stuff) {
        ArrayUtil.rm(this.stuff, stuff);
    }
    forEach(cb) {
        this.stuff.forEach(cb);
    }
    has(...stuff) {
        return ArrayUtil.has(this.stuff, stuff);
    }
    find(cb) {
        return this.stuff.find(cb);
    }
    filter(cb) {
        return this.stuff.filter(cb);
    }
    some(cb) {
        return this.stuff.some(cb);
    }
}
/**
 * The synthetic event class.
 * @since v0.0.0
 */
class PhantomEvent {
    constructor(name) {
        this.name = name;
    }
}
/**
 * Fired when this first constructs.
 * @since v0.0.0
 */
class PhantomAliveEvent extends PhantomEvent {
    constructor() { super("alive"); }
}
/**
 * Fired when this ent is added to the scene.
 * @since v0.0.0
 */
class PhantomAddedEvent extends PhantomEvent {
    constructor() { super("added"); }
}
/**
 * Fired when this ent is removed from the scene.
 * @since v0.0.0
 */
class PhantomRemovedEvent extends PhantomEvent {
    constructor() { super("removed"); }
}
/**
 * Fired when this ent takes damage.
 * @since v0.0.0
 */
class PhantomHealthCompHurtEvent extends PhantomEvent {
    constructor() { super("hurt"); }
}
/**
 * Fired when this ent dies.
 * @since v0.0.0
 */
class PhantomHealthCompDieEvent extends PhantomEvent {
    constructor() { super("die"); }
}
/**
 * Fired when this ent heals.
 * @since v0.0.0
 */
class PhantomHealthCompHealEvent extends PhantomEvent {
    constructor() { super("heal"); }
}
/**
 * The component class.
 * @since v0.0.0
 */
class Comp {
    constructor(ent) {
        this.ent = ent;
    }
    /**
     * Consumes an event.
     * @param k The event type.
     * @param e The event.
     * @since v0.0.0
     */
    consume(k, e) {
        this.ent.consume(k, e);
    }
    /**
     * The updater for this component.
     *
     * Called during `update`.
     * @since v0.0.0
     */
    upd() { }
}
/**
 * A simple health component.
 * @since v0.0.0
 */
class HealthComp extends Comp {
    constructor(ent, opts) {
        var _b;
        super(ent);
        _HealthComp_instances.add(this);
        this.hp = (_b = opts.hp) !== null && _b !== void 0 ? _b : 0;
        this.mhp = opts.mhp;
        this.onHurt = opts.onHurt;
        this.onDie = opts.onDie;
        this.onHeal = opts.onHeal;
    }
    /**
     * Hurts this entity.
     * @param dmg The damage to receive.
     * @since v0.0.0
     */
    hurt(dmg) {
        this.hp -= dmg;
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onHurt, "hurt", new PhantomHealthCompHurtEvent());
        if (this.hp <= 0)
            this.die();
    }
    /**
     * Kills this entity.
     * @since v0.0.0
     */
    die() {
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onDie, "die", new PhantomHealthCompDieEvent());
    }
    /**
     * Heals this entity.
     * @param hp The health to heal.
     * @since v0.0.0
     */
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
/**
 * A simple inventory system.
 * @since v0.0.0
 */
class InvComp extends Comp {
    constructor(ent, opts) {
        super(ent);
        this.size = opts.size;
        this.inv = [];
    }
    /**
     * Adds new items.
     * @param items The items to add.
     * @since v0.0.0
     */
    add(...items) {
        ArrayUtil.add(this.inv, ...items);
        if (this.size && this.inv.length > this.size)
            this.inv.length = this.size;
    }
    /**
     * Removes items.
     * @param items The items to remove.
     * @since v0.0.0
     */
    rm(...items) {
        ArrayUtil.rm(this.inv, ...items);
    }
    /**
     * Tests if this inventory contains the items passed.
     * @param items The items to check.
     * @returns If it contains all the items.
     * @since v0.0.0
     */
    has(...items) {
        return ArrayUtil.has(this.inv, ...items);
    }
    /**
     * Returns the index of an item.
     * @param i The item.
     * @returns The index.
     * @since v0.0.0
     */
    idxOf(i) {
        return this.inv.indexOf(i);
    }
    /**
     * Returns the length of the inventory.
     * @returns The length.
     * @since v0.0.0
     */
    len() {
        return this.inv.length;
    }
    /**
     * Returns an item at the index.
     * @param i The index.
     * @returns The item.
     * @since v0.0.0
     */
    at(i) {
        return this.inv[i];
    }
}
/**
 * A displayable sprite, packages multiple image frames to use.
 * @since v0.0.0
 */
class SpriteComp extends Comp {
    constructor(ent, opts) {
        var _b;
        super(ent);
        this.frames = ((_b = opts.frames) !== null && _b !== void 0 ? _b : []).map(Img.from);
        this.scene = opts.scene;
        this.idx = 0;
    }
    frame(idx) {
        this.idx = idx;
    }
    at(idx) {
        return this.frames[idx];
    }
    cur() {
        return this.at(this.idx);
    }
    add(...items) {
        ArrayUtil.add(this.frames, ...items);
    }
    rm(...items) {
        ArrayUtil.rm(this.frames, ...items);
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        const c = this.cur();
        if (!c)
            throw new OutOfBoundsError();
        this.scene.img(c, this.ent.x, this.ent.y, this.ent.width, this.ent.height);
    }
}
class PointAtCompBase extends Comp {
    constructor(ent, opts) {
        super(ent);
        this.scene = opts.scene;
    }
}
class PointAtComp extends PointAtCompBase {
    constructor(ent, opts) {
        super(ent, opts);
        this.point = opts.point;
    }
    link(ent) {
        this.point = ent;
    }
    unlink() {
        this.point = undefined;
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        if (!this.point)
            return console.warn("No linked entity! Please add a link.");
        this.ent.setRot(this.scene.rotBtwn(this.ent, this.point));
    }
}
class PointAtMouseComp extends PointAtCompBase {
    constructor(ent, opts) {
        super(ent, opts);
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        this.ent.setRot(this.scene.rotToMouse(this.ent));
    }
}
/**
 * The record used to create components.
 * @since v0.0.0
 */
const PhantomCompRecord = {
    health: HealthComp,
    inv: InvComp,
    sprite: SpriteComp,
    pointat: PointAtComp,
    pointatmouse: PointAtMouseComp
};
/**
 * The class used for creating components for the scene.
 * @since v0.0.0
 */
class SceneComp {
    constructor(scene) {
        this.scene = scene;
    }
}
/**
 * A simple tile display for the scene.
 * @since v0.0.0
 */
class SceneTilesComp extends SceneComp {
    constructor(scene, opts) {
        var _b;
        super(scene);
        this.size = (_b = opts.size) !== null && _b !== void 0 ? _b : 0;
        this.nth = opts.nth;
    }
}
/**
 * The record used to create scene components.
 * @since v0.0.0
 */
const PhantomSceneCompRecord = {
    tiles: SceneTilesComp
};
/**
 * A map of shorthands to browser keys.
 * @since v0.0.0
 */
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
/**
 * The reverse map of browser keys to shorthands.
 * @since v0.0.0
 */
const KeyCodeMapReverse = {};
for (const [k, v] of Object.entries(KeyCodeMap)) {
    if (Array.isArray(v))
        continue;
    KeyCodeMapReverse[v] = k;
}
/**
 * The root class of all entities, providing base functionality.
 * @since v0.0.0
 */
class Entity {
    constructor(opts) {
        var _b, _c, _d, _f, _g, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        this.collide = (_b = opts === null || opts === void 0 ? void 0 : opts.collide) !== null && _b !== void 0 ? _b : ((o) => { });
        this.upd = (_c = opts === null || opts === void 0 ? void 0 : opts.upd) !== null && _c !== void 0 ? _c : NoFunc;
        this.x = (_f = (_d = opts === null || opts === void 0 ? void 0 : opts.x) !== null && _d !== void 0 ? _d : Entity.defaults.get("x")) !== null && _f !== void 0 ? _f : 0;
        this.y = (_j = (_g = opts === null || opts === void 0 ? void 0 : opts.y) !== null && _g !== void 0 ? _g : Entity.defaults.get("y")) !== null && _j !== void 0 ? _j : 0;
        this.rot = (_l = (_k = opts === null || opts === void 0 ? void 0 : opts.rot) !== null && _k !== void 0 ? _k : Entity.defaults.get("rot")) !== null && _l !== void 0 ? _l : 0;
        this.width = (_o = (_m = opts === null || opts === void 0 ? void 0 : opts.width) !== null && _m !== void 0 ? _m : Entity.defaults.get("width")) !== null && _o !== void 0 ? _o : 0;
        this.height = (_q = (_p = opts === null || opts === void 0 ? void 0 : opts.height) !== null && _p !== void 0 ? _p : Entity.defaults.get("height")) !== null && _q !== void 0 ? _q : 0;
        this.evStore = new Store();
        this.color = (_s = (_r = opts === null || opts === void 0 ? void 0 : opts.color) !== null && _r !== void 0 ? _r : Entity.defaults.get("color")) !== null && _s !== void 0 ? _s : "#fff";
        if (opts === null || opts === void 0 ? void 0 : opts.custom)
            for (const [k, v] of Object.entries(opts.custom)) {
                this[k] = v;
            }
        this.comps = new Store();
        this.moveMode = (_t = opts === null || opts === void 0 ? void 0 : opts.moveMode) !== null && _t !== void 0 ? _t : "move";
        this.evMng = new PhantomEventManager(this, this.evStore);
        this.tags = new TagList();
        this.initState = new SavedState(this, "The state this object was in, at the time of construction.");
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
    /**
     * Sets the rotation.
     * @param rad The new rotation.
     * @since v0.0.0
     */
    setRot(rad) {
        this.rot = rad;
    }
    /**
     * Sets the width.
     * @param w The new width.
     * @since v0.0.0
     */
    setWidth(w) {
        this.width = w;
    }
    /**
     * Sets the height.
     * @param h The new height.
     * @since v0.0.0
     */
    setHeight(h) {
        this.height = h;
    }
    /**
     * Returns a `Vector` object of the forward vector.
     * @returns {Vector} The forward vector.
     * @since v0.0.0
     */
    getFVec() {
        const dx = Math.cos(this.rot);
        const dy = Math.sin(this.rot);
        return new Vector(dx, dy);
    }
    /**
     * Moves a distance on an axis.
     * @param dist The distance to move.
     * @param axis The axis to move on.
     * @since v0.0.0
     */
    move(dist, axis) {
        if (this.moveMode == "fixed")
            return console.warn("Cannot move this entity, because it has a 'fixed' move mode.");
        if (axis == "x" || axis == 0)
            this.x += dist;
        else if (axis == "y" || axis == 1)
            this.y += dist;
    }
    /**
     * Moves a distance on the x-axis.
     * @param dist The distance to move.
     * @since v0.0.0
     */
    moveX(dist) {
        this.move(dist, "x");
    }
    /**
     * Moves a distance on the y-axis.
     * @param dist The distance to move.
     * @since v0.0.0
     */
    moveY(dist) {
        this.move(dist, "y");
    }
    /**
     * Clamps this position to a range.
     * @param min The min value.
     * @param max The max value.
     * @param axis The axis to clamp.
     * @since v0.0.0
     */
    clampPos(min, max, axis) {
        if (axis == "x" || axis == 0)
            this.x = Util.clamp(this.x, min, max);
        else if (axis == "y" || axis == 1)
            this.y = Util.clamp(this.y, min, max);
    }
    /**
     * Clamps this x position to a range.
     * @param min The min value.
     * @param max The max value.
     * @since v0.0.0
     */
    clampPosX(min, max) {
        this.clampPos(min, max, "x");
    }
    /**
     * Clamps this y position to a range.
     * @param min The min value.
     * @param max The max value.
     * @since v0.0.0
     */
    clampPosY(min, max) {
        this.clampPos(min, max, "y");
    }
    /**
     * Returns a `Vector` representing this position.
     * @returns {Vector} This position.
     * @since v0.0.0
     */
    getPos() {
        return new Vector(this.x, this.y);
    }
    /**
     * Returns the x-coordinate.
     * @returns {number} This x-coordinate.
     * @since v0.0.0
     */
    getPosX() {
        return this.x;
    }
    /**
     * Returns the y-coordinate.
     * @returns {number} The y-coordinate.
     * @since v0.0.0
     */
    getPosY() {
        return this.y;
    }
    /**
     * Sets this x-coordinate.
     * @param x The new x.
     * @since v0.0.0
     */
    setPosX(x) {
        this.x = x;
    }
    /**
     * Sets this y-coordinate.
     * @param y The new y.
     * @since v0.0.0
     */
    setPosY(y) {
        this.y = y;
    }
    /**
     * Applies a listener for an event.
     * @param event The event type.
     * @param handle The handle.
     * @since v0.0.0
     */
    on(event, handle) {
        this.evMng.on(event, handle);
    }
    /**
     * Removes a listener for an event.
     * @param event The event type.
     * @param handle The event handle (or nothing, to remove all handles).
     * @since v0.0.0
     */
    off(event, handle) {
        this.evMng.off(event, handle);
    }
    /**
     * Consumes an event.
     * @param title The event type.
     * @param event The actual event.
     * @since v0.0.0
     */
    consume(title, event) {
        const handles = this.evStore.get(title);
        if (handles) {
            handles.forEach(h => h(event));
        }
    }
    /**
     * Returns this width.
     * @returns The width.
     * @since v0.0.0
     */
    getWidth() {
        return this.width;
    }
    /**
     * Returns this height.
     * @returns The height.
     * @since v0.0.0
     */
    getHeight() {
        return this.height;
    }
    /**
     * Called every frame, calls the update function.
     *
     * Also calls `Comp.prototype.upd` for every component.
     * @since v0.0.0
     */
    update() {
        this.upd();
        for (const c of this.comps.values()) {
            c.upd();
        }
    }
    /**
     * Returns the string representation of this object.
     * @returns This, as a string.
     * @since v0.0.0
     */
    toString() {
        return Util.str(this);
    }
    /**
     * Applies a preset.
     * @param preset The preset to apply.
     * @since v0.0.0
     */
    apply(preset) {
        preset.apply(this);
    }
    /**
     * Returns a new `Preset` from this.
     * @returns This, as a `Preset`.
     * @since v0.0.0
     */
    preset() {
        return new Preset(this);
    }
    /**
     * Returns the center coordinate.
     * @returns The center coordinate.
     * @since v0.0.0
     */
    center() {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    /**
     * Returns the real screen position (accounting for width and height).
     * @returns The screen position.
     * @since v0.0.0
     */
    scrPos() {
        return new Vector(this.x + this.width, this.y + this.height);
    }
    /**
     * Returns the real screen x (accounting for width).
     * @returns The screen x.
     * @since v0.0.0
     */
    scrX() {
        return this.scrPos().x;
    }
    /**
     * Retunrs the real screen y (accounting for height).
     * @returns The screen y.
     * @since v0.0.0
     */
    scrY() {
        return this.scrPos().y;
    }
    /**
     * Uses a component.
     * @param c The component type.
     * @param opts The arguments for the component.
     * @see {@link PhantomCompMap}
     * @since v0.0.0
     * @throws {AlreadyUsingError} If this component is already in use.
     */
    use(c, opts = {}) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        this.comps.set(c, new (PhantomCompRecord[c])(this, opts));
    }
    /**
     * Removes a component.
     * @param c The component type.
     * @see {@link PhantomCompMap}
     * @since v0.0.0
     */
    unuse(c) {
        this.comps.del(c);
    }
    /**
     * Returns whether this uses a component or not.
     * @param c The component type.
     * @returns If it is in use.
     * @since v0.0.0
     */
    uses(c) {
        return this.comps.has(c);
    }
    /**
     * Returns a reference to this component.
     * @param c The component type.
     * @returns The component (or nothing).
     * @since v0.0.0
     */
    comp(c) {
        return this.comps.get(c);
    }
    getMoveMode() {
        return this.moveMode;
    }
    setMoveMode(m) {
        this.moveMode = m;
    }
    /**
     * Restores a saved state to this entity.
     * @param state The state to be restored.
     * @since v1.0.16
     * @example
     * ```
     * const ent = new Entity({ ... });
     * const state = ent.saveState();
     * ent.setPos(random(), random()); // assume pos is needed to stay the same
     * ent.restoreState(state); // back to normal
     * // note: this example also works with restoreInitState
     * ```
     */
    restoreState(state) {
        state.restore(this);
    }
    /**
     * Restores this `Entity` to the state it was in at the time of construction.
     * @since v1.0.13
     * @example
     * ```
     * const ent = new Entity({ ... });
     * messUpEnt(ent); // assuming this would mess up the entity in some way
     * ent.restoreInitState(); // back to normal
     * ```
     */
    restoreInitState() {
        this.restoreState(this.initState);
    }
    /**
     * Creates a saved state of this entity, which can be later restored.
     * @param desc The extended, optional description.
     * @returns A saved state of this entity.
     * @since v1.0.16
     */
    saveState(desc) {
        return new SavedState(this, desc);
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new Entity({});
            opts.apply(ent);
            return ent;
        }
        return new Entity(opts);
    }
    /**
     * Returns whether the object passed is an `Entity`.
     * @param obj The object to test.
     * @returns Whether it is an entity.
     */
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * A simple object that is primarily used for scenery.
 *
 * This object has no special attributes.
 * @since v0.0.0
 */
class StaticObject extends Entity {
    constructor(opts) {
        super(opts);
        // requires an enforced fixed move mode
        this.setMoveMode("fixed");
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new StaticObject({ shape: "geom" });
            opts.apply(ent);
            return ent;
        }
        return new StaticObject(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * A simple object that uses physics.
 * @since v0.0.0
 */
class PhysicsObject extends Entity {
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
        if (opts instanceof Preset) {
            const ent = new PhysicsObject({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new PhysicsObject(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * An object that moves in both x and y directions.
 *
 * Optionally, it can bounce on extent reached.
 * @since v0.0.0
 */
class MovingObject extends Entity {
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
        if (opts instanceof Preset) {
            const ent = new MovingObject({ dirX: 0, dirY: 0, extBtm: 0, extLeft: 0, extRight: 0, extTop: 0, spd: 0, bouncy: false });
            opts.apply(ent);
            return ent;
        }
        return new MovingObject(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * Similar to a moving object, this will fly across the screen.
 *
 * Will automatically destroy itself when reaching an extent.
 * @since v0.0.0
 */
class BulletObject extends Entity {
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
        if (opts instanceof Preset) {
            const ent = new BulletObject({ rot: 0, extBtm: 0, extLeft: 0, extRight: 0, extTop: 0, spd: 0, scene: null });
            opts.apply(ent);
            return ent;
        }
        return new BulletObject(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * Acts as a barrier to other entities.
 * @since v1.0.12
 */
class WallObject extends Entity {
    constructor(opts) {
        super(opts);
        this.collide = (e) => {
            // left vs right pen
            const xl = e.x + e.width - this.x;
            const xr = this.x + this.width - e.x;
            const mx = Math.min(xl, xr);
            // top vs btm pen
            const yt = e.y + e.height - this.y;
            const yb = this.y + this.height - e.y;
            const my = Math.min(yt, yb);
            const ec = e.center();
            const wc = this.center();
            if (mx < my) {
                if (ec.x < wc.x) {
                    // push left
                    e.x = this.x - e.width;
                }
                else {
                    // push right
                    e.x = this.x + this.width;
                }
            }
            else {
                if (ec.y < wc.y) {
                    // push up
                    e.y = this.y - e.height;
                }
                else {
                    // push down
                    e.y = this.y + this.height;
                }
            }
        };
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new WallObject({});
            opts.apply(ent);
            return ent;
        }
        return new WallObject(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * The root class for other character-like classes.
 *
 * Provides functionality for characters; uses physics.
 * @since v0.0.0
 */
class Character extends Entity {
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
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new Character({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new Character(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * A character that also has bindings.
 *
 * Automatically listens for `keydown` and `keyup` events.
 * @since v0.0.0
 */
class PlayableCharacter extends Character {
    constructor(opts) {
        var _b;
        super(opts);
        this.binds = (_b = opts.binds) !== null && _b !== void 0 ? _b : new Store();
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
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new PlayableCharacter({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new PlayableCharacter(opts);
    }
    static is(obj) {
        return objIs(obj);
    }
}
/**
 * A 2D vector.
 *
 * Part of the broader vector ecosystem.
 * @since v0.0.0
 */
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }
    static rotBtwn(a, b) {
        const a1 = Math.atan2(a.y, a.x);
        const a2 = Math.atan2(b.y, b.x);
        let dif = a2 - a1;
        const pi2 = 2 * Math.PI;
        if (dif > Math.PI)
            dif -= pi2;
        else if (dif < -Math.PI)
            dif += pi2;
        return dif;
    }
    rotate(rad) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const nx = this.x * cos - this.y * sin;
        const ny = this.x * sin + this.y * cos;
        this.x = nx;
        this.y = ny;
    }
}
/**
 * A pixel.
 * @since v0.0.0
 */
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
function SoundOptionsIsSOD(o) {
    return "mime" in o;
}
/**
 * An audio source.
 *
 * Used to play a variety of sounds.
 * @since v0.0.0
 */
class Sound {
    constructor(opts) {
        this.src = opts.src;
        this.aud = new Audio();
        if (SoundOptionsIsSOD(opts)) {
            this.mime = opts.mime;
            const source = document.createElement("source");
            source.src = this.src;
            source.type = this.mime.startsWith("audio") ? this.mime : `audio/${this.mime}`;
            this.aud.appendChild(source);
        }
        else {
            this.aud.src = this.src;
        }
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
    static from(opts) {
        return new Sound(opts);
    }
}
/**
 * An image.
 *
 * Shorthand for `HTMLImageElement`.
 * @since v0.0.0
 */
class Img {
    constructor(src) {
        _Img_instances.add(this);
        this.img = new Image();
        this.rebuild(src);
    }
    rebuild(src) {
        this.img.src = __classPrivateFieldGet(this, _Img_instances, "m", _Img_realSrc).call(this, src);
    }
    static from(src) {
        return new _a(src);
    }
}
_a = Img, _Img_instances = new WeakSet(), _Img_realSrc = function _Img_realSrc(src) {
    const root = _a.config.get("root");
    if (!root || root.length == 0)
        return src;
    return `${root}${root.endsWith("/") ? "" : "/"}${src}`;
};
/**
 * A component to store various elements.
 * @since v0.0.0
 */
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
        return ArrayUtil.has(this.items, items);
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
    find(cb) {
        return this.items.find(cb);
    }
    some(cb) {
        return this.items.some(cb);
    }
}
/**
 * The root canvas to display content.
 * @since v0.0.0
 */
class Scene {
    constructor(opts) {
        var _b, _c;
        _Scene_instances.add(this);
        if (typeof opts.canvas == "string") {
            opts.canvas = document.getElementById(opts.canvas);
        }
        if (!opts.canvas)
            throw new NoCanvasError();
        this.canvas = opts.canvas instanceof HTMLCanvasElement ? opts.canvas : opts.canvas;
        this.canvas.width = (_b = opts.w) !== null && _b !== void 0 ? _b : 0;
        this.canvas.height = (_c = opts.h) !== null && _c !== void 0 ? _c : 0;
        if (opts.cssW)
            this.canvas.style.width = opts.cssW;
        if (opts.cssH)
            this.canvas.style.height = opts.cssH;
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new NoContextError();
        this.ctx = ctx;
        this.items = new Items();
        this.evStore = new Store();
        this.lvlStore = new Store();
        this.mousePos = new Vector(0, 0);
        window.addEventListener("mousemove", (e) => {
            this.mousePos = this.mouseAt(e);
        });
        this.runtime = new Runtime();
        this.comps = new Store();
        this.evMng = new SceneEventManager(this, this.evStore);
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
        this.evMng.on(name, handle);
    }
    off(name, handle) {
        this.evMng.off(name, handle);
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
    loadLvl(lvlName) {
        const lvl = this.lvlStore.get(lvlName);
        if (lvl)
            this.items = lvl.items;
    }
    lvl() {
        const lvl = new Level();
        lvl.items = this.items;
        return lvl;
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
            this.ctx.translate(i.x, i.y);
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
    mouseAt(e) {
        const rect = this.bounds();
        const sx = this.width / rect.width;
        const sy = this.height / rect.height;
        return new Vector((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy);
    }
    clickFScrOn() {
        this.on("click", () => this.fScrOn());
    }
    clickFScrOff() {
        this.off("click", () => this.fScrOn());
    }
    clickPLockOn() {
        this.on("click", () => this.pLockOn());
    }
    clickPLockOff() {
        this.off("click", () => this.pLockOn());
    }
    __listenOn(e, h) {
        this.canvas.addEventListener(e, h);
    }
    __listenOff(e, h) {
        this.canvas.removeEventListener(e, h);
    }
    toDataURL(format = "image/png", quality = 1) {
        return this.canvas.toDataURL(format, quality);
    }
    /**
     * Creates a screenshot of the canvas.
     *
     * Uses the canvas's content as the image content.
     * @param file The file name.
     * @param format The image format to use.
     * @param quality The quality (if avaliable) to use.
     */
    screenshot(file, format = "image/png", quality = 1) {
        const save = new Save({
            mime: format,
            file,
            ext: format.split("/")[1]
        });
        save.trigger(this.toDataURL(format, quality));
    }
    find(cb) {
        return this.items.find(cb);
    }
    findByTag(tagName) {
        return this.find((e) => __classPrivateFieldGet(this, _Scene_instances, "m", _Scene_tagTest).call(this, e, tagName));
    }
    hasByTag(tagName) {
        return this.some((e) => __classPrivateFieldGet(this, _Scene_instances, "m", _Scene_tagTest).call(this, e, tagName));
    }
    some(cb) {
        return this.items.some(cb);
    }
    /**
     * Returns the rotation between two entites.
     *
     * Utilizes `Vector.rotBtwn` to calculate.
     * @param a The first entity.
     * @param b The second entity.
     * @returns The rotation between the two.
     * @since v1.0.16
     */
    rotBtwn(a, b) {
        return Vector.rotBtwn(a.getPos(), b.getPos());
    }
    /**
     * Returns the rotation between the specified entity and the mouse.
     * @param ent The entity to test.
     * @returns The rotation from the entity to the mouse.
     */
    rotToMouse(ent) {
        return Vector.rotBtwn(ent.getPos(), this.mousePos);
    }
}
_Scene_instances = new WeakSet(), _Scene_tagTest = function _Scene_tagTest(ent, tagName) {
    if (objIs(tagName)) {
        return ent.tags.has(tagName);
    }
    else {
        return ent.tags.some((t) => t.test(tagName));
    }
};
/**
 * A collection of items.
 *
 * Can be used as a `Preset` for `Scene`.
 * @since v0.0.0
 */
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
    find(cb) {
        return this.items.find(cb);
    }
    save(file) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
}
/**
 * A class for saving content.
 * @since v0.0.0
 */
class Save {
    constructor(opts) {
        this.file = opts.file;
        this.mime = opts.mime;
        this.ext = opts.ext;
    }
    trigger(url) {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${this.file}.${this.ext}`;
        a.click();
        document.body.removeChild(a);
    }
    save(cont) {
        const blob = new Blob([cont], { type: this.mime });
        const url = URL.createObjectURL(blob);
        this.trigger(url);
        URL.revokeObjectURL(url);
    }
}
/**
 * An extension class of `Save`.
 *
 * Used for saving specifically JSON files.
 * @since v0.0.0
 */
class SaveJSON extends Save {
    constructor(file) {
        super({ file, mime: "application/json", ext: "json" });
    }
    save(cont, indent = 4) {
        super.save(Util.str(cont, indent));
    }
}
/**
 * A saved set of attributes for an entity.
 *
 * Can be applied to an entity later.
 * @since v0.0.0
 */
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
/**
 * A ray in the scene space.
 * @since v0.0.0
 */
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
                if ((res && hit < res.dist) || (res == null))
                    res = new RaycastIntersecton(hit, i, new Vector(this.origin.x + dir.x * hit, this.origin.y + dir.y * hit));
            }
        }
        return res;
    }
}
/**
 * The intersection returned by a `Raycast` collision.
 * @since v0.0.0
 */
class RaycastIntersecton {
    constructor(dist, obj, point) {
        this.dist = dist;
        this.obj = obj;
        this.point = point;
    }
}
/**
 * Handler for the `Scene` runtime.
 *
 * Controls the state of the `Scene` rendering.
 * @since v0.0.0
 */
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
        this.processId = -1;
    }
}
/**
 * The geometric object root class.
 * @since v0.0.0
 */
class Geom {
    constructor(name) {
        this.name = name;
    }
}
/**
 * Represents a rectangle.
 * @since v0.0.0
 */
class GeomRect extends Geom {
    constructor() { super("rect"); }
}
/**
 * Represents a circle.
 * @since v0.0.0
 */
class GeomCircle extends Geom {
    constructor() { super("circle"); }
}
class StorageRoot {
    constructor(obj) {
        this.storage = obj;
    }
    get(k) {
        return this.storage.getItem(k);
    }
    set(k, v) {
        this.storage.setItem(k, Util.strOf(v));
    }
    has(k) {
        return !!this.get(k);
    }
    get len() {
        return this.storage.length;
    }
    del(k) {
        this.storage.removeItem(k);
    }
    clear() {
        this.storage.clear();
    }
}
const Local = new StorageRoot(localStorage);
const Session = new StorageRoot(sessionStorage);
/**
 * An implementation of `localStorage`.
 * @since v1.0.2
 * @deprecated Replaced by new `Local` object.
 */
class LocalDeprecated {
    /**
     * Sets a value in `localStorage`.
     * @param k The key.
     * @param v The value.
     * @since v1.0.2
     */
    static set(k, v) {
        const val = typeof v == "string" ? v : Util.str(v);
        localStorage.setItem(k, val);
    }
    /**
     * Gets a value from `localStorage`.
     * @param k The key.
     * @returns The value (or none, if it does not exist).
     * @since v1.0.2
     */
    static get(k) {
        return localStorage.getItem(k);
    }
    /**
     * Returns whether an entry with this key exists.
     * @param k The key.
     * @returns Whether this entry exists.
     * @since v1.0.2
     */
    static has(k) {
        return !!this.get(k);
    }
    /**
     * Returns the length of `localStorage`.
     * @since v1.0.2
     */
    static get len() {
        return localStorage.length;
    }
    /**
     * Deletes an item.
     * @param k The key.
     * @since v1.0.2
     */
    static del(k) {
        localStorage.removeItem(k);
    }
}
/**
 * An implementation of `cookieStore`.
 * @since v1.0.6
 */
class Cookies {
    /**
     * Returns a cookie value.
     * @param k The key to get.
     * @returns The associated cookie (or nothing).
     * @since v1.0.6
     */
    static get(k) {
        return cookieStore.get(k);
    }
    /**
     * Sets a cookie value.
     * @param k The key.
     * @param v The value.
     * @since v1.0.6
     */
    static set(k, v) {
        cookieStore.set(k, Util.strOf(v));
    }
    /**
     * Returns a list of associated cookie values.
     * @param k The key to get.
     * @returns The values.
     * @since v1.0.6
     */
    static getAll(k) {
        return cookieStore.getAll(k);
    }
    /**
     * Deletes a cookie pair.
     * @param k The key.
     * @since v1.0.6
     */
    static del(k) {
        cookieStore.delete(k);
    }
}
/**
 * A simple cooldown timer.
 * @since v1.0.5
 */
class Cooldown {
    constructor(msOrState, msOrState2) {
        _Cooldown_instances.add(this);
        this.id = -1;
        this.ready = false;
        if (msOrState && typeof msOrState == "number" && msOrState2 == undefined) {
            this.on(msOrState);
        }
        else if (msOrState && typeof msOrState == "boolean" && msOrState2 == undefined) {
            this.ready = msOrState;
        }
        else if (msOrState && typeof msOrState == "number" && msOrState2 && typeof msOrState2 == "boolean") {
            this.on(msOrState);
            this.ready = msOrState2;
        }
    }
    on(ms) {
        if (this.id != -1)
            throw new ExistingProcessError();
        this.id = setInterval(__classPrivateFieldGet(this, _Cooldown_instances, "m", _Cooldown_handle), ms);
    }
    off() {
        if (this.id == -1)
            throw new NoProcessError();
        clearInterval(this.id);
        this.id = -1;
    }
    consume() {
        this.ready = false;
    }
}
_Cooldown_instances = new WeakSet(), _Cooldown_handle = function _Cooldown_handle() {
    this.ready = true;
};
class Config {
    constructor() {
        this.config = new Store();
    }
    get(k) {
        return this.config.get(k);
    }
    set(k, v) {
        this.config.set(k, v);
    }
    has(k) {
        return this.config.has(k);
    }
    del(k) {
        this.config.del(k);
    }
}
function option(vals) {
    return { vals };
}
function prim(type) {
    return { type };
}
function primNum() {
    return prim(Number);
}
function primString() {
    return prim(String);
}
function primBool() {
    return prim(Boolean);
}
const SceneConfigMap = {
    /**
     * Controls the displayed resolution (outputted textures width and height).
     *
     * Resolution is basically a texture's "sharpness" prior application.
     *
     * Textures (including basic colors) are stretched to fill an entities `width` and `height`.
     * @since v1.0.7
     */
    resolution: option(["1920x1080", "2560x1440", "1280x720", "640x360"]),
    /**
     * Controls the master volume of all audio in this project.
     *
     * Accepts a value from 0 - 1.
     *
     * Part of the sound volume control collection.
     * @since v1.0.7
     */
    master: primNum(),
    /**
     * Controls the volume of all music audio in this project.
     *
     * Any `Sound` with the tag "music" is controlled by this.
     *
     * Accepts a value from 0 - 1.
     *
     * Part of the sound volume control collection.
     * @since v1.0.7
     */
    music: primNum(),
    /**
     * Controls the volume of all sound effect audio in this project.
     *
     * Any `Sound` with the tag "sfx" is controlled by this.
     *
     * Accepts a value from 0 - 1.
     *
     * Part of the sound volume control collection.
     * @since v1.0.7
     */
    sfx: primNum()
};
class SceneConfig extends Config {
}
Scene.config = new SceneConfig();
Scene.config.set("resolution", "1920x1080");
Scene.config.set("master", 1);
Scene.config.set("music", 1);
Scene.config.set("sfx", 1);
const ImgConfigMap = {
    /**
     * Controls the beginning (pre-pended) folder path to all `src` properties.
     * @since v1.0.7
     * @example
     * ```
     * Img.config.set("root", "assets"); // assuming there was an 'assets/' folder
     * const img = new Img("cool.png"); // this would be transformed to be 'assets/cool.png'
     * ```
     */
    root: primString()
};
class ImgConfig extends Config {
}
Img.config = new ImgConfig();
Img.config.set("root", "");
const EntityDefaultsMap = {
    /**
     * Controls the x-coordinate.
     * @since v1.0.11
     */
    x: primNum(),
    /**
     * Controls the y-coordinate.
     * @since v1.0.11
     */
    y: primNum(),
    /**
     * Controls the rotation, in radians.
     * @since v1.0.11
     */
    rot: primNum(),
    /**
     * Controls the width.
     * @since v1.0.11
     */
    width: primNum(),
    /**
     * Controls the height.
     * @since v1.0.11
     */
    height: primNum(),
    /**
     * Controls the color.
     * @since v1.0.11
     */
    color: primString()
};
class EntityDefaults extends Config {
}
Entity.defaults = new EntityDefaults();
class Picker {
    clean(opts) {
        return { id: opts.id, startIn: opts.start };
    }
}
/**
 * Shows a file picker.
 *
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker)
 * @since v1.0.7
 */
class FilePicker extends Picker {
    async pick(opts) {
        try {
            const [...handles] = await this.handle(opts);
            if (handles.length == 1) {
                const file = await handles[0].getFile();
                return await file.text();
            }
            const files = [];
            for (const handle of handles) {
                files.push(await handle.getFile());
            }
            const out = await Promise.all(files.map(async (o) => o.text()));
            return out;
        }
        catch (e) {
            throw e;
        }
    }
    async handle(opts) {
        try {
            const [...handles] = await window.showOpenFilePicker(this.cleanOpts(opts));
            return handles;
        }
        catch (e) {
            throw e;
        }
    }
    cleanOpts(opts) {
        var _b;
        return Object.assign(Object.assign({}, this.clean(opts)), { excludeAcceptAllOption: opts.all, multiple: opts.mult, types: (_b = opts.accept) === null || _b === void 0 ? void 0 : _b.map(a => { return { description: a.desc, accept: a.accept }; }) });
    }
}
/**
 * Shows a directory picker.
 *
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
 * @since v1.0.7
 */
class DirPicker extends Picker {
    async pick(opts) {
        try {
            const handle = await window.showDirectoryPicker(this.cleanOpts(opts));
            return handle;
        }
        catch (e) {
            throw e;
        }
    }
    async handle(opts) {
        return this.pick(opts);
    }
    cleanOpts(opts) {
        return Object.assign(Object.assign({}, this.clean(opts)), { mode: opts.mode ? { "r": "read", "rw": "readwrite" }[opts.mode] : undefined });
    }
}
class EventManager {
    constructor(self, store) {
        this.self = self;
        this.store = store;
    }
    on(e, h, thenExec = NoFunc) {
        var _b;
        const a = (_b = this.store.get(e)) !== null && _b !== void 0 ? _b : [];
        ArrayUtil.add(a, h);
        this.store.set(e, a);
        thenExec();
    }
    off(e, h, hExist = NoFunc, notHExist = NoFunc) {
        var _b;
        if (h) {
            const a = (_b = this.store.get(e)) !== null && _b !== void 0 ? _b : [];
            ArrayUtil.rm(a, h);
            this.store.set(e, a);
            hExist();
        }
        else {
            notHExist();
            this.store.del(e);
        }
    }
}
class SceneEventManager extends EventManager {
    on(e, h) {
        super.on(e, h, () => {
            this.self.__listenOn(e, h);
        });
    }
    off(e, h) {
        super.off(e, h, () => {
            if (h)
                this.self.__listenOff(e, h);
        }, () => {
            for (const [_e, _h] of this.self.evStore.items()) {
                for (const __h of _h)
                    this.self.__listenOff(_e, __h);
            }
        });
    }
}
class PhantomEventManager extends EventManager {
}
class Clipboard {
    static read() {
        return navigator.clipboard.read();
    }
    static reads() {
        return navigator.clipboard.readText();
    }
    static write(data) {
        navigator.clipboard.write(data);
    }
    static writes(data) {
        navigator.clipboard.writeText(data);
    }
}
class Tag {
    constructor(val) {
        this.val = val !== null && val !== void 0 ? val : "";
    }
    get() {
        return this.val;
    }
    set(v) {
        this.val = v;
    }
    test(valOrTag) {
        if (valOrTag instanceof Tag) {
            return this.val == valOrTag.get();
        }
        else {
            return this.val == valOrTag;
        }
    }
}
class TagList extends ItemBox {
}
class Angle {
    static deg(rad) {
        return rad * 180 / Math.PI;
    }
    static rad(deg) {
        return deg * Math.PI / 180;
    }
}
class SavedState {
    constructor(o, desc) {
        this.atts = {};
        Object.assign(this.atts, o);
        this.desc = desc;
        this.timestamp = (new Date()).toISOString();
    }
    restore(o) {
        Object.assign(o, this.atts);
    }
}
/**
 * Returns whether 2 objects are in collision.
 * @param a Object 1.
 * @param b Object 2.
 * @returns {boolean} If they collide.
 * @since v0.0.0
 */
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
/**
 * Returns an intersection distance between a ray and a rect.
 * @param origin The beginning point.
 * @param dir The angle to travel at (in vector-angle).
 * @param rect The rectangle to test.
 * @param scene The scene.
 * @returns The distance of intersection (if there was one).
 */
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
/**
 * Returns a `Vector` relative to screen space.
 *
 * Uses UV vector conversion math to map coords to [-1, 1].
 * @param p The vector.
 * @param w The scene-space width.
 * @param h The scene-space height.
 * @returns A new UV `Vector`.
 */
function uvVec(p, w, h) {
    let u = p.x / (w - 1);
    let v = p.y / (h - 1);
    u = u * 2 - 1;
    v = v * 2 - 1;
    let aspect = w / h;
    u *= aspect;
    return new Vector(u, v);
}
/**
 * Returns a `Promise` to wait for a specified amount of time.
 * @param ms The time to wait.
 * @returns A `Promise` to wait for.
 */
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function random(a, b) {
    let min = 0;
    let max = 0;
    if (a == undefined && b == undefined) {
        min = 0;
        max = 101;
    }
    else if (a && b == undefined) {
        min = 0;
        max = a;
    }
    else if (a && b) {
        min = a;
        max = b;
    }
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
function chance(max, upperBound) {
    return max <= random((upperBound !== null && upperBound !== void 0 ? upperBound : 100) + 1);
}
function objIs(obj) {
    return obj != undefined && obj instanceof null;
}
/**
 * Returns a shallow, null value of the type provided.
 * @returns A shallow, null value.
 */
function shallow() {
    return null;
}
export { NoFunc, NoContextError, ExistingProcessError, NoCanvasError, NoProcessError, PhantomEvent, PhantomAliveEvent, PhantomAddedEvent, PhantomRemovedEvent, Entity, StaticObject, PhysicsObject, MovingObject, BulletObject, Scene, Character, PlayableCharacter, WallObject, Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel, Raycast, RaycastIntersecton, Cooldown, FilePicker, DirPicker, Img, Angle, Config, SceneConfig, ImgConfig, isCol, rayInterRect, uvVec, wait, random, chance, shallow, objIs, Local, LocalDeprecated, Session, Clipboard, Cookies };
