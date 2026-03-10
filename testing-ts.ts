import * as p2d from "./phantom2d.js";

const canvas = document.getElementById("canvas");
const scene = new p2d.Scene({ canvas: canvas, w: 750, h: 750 });
const ent = new p2d.Entity({ width: 30, height: 30, x: scene.width / 2, y: scene.height / 2, color: "#27e700" });
scene.add(ent);
ent.use("pointatmouse", {
    scene: scene
});
scene.start();

console.log(ent);