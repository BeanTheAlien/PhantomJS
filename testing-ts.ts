import * as p2d from "./phantom2d-ts.js";

const canvas = document.getElementById("canvas");
const scene = new p2d.Scene({ canvas: canvas, w: 1000, h: 1000, cssW: "100vw", cssH: "100vh" });
const sqr = new p2d.StaticObject({ shape: "rect", color: "#51ee18", width: 50, height: 50, rot: 45 });
scene.add(sqr);

scene.start();