type Custom = { any?: any };
type Axis = "x" | "y" | 0 | 1;
type Dir = 0 | 1;
type CompassDir = 0 | 1 | 2 | 3 | number;
type EventHandle = (e: Event) => void;
type EventType = keyof HTMLElementEventMap;
type Callback<T> = (value: Phantom2dEntity, index: number, array: Phantom2dEntity[]) => T;
type PhantomEventType = keyof PhantomEventMap;
const NoFunc: Function = (() => {});

class NoContextError extends Error {
    constructor() {
        super("Cannot get context 2D.");
        this.name = "NoContextError";
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
    collide?: Function;
    x?: number;
    y?: number;
    rot?: number;
    width?: number;
    height?: number;
    custom?: Custom;
    upd?: Function;
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
    spd: number;
    dir: CompassDir;
}
interface SceneOptions {
    canvas: HTMLCanvasElement;
    w?: number;
    h?: number;
    cssW?: string;
    cssH?: string;
}
interface PhantomEventMap {
    alive: PhantomEvent;
}
class PhantomEvent {}

class Phantom2dEntity {
    collide: Function; upd: Function;
    x: number; y: number;
    rot: number;
    width: number; height: number;
    constructor(opts: Phantom2dOptions) {
        this.collide = opts.collide ?? NoFunc;
        this.upd = opts.upd ?? NoFunc;
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.rot = opts.rot ?? 0;
        this.width = opts.width ?? 0;
        this.height = opts.height ?? 0;
    }
    setPos(x: number | Vector, y?: number) {
        if (typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        } else if (x instanceof Vector) {
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
    update() {
        this.upd();
    }
}
class StaticObject extends Phantom2dEntity {
    constructor(opts: StaticObjectOptions) {
        super(opts);
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
}
class BulletObject extends Phantom2dEntity {
    dir: CompassDir;
    extLeft: number; extRight: number; extBtm: number; extTop: number;
    spd: number;
    constructor(opts: BulletObjectOptions) {
        super(opts);
        this.dir = opts.dir;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
    }
    update() {
        switch(this.dir) {
            case 0: this.y -= this.spd; break;
            case 1: this.x += this.spd; break;
            case 2: this.y += this.spd; break;
            case 3: this.x -= this.spd; break;
            default:
                const dx = Math.cos(this.dir);
                const dy = Math.sin(this.dir);
                this.x += dx * this.spd;
                this.y += dy * this.spd;
                break;
        }
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
class Items {
    items: Phantom2dEntity[];
    constructor() {
        this.items = [];
    }
    add(...items: Phantom2dEntity[]) {
        this.items.push(...items);
    }
    rm(...items: Phantom2dEntity[]) {
        for(const item of items) {
            if(this.has(item)) {
                this.items.splice(this.idxOf(item), 1);
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
class Scene {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    items: Items;
    evStore: Store<EventType, EventHandle>;
    lvlStore: Store<string, Level>;
    constructor(opts: SceneOptions) {
        this.canvas = opts.canvas;
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
    update() {
        this.items.forEach(i => i.update());
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
}