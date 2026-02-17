type Custom = { any?: any };
type Axis = "x" | "y" | 0 | 1;
const NoFunc: Function = (() => {});
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
class Vector {
    x: number; y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}