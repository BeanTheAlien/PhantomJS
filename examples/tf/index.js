import { Img, Scene, FloorObject, Entity, Raycast, DebugRay, Cooldown, BulletObject, Angle, random, Vector, PlayableCharacter, MenuUI, KeyInputs, ImgUI, objIs } from "../../phantom2d.js";
window.onerror = alert;
Img.config.set("root", "assets");
const scene = new Scene({ canvas: "tf", w: 1200, h: 1200, border: "2px solid red" });
const fh = 50;
const floor = new FloorObject({ width: scene.width, height: fh, y: scene.height - fh, color: "green" });
scene.add(floor);
class Merc extends Entity {
    constructor(prim, sec, mel, merc) {
        super();
        this.prim = prim;
        this.sec = sec;
        this.mel = mel;
        this.merc = new Img(merc);
        this.active = this.prim;
    }
    fire() {
        this.active.fire();
    }
    alt() {
        this.active.alt();
    }
    swap(w) {
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
        this.dk = new DisguiseKit();
    }
}
class Engi extends Merc {
    constructor() {
        super(new Shotgun(), new Pistol(), new Wrench(), "mc.png");
        this.pda1 = new ConstructionPDA();
        this.pda2 = new DestructionPDA();
        this.metal = 200;
    }
}
class Medic extends Merc {
    constructor() {
        super(new Medigun(), new SyringeGun(), new Bonesaw(), "mc.png");
    }
}
class WeapBase {
    constructor(img, w) {
        this.img = new Img(img);
        this.w = w !== null && w !== void 0 ? w : 50;
    }
    alt() { }
    pRot() {
        return scene.rotToMouse(player);
    }
    rayOpts(dist, angle) {
        return { origin: weap.origin(), dist: dist !== null && dist !== void 0 ? dist : 1000, angle: angle !== null && angle !== void 0 ? angle : this.pRot(), scene };
    }
    ray(angle, dist) {
        return (new Raycast(this.rayOpts(dist, angle))).cast();
    }
    debug(angle, color, dist, life) {
        new DebugRay(Object.assign(Object.assign({}, this.rayOpts(dist, angle)), { color: color !== null && color !== void 0 ? color : "red", life }));
    }
    col(o) {
        if (o.uses("health")) {
            o.comp("health").hurt(1);
        }
    }
    onActivated() { }
}
const bulletBounds = { extLeft: 0, extBtm: scene.height, extRight: scene.width, extTop: 0 };
class RocketLauncher extends WeapBase {
    constructor() {
        super("mc.png");
        this.cd = new Cooldown(500);
    }
    fire() {
        if (!this.cd.ready)
            return;
        this.cd.consume();
        const b = new BulletObject(Object.assign(Object.assign({ scene, spd: 3, rot: this.pRot() }, bulletBounds), { width: 15, height: 10, color: "#949494", x: player.x, y: player.y, collide: (o) => this.col(o) }));
        scene.add(b);
    }
}
class GunBase extends WeapBase {
    constructor(img, cdTime) {
        super(img);
        this.cd = new Cooldown(cdTime);
    }
    fire(pel, offMin, offMax) {
        if (!this.cd.ready)
            return;
        this.cd.consume();
        const a = this.pRot();
        for (let i = 0; i < (pel !== null && pel !== void 0 ? pel : 6); i++) {
            const _a = a + Angle.rad(random(offMin !== null && offMin !== void 0 ? offMin : -15, offMax !== null && offMax !== void 0 ? offMax : 16));
            const out = this.ray(_a, 100);
            this.debug(_a, "yellow", 100, 200);
            if (out)
                this.col(out.obj);
        }
    }
}
class ShotgunBase extends GunBase {
    constructor(img) {
        super(img, 500);
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
        super("mc.png", 300);
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
        // go from -15deg - 15deg with step of 0.1
        for (let i = -15; i <= 16; i += 0.1) {
            const _a = a + Angle.rad(i);
            const out = this.ray(_a, 100);
            this.debug(_a, "red", 100, 100);
            if (out)
                this.col(out.obj);
        }
    }
}
class GrenadeLauncher extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        scene.add(new BulletObject(Object.assign(Object.assign({ scene, spd: 3, rot: this.pRot() }, bulletBounds), { width: 15, height: 10, color: "#b01818", x: player.x + player.getFVec().x + 30, y: player.y - 10, collide: (o) => this.col(o), decay: 0.035 })));
    }
}
class StickyBombLauncher extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const b = new BulletObject(Object.assign(Object.assign({ scene, spd: 3, rot: this.pRot() }, bulletBounds), { width: 10, height: 10, color: "#990404", x: player.x + player.getFVec().x + 30, y: player.y - 10, decay: 0.035 }));
        scene.add(b);
        StickyBombLauncher.stickys.push(b);
    }
    alt() {
        StickyBombLauncher.stickys.forEach(s => scene.rm(s));
    }
}
StickyBombLauncher.stickys = [];
class Minigun extends GunBase {
    constructor() {
        super("mc.png", 50);
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
        if (out)
            this.col(out.obj);
    }
}
class SMG extends GunBase {
    constructor() {
        super("mc.png", 250);
    }
    fire() {
        super.fire(1, -10, 11);
    }
}
class Revolver extends GunBase {
    constructor() {
        super("mc.png", 650);
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
        if (out)
            if (out.obj instanceof Building)
                out.obj.destroy();
    }
}
class SyringeGun extends WeapBase {
    constructor() {
        super("mc.png");
        this.cd = new Cooldown(260);
    }
    fire() {
        if (!this.cd.ready)
            return;
        this.cd.consume();
        scene.add(new BulletObject(Object.assign(Object.assign({}, bulletBounds), { scene, spd: 3, rot: this.pRot() + Angle.rad(random(-5, 6)), width: 15, height: 10, x: player.x, y: player.y, color: "#960d0d" })));
    }
}
class Medigun extends WeapBase {
    constructor() {
        super("mc.png");
    }
    fire() {
        const out = this.ray(this.pRot(), 100);
        if (out) { }
    }
}
class Melee extends WeapBase {
    constructor(img) {
        super(img);
    }
    fire() {
        const out = this.ray();
        if (out)
            this.col(out.obj);
    }
}
class Shovel extends Melee {
    constructor() { super("mc.png"); }
}
class Bat extends Melee {
    constructor() { super("mc.png"); }
}
class FireAxe extends Melee {
    constructor() { super("mc.png"); }
}
class Bottle extends Melee {
    constructor() { super("mc.png"); }
}
class Fists extends Melee {
    constructor() { super("mc.png"); }
}
class Kukri extends Melee {
    constructor() { super("mc.png"); }
}
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
        if (out)
            if (objIs(out.obj, Building)) {
                const h = out.obj.comp("health");
                if (out.obj.id) {
                    clearInterval(out.obj.id);
                    out.obj.id = undefined;
                }
                else if (h.mhp && h.hp < h.mhp) {
                    h.heal(5);
                }
                else {
                    out.obj.prog++;
                    if (out.obj.prog >= 4) {
                        scene.rm(out.obj);
                    }
                }
            }
    }
}
class Bonesaw extends Melee {
    constructor() { super("mc.png"); }
}
class Building extends Entity {
    constructor() {
        super(...arguments);
        this.lvl = 1;
        this.prog = 0;
    }
    init(hp) {
        this.use("health", { hp, mhp: hp });
    }
    destroy() {
        this.id = setInterval(() => this.comp("health").hurt(5), 1000);
    }
}
const pdaMenu = new MenuUI({ scene, w: scene.width / 2, h: scene.height / 2 });
const showPDAMenu = (b1, b2, b3, b4) => {
    if (scene.hasUI(pdaMenu))
        return;
    for (let i = 1; i < 5; i++)
        pdaMenu.bind(keyNum(i), [b1, b2, b3, b4][i - 1]);
    pdaMenu.bind("q", closePDAMenu);
    scene.addUI(pdaMenu);
};
const closePDAMenu = () => {
    if (!scene.hasUI(pdaMenu))
        return;
    for (let i = 1; i < 5; i++)
        pdaMenu.unbind(keyNum(i));
    pdaMenu.unbind("q");
    scene.rmUI(pdaMenu);
};
class PDA extends WeapBase {
    fire() { }
    onActivated() {
        this.menu();
    }
}
class ConstructionPDA extends PDA {
    constructor() {
        super("mc.png");
    }
    menu() {
        const _ = () => { };
        pdaMenu.child.stuff.length = 0;
        for (let i = 0; i < 4; i++)
            pdaMenu.addChild(new ImgUI({ scene, img: new Img("mc.png") }));
        showPDAMenu(_, _, _, _);
    }
}
class DestructionPDA extends PDA {
    constructor() {
        super("mc.png");
    }
    menu() {
        const _ = () => { };
        pdaMenu.child.stuff.length = 0;
        for (let i = 0; i < 4; i++)
            pdaMenu.addChild(new ImgUI({ scene, img: new Img("mc.png") }));
        showPDAMenu(_, _, _, _);
    }
}
const showDKMenu = () => {
    if (scene.hasUI(dkMenu))
        return;
    dkMenu.bind("q", closeDKMenu);
    scene.addUI(pdaMenu);
};
const closeDKMenu = () => {
    if (!scene.hasUI(dkMenu))
        return;
    dkMenu.unbind("q");
    scene.rmUI(pdaMenu);
};
class DisguiseKit extends WeapBase {
    constructor() {
        super("mc.png");
    }
    onActivated() {
        showDKMenu();
    }
    fire() { }
}
class Weap {
    render() {
        if (!merc)
            return;
        const o = this.origin();
        scene.img(merc.active.img, o.x, o.y, merc.active.w, 10);
    }
    origin() {
        const c = player.center();
        const f = c.x - (player.face == 0 ? 0 : merc === null || merc === void 0 ? void 0 : merc.active.w);
        return new Vector(f, c.y - 5);
    }
    shoot() {
        const cast = new Raycast({ origin: this.origin(), dist: 1000, angle: scene.rotToMouse(player), scene });
        const out = cast.cast();
        if (out && out.obj.uses("health")) {
            out.obj.comp("health").hurt(1);
        }
    }
}
const player = new PlayableCharacter({ strength: 0.4, width: 15, height: 40, color: "red", custom: { spd: 3, jh: 10, face: 0 }, x: 10 });
player.use("enhancedphys", { scene, fric: 0.88 });
const phys = player.comp("enhancedphys");
player.bind("w", () => { if (player.onGround)
    player.jump(player.jh); });
