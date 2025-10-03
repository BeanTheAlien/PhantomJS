import * as phantom from "./phantom2d.js";

const canvas = document.getElementById("phantom-2d-canvas");

const scene = new phantom.Scene(canvas, "100vw", "100vh");
scene.rect(0, 0, 50, 50, "green");
// example with some StaticObjects
const statics = [
    new phantom.StaticObject({ id: "myso1", shape: "rect", px: 10, py: 10, width: 30, height: 50, collide: null, color: "blue" }),
    new phantom.StaticObject({ id: "myso2", shape: "rect", px: 30, py: 30, width: 40, height: 5, collide: null, color: "red" }),
    new phantom.StaticObject({ id: "myso3", shape: "rect", px: 70, py: 70, width: 80, height: 60, collide: null, color: "green" })
];
scene.add(...statics);
// note that MovingObject is experimental and I haven't done testing on it yet
// Use with caution
const mymo = new phantom.MovingObject({
    id: "mymo",
    shape: "rect",
    dirX: 1, dirY: 0,
    extentLeft: 10, extentRight: 50,
    extentDown: null, extentUp: null,
    isBouncing: true,
    speed: 1
});
scene.add(mymo);
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
        "w": playerWithBinds.moveY(-3),
        "a": playerWithBinds.moveX(-3),
        "s": playerWithBinds.moveY(3),
        "d": playerWithBinds.moveX(3)
    },
    color: "blue"
});
// you can change with setBind, get with getBind
const playerWithBindsWBind = playerWithBinds.getBind("w"); // returns the bind for "w" (player moveY -3)
playerWithBinds.setBind("w", playerWithBinds.moveY(3)); // sets bind to "w" => player moveY 3
scene.add(playerWithGravity, playerWithoutGravity, playerWithBinds);
// BouncyObject (without ignore)
const bouncyObjectWithoutIgnore = new phantom.BouncyObject({
    id: "mybo1",
    wwidth: 10,
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