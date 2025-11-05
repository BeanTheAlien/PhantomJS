import * as phantom from "./phantom2d.js";

window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

const canvas = document.getElementById("phantom-2d-canvas");

const scene = new phantom.Scene(canvas, 500, 500);
// scene.rect(1, 1, 20, 20, "blue");
// StaticObject is a static shape (it doesn't do anything, has collision)
const staticObject = new phantom.StaticObject({
    id: "myso",
    shape: "rect",
    x: 10, y: 10,
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
// PlayableCharacter (with gravity)
const playerWithGravity = new phantom.PlayableCharacter({
    id: "player1",
    width: 5,
    height: 10,
    strength: 3,
    color: "blue",
    shape: "rect",
    collide: null
});
// PlayableCharacter (without gravity)
const playerWithoutGravity = new phantom.PlayableCharacter({
    id: "player2",
    width: 5,
    height: 10,
    strength: 0, // or leave out
    color: "blue",
    shape: "rect",
    collide: null
});
// PlayableCharacter (with preset binds)
const playerWithBinds = new phantom.PlayableCharacter({
    id: "player3",
    width: 5,
    height: 10,
    strength: 0.01,
    binds: {
        "w": () => {
            if(phantom.isColliding(playerWithBinds, floor)) playerWithBinds.jump(1);
        },
        "a": () => playerWithBinds.moveX(-playerWithBinds.speed),
        "d": () => playerWithBinds.moveX(playerWithBinds.speed)
    },
    color: "blue",
    shape: "rect",
    collide: null,
    custom: {
        speed: 0.5
    }
});

// you can change with setBind, get with getBind
// const playerWithBindsWBind = playerWithBinds.getBind("w"); // returns the bind for "w" (player moveY -3)
// playerWithBinds.setBind("w", () => playerWithBinds.moveY(3)); // sets bind to "w" => player moveY 3
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
    targetByType: [phantom.PlayableCharacter]
});
// NonPlayableCharacter
const nonPlayableCharacter = new phantom.NonPlayableCharacter({
    id: "mynpc",
    states: {
        "idle": () => {
            if(phantom.random() <= 50) nonPlayableCharacter.moveX(phantom.random(-1, 2));
            else nonPlayableCharacter.moveY(phantom.random(-1, 2));
        }
    },
    color: "orange",
    width: 5,
    height: 7,
    shape: "rect",
    collide: null
});
// sets our NPC to wander around
// const interval = setInterval(() => nonPlayableCharacter.applyState("idle"), 1000);
// scene.add(nonPlayableCharacter);
// sample event addition to scene
function generateBullet() {
    const { x, y } = playerWithBinds.getCenter();
    const rot = scene.getRotToMouse({ x, y });
    const bullet = new phantom.BulletObject({
        scene,
        id: "bullet",
        shape: "rect",
        collide: null,
        color: "yellow",
        clampLeft: 0,
        clampRight: scene.width(),
        clampUp: -Infinity,
        clampDown: Infinity,
        speed: 1,
        dir: rot,
        rot,
        width: 5,
        height: 3,
        x, y
    });
    scene.add(bullet);
}
scene.addEvent("click", generateBullet);

// scene.loadImg("./missing_content.png");

// scene.focus(playerWithBinds);

const floor = new phantom.WallObject({
    id: "floor", shape: "rect", color: "#000f67ff",
    x: 0, y: 300, width: canvas.width, height: 100
});
scene.add(floor);

const bulletsummoner = new phantom.Spawner({
    id: "stupidspawner", shape: "rect", color: "#d40d0dff",
    spawns: phantom.BulletObject, spawnargs: {
        dir: 1,
        id: "b", shape: "rect", color: "#f3ba00ff",
        clampLeft: 0, clampRight: canvas.width, clampUp: 0, clampDown: canvas.height,
        speed: 2, x: 50, y: 50, width: 20, height: 10,
        scene
    },
    cd: 3000,
    scene,
    x: 50, y: 50,
    width: 5,
    height: 5
});
bulletsummoner.start();
scene.add(bulletsummoner);

const npc = new phantom.NonPlayableCharacter({
    id: "a", shape: "rect", color: "#fe0d0dff", states: {},
    strength: 0.01, width: 10, height: 20,
    x: 50
});
scene.add(npc);

const homer = new phantom.HomingBulletObject({
    id: "homer", shape: "rect", color: "#d9ff00ff",
    clampLeft: 0, clampRight: canvas.width, clampUp: 0, clampDown: canvas.height,
    speed: 1, dir: 1, scene, target: playerWithBinds, x: 100, y: 10,
    width: 20, height: 10,
    focus: [playerWithBinds]
});
scene.add(homer);

// render loop
// scene.update updates each component's logic
// scene.clear clears the canvas (removes artifacts)
// scene.render draws everything
function render() {
    scene.clear();
    scene.update();
    playerWithBinds.clampPosX(0, canvas.width);
    // playerWithBinds.clampPosY(0, 300);
    // playerWithBinds.debugRay({ angle: scene.getRotToMouse(playerWithBinds), dist: 200, color: "red", scene });
    // filled bg
    // scene.fillBg("rgb(0, 0, 0)");
    // img bg
    // scene.imgBg("./missing_content.png");
    scene.render();
    requestAnimationFrame(render);
}
render();