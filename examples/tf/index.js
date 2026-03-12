import * as p2d from "../../phantom2d.js";
p2d.Img.config.set("root", "assets");
const scene = new p2d.Scene({ canvas: "tf", w: 750, h: 750, border: "2px solid red" });
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);
class Merc extends p2d.Entity {
    constructor(weap, merc) {
        super({ width: 10, height: 30 });
        this.weap = new p2d.Img(weap);
        this.merc = new p2d.Img(merc);
    }
}
const player = new p2d.PlayableCharacter({ strength: 0.4, width: 10, height: 30, color: "red", custom: { spd: 3, jh: 10 }, x: 10 });
player.use("enhancedphys", { scene, fric: 0.88 });
player.bind("w", () => { if (player.onGround)
    player.jump(player.jh); });
player.bind("a", () => player.comp("enhancedphys").addForceX(-1));
player.bind("d", () => player.comp("enhancedphys").addForceX(1));
scene.add(player);
player.bind("1", () => { scene.screenshot("helloworld.png"); });
scene.start();
