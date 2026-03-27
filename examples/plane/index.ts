import * as p2d from "../../phantom2d.js";

window.addEventListener("error", (e) => {
    alert(e.message)
})

const scene = new p2d.Scene({ canvas: "plane", w: 750, h: 750, border: "2px solid red" });
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);

const plane = new p2d.Aircraft({
    scene, wing: 30, grav: 0.98, drag: 0.5, width: 30, height: 10, x: 10, y: 30, color: "red", air: 1, mass: 1
});
plane.addThrust(30);

scene.add(plane);

scene.start();