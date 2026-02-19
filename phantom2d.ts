class Util {
    static str(o: any, space?: number): string {
        return JSON.stringify(o, null, space);
    }
}

type Custom = { any?: any };
type Axis = "x" | "y" | 0 | 1;
type Dir = 0 | 1;
type EventHandle = (e: Event) => void;
type EventType = keyof HTMLElementEventMap;
type Callback<T> = (value: Phantom2dEntity, index: number, array: Phantom2dEntity[]) => T;
type PhantomEventType = keyof PhantomEventMap;
type PhantomEventHandle = (e: PhantomEvent) => void;
type AudioMIME = "audio/wav" | "audio/mpeg" | "audio/mp4" | "audio/webm" | "audio/ogg" | "audio/aac" | "audio/aacp" | "audio/x-caf" | "audio/flac" |
                "wav" | "mpeg" | "mp4" | "webm" | "ogg" | "aac" | "aacp" | "x-caf" | "flac";
type CollisionHandle = (o: Phantom2dEntity) => void;
const NoFunc: Function = (() => {});

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

class Store<TI, TO> {
    store: Map<TI, TO>;
    constructor() {
        this.store = new Map();
    }
    get(key: TI): TO | undefined {
        return this.store.get(key);
    }
    set(key: TI, value: TO) {
        this.store.set(key, value);
    }
    has(key: TI): boolean {
        return this.store.has(key);
    }
    del(key: TI): boolean {
        return this.store.delete(key);
    }
}

