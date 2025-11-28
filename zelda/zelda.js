import * as phantom from "./../phantom2d.js";

// window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.linno}`));

const titleScreen = document.createElement("div");
document.body.appendChild(titleScreen);
titleScreen.className = "titlescreen";
const title = document.createElement("h1");
title.textContent = "The Legend of Seth";
titleScreen.appendChild(title);
const start = document.createElement("button");
start.textContent = "Start";
titleScreen.appendChild(start);
start.addEventListener("click", init);
// const cont = document.createElement("button");
// cont.textContent = "Continue";
// if(Object.hasOwn(localStorage, "saved_game")) {
//     titleScreen.appendChild(cont);
//     cont.addEventListener("click", initLoad);
// } else console.log(localStorage);

const canvas = document.getElementById("zelda");

class Enemy extends phantom.NonPlayableCharacter {
    constructor(s) {
        s.shape = "rect";
        s.strength = 0;
        // tempfix
        //s.color = "rgba(0, 0, 0, 0)";
        s.states = {};
        s.custom = { sprite: s.sprite, spd: s.spd, tags: ["enemy", ...s.tags ?? []], atk: s.atk };
        s.collide = (c) => {
            if(c != player) return;
            player.hurt(1);
        }
        super(s);
        //scene.loadImg(this.sprite);
        phantom.GameTools.useHealth(this, s.hp, s.hp, s.dead ?? (() => scene.remove(this)), s.hurt ?? (() => {}));        
    }
    update() {
        super.update();
        //scene.img(this.x, this.y, this.width, this.height, this.sprite);
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
        // this.entName = entName;
    }
    fire() {
        if(!this.ready) return;
        this.ready = false;
        const angle = { 1: -Math.PI/2, 2: 0, 3: Math.PI/2, 4: Math.PI }[player.dir];
        const ofsDist = 6; // how far from player center the sword originates
        const wp = new phantom.StaticObject({
            id: "", shape: "rect", color: this.colour,
            collide: (col) => wpCol(this, this.dmg, col),
            // put sword center on player center + directional offset
            x: player.getPosX() + player.width/2 + Math.cos(angle) * ofsDist - (this.w/2),
            y: player.getPosY() + player.height/2 + Math.sin(angle) * ofsDist - (this.h/2),
            rot: angle,
            width: this.w,
            height: this.h
        });
        scene.add(wp);
        wp.expire(scene, this.expr);
        setTimeout(() => this.ready = true, this.cd);
    }
}

const ents = {
    "StaticObject": phantom.StaticObject
};
const Sword = new Weap({ dmg: 1, w: 5, h: 20, cd: 150, expr: 150, ent: phantom.StaticObject, colour: "#585858ff" });
// , entName: "StaticObject"

const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");
const player = new phantom.PlayableCharacter({
    id: "player",
    shape: "rect",
    strength: 0,
    color: "#009414ff",
    width: 5,
    height: 5,
    x: 20,
    y: 30,
    custom: {
        spd: 1,
        cur: Sword,
        dir: -1
    },
    binds: {
        "w": () => {
            player.moveY(-player.spd);
            player.dir = 1;
        },
        "a": () => {
            player.moveX(-player.spd);
            player.dir = 4;
        },
        "s": () => {
            player.moveY(player.spd);
            player.dir = 3;
        },
        "d": () => {
            player.moveX(player.spd);
            player.dir = 2;
        }
    }
});
phantom.GameTools.useHealth(player, 5, 5, () => {
    cancelAnimationFrame(rend);
    alert("You Died");
    scene.remove(player);
}, () => {
    player.color = "#df0e0eff";
    setTimeout(() => player.color = "#009414ff", 30);
});
phantom.GameTools.useInv(player);
player.invSet("sword", Sword);

const BigBad = new Enemy({
    id: "bigbad", spd: 1, width: 10, height: 10,
    sprite: "../missing_content.png", hp: 5, x: 30, y: 30,
    color: "#ff0000ff", atk: () => {}
});

function wpCol(self, dmg, col) {
    if(!col?.hp) return;
    if(col == player) return;
    col.hurt(dmg);
    scene.remove(self);
}

function attack() {
    if(player.cur) player.cur.fire();
}

function initCore() {
    document.body.removeChild(titleScreen);
    scene.add(player);
    scene.addEvent("click", attack);
}
function init() {
    initCore();
    scene.add(BigBad);
    render();
    // autosave();
}
function initLoad() {
    initCore();
    const save = localStorage.getItem("saved_game");
    if(!save) throw new Error("Cannot find saved game.");
    const { x, y, cur, hp, maxhp, inv, enemies } = JSON.parse(save);
    console.log(`x: ${x}\ny: ${y}\ncur: ${JSON.stringify(cur)}\nhp: ${hp}\nmaxhp: ${maxhp}\ninv: ${JSON.stringify(inv)}\nenemies: ${JSON.stringify(enemies)}`);
    player.setPos(parseFloat(x), parseFloat(y));
    console.log(cur.entName);
    const wp = new Weap({ dmg: cur.dmg, w: cur.w, h: cur.h, cd: cur.cd, expr: cur.expr, entName: cur.entName, ent: null });
    wp.ent = ents[cur.entName];
    player.cur = wp;
    console.log(player.cur);
    player.hp = hp;
    player.maxHP = maxhp;
    player.inv = inv;
    for(const e of enemies) scene.add(new Enemy(e));
    autosave();
}
function autosave() {
    setInterval(() => {
        localStorage.setItem("saved_game", JSON.stringify({
            "x": player.getPosX(),
            "y": player.getPosY(),
            "cur": player.cur,
            "hp": player.hp,
            "maxhp": player.maxHP,
            "inv": player.inv,
            "enemies": scene.filter(c => c.tags?.includes("enemy"))
        }));
    }, 60000);
}

var rend;

function render() {
    scene.update();
    player.clampPosX(0, scene.width);
    player.clampPosY(0, scene.height);
    scene.clear();
    scene.render();
    rend = requestAnimationFrame(render);
}
