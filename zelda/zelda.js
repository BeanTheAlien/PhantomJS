import * as phantom from "./../phantom2d.js";

const canvas = document.getElementById("zelda");

class Enemy extends phantom.NonPlayableCharacter {
    constructor(s) {
        s.shape = "rect";
        s.strength = 0;
        s.states = {};
        s.custom.sprite = s.sprite;
        s.custom.spd = s.spd;
        super(s);
        scene.loadImg(this.sprite);
        phantom.GameTools.useHealth(this, s.hp, s.hp, s.dead ?? () => scene.remove(this), s.hurt ?? (() => {}));
        scene.add(this);
    }
    update() {}
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

const BigBad = new Enemy({
    id: "bigbad", color: "rgba(195, 30, 8, 1)", spd: 1, width: 10, height: 10, sprite: "missing_content.png", hp: 5
});

function Sword() {
    const slash = new phantom.StaticObject({
        id: "slash", shape: "rect", color: "#555555ff", x: player.getPosX(), y: player.getPosY(), rot: player.rot, width: 5, height: 20, collide: (col) => {}
    });
    scene.add(slash);
    setTimeout(() => scene.remove(slash), 150);
}

function attack() {
    if(player.cur) player.cur();
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
