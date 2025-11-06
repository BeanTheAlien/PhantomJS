import * as phantom from "./../phantom2d.js";

const canvas = document.getElementById("zelda");

const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");
const c = new phantom.StaticObject({
    id: "1", shape: "rect", color: "#00f7ffff", x: 5, y: 5, width: 30, height: 40
});
scene.add(c);

function render() {
    scene.update();
    scene.clear();
    scene.render();
    requestAnimationFrame(render);
}
render();