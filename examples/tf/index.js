import * as p2d from "../../phantom2d.js";
p2d.Img.config.set("root", "assets");
const scene = new p2d.Scene({ canvas: "tf", w: 750, h: 750 });
scene.canvas.style.border = "2px solid red";
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);
class Merc extends p2d.Entity {
    constructor(weap, merc) {
        super({ width: 10, height: 30, color: "red" });
        this.weap = new p2d.Img(weap);
        this.merc = new p2d.Img(merc);
    }
}
const player = new p2d.PlayableCharacter({ strength: 0.4, width: 10, height: 30, color: "red", custom: { spd: 5, jh: 10 }, x: 10 });
player.bind("w", () => { if (player.onGround)
    player.jump(player.jh); });
player.bind("a", () => player.moveX(-player.spd));
player.bind("d", () => player.moveX(player.spd));
scene.add(player);
scene.start();
