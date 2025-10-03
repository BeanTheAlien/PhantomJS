import * as phantom from "./phantom2d.js";

const canvas = document.getElementById("phantom-2d-canvas");

const scene = new phantom.Scene(canvas, "100vw", "100vh");
scene.ctx.fillStyle ="green";
scene.ctx.fillRect(1,1,1000,1000)