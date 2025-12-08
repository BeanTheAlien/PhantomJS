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
            id: "", shape: "rect", color: "#d3950fff", collide: (c) => {
                if(c == mario) cancelAnimationFrame(frame);
            }, x: 0, y: 0, width: 10, height: 5, custom: { spd }
        });
    }
}
const b = new Barrel(1);

var frame = 0;
function render() {
    scene.clear();
    scene.update();
    scene.render();
    frame = requestAnimationFrame(render);
}
render();