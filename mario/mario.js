window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

import * as phantom from "../phantom2d.js";
const canvas = document.getElementById("p2d-canvas");
const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");
const mario = new phantom.PlayableCharacter({
    id: "mario", shape: "rect", color: "#be1414ff",
    width: 5, height: 10, x: 10, y: 10, strength: 0.03,
    binds: {
        w: () => {
            if(phantom.isColliding(mario, flur)) mario.jump(1.5);
        },
        a: () => mario.moveX(-1),
        d: () => mario.moveX(1)
    },
    collide: (c) => {
        if(c instanceof Barrel) {
            throw new Error("game over");
        }
    },
    upd: () => {
        if(phantom.isColliding(mario, flur)) {
            phantom.resolveYCol(mario, flur);
            return;
        }
        mario.strength = 0.03;
    }
});
scene.add(mario);
const flur = new phantom.WallObject({
    id: "flur", shape: "rect", color: "#680f0fff", x: 0, y: 100,
    width: scene.width, height: 10
});
scene.add(flur);

class Barrel extends phantom.Phantom2DEntity {
    constructor(spd) {
        super([], "", {
            id: "", shape: "rect", color: "#cf8112ff", collide: (c) => {
                if(c.id == mario.id) throw new Error("game over");
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
        }
        else {
            this.moveX(-this.spd);
            if(this.x <= scene.width * 0.25) {
                this.level++;
                this.moveY(10);
            }
        }
    }
}
class Flur extends phantom.WallObject {
    constructor(y) {
        super({ id: "flur", shape: "rect", color: "#680f0fff", x: 0, y: 100, width: scene.width, height: 10 });
    }
}
const b = new Barrel(5);
scene.add(b);

function render() {
    scene.clear();
    scene.update();
    scene.render();
    requestAnimationFrame(render);
}
render();