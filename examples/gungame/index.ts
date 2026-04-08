import * as p2d from "../../phantom2d.js";
const scene = new p2d.Scene({ canvas: "gungame", w: 700, h: 700, border: "3px solid red" });
const gun = new p2d.Pistol({ mag: 8, ammo: 16, opts: { scene, spd: 1, rot: p2d.Angle.rad(180), extLeft: 0, extRight: scene.width, extBtm: scene.height, extTop: 0, width: 5, height: 3, color: "yellow" }, scene });
gun.fire(new p2d.Vector(50, 50));
console.log(scene.items);

scene.start();