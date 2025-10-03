import * as phantom from "./phantom2d.js";

const canvas = document.getElementById("phantom-2d-canvas");

const scene = new phantom.Scene(canvas, "100vw", "100vh");
scene.rect(0, 0, 50, 50, "green");
// example with some StaticObjects
const statics = [
    new phantom.StaticObject({ name: "myso1", shape: "rect", px: 10, py: 10, width: 30, height: 50, collide: null, color: "blue" }),
    new phantom.StaticObject({ name: "myso2", shape: "rect", px: 30, py: 30, width: 40, height: 5, collide: null, color: "red" }),
    new phantom.StaticObject({ name: "myso3", shape: "rect", px: 70, py: 70, width: 80, height: 60, collide: null, color: "green" })
];
scene.add(...statics);