interface Phantom2dOptions {
    collide?: CollisionHandle;
    x?: number;
    y?: number;
    rot?: number;
    width?: number;
    height?: number;
    custom?: Custom;
    upd?: Function;
    color?: string;
}
interface StaticObjectOptions extends Phantom2dOptions {
    shape: "rect" | "circle";
    color: string;
}
interface PhysicsObjectOptions extends Phantom2dOptions {
    strength: number;
}
interface Extent {
    extLeft: number; extRight: number;
    extBtm: number; extTop: number;
}
interface MovingObjectOptions extends Phantom2dOptions, Extent {
    dirX: Dir;
    dirY: Dir;
    bouncy: boolean;
    spd: number;
}
interface BulletObjectOptions extends Phantom2dOptions, Extent {
    spd: number; rot: number;
}
interface SceneOptions {
    canvas: HTMLCanvasElement | HTMLElement | null;
    w?: number;
    h?: number;
    cssW?: string;
    cssH?: string;
}
interface PhantomEventMap {
    alive: PhantomAliveEvent; added: PhantomAddedEvent; removed: PhantomRemovedEvent;
}
interface SaveOptions {
    file: string;
    mime: string;
    ext: string;
}
interface SoundOptions {
    src: string;
    mime: AudioMIME;
}
class PhantomEvent {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
class PhantomAliveEvent extends PhantomEvent { constructor() { super("alive"); } }
class PhantomAddedEvent extends PhantomEvent { constructor() { super("added"); } }
class PhantomRemovedEvent extends PhantomEvent { constructor() { super("removed"); } }

class Phantom2dEntity {
    collide: CollisionHandle; upd: Function;
    x: number; y: number;
    rot: number;
    width: number; height: number;
    color: string;
    evStore: Store<PhantomEventType, PhantomEventHandle>;
    constructor(opts: Phantom2dOptions) {
        this.collide = opts.collide ?? ((o: Phantom2dEntity) => {});
        this.upd = opts.upd ?? NoFunc;
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.rot = opts.rot ?? 0;
        this.width = opts.width ?? 0;
        this.height = opts.height ?? 0;
        this.evStore = new Store();
        this.color = opts.color ?? "#fff";
    }
    setPos(x: number | Vector, y?: number) {
        if(typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        } else if(x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
    }
    setRot(rad: number) {
        this.rot = rad;
    }
    setWidth(w: number) {
        this.width = w;
    }
    setHeight(h: number) {
        this.height = h;
    }
    getFVec(): Vector {
        const dx = Math.cos(this.rot);
        const dy = Math.sin(this.rot);
        return new Vector(dx, dy);
    }
    move(dist: number, axis: Axis) {
        if(axis == "x" || axis == 0) this.x += dist;
        else if(axis == "y" || axis == 1) this.y += dist;
    }
    moveX(dist: number) {
        this.move(dist, "x");
    }
    moveY(dist: number) {
        this.move(dist, "y");
    }
    clampPos(min: number, max: number, axis: Axis) {
        const clamp = (n: number): number => Math.min(Math.max(n, min), max);
        if(axis == "x" || axis == 0) this.x = clamp(this.x);
        else if(axis == "y" || axis == 1) this.y = clamp(this.y);
    }
    clampPosX(min: number, max: number) {
        this.clampPos(min, max, "x");
    }
    clampPosY(min: number, max: number) {
        this.clampPos(min, max, "y");
    }
    getPos(): Vector {
        return new Vector(this.x, this.y);
    }
    getCenter(): Vector {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    getPosX(): number {
        return this.x;
    }
    getPosY(): number {
        return this.y;
    }
    setPosX(x: number) {
        this.x = x;
    }
    setPosY(y: number) {
        this.y = y;
    }
    on(event: PhantomEventType, handle: PhantomEventHandle) {
        this.evStore.set(event, handle);
    }
    off(event: PhantomEventType) {
        this.evStore.del(event);
    }
    consume(title: PhantomEventType, event: PhantomEvent) {
        const handle = this.evStore.get(title);
        if(handle) {
            handle(event);
        }
    }
    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }
    update() {
        this.upd();
    }
    toString(): string {
        return Util.str(this);
    }
    apply(preset: Preset) {
        preset.apply(this);
    }
    preset(): Preset {
        return new Preset(this);
    }
    static from(opts: Phantom2dOptions): Phantom2dEntity {
        return new Phantom2dEntity(opts);
    }
}
class StaticObject extends Phantom2dEntity {
    constructor(opts: StaticObjectOptions) {
        super(opts);
    }
    static from(opts: StaticObjectOptions): StaticObject {
        return new StaticObject(opts);
    }
}
class PhysicsObject extends Phantom2dEntity {
    strength: number; gravspd: number;
    constructor(opts: PhysicsObjectOptions) {
        super(opts);
        this.strength = opts.strength;
        this.gravspd = 0;
    }
    update() {
        this.gravspd += this.strength;
        this.y += this.gravspd;
        super.update();
    }
    static from(opts: PhysicsObject): PhysicsObject {
        return new PhysicsObject(opts);
    }
}
class MovingObject extends Phantom2dEntity {
    dirX: Dir; dirY: Dir;
    extLeft: number; extRight: number; extBtm: number; extTop: number;
    spd: number;
    bouncy: boolean;
    constructor(opts: MovingObjectOptions) {
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
        if(this.extLeft >= this.x && this.bouncy && this.dirX == 0) {
            this.x += this.spd;
            this.dirX = 1;
        } else if(this.extRight <= this.x && this.bouncy && this.dirX == 1) {
            this.x -= this.spd;
            this.dirX = 0;
        } else if(this.extLeft < this.x && !this.bouncy && this.dirX == 0) {
            this.x -= this.spd;
        } else if(this.extRight > this.x && this.bouncy && this.dirX == 1) {
            this.x += this.spd;
        }
        if(this.extBtm >= this.y && this.bouncy && this.dirY == 0) {
            this.y += this.spd;
            this.dirY = 1;
        } else if(this.extBtm <= this.y && this.bouncy && this.dirY == 1) {
            this.y -= this.spd;
            this.dirY = 0;
        } else if(this.extTop < this.y && !this.bouncy && this.dirY == 0) {
            this.y -= this.spd;
        } else if(this.extTop > this.y && !this.bouncy && this.dirY == 1) {
            this.y += this.spd;
        }
        super.update();
    }
    static from(opts: MovingObjectOptions): MovingObject {
        return new MovingObject(opts);
    }
}
class BulletObject extends Phantom2dEntity {
    extLeft: number; extRight: number; extBtm: number; extTop: number;
    spd: number;
    constructor(opts: BulletObjectOptions) {
        super(opts);
        this.rot = opts.rot;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
    }
    update() {
        const fVec = this.getFVec();
        fVec.scale(this.spd);
        this.x += fVec.x; this.y += fVec.y;
    }
    static from(opts: BulletObjectOptions): BulletObject {
        return new BulletObject(opts);
    }
}
class Vector {
    x: number; y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    scale(factor: number) {
        this.x *= factor;
        this.y *= factor;
    }
}
class Pixel {
    r: number; g: number; b: number; a: number;
    constructor(pxl: { r: number, g: number, b: number, a: number }) {
        this.r = pxl.r;
        this.g = pxl.g;
        this.b = pxl.b;
        this.a = pxl.a;
    }
}
class Sound {
    src: string; mime: AudioMIME; aud: HTMLAudioElement;
    constructor(opts: SoundOptions) {
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
    get time(): number {
        return this.aud.currentTime;
    }
    set time(t: number) {
        this.aud.currentTime = t;
    }
    get len(): number {
        return this.aud.duration;
    }
}
class Items {
    items: Phantom2dEntity[];
    constructor() {
        this.items = [];
    }
    add(...items: Phantom2dEntity[]) {
        this.items.push(...items);
        for(const item of items) {
            item.consume("added", new PhantomAddedEvent());
        }
    }
    rm(...items: Phantom2dEntity[]) {
        for(const item of items) {
            if(this.has(item)) {
                this.items.splice(this.idxOf(item), 1);
                item.consume("removed", new PhantomRemovedEvent());
            }
        }
    }
    has(...items: Phantom2dEntity[]): boolean {
        return items.every(i => this.items.includes(i));
    }
    idxOf(item: Phantom2dEntity): number {
        return this.items.indexOf(item);
    }
    filter(cb: Callback<unknown>): Phantom2dEntity[] {
        return this.items.filter(cb);
    }
    forEach(cb: Callback<void>) {
        this.items.forEach(cb);
    }
}
/**
 * The root canvas to display content.
 * @since v0.0.0
 */
class Scene {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    items: Items;
    evStore: Store<EventType, EventHandle>;
    lvlStore: Store<string, Level>;
    processId: number;
    constructor(opts: SceneOptions) {
        if(!opts.canvas) throw new NoCanvasError();
        this.canvas = opts.canvas instanceof HTMLCanvasElement ? opts.canvas : opts.canvas as HTMLCanvasElement;
        this.canvas.width = opts.w ?? 0;
        this.canvas.height = opts.h ?? 0;
        this.canvas.style.width = opts.cssW ?? "0px";
        this.canvas.style.height = opts.cssH ?? "0px";
        const ctx = this.canvas.getContext("2d");
        if(!ctx) throw new NoContextError();
        this.ctx = ctx;
        this.items = new Items();
        this.evStore = new Store();
        this.lvlStore = new Store();
        this.processId = -1;
    }
    get width(): number {
        return this.canvas.width;
    }
    set width(w: number) {
        this.canvas.width = w;
    }
    get cssWidth(): string {
        return this.canvas.style.width;
    }
    set cssWidth(w: string) {
        this.canvas.style.width = w;
    }
    get height(): number {
        return this.canvas.height;
    }
    set height(h: number) {
        this.canvas.height = h;
    }
    get cssHeight(): string {
        return this.canvas.style.height;
    }
    set cssHeight(h: string) {
        this.canvas.style.height = h;
    }
    add(...items: Phantom2dEntity[]) {
        this.items.add(...items);
    }
    rm(...items: Phantom2dEntity[]) {
        this.items.rm(...items);
    }
    has(...items: Phantom2dEntity[]): boolean {
        return this.items.has(...items);
    }
    idxOf(item: Phantom2dEntity): number {
        return this.items.idxOf(item);
    }
    filter(cb: Callback<unknown>): Phantom2dEntity[] {
        return this.items.filter(cb);
    }
    on(name: EventType, handle: EventHandle) {
        this.evStore.set(name, handle);
        this.canvas.addEventListener(name, handle);
    }
    off(name: EventType, handle: EventHandle | undefined) {
        if(handle) this.canvas.removeEventListener(name, handle ?? this.evStore.get(name));
        this.evStore.del(name);
    }
    getPixel(pos: Vector): Pixel {
        const { data } = this.ctx.getImageData(pos.x, pos.y, 1, 1);
        return new Pixel({ r: data[0], g: data[1], b: data[2], a: data[3] });
    }
    setPixel(pos: Vector, rgba: Pixel) {
        const imgData = this.ctx.getImageData(pos.x, pos.y, 1, 1);
        imgData.data[0] = rgba.r;
        imgData.data[1] = rgba.g;
        imgData.data[2] = rgba.b;
        imgData.data[3] = rgba.a;
        this.ctx.putImageData(imgData, pos.x, pos.y);
    }
    forEach(cb: Callback<void>) {
        this.items.forEach(cb);
    }
    getLvl(lvlName: string): Level | undefined {
        return this.lvlStore.get(lvlName);
    }
    setLvl(lvlName: string, lvl: Level) {
        this.lvlStore.set(lvlName, lvl);
    }
    hasLvl(lvlName: string): boolean {
        return this.lvlStore.has(lvlName);
    }
    delLvl(lvlName: string) {
        this.lvlStore.del(lvlName);
    }
    get color(): string | CanvasGradient | CanvasPattern {
        return this.ctx.fillStyle;
    }
    set color(color: string) {
        this.ctx.fillStyle = color;
    }
    img(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
        this.ctx.drawImage(img, x, y, w, h);
    }
    rect(x: number, y: number, w: number, h: number, color: string) {
        this.color = color;
        this.ctx.fillRect(x, y, w, h);
    }
    update() {
        this.forEach(i => i.update());
        this.testCols();
    }
    testCols() {
        this.forEach(a => {
            this.forEach(b => {
                if(a == b) return;
                if(isCol(a, b)) {
                    a.collide(b);
                }
            });
        });
    }
    render() {
        this.items.forEach(i => {
            this.rect(i.x, i.y, i.width, i.height, i.color);
        });
    }
    start(postUpd: Function = NoFunc) {
        if(this.processId != -1) throw new ExistingProcessError();
        const tick = () => {
            this.update();
            postUpd();
            this.render();
            this.processId = requestAnimationFrame(tick);
        }
        tick();
    }
    stop() {
        if(this.processId == -1) throw new NoProcessError();
        cancelAnimationFrame(this.processId);
        this.processId = -1;
    }
    save(file: string) {
        const save = new SaveJSON(file);
        save.save(Util.str(this, 4));
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
}
class Level {
    items: Items;
    constructor() {
        this.items = new Items();
    }
    add(...items: Phantom2dEntity[]) {
        this.items.add(...items);
    }
    rm(...items: Phantom2dEntity[]) {
        this.items.rm(...items);
    }
    has(...items: Phantom2dEntity[]): boolean {
        return this.items.has(...items);
    }
    idxOf(item: Phantom2dEntity): number {
        return this.items.idxOf(item);
    }
    filter(cb: Callback<unknown>): Phantom2dEntity[] {
        return this.items.filter(cb);
    }
    forEach(cb: Callback<void>) {
        this.items.forEach(cb);
    }
}
class Save {
    file: string; mime: string; ext: string;
    constructor(opts: SaveOptions) {
        this.file = opts.file;
        this.mime = opts.mime;
        this.ext = opts.ext;
    }
    save(cont: string) {
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
    constructor(file: string) {
        super({ file, mime: "application/json", ext: "json" });
    }
}
class Preset {
    atts: { any?: any };
    constructor(ent: Phantom2dEntity) {
        this.atts = {};
        Object.assign(this.atts, ent);
    }
    save(out: string) {
        const s = new SaveJSON(out);
        s.save(Util.str(this, 4));
    }
    apply(ent: Phantom2dEntity) {
        Object.assign(ent, this.atts);
    }
}

function isCol(a: Phantom2dEntity, b: Phantom2dEntity): boolean {
    const w1 = a.width; const h1 = a.height; const x1 = a.x; const y1 = a.y;
    const w2 = b.width; const h2 = b.height; const x2 = b.x; const y2 = b.y;
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

export {
    Custom, Axis, Dir, EventHandle, EventType, Callback, PhantomEventType,
    PhantomEventHandle, AudioMIME, CollisionHandle,
    
    NoFunc,

    NoContextError, ExistingProcessError, NoCanvasError, NoProcessError,
    
    Phantom2dOptions, StaticObjectOptions, PhysicsObjectOptions, Extent,
    MovingObjectOptions, BulletObjectOptions, SceneOptions, PhantomEventMap,
    SaveOptions, SoundOptions,

    PhantomEvent, PhantomAliveEvent, PhantomAddedEvent, PhantomRemovedEvent,

    Phantom2dEntity, StaticObject, PhysicsObject, MovingObject, BulletObject,
    Scene, Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel,

    isCol
};