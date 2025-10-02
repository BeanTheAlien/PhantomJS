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
class PhysicsObject {
  constructor(settings) {
    if(!expect(settings, ["name", "shape", "strength", "collide"])) throw new Error("Missing key(s) in physics object settings.");
    this.name = settings.name;
    this.shape = settings.shape;
    this.strength = settings.strength;
    this.gravspd = 0;
    this.collide = settings.collide ?? () => {};
    this.pos = { x: settings.px ?? 0, y: settings.py ?? 0, z: settings.pz ?? 0 };
    this.rot = { x: settings.rx ?? 0, y: settings.ry ?? 0, z: settings.rz ?? 0 };
    this.width = settings.width ?? 0;
    this.height = settings.height ?? 0;
  }
}
