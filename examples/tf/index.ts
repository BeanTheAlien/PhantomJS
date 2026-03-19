import * as p2d from "../../phantom2d.js";

p2d.Img.config.set("root", "assets");
const scene = new p2d.Scene({ canvas: "tf", w: 750, h: 750, border: "2px solid red" });
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);

class Merc extends p2d.Entity {
    weap: p2d.Img;
    merc: p2d.Img;
    constructor(weap: string, merc: string) {
        super({ width: 10, height: 30 });
        this.weap = new p2d.Img(weap);
        this.merc = new p2d.Img(merc);
    }
}
class Weap {
    img: p2d.Img;
    w: number = 50;
    constructor(img: string) {
        this.img = new p2d.Img(img);
    }
    render() {
        const o = this.origin();
        scene.img(this.img, o.x, o.y, this.w, 10);
    }
    origin(): p2d.Vector {
        const c = player.center();
        const f = c.x - (player.face == 0 ? 0 : this.w);
        return new p2d.Vector(f, c.y - 5);
    }
    shoot() {
        const cast = new p2d.Raycast({ origin: this.origin(), dist: 1000, angle: scene.rotToMouse(player), scene });
        const out = cast.cast();
        if(out && out.obj.uses("health")) {
            out.obj.comp("health").hurt(1);
        }
    }
}
const player = new p2d.PlayableCharacter({ strength: 0.4, width: 15, height: 40, color: "red", custom: { spd: 3, jh: 10, face: 0 }, x: 10 });
player.use("enhancedphys", { scene, fric: 0.88 });
const phys = player.comp("enhancedphys");
player.bind("w", () => { if(player.onGround) player.jump(player.jh); });
player.bind("a", () => { phys.addForceX(-1); player.face = 1; });
player.bind("d", () => { phys.addForceX(1); player.face = 0; });
const weap = new Weap("mc.png");
const enemy = new p2d.Character({ strength: 0.4, x: 20, color: "#1448f0", width: 15, height: 40 });
enemy.use("health", { mhp: 5, hp: 5 });
scene.add(player, enemy);
scene.on("click", () => weap.shoot());

scene.start(() => {
    weap.render();
});