import * as phantom from "./phantom2d.js";

const canvas = document.getElementById("phantom-2d-canvas");

const scene = new phantom.Scene(canvas, 500, 500);
scene.rect(1, 1, 20, 20, "blue");
// StaticObject is a static shape (it doesn't do anything, has collision)
const staticObject = new phantom.StaticObject({
    id: "myso",
    shape: "rect",
    px: 10, py: 10,
    width: 30, height: 10,
    collide: null,
    color: "blue"
});
scene.add(staticObject);
// note that MovingObject is experimental and I haven't done testing on it yet
// Use with caution
const movingObject = new phantom.MovingObject({
    id: "mymo",
    shape: "rect",
    dirX: 1, dirY: 0,
    extentLeft: 10, extentRight: 50,
    extentDown: null, extentUp: null,
    isBouncing: true,
    speed: 1,
    collide: null,
    color: "red"
});
// ControllableCharacter (with gravity)
const playerWithGravity = new phantom.ControllableCharacter({
    id: "player1",
    width: 5,
    height: 10,
    strength: 3,
    color: "blue"
});
// ControllableCharacter (without gravity)
const playerWithoutGravity = new phantom.ControllableCharacter({
    id: "player2",
    width: 5,
    height: 10,
    strength: 0, // or leave out
    color: "blue"
});
// ControllableCharacter (with preset binds)
const playerWithBinds = new phantom.ControllableCharacter({
    id: "player3",
    width: 5,
    height: 10,
    strength: 3,
    binds: {
        "w": () => playerWithBinds.moveY(-3),
        "a": () => playerWithBinds.moveX(-3),
        "s": () => playerWithBinds.moveY(3),
        "d": () => playerWithBinds.moveX(3)
    },
    color: "blue"
});

// you can change with setBind, get with getBind
const playerWithBindsWBind = playerWithBinds.getBind("w"); // returns the bind for "w" (player moveY -3)
playerWithBinds.setBind("w", () => playerWithBinds.moveY(3)); // sets bind to "w" => player moveY 3
// scene.add(playerWithGravity, playerWithoutGravity, playerWithBinds);
scene.add(playerWithBinds);
// BouncyObject (without ignore)
const bouncyObjectWithoutIgnore = new phantom.BouncyObject({
    id: "mybo1",
    width: 10,
    height: 3,
    strength: 3,
    shape: "rect",
    color: "green"
});
// BouncyObject (with ignore)
const bouncyObjectWithIgnore = new phantom.BouncyObject({
    id: "mybo2",
    width: 10,
    height: 3,
    strength: 3,
    shape: "rect",
    color: "green",
    ignore: [playerWithGravity, playerWithoutGravity, playerWithBinds] // everything else is still bouncy! (ignores players we generated earlier)
});
// BouncyObject (with ignore by type)
const bouncyObjectWithIgnoreByType = new phantom.BouncyObject({
    id: "mybo3",
    width: 10,
    height: 3,
    strength: 3,
    shape: "rect",
    color: "green",
    ignoreByType: [phantom.SceneObject]
});
// If any SceneObject instances hit this, they won't bounce (will implement passthrough/stop logic in later patch)
// BouncyObject (with target)
const bouncyTargetWithTarget = new phantom.BouncyObject({
    id: "mybo4",
    width: 10,
    height: 3,
    strength: 3,
    shape: "rect",
    color: "green",
    target: [playerWithGravity, playerWithoutGravity, playerWithBinds] // only our players will bounce
});
// BouncyObject (with target by type)
const bouncyObjectWithTargetByType = new phantom.BouncyObject({
    id: "mybo5",
    width: 10,
    height: 3,
    strength: 3,
    shape: "rect",
    color: "green",
    targetByType: [phantom.ControllableCharacter]
});
// NonPlayableCharacter
const nonPlayableCharacter = new phantom.NonPlayableCharacter({
    id: "mynpc",
    states: {
        "idle": (() => {
            if(phantom.random() <= 50) nonPlayableCharacter.moveX(phantom.random(-1, 2));
            else nonPlayableCharacter.moveY(phantom.random(-1, 2));
        })
    },
    color: "orange",
    width: 5,
    height: 7
});
// sets our NPC to wander around
const interval = setInterval(() => nonPlayableCharacter.applyState("idle"), 1000);
/*
constructor(settings) {
    if(!expect(settings, ["id", "states", "color"])) throw new Error("Missing key(s) in non-playable character.");
    this.id = settings.id;
    this.pos = { x: settings.x ?? 0, y: settings.y ?? 0 };
    this.width = settings.width ?? 0;
    this.height = settings.height ?? 0;
    this.color = settings.color;
    this.gravspd = 0;
    this.strength = settings.strength ?? 0;
    this.#states = settings.states;
  }
  getState(name) {
    return this.#states[name];
  }
  setState(name, check, action) {
    this.#states[name] = { check, action };
  }
  applyState(name) {
    this.#states[name]();
  }
  update() {
    this.gravspd += this.strength;
    this.pos.y += this.gravspd;
  }
*/