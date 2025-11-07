import * as phantom from "./../phantom2d.js";

window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.linno}`));

const canvas = document.getElementById("zelda");

class Enemy extends phantom.NonPlayableCharacter {
    constructor(s) {
        s.shape = "rect";
        s.strength = 0;
        s.color = "rgba(0, 0, 0, 0)";
        s.states = {};
        s.custom = {};
        s.custom.sprite = s.sprite;
        s.custom.spd = s.spd;
        super(s);
        this.sprite = scene.loadImg(this.sprite);
        phantom.GameTools.useHealth(this, s.hp, s.hp, s.dead ?? (() => scene.remove(this)), s.hurt ?? (() => {}));
        scene.add(this);
    }
    update() {
        scene.img(this.x, this.y, this.width, this.height, this.sprite);
    }
}
class Weap {
    constructor({ dmg, w, h, cd, expr, ent, colour }) {
        this.dmg = dmg;
        this.w = w;
        this.h = h;
        this.cd = cd;
        this.expr = expr;
        this.ent = ent;
        this.colour = colour;
        this.ready = true;
    }
    fire() {
        if(!this.ready) return;
        this.ready = false;
        const wp = new this.ent({
            id: "", shape: "rect", color: this.colour,
            collide: (col) => wpCol(this, this.dmg, col),
            x: player.getPosX(), y: player.getPosY(),
            rot: player.rot, width: this.w, height: this.h
        });
        scene.add(wp);
        wp.expire(scene, this.expr);
        setTimeout(() => this.ready = true, this.cd);
    }
}

const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");
const c = new phantom.StaticObject({
    id: "1", shape: "rect", color: "#00f7ffff", x: 5, y: 5, width: 30, height: 40
});
scene.add(c);
const player = new phantom.PlayableCharacter({
    id: "player",
    shape: "rect",
    strength: 0,
    color: "#009414ff",
    width: 5,
    height: 10,
    x: 20,
    y: 30,
    custom: {
        spd: 1,
        cur: Sword
    },
    binds: {
        "w": () => player.moveY(-player.spd),
        "a": () => player.moveX(-player.spd),
        "s": () => player.moveY(player.spd),
        "d": () => player.moveX(player.spd)
    }
});
scene.add(player);
phantom.GameTools.useHealth(player, 5, 5, () => {
    alert("You Died");
});
phantom.GameTools.useInv(player);
player.invSet("sword", Sword);

const BigBad = new Enemy({
    id: "bigbad", spd: 1, width: 10, height: 10,
    sprite: "../missing_content.png", hp: 5, x: 30, y: 30
});

function wpCol(self, dmg, col) {
    if(!col.hp) return;
    col.hurt(dmg);
    scene.remove(self);
}

const Sword = new Weap({ dmg: 1, w: 5, h: 20, cd: 150, expr: 150, ent: phantom.StaticObject, colour: "#585858ff" });

function attack() {
    if(player.cur) player.cur.fire();
}
scene.addEvent("click", attack);

function render() {
    scene.update();
    player.clampPosX(0, scene.width());
    player.clampPosY(0, scene.height());
    scene.clear();
    scene.render();
    requestAnimationFrame(render);
}
render();
