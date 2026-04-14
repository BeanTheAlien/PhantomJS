import * as p2d from "../../phantom2d.js";
p2d.Img.config.set("root", "assets");
const scene = new p2d.Scene({ canvas: "tf", w: 750, h: 750, border: "2px solid red" });
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);
class Merc extends p2d.Entity {
    constructor(prim, sec, mel, merc) {
        super();
        this.prim = prim;
        this.sec = sec;
        this.mel = mel;
        this.merc = new p2d.Img(merc);
        this.active = this.prim;
    }
    fire() {
        this.active.fire();
    }
    alt() {
        this.active.alt();
    }
}
class Soldier extends Merc {
    constructor() {
        super(new RocketLauncher(), new Shotgun(), new Shovel(), "mc.png");
    }
}
class Scout extends Merc {
}
class WeapBase {
    constructor(img, w) {
        this.img = new p2d.Img(img);
        this.w = w !== null && w !== void 0 ? w : 50;
    }
    alt() { }
    pRot() {
        return scene.rotToMouse(player);
    }
    ray(angle, dist) {
        return (new p2d.Raycast({ origin: weap.origin(), dist: dist !== null && dist !== void 0 ? dist : 1000, angle: angle !== null && angle !== void 0 ? angle : this.pRot(), scene })).cast();
    }
    debug(angle, color, dist, life) {
        new p2d.DebugRay({ scene, origin: weap.origin(), dist: dist !== null && dist !== void 0 ? dist : 1000, color: color !== null && color !== void 0 ? color : "red", angle: angle !== null && angle !== void 0 ? angle : this.pRot(), life });
    }
}
class RocketLauncher extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const b = new p2d.BulletObject({ scene, spd: 3, rot: scene.rotToMouse(player), extLeft: 0, extBtm: scene.height, extRight: scene.width, extTop: 0, width: 15, height: 10, color: "#949494", x: player.x, y: player.y, collide: (o) => {
                if (o.uses("health")) {
                    o.comp("health").hurt(1);
                }
            } });
        scene.add(b);
    }
}
class ShotgunBase extends WeapBase {
    constructor(img) {
        super(img);
    }
    fire() {
        const a = scene.rotToMouse(player);
        // run a set of 6 casts within a +- 15deg of a
        for (let i = 0; i < 6; i++) {
            const _a = a + p2d.Angle.rad(p2d.random(-15, 16));
            const out = this.ray(_a, 100);
            this.debug(_a, "yellow", 100, 200);
            if (out && out.obj.uses("health")) {
                out.obj.comp("health").hurt(1);
            }
        }
    }
}
class Shotgun extends ShotgunBase {
    constructor() {
        super("mc.png");
    }
}
class Scattergun extends ShotgunBase {
    constructor() {
        super("mc.png");
    }
}
class Melee extends WeapBase {
    constructor(img) {
        super(img);
    }
    fire() {
        const out = this.ray();
        if (out && out.obj.uses("health")) {
            out.obj.comp("health").hurt(1);
        }
    }
}
class Shovel extends Melee {
    constructor() { super("mc.png"); }
}
class Bat extends Melee {
    constructor() { super("mc.png"); }
}
class Weap {
    render() {
        const o = this.origin();
        scene.img(sol.active.img, o.x, o.y, sol.active.w, 10);
    }
    origin() {
        const c = player.center();
        const f = c.x - (player.face == 0 ? 0 : sol.active.w);
        return new p2d.Vector(f, c.y - 5);
    }
    shoot() {
        const cast = new p2d.Raycast({ origin: this.origin(), dist: 1000, angle: scene.rotToMouse(player), scene });
        const out = cast.cast();
        if (out && out.obj.uses("health")) {
            out.obj.comp("health").hurt(1);
        }
    }
}
const player = new p2d.PlayableCharacter({ strength: 0.4, width: 15, height: 40, color: "red", custom: { spd: 3, jh: 10, face: 0 }, x: 10 });
player.use("enhancedphys", { scene, fric: 0.88 });
const phys = player.comp("enhancedphys");
player.bind("w", () => { if (player.onGround)
    player.jump(player.jh); });
player.bind("a", () => { phys.addForceX(-1); player.face = 1; });
player.bind("d", () => { phys.addForceX(1); player.face = 0; });
player.bind("1", () => sol.active = sol.prim);
player.bind("2", () => sol.active = sol.sec);
player.bind("3", () => sol.active = sol.mel);
const sol = new Soldier();
const weap = new Weap();
player.child.add(sol);
// const enemy = new p2d.Character({ strength: 0.4, x: 20, color: "#1448f0", width: 15, height: 40 });
// enemy.use("health", { mhp: 5, hp: 5 });
// const test = new p2d.Entity({ width: 5, height: 5, color: "yellow", x: 100 });
// player.child.add(test);
scene.add(player);
scene.on("click", () => sol.fire());
scene.on("click", () => sol.alt());
scene.start(() => {
    weap.render();
});
