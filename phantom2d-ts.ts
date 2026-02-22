class Util {
    static str(o: any, space?: number): string {
        return JSON.stringify(o, null, space);
    }
    static clamp(n: number, min: number, max: number): number {
        return Math.min(Math.max(n, min), max);
    }
}

/**
 * Represents custom properties to
 * be attached during creation.
 */
type Custom = { any?: any };
/**
 * Represents an axis.
 * 
 * Axis Map
 * 
 * --------
 * 
 * "x", 0 - x-axis
 * 
 * "y", 1 - y-axis
 */
type Axis = "x" | "y" | 0 | 1;
/**
 * A simple direction.
 * 
 * 0 = x
 * 
 * 1 = y
 */
type Dir = 0 | 1;
/**
 * A handle for an event.
 * 
 * Takes one argument, the event.
 */
type EventHandle = (e: Event) => void;
type EventType = keyof HTMLElementEventMap;
type Callback<T> = (value: Phantom2dEntity, index: number, array: Phantom2dEntity[]) => T;
type PhantomEventType = keyof PhantomEventMap;
type PhantomEventHandle = (e: PhantomEvent) => void;
type AudioMIME = "audio/wav" | "audio/mpeg" | "audio/mp4" | "audio/webm" | "audio/ogg" | "audio/aac" | "audio/aacp" | "audio/x-caf" | "audio/flac" |
                "wav" | "mpeg" | "mp4" | "webm" | "ogg" | "aac" | "aacp" | "x-caf" | "flac";
