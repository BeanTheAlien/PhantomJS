import * as p2d from "./phantom2d-ts.js";
const canvas = document.getElementById("canvas");
const scene = new p2d.Scene({ canvas: canvas, w: 750, h: 750, cssW: "80vw", cssH: "80vh" });
const sqr = new p2d.StaticObject({ shape: "rect", color: "#51ee18", width: 50, height: 50 });
scene.add(sqr);
scene.start();
