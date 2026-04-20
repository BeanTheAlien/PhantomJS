import * as p2d from "./phantom2d.js";
const canvas = document.getElementById("canvas");
const scene = new p2d.Scene({ canvas: canvas, w: 750, h: 750 });
const ent = new p2d.Entity({ width: 30, height: 30, x: scene.width / 2, y: scene.height / 2, color: "#27e700" });
scene.add(ent);
ent.use("pointatmouse", {
    scene: scene
});
const ui = new p2d.SceneUI({
    scene,
    x: 10,
    y: 30,
    w: 100,
    h: 50,
    color: "#00367c"
});
const tx = new p2d.TextUI({ scene, tx: "Hello", font: "24px Comic Sans MS", y: 30, color: "red" }); // rend: () => scene.color = "red"
ui.addChild(tx);
scene.addUI(ui);
const btn = new p2d.ButtonUI({
    scene,
    x: 100,
    y: 50,
    w: 100,
    h: 50,
    click: () => console.log("hi"),
    styles: {
        idle: "#085ddd",
        hover: "#02fab0",
        click: "#fd0404"
    }
});
scene.addUI(btn);
let i = 0;
scene.start(() => { scene.frustum(10, scene.height, 15, 5, 10, "#ff0000"); scene.cone(new p2d.Vector(100, 100), new p2d.Vector(70, 200), new p2d.Vector(30, 15), "#ff0202"); i += scene.delta / 10000; if (i < 1) {
    tx.x = p2d.lerp(0, 500, i);
    tx.y = p2d.lerp(30, 30, i);
} });
