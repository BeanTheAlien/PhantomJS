import * as p2d from "./phantom2d.ts";

const canvas = document.getElementById("canvas");
if(!canvas) throw new Error();
const scene = new p2d.Scene({ canvas: canvas });
const sqr = new p2d.StaticObject({ shape: "rect", color: "#51ee18", width: 50, height: 50 });
scene.add(sqr);

scene.start();