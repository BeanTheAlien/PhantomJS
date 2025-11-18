import * as p2d from "./../../phantom2d.js";

const canvas = document.getElementById("phantom-canvas");
const scene = new p2d.Scene(canvas, 500, 500, "100vw", "100vh");
const player = new p2d.PlayableCharacter({
    id: "doodle", shape: "rect", color: "#009625ff", width: 20, height: 40, strength: 3, binds: {
        "w": () => player.jump(5)
    }
});
scene.add(player);

function render() {
    scene.update();
    scene.clear();
    scene.render();
    requestAnimationFrame(render);
}
render();