type CollisionHandle = (o: Phantom2dEntity) => void;
type Iter<T> = MapIterator<T>;
type PhantomCompType = keyof PhantomCompMap;
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
class AlreadyUsingError extends Error {
    constructor() {
        super("Already using this component, cannot use again.");
        this.name = "AlreadyUsingError";
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
    keys(): Iter<TI> {
        return this.store.keys();
    }
    values(): Iter<TO> {
        return this.store.values();
    }
    items(): Iter<[TI, TO]> {
        return this.store.entries();
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
    spd: number; rot: number; scene: Scene;
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
    hurt: PhantomHealthCompHurtEvent; die: PhantomHealthCompDieEvent; heal: PhantomHealthCompHealEvent;
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
interface CharacterOptions extends PhysicsObjectOptions {}
interface PlayableCharacterOptions extends CharacterOptions {
    binds?: Store<string, Function>;
}
interface RaycastOptions {
    origin: Vector;
    angle: number;
    dist: number;
    scene: Scene;
}
interface PhantomCompMap {
    health: HealthComp;
    inv: InvComp;
}
interface CompOptions {}
interface HealthCompOptions extends CompOptions {
    hp?: number; mhp?: number;
    onHurt?: PhantomEventHandle;
    onDie?: PhantomEventHandle;
    onHeal?: PhantomEventHandle;
}
interface InvCompOptions extends CompOptions {
    size?: number;
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
class PhantomHealthCompHurtEvent extends PhantomEvent { constructor() { super("hurt"); } }
class PhantomHealthCompDieEvent extends PhantomEvent { constructor() { super("die"); } }
class PhantomHealthCompHealEvent extends PhantomEvent { constructor() { super("heal"); } }
class Comp {
    ent: Phantom2dEntity;
    constructor(ent: Phantom2dEntity) {
        this.ent = ent;
    }
    consume(k: PhantomEventType, e: PhantomEvent) {
        this.ent.consume(k, e);
    }
}
class HealthComp extends Comp {
    hp: number; mhp?: number;
    onHurt?: PhantomEventHandle;
    onDie?: PhantomEventHandle;
    onHeal?: PhantomEventHandle;
    constructor(ent: Phantom2dEntity, opts: HealthCompOptions) {
        super(ent);
        this.hp = opts.hp ?? 0;
        this.mhp = opts.mhp;
        this.onHurt = opts.onHurt;
        this.onDie = opts.onDie;
        this.onHeal = opts.onHeal;
    }
    hurt(dmg: number) {
        this.hp -= dmg;
        this.#consume(this.onHurt, "hurt", new PhantomHealthCompHurtEvent());
        if(this.hp <= 0) this.die();
    }
    die() {
        this.#consume(this.onDie, "die", new PhantomHealthCompDieEvent());
    }
    heal(hp: number) {
        this.hp += hp;
        if(this.mhp) this.hp = Math.min(this.hp, this.mhp);
        this.#consume(this.onHeal, "heal", new PhantomHealthCompHealEvent());
    }
    #consume(fn: PhantomEventHandle | undefined, k: PhantomEventType, e: PhantomEvent) {
        if(fn) fn(e);
        else this.consume(k, e);
    }
}
class InvComp extends Comp {
    size?: number;
    inv: any[];
    constructor(ent: Phantom2dEntity, opts: InvCompOptions) {
        super(ent);
        this.size = opts.size;
        this.inv = [];
    }
    add(...items: any[]) {
        for(let i = 0; i < items.length; i++) {
            if(this.size && this.inv.length >= this.size) continue;
            this.inv.push(items[i]);
        }
    }
    rm(...items: any[]) {
        for(const i of items) if(this.has(i)) this.inv.splice(this.idxOf(i), 1);
    }
    has(...items: any[]): boolean {
        return items.every(i => this.inv.includes(i));
    }
    idxOf(i: any): number {
        return this.inv.indexOf(i);
    }
    len(): number {
        return this.inv.length;
    }
    at(i: number): any {
        return this.inv[i];
    }
}

class Phantom2dEntity {
    collide: CollisionHandle; upd: Function;
    x: number; y: number;
    rot: number;
    width: number; height: number;
    color: string;
    evStore: Store<PhantomEventType, PhantomEventHandle>;
    [x: string]: any;
    comps: Store<PhantomCompType, Comp>;
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
        if(opts.custom) for(const [k, v] of Object.entries(opts.custom)) {
            this[k] = v;
        }
        this.comps = new Store();
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
        if(axis == "x" || axis == 0) this.x = Util.clamp(this.x, min, max);
        else if(axis == "y" || axis == 1) this.y = Util.clamp(this.y, min, max);
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
    center(): Vector {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    scrPos(): Vector {
        return new Vector(this.x + this.width, this.y + this.height);
    }
    scrX(): number {
        return this.scrPos().x;
    }
    scrY(): number {
        return this.scrPos().y;
    }
    use(c: PhantomCompType, opts: CompOptions = {}) {
        if(this.uses(c)) throw new AlreadyUsingError();
        if(c == "health") this.comps.set(c, new HealthComp(this, opts));
        if(c == "inv") this.comps.set(c, new InvComp(this, opts));
    }
    unuse(c: PhantomCompType) {
        this.comps.del(c);
    }
    uses(c: PhantomCompType): boolean {
        return this.comps.has(c);
    }
    comp(c: PhantomCompType): Comp | undefined {
        return this.comps.get(c);
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
    scene: Scene;
    constructor(opts: BulletObjectOptions) {
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
        this.x += fVec.x; this.y += fVec.y;
        // test if its on-screen
        // tolerance of 15px
        const x = this.scrX();
        const y = this.scrY();
        const w = this.scene.width;
        const h = this.scene.height;
        if(x - 15 < w || x + 15 > w || y + 15 > h || y - 15 < h) {
            // self-destruct if its not
            this.scene.rm(this);
        }
    }
    static from(opts: BulletObjectOptions): BulletObject {
        return new BulletObject(opts);
    }
}
class Character extends Phantom2dEntity {
    gspd: number;
    constructor(opts: CharacterOptions) {
        super(opts);
        this.gspd = 0;
    }
    setGSpd(spd: number) {
        this.gspd = spd;
    }
    getGSpd(): number {
        return this.gspd;
    }
    jump(h: number) {
        this.gspd = -(h);
    }
}
class PlayableCharacter extends Character {
    binds: Store<string, Function>;
    keys: Store<string, boolean>;
    constructor(opts: PlayableCharacterOptions) {
        super(opts);
        this.binds = opts.binds ?? new Store();
        this.keys = new Store();
        window.addEventListener("keydown", (e) => {
            this.keys.set(e.code, true);
        });
        window.addEventListener("keyup", (e) => {
            this.keys.set(e.code, false);
        });
    }
    bind(code: string, exec: Function) {
        this.binds.set(code, exec);
    }
    unbind(code: string) {
        this.binds.del(code);
    }
    isBind(code: string): boolean {
        return this.binds.has(code);
    }
    bindOf(code: string): Function | undefined {
        return this.binds.get(code);
    }
    update() {
        for(const [k, v] of this.keys.items()) {
            if(v) {
                const exec = this.binds.get(k);
                if(exec) {
                    exec();
                }
            }
        }
        super.update();
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
    static from(data: ImageData | ImageDataArray): Pixel {
        if(data instanceof ImageData) {
            return Pixel.from(data.data);
        } else {
            return new Pixel({ r: data[0], g: data[1], b: data[2], a: data[3] });
        }
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
class Img {
    img: HTMLImageElement;
    constructor(src: string) {
        this.img = new Image();
        this.img.src = src;
    }
}
class Items {
    items: Phantom2dEntity[];
    constructor() {
        this.items = [];
    }
    add(...items: Phantom2dEntity[]) {
        this.items.push(...items);
        items.forEach(i => i.consume("added", new PhantomAddedEvent()));
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
    at(i: number): Phantom2dEntity | undefined {
        return this.items[i];
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
    mousePos: Vector;
    runtime: Runtime;
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
        this.mousePos = new Vector(0, 0);
        window.addEventListener("mousemove", (e) => {
            this.mousePos = new Vector(e.clientX, e.clientY);
        });
        this.runtime = new Runtime();
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
    getImgData(pos: Vector): ImageData {
        return this.ctx.getImageData(pos.x, pos.y, 1, 1);
    }
    setImgData(pos: Vector, data: ImageData) {
        this.ctx.putImageData(data, pos.x, pos.y);
    }
    getPixel(pos: Vector): Pixel {
        return Pixel.from(this.getImgData(pos));
    }
    setPixel(pos: Vector, rgba: Pixel) {
        const d = this.getImgData(pos);
        d.data[0] = rgba.r;
        d.data[1] = rgba.g;
        d.data[2] = rgba.b;
        d.data[3] = rgba.a;
        this.setImgData(pos, d);
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
    img(img: HTMLImageElement | Img, x: number, y: number, w: number, h: number) {
        this.ctx.drawImage(img instanceof HTMLImageElement ? img : img.img, x, y, w, h);
    }
    rect(x: number, y: number, w: number, h: number, color: string) {
        this.color = color;
        this.ctx.fillRect(x, y, w, h);
    }
    bg(color: string) {
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
                if(a == b) return;
                if(isCol(a, b)) {
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
    start(postUpd: Function = NoFunc) {
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
    save(file: string) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
    saveLvl(lvlName: string, file: string) {
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
    get delta(): number {
        return this.runtime.delta;
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
    save(file: string) {
        const s = new SaveJSON(file);
        s.save(this, 4);
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
    save(cont: any, indent: number = 4) {
        super.save(Util.str(cont, indent));
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
        s.save(this, 4);
    }
    apply(ent: Phantom2dEntity) {
        Object.assign(ent, this.atts);
    }
}
class Raycast {
    origin: Vector; angle: number; dist: number; scene: Scene;
    constructor(opts: RaycastOptions) {
        this.origin = opts.origin;
        this.angle = opts.angle;
        this.dist = opts.dist;
        this.scene = opts.scene;
    }
    cast(): RaycastIntersecton | null {
        let res: RaycastIntersecton | null = null;
        const dir = new Vector(Math.cos(this.angle), Math.sin(this.angle));
        for(const i of this.scene.items.items) {
            const hit = rayInterRect(this.origin, dir, i, this.scene);
            if(hit) {
                if(res && hit < res.dist) res = new RaycastIntersecton(hit, i, new Vector(this.origin.x + dir.x * hit, this.origin.y + dir.y * hit));
            }
        }
        return res;
    }
}
class RaycastIntersecton {
    dist: number;
    obj: Phantom2dEntity;
    point: Vector;
    constructor(dist: number, obj: Phantom2dEntity, point: Vector) {
        this.dist = dist;
        this.obj = obj;
        this.point = point;
    }
}
class Runtime {
    processId: number; delta: number;
    constructor() {
        this.processId = -1;
        this.delta = 0;
    }
    start(fn: Function) {
        if(this.processId != -1) throw new ExistingProcessError();
        const out = () => {
            fn();
            this.delta++;
            this.processId = requestAnimationFrame(out);
        }
        out();
    }
    stop() {
        if(this.processId == -1) throw new NoProcessError();
        cancelAnimationFrame(this.processId);
        this.delta = 0;
    }
}

function isCol(a: Phantom2dEntity, b: Phantom2dEntity): boolean {
    const w1 = a.width; const h1 = a.height; const x1 = a.x; const y1 = a.y;
    const w2 = b.width; const h2 = b.height; const x2 = b.x; const y2 = b.y;
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}
function rayInterRect(origin: Vector, dir: Vector, rect: Phantom2dEntity, scene: Scene): number | null {
    const uv = uvVec(dir, scene.width, scene.height);
    const t1 = (rect.x - origin.x) / uv.x;
    const t2 = (rect.scrX() - origin.x) / uv.x;
    const t3 = (rect.y - origin.y) / uv.y;
    const t4 = (rect.scrY() - origin.y) / uv.y;
    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    if(tmax < 0 || tmin > tmax) return null;
    return tmin >= 0 ? tmin : tmax;
}
function uvVec(p: Vector, w: number, h: number): Vector {
    let u = p.x / (w - 1);
    let v = p.y / (h - 1);
    u = u * 2 - 1;
    v = v * 2 - 1;
    let aspect = w / h;
    u *= aspect;
    return new Vector(u, v);
}

export {
    Custom, Axis, Dir, EventHandle, EventType, Callback, PhantomEventType,
    PhantomEventHandle, AudioMIME, CollisionHandle,
    
    NoFunc,

    NoContextError, ExistingProcessError, NoCanvasError, NoProcessError,
    
    Phantom2dOptions, StaticObjectOptions, PhysicsObjectOptions, Extent,
    MovingObjectOptions, BulletObjectOptions, SceneOptions, PhantomEventMap,
    SaveOptions, SoundOptions, RaycastOptions,

    PhantomEvent, PhantomAliveEvent, PhantomAddedEvent, PhantomRemovedEvent,

    Phantom2dEntity, StaticObject, PhysicsObject, MovingObject, BulletObject,
    Scene, Character, PlayableCharacter,
    
    Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel, Raycast,
    RaycastIntersecton,

    isCol, rayInterRect, uvVec
};