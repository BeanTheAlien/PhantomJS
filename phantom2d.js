import { expect } from "/phantom.js";

/* Phantom2D v0.0.0 */
class Scene {
  #components;
  constructor(canvas, width, height) {
    if(!(canvas instanceof HTMLCanvasElement)) throw new Error("Please provide a valid canvas.");
    this.canvas = canvas;
    this.canvas.style.width = width;
    this.canvas.style.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.#components = [];
  }
  add(...comps) {
    this.#components.push(...comps);
  }
  render() {}
}
class SceneObject {
  constructor(expects, objname, settings) {
    if(!expect(settings, ["name", "shape", "collide", ...expects])) throw new Error("Missing key(s) in " + objname + " object settings.");
    this.name = settings.name;
    this.shape = settings.shape;
    this.collide = settings.collide ?? (() => {});
    this.pos = { x: settings.px ?? 0, y: settings.py ?? 0 };
    this.rot = { x: settings.rx ?? 0, y: settings.ry ?? 0 };
    this.width = settings.width ?? 0;
    this.height = settings.height ?? 0;
  }
}
class StaticObject extends SceneObject {
  constructor(settings) {
    super([], "static", settings);
  }
  update() {}
}
class PhysicsObject extends SceneObject {
  constructor(settings) {
    super(["strength"], "physics", settings);
    this.strength = settings.strength;
    this.gravspd = 0;
  }
  update() {
    this.gravspd += this.strength;
    this.pos.y += this.gravspd;
  }
}
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}