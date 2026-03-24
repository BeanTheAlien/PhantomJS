import * as p2d from "../../phantom2d.js";

window.addEventListener("error", (e) => {
    alert(e.message);
})
const scene = new p2d.Scene({ canvas: "heli", w: 750, h: 750, border: "2px solid red" });
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);

const player = new p2d.PlayableCharacter({ strength: 0.27, width: 50, height: 25, color: "red", x: 10, custom: { eng: false } });
player.use("enhancedphys", { scene, fric: 0.88 });
const phys = player.comp("enhancedphys");
player.bind("w", () => { if(player.eng) player.jump(7); });
player.bind("a", () => { if(player.eng) phys.addForceX(-1); });
player.bind("d", () => { if(player.eng) phys.addForceX(1); });
player.bind("e", () => { player.eng = !player.eng; }, 1000);
scene.add(player);
const w = 55;
const prop = new p2d.Entity({ rot: 0, x: player.width / 2 - w / 2, y: -5, width: w, height: 7, color: "#222222" });
player.child.add(prop);

scene.start(() => {
    if(player.eng) {
        prop.rot += 5;
        prop.rot %= 360;
    }
});