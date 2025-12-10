window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

import * as phantom from "../phantom2d.js";
const canvas = document.getElementById("p2d-canvas");
const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");
const mario = new phantom.PlayableCharacter({
    id: "mario", shape: "rect", color: "#be1414ff",
    width: 5, height: 10, x: 10, y: 10, strength: 0.03,
    binds: {
        w: () => {
            if(flure.some(f => phantom.isColliding(mario, f))) mario.jump(1.5);
        },
        a: () => mario.moveX(-1),
        d: () => mario.moveX(1)
    },
    collide: (c) => {
        if(c instanceof Barrel) {
            gameOver = 1;
        }
    },
    upd: () => {
        if(flure.some(f => phantom.isColliding(mario, f))) {
            phantom.resolveYCol(mario, flure.find(f => phantom.isColliding(mario, f)));
            return;
        }
        mario.strength = 0.03;
    }
});
class Flur extends phantom.WallObject {
    constructor(x, y, width) {
        super({ id: "flur", shape: "rect", color: "#680f0fff", x, y, width, height: 10 });
    }
}
scene.add(mario);
const flur = new Flur(0, 50, 0.75 * scene.width);
scene.add(flur);
const flur2 = new Flur(scene.width * 0.25, 100, 0.75 * scene.width);
scene.add(flur2);
const flure = [flur, flur2];

class Barrel extends phantom.Phantom2DEntity {
    constructor(spd) {
        super([], "", {
            id: "barrel", shape: "rect", color: "#cf8112ff", collide: (c) => {
                if(c.id == mario.id) gameOver = 1;
            }, x: 0, y: 0, width: 15, height: 10, custom: { spd, level: 0 }
        });
    }
    update() {
        if(this.level % 2 == 0) {
            this.moveX(this.spd);
            if(this.x >= scene.width * 0.75) {
                this.level++;
                this.moveY(10);
            }
        } else {
            this.moveX(-this.spd);
            if(this.x <= scene.width * 0.25) {
                this.level++;
                this.moveY(10);
            }
        }
    }
}
const b = new Barrel(5);
scene.add(b);

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