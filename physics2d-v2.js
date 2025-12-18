import * as p2d from "./phantom2d.js";
import { wait } from "./phantom.js";

class PhysicsV2 {
    constructor(s) {
        this.vx = 0;
        this.vy = 0;
        this.ax = 1;
        this.ay = 1;
        this.fx = 0;
        this.fy = 0;
        // kg
        this.mass = s.mass;
        // m^3
        this.vol = s.vol;
        this.dens = this.mass / this.vol;
        this.x = 0;
        this.y = 0;
    }
    getVel() {
        return { x: this.vx, y: this.vy };
    }
    getVelX() {
        return this.vx;
    }
    getVelY() {
        return this.vy;
    }
    setVel(x, y) {
        this.vx = x;
        this.vy = y;
    }
    setVelX(v) {
        this.vx = v;
    }
    setVelY(v) {
        this.vy = v;
    }
    getAccl() {
        return { x: this.ax, y: this.ay };
    }
    getAcclX() {
        return this.ax;
    }
    getAcclY() {
        return this.ay;
    }
    setAccl(x, y) {
        this.ax = x;
        this.ay = y;
    }
    setAcclX(x) {
        this.ax = x;
    }
    setAcclY(y) {
        this.ay = y;
    }
    #updVel(delta) {
        this.vx *= delta;
        this.vy *= delta;
    }
    #updAcl(delta) {
        this.ax *= delta;
        this.ay *= delta;
    }
    #rootUpdate(d) {
        this.#updAcl(d);
        this.#updVel(d);
        this.x += this.vx * d;
        this.y += this.vy * d;
    }
    #dir(inputDir) {
        return inputDir == "x" || inputDir == 0 ? 0 : inputDir == "y" || inputDir == 1 ? 1 : null;
    }
    addImpulse(dir, amount) {
        const d = this.#dir(dir);
        if(d == 0) this.ax += amount;
        else if(d == 1) this.ay += amount;
    }
    remImpulse(dir, amount) {
        const d = this.#dir(dir);
        if(d == 0) this.ax -= amount;
        else if(d == 1) this.ay -= amount;
    }
    applyImpulse(dir, amount) {
        const d = this.#dir(dir);
        if(d == 0) this.ax *= amount;
        else if(d == 1) this.ay *= amount;
    }
    update(d) {
        this.#rootUpdate(d);
    }
}
class Material {
    constructor(s) {
        this.name = s.name;
        this.fric = s.fric;
        this.color = s.color;
    }
    physCompCollides(c) {
        // slow the acceleration by this friction
        c.applyImpulse(0, this.fric);
        c.applyImpulse(1, this.fric);
    }
}
class Liquid {
    constructor(s) {
        this.name = s.name;
        this.dens = s.dens;
    }
    buoyancy(c) {
        // floats
        if(c.dens < this.dens) return 1;
        // neutral
        if(c.dens == this.dens) return 0;
        // sinks
        if(c.dens > this.dens) return -1;
    }
}
class LiquidWater extends Liquid {
    constructor() {
        // liquid water has a density of 1000 kg/m^3
        super({ name: "water", dens: 1000 });
    }
}
class Gravity {
    static acclForce(m, A) {
        // force = mass * acceleration
        const F = m * A;
        // derive the acceleration force applied on some object
        const a = F / m;
        return a;
    }
    static applyGravity(d, objs) {
        for(const o of objs) {
            // cancel force acculmator
            o.fx = 0;
            o.fy = 0;
        }
        for(const [i, o1] of objs.entries()) {
            for(const [j, o2] of objs.entries()) {
                // avoid doing the same pair
                if(i < j) {
                    // compute distance between centers
                    const dx = o2.x - o1.x;
                    const dy = o2.y - o1.y;
                    // the distance between their centers
                    const r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                    // avoid division by 0
                    if(r < 1) r = 1;
                    // gravitioanl constant
                    const k = 1000;
                    // the force being applied
                    // F = k * (q1 * q2 / r^2)
                    const f = (k * o1.m * o2.m) / Math.pow(r, 2);
                    const fx = f * dx / r;
                    const fy = f * dy / r;
                    // accumlate
                    o1.fx += fx;
                    o1.fy += fy;
                    // opposite direction
                    o2.fx -= fx;
                    o2.fy -= fy;
                }
            }
        }
        for(const o of objs) {
            // update acceleration
            const ax = o.fx / o.mass;
            const ay = o.fy / o.mass;
            // velocity
            o.vx += ax * d;
            o.vy += ay * d;
            // position
            o.x += o.vx * d;
            o.y += o.vy * d;
        }
    }
}
class Colllision {
    constructor(o1, o2, dx, dy, d) {
        this.o1 = o1;
        this.o2 = o2;
        this.dx = dx;
        this.dy = dy;
        this.d = d;
    }
}
function circleCol(o1, o2) {
    const dx = o2.x - o1.x;
    const dy = o2.y - o1.y;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    // if the sum of the radii is lower than their distance, they must be colliding
    if(d < o1.r + o2.r) {
        return {
            info: new Colllision(o1, o2, dx, dy, d),
            col: true
        }
    }
    return {
        info: null,
        col: false
    }
}
function resolveCircleCol(info) {
    // Eigen vectors
    const nx = info.dx / info.d;
    const ny = info.dy / info.d;
    // pen depth
    const s = info.o1.r + info.o2.r - info.d;
    const s2 = s / 2;
    const nsx = nx * s2;
    const nsy = ny * s2;
    // move by half pen depth
    info.o1.x -= nsx;
    info.o1.y -= nsy;
    // move oppositie half pen depth
    info.o2.x += nsx;
    info.o2.y += nsy;
}
function resolveByForce(info) {
    // law of momentum conservation and law of energy conservation accounting
    // k = -2 * ((o2.vx - o1.vx) * nx + (o2.vy - o1.vy) * ny) / (1/o1.m + 1/o2.m)
    // Eigen vectors
    const nx = info.dx / info.d;
    const ny = info.dy / info.d;
    // pen depth
    const s = info.o1.r + info.o2.r - info.d;
    const s2 = s / 2;
    const nsx = nx * s2;
    const nsy = ny * s2;
    // move by half pen depth
    info.o1.x -= nsx;
    info.o1.y -= nsy;
    // move oppositie half pen depth
    info.o2.x += nsx;
    info.o2.y += nsy;

    // magic
    const k = -2 * ((info.o2.vx - info.o1.vx) * nx + (info.o2.vy - info.o1.vy) * ny) / (1 / info.o1.mass + 1 / info.o2.mass);
    const nxk = k * nx;
    const nyk = k * ny;
    info.o1.vx -= nxk / info.o1.mass;
    info.o1.vy -= nyk / info.o1.mass;
    info.o2.vx += nxk / info.o2.mass;
    info.o2.vy += nyk / info.o2.mass;
}
export {
    PhysicsV2, Material, Liquid, LiquidWater
};