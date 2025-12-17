import * as p2d from "./phantom2d.js";
import { wait } from "./phantom.js";

class PhysicsV2 {
    constructor(s) {
        this.vx = 0;
        this.vy = 0;
        this.ax = 1;
        this.ay = 1;
        this.fric = 0.6;
        this.mass = s.mass;
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
    applyImpulse(dir, amount) {
        const d = this.#dir(dir);
        if(d == 0) this.ax *= amount;
        else if(d == 1) this.ay *= amount;
    }
}