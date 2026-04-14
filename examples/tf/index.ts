import * as p2d from "../../phantom2d.js";

p2d.Img.config.set("root", "assets");
const scene = new p2d.Scene({ canvas: "tf", w: 750, h: 750, border: "2px solid red" });
const fh = 50;
const floor = new p2d.FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);

class Merc extends p2d.Entity {
    prim: WeapBase;
    sec: WeapBase;
    mel: WeapBase;
    merc: p2d.Img;
    active: WeapBase;
    constructor(prim: WeapBase, sec: WeapBase, mel: WeapBase, merc: string) {
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
    swap(w: WeapBase) {
        this.active = w;
        this.active.onActivated();
    }
}
class Soldier extends Merc {
    constructor() {
        super(new RocketLauncher(), new Shotgun(), new Shovel(), "mc.png");
    }
}
class Scout extends Merc {
    constructor() {
        super(new Scattergun(), new Pistol(), new Bat(), "mc.png");
    }
}
class Pyro extends Merc {
    constructor() {
        super(new Flamethrower(), new Shotgun(), new FireAxe(), "mc.png");
    }
}
class Demo extends Merc {
    constructor() {
        super(new GrenadeLauncher(), new StickyBombLauncher(), new Bottle(), "mc.png");
    }
}
class Heavy extends Merc {
    constructor() {
        super(new Minigun(), new Shovel(), new Fists(), "mc.png");
    }
}
class Sniper extends Merc {
    constructor() {
        super(new SniperRifle(), new SMG(), new Kukri(), "mc.png");
    }
}
class Spy extends Merc {
    constructor() {
        super(new Revolver(), new Sapper(), new Knife(), "mc.png");
    }
}
class Engi extends Merc {
    pda1: ConstructionPDA;
    pda2: DestructionPDA;
    metal: number;
    constructor() {
        super(new Shotgun(), new Pistol(), new Wrench(), "mc.png");
        this.pda1 = new ConstructionPDA();
        this.pda2 = new DestructionPDA();
        this.metal = 200;
    }
}
abstract class WeapBase {
    img: p2d.Img;
    w;
    constructor(img: string, w?: number) {
        this.img = new p2d.Img(img);
        this.w = w ?? 50;
    }
    abstract fire(): void;
    alt() {}
    pRot() {
        return scene.rotToMouse(player);
    }
    rayOpts(dist?: number, angle?: number) {
        return { origin: weap.origin(), dist: dist ?? 1000, angle: angle ?? this.pRot(), scene };
    }
    ray(angle?: number, dist?: number) {
        return (new p2d.Raycast(this.rayOpts(dist, angle))).cast();
    }
    debug(angle?: number, color?: string, dist?: number, life?: number) {
        new p2d.DebugRay({ ...this.rayOpts(dist, angle), color: color ?? "red", life });
    }
    col(o: p2d.Entity) {
        if(o.uses("health")) {
            o.comp("health").hurt(1);
        }
    }
    onActivated() {}
}
const bulletBounds = { extLeft: 0, extBtm: scene.height, extRight: scene.width, extTop: 0 };
class RocketLauncher extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const b = new p2d.BulletObject({ scene, spd: 3, rot: this.pRot(), ...bulletBounds, width: 15, height: 10, color: "#949494", x: player.x, y: player.y, collide: (o) => this.col(o) });
        scene.add(b);
    }
}
class GunBase extends WeapBase {
    cd: p2d.Cooldown;
    constructor(img: string, cdTime: number) {
        super(img);
        this.cd = new p2d.Cooldown(cdTime);
    }
    fire(): void;
    fire(pel: number, offMin: number, offMax: number): void;
    fire(pel?: number, offMin?: number, offMax?: number) {
        if(!this.cd.ready) return;
        this.cd.consume();
        const a = this.pRot();
        for(let i = 0; i < (pel ?? 6); i++) {
            const _a = a + p2d.Angle.rad(p2d.random(offMin ?? -15, offMax ?? 16));
            const out = this.ray(_a, 100);
            this.debug(_a, "yellow", 100, 200);
            if(out) this.col(out.obj);
        }
    }
}
class ShotgunBase extends GunBase {
    constructor(img: string) {
        super(img, 100);
    }
    fire() {
        // run a set of 6 casts within a +- 15deg of a
        super.fire(6, -15, 16);
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
class Pistol extends GunBase {
    constructor() {
        super("mc.png", 100);
    }
    fire() {
        super.fire(1, -5, 6);
    }
}
class Flamethrower extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const a = this.pRot();
        for(let i = -15; i <= 16; i++) {
            const _a = a + p2d.Angle.rad(i);
            const out = this.ray(_a, 100);
            this.debug(_a, "red", 100, 200);
            if(out) this.col(out.obj);
        }
    }
}
class GrenadeLauncher extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        scene.add(new p2d.BulletObject({ scene, spd: 3, rot: this.pRot(), ...bulletBounds, width: 15, height: 10, color: "#b01818", x: player.x, y: player.y, collide: (o) => this.col(o), decay: 0.35 }));
    }
}
class StickyBombLauncher extends WeapBase {
    static stickys: p2d.BulletObject[] = [];
    constructor() {
        super("mc.png");
    }
    fire() {
        scene.add(new p2d.BulletObject({ scene, spd: 3, rot: this.pRot(), ...bulletBounds, width: 10, height: 10, color: "#990404", x: player.x, y: player.y, decay: 0.35 }));
    }
    alt() {
        StickyBombLauncher.stickys.forEach(s => scene.rm(s));
    }
}
class Minigun extends GunBase {
    constructor() {
        super("mc.png", 25);
    }
    fire() {
        super.fire(1, -5, 6);
    }
}
class SniperRifle extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const out = this.ray(this.pRot(), Infinity);
        this.debug(this.pRot(), "yellow", Infinity, 200);
        if(out) this.col(out.obj);
    }
}
class SMG extends GunBase {
    constructor() {
        super("mc.png", 65);
    }
    fire() {
        super.fire(1, -10, 11);
    }
}
class Revolver extends GunBase {
    constructor() {
        super("mc.png", 100);
    }
    fire() {
        super.fire(1, -3, 4);
    }
}
class Sapper extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const out = this.ray(this.pRot(), 50);
        if(out) if(out.obj instanceof Building) out.obj.destroy();
    }
}
class Melee extends WeapBase {
    constructor(img: string) {
        super(img);
    }
    fire() {
        const out = this.ray();
        if(out) this.col(out.obj);
    }
}
class Shovel extends Melee { constructor() { super("mc.png"); } }
class Bat extends Melee { constructor() { super("mc.png"); } }
class FireAxe extends Melee { constructor() { super("mc.png"); } }
class Bottle extends Melee { constructor() { super("mc.png"); } }
class Fists extends Melee { constructor() { super("mc.png"); } }
class Kukri extends Melee { constructor() { super("mc.png"); } }
class Knife extends Melee {
    constructor() {
        super("mc.png");
    }
}
class Wrench extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const out = this.ray(this.pRot(), 100);
        if(out) if(out.obj instanceof Building) {
            const h = out.obj.comp("health");
            if(out.obj.id) {
                clearInterval(out.obj.id);
                out.obj.id = undefined;
            } else if(h.mhp && h.hp < h.mhp) {
                h.heal(5);
            } else {
                out.obj.prog++;
                if(out.obj.prog >= 4) {
                    scene.rm(out.obj);
                }
            }
        }
    }
}
class Building extends p2d.Entity {
    id?: number;
    lvl: number = 1;
    prog: number = 0;
    init(hp: number) {
        this.use("health", { hp, mhp: hp });
    }
    destroy() {
        this.id = setInterval(() => this.comp("health").hurt(5), 1000);
    }
}
abstract class PDA extends WeapBase {
    abstract menu(): void;
    fire() {}
    onActivated() {
        this.menu();
    }
}
class ConstructionPDA extends PDA {
    constructor() {
        super("mc.png");
    }
    menu() {}
}
class DestructionPDA extends PDA {
    constructor() {
        super("mc.png");
    }
    menu() {}
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
player.bind("1", () => sol.swap(sol.prim));
player.bind("2", () => sol.swap(sol.sec));
player.bind("3", () => sol.swap(sol.mel));
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