player.bind("a", () => { phys.addForceX(-1); player.face = 1; });
player.bind("d", () => { phys.addForceX(1); player.face = 0; });
player.bind("1", () => merc === null || merc === void 0 ? void 0 : merc.swap(merc.prim));
player.bind("2", () => merc === null || merc === void 0 ? void 0 : merc.swap(merc.sec));
player.bind("3", () => merc === null || merc === void 0 ? void 0 : merc.swap(merc.mel));
player.bind("4", () => { if (objIs(merc, Engi))
    merc.swap(merc.pda1);
else if (objIs(merc, Spy))
    merc.swap(merc.dk); });
player.bind("5", () => { if (objIs(merc, Engi))
    merc.swap(merc.pda2); });
var merc;
const weap = new Weap();
const menu = new MenuUI({ scene, w: scene.width, h: scene.height, color: "#707070" });
const select = (mcl) => {
    if (merc)
        player.child.rm(merc);
    merc = new mcl();
    player.child.add(merc);
    hideMenu();
};
const keyNum = (i) => String(i);
const showMenu = () => {
    if (scene.hasUI(menu))
        return;
    for (let i = 1; i < 10; i++)
        menu.bind(keyNum(i), () => select(mercList[i - 1]));
    scene.addUI(menu);
};
const hideMenu = () => {
    if (!scene.hasUI(menu))
        return;
    for (let i = 1; i < 10; i++)
        menu.unbind(keyNum(i));
    scene.rmUI(menu);
};
const mercList = [Scout, Soldier, Pyro, Demo, Heavy, Engi, Medic, Sniper, Spy];
const addMercImgsToMenu = (menu) => {
    for (let i = 0; i < mercList.length; i++) {
        const _ = (new (mercList[i])()).merc;
        menu.addChild(new ImgUI({ scene, x: i * 120, y: menu.height / 2, img: _, w: 50, h: 50 }));
    }
};
addMercImgsToMenu(menu);
const dkMenu = new MenuUI({ scene, w: scene.width / 2, h: scene.height / 2 });
addMercImgsToMenu(dkMenu);
scene.addUI(dkMenu);
// const enemy = new p2d.Character({ strength: 0.4, x: 20, color: "#1448f0", width: 15, height: 40 });
// enemy.use("health", { mhp: 5, hp: 5 });
// const test = new p2d.Entity({ width: 5, height: 5, color: "yellow", x: 100 });
// player.child.add(test);
scene.add(player);
let firing1 = false;
let firing2 = false;
scene.on("mousedown", (e) => {
    if (e.button == 0)
        firing1 = true;
    if (e.button == 2)
        firing2 = true;
});
scene.on("mouseup", (e) => {
    if (e.button == 0)
        firing1 = false;
    if (e.button == 2)
        firing2 = false;
});
scene.on("contextmenu", (e) => e.preventDefault());
const gbKeys = new KeyInputs();
showMenu();
gbKeys.bind("dot", () => showMenu());
scene.start(() => {
    weap.render();
    gbKeys.update();
    if (firing1)
        merc === null || merc === void 0 ? void 0 : merc.fire();
    if (firing2)
        merc === null || merc === void 0 ? void 0 : merc.alt();
});
