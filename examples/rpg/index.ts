import { ButtonUI, Scene, TextUI } from "../../phantom2d.js";
const scene = new Scene({ canvas: "rpg", w: 750, h: 750, border: "2px solid red" });

const b1 = new ButtonUI({ scene, styles: {
    idle: "#0050b9",
    hover: "#005fdb",
    click: "#00306e"
}, w: 100, h: 50, click: () => {
    b1.alpha = 0;
    b1.child.forEach((c) => c.alpha = 0);
    setTimeout(() => { b1.alpha = 1; b1.child.forEach((c) => c.alpha = 1); }, 1000);
} });
const tx = new TextUI({ scene, tx: "hello", color: "black" });
b1.addChild(tx);
scene.addUI(b1);

scene.start();