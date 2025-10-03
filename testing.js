import * as phantom from "./phantom2d.js";

const canvas = document.getElementById("phantom-2d-canvas");

const scene = new phantom.Scene(canvas, "100vw", "100vh");
scene.rect(0, 0, 50, 50, "green");
// example with some StaticObjects
const statics = [
    new phantom.StaticObject({ id: "myso1", shape: "rect", px: 10, py: 10, width: 30, height: 50, collide: null, color: "blue" }),
    new phantom.StaticObject({ id: "myso2", shape: "rect", px: 30, py: 30, width: 40, height: 5, collide: null, color: "red" }),
    new phantom.StaticObject({ id: "myso3", shape: "rect", px: 70, py: 70, width: 80, height: 60, collide: null, color: "green" })
];
scene.add(...statics);
// note that MovingObject is experimental and I haven't done testing on it yet
// Use with caution
const mymo = new phantom.MovingObject({
    id: "mymo",
    shape: "rect",
    dirX: 1, dirY: 0,
    extentLeft: 10, extentRight: 50,
    extentDown: null, extentUp: null,
    isBouncing: true,
    speed: 1
});