window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

import * as phantom from "../phantom2d.js";
const canvas = document.getElementById("p2d-canvas");
const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");
const mario = new phantom.PlayableCharacter({
    id: "mario", shape: "rect", color: "#be1414ff",
    width: 5, height: 10, x: 10, y: scene.height - 35, strength: 0.04,
    binds: {
        w: () => {
            if(lCol()) {
                mario.moveY(-1);
                mario.setGravSpd(0);
            }
            else if(fCol()) mario.jump(1.5);
        },
        a: () => mario.moveX(-mario.spd),
        s: () => {
            if(lCol()) mario.moveY(1);
        },
        d: () => mario.moveX(mario.spd)
    },
    collide: (c) => {
        if(c instanceof Barrel) {
            gameOver = 1;
        }
    },
    upd: () => {
        if(lCol()) {
            mario.strength = 0;
            mario.setGravSpd(0);
            return;
        }
        if(fCol()) {
            phantom.resolveYCol(mario, flure.find(f => phantom.isColliding(mario, f)));
            return;
        }
        mario.strength = 0.04;
    },
    custom: { spd: 1.5 }
});
class Flur extends phantom.WallObject {
    constructor(x, y, width) {
        super({ id: "flur", shape: "rect", color: "#680f0fff", x, y, width, height: 10 });
    }
}
class Ladder extends phantom.Phantom2DEntity {
    constructor(x, y, height) {
        super([], "", {
            id: "ladder", shape: "rect", color: "#970d0bff", x, y, height, width: 7
        });
    }
    update() {}
}
function wp(p) {
    return scene.width * p;
}
function fCol() {
    return flure.some(f => phantom.isColliding(mario, f));
}
function lCol() {
    return ldrs.some(l => phantom.isColliding(mario, l));
}
scene.add(mario);
const flur = new Flur(0, scene.height - 20, scene.width);
const flur1 = new Flur(0, flur.getPosY() - 60, wp(0.75));
const flur2 = new Flur(wp(0.25), flur1.getPosY() - 60, wp(0.75));
const flur3 = new Flur(0, flur2.getPosY() - 60, wp(0.75));
const flur4 = new Flur(wp(0.25), flur3.getPosY() - 60, wp(0.75));
const flur5 = new Flur(0, flur4.getPosY() - 60, wp(0.75));
const flur6 = new Flur(wp(0.25), flur5.getPosY() - 60, wp(0.75));
const flur7 = new Flur(0, flur6.getPosY() - 60, wp(0.75));
scene.add(flur, flur1, flur2, flur3, flur4, flur5, flur6, flur7);
const flure = [flur, flur1, flur2, flur3, flur4, flur5, flur6, flur7];
const ldr = new Ladder(50, 20, 30);
scene.add(ldr);
const ldrs = [ldr];

class Barrel extends phantom.Phantom2DEntity {
    constructor(y = flur7.getPosY() - 10, spd = 5) {
        super([], "", {
            id: "barrel", shape: "rect", color: "#cf8112ff", collide: (c) => {
                if(c.id == mario.id) gameOver = 1;
            }, x: 0, y, width: 15, height: 10, custom: { spd, level: 0 }
        });
    }
    async update() {
        const lerp = (start, end, effect) => start + (end - start) * effect;
        const tY = this.y + 60;
        const yLerp = () => {
            return new Promise((resolve) => {
                const anim = () => {
                    this.y = lerp(this.y, tY, 0.1);
                    if(Math.abs(tY - this.y) > 0.001) requestAnimationFrame(anim);
                    else {
                        this.y = tY;
                        resolve();
                    }
                }
                anim();
            });
        }
        if(this.level % 2 == 0) {
            this.moveX(this.spd);
            if(this.x >= scene.width * 0.85) {
                this.level++;
                await yLerp();
            }
        } else {
            this.moveX(-this.spd);
            if(this.x <= scene.width * 0.15) {
                this.level++;
                await yLerp();
            }
        }
    }
}

async function init() {
    for(let i = 0; i < 10; i++) {
        scene.add(new Barrel());
        await phantom.wait(100);
    }
}
init();

var gameOver = 0;
function render() {
    if(gameOver == 1) {
        return;
    }
    scene.clear();
    scene.update();
    scene.render();
    requestAnimationFrame(render);
}
render();