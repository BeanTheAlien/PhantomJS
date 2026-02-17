type Custom = { any?: any };
interface Phantom2dOptions {
    collide?: Function;
    x?: number;
    y?: number;
    rot?: number;
    width?: number;
    height?: number;
    custom?: Custom;
}

class Phantom2dEntity {
    collide: Function;
    x: number; y: number;
    rot: number;
    width: number; height: number;
    constructor(opts: Phantom2dOptions) {
        this.collide = opts.collide ?? (() => {});
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
}
class Vector {
    x: number; y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}