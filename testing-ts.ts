import * as p2d from "./phantom2d.js";

const canvas = document.getElementById("canvas");
const scene = new p2d.Scene({ canvas: canvas, w: 1000, h: 1000, cssW: "50vw", cssH: "50vh" });
const sqr = new p2d.StaticObject({ shape: "rect", color: "#51ee18", width: 50, height: 50, rot: 45 });
scene.add(sqr);
const ent = new p2d.Phantom2dEntity({ width: 30, height: 30, x: 3000, y: 3000 });
ent.use("sprite", { scene, frames: ["missing_content.png"] });
scene.add(ent);

scene.start();