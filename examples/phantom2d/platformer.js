import * as phantom from "./../../phantom2d.js";

const canvas = document.getElementById("phantom-canvas");

const scene = new phantom.Scene(canvas, "100vw", "100vh");

const level = [
    new phantom.StaticObject({id: "1", shape: "rect", collide: () => {}, color: "blue"})
];
scene.add(...level);

const player = new phantom.ControllableCharacter({
    id: "player",
    x: 1, y: 1,
    width: 3,
    height: 10,
    color: "green",
    strength: 0.7,
    binds: {}
});
/*
    class SceneObject {
      constructor(expects, objname, settings) {
        if(!expect(settings, ["id", "shape", "collide", "color", ...expects])) throw new Error("Missing key(s) in " + objname + " object settings.");
        this.id = settings.id;
        this.shape = settings.shape;
        this.collide = settings.collide ?? (() => {});
        this.color = settings.color;
        this.pos = { x: settings.px ?? 0, y: settings.py ?? 0 };
        this.rot = { x: settings.rx ?? 0, y: settings.ry ?? 0 };
        this.width = settings.width ?? 0;
        this.height = settings.height ?? 0;
      }
    }
 */

scene.render();