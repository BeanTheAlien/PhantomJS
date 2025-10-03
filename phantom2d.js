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
  rem(...comps) {
    for(let i = this.#components.length - 1; i >= 0; i--) {
      if(comps.includes(this.#components[i])) {
        this.#components.splice(i, 1);
      }
    }
  }
  // ctx functions
  rect(x, y, width, height, colour) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(x, y, width, height);
  }
  render() {
    for(const sceneobject of this.#components) {
      if(!(sceneobject instanceof SceneObject)) throw new Error("Cannot render non scene object.");
    }
    this.#components.forEach(component => {
      this.rect(component.pos.x, component.pos.y, component.width, component.height, component.color);
    });
  }
  getById(id) {
    return this.#components.find(component => component.name == id);
  }
}
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
class MovingObject extends SceneObject {
  constructor(settings) {
    super(["speed", "dirX", "dirY", "extentLeft", "extentRight", "extentDown", "extentUp"], "moving", settings);
    this.speed = settings.speed;
    // 0 represents LEFT, 1 represents RIGHT
    this.directionX = settings.dirX;
    // 0 represents DOWN, 1 represents UP
    this.directionY = settings.dirY;
    // isBouncing defines whether:
    // 1. when an extent is reached, should stop
    // 2. when an extent is reached, move in the opposite direction
    this.isBouncing = settings.isBouncing ?? true;
    // extentLeft shows the furthest x position it can be in the left direction
    this.extentLeft = settings.extentLeft;
    // extentRight shows the furthest x position it can be in the right direction
    this.extentRight = settings.extentRight;
    // extentDown shows the furthest y position it can be in the down direction
    this.extentDown = settings.extentDown;
    // extentUp shows the furthest y position it can be in the up direction
    this.extentUp = settings.extentUp;
  }
  update() {
    if(this.extentLeft != null && this.extentRight != null) {
      if(this.extentLeft >= this.x && this.isBouncing && this.directionX == 0) {
        this.x += this.speed;
        this.directionX = 1;
      } else if(this.extentRight <= this.x && this.isBouncing && this.directionX == 1) {
        this.x -= this.speed;
        this.directionX = 0;
      } else if(this.extentLeft < this.x && !this.isBouncing && this.directionX == 0) {
        this.x -= this.speed;
      } else if(this.extentRight > this.x && !this.isBouncing && this.directionX == 1) {
        this.x += this.speed;
      }
    }
    if(this.extentDown != null && this.extentUp != null) {
      if(this.extentDown >= this.y && this.isBouncing && this.directionY == 0) {
        this.y += this.speed;
        this.directionY = 1;
      } else if(this.extentDown <= this.y && this.isBouncing && this.directionY == 1) {
        this.y -= this.speed;
        this.directionY = 0;
      } else if(this.extentUp < this.y && !this.isBouncing && this.directionY == 0) {
        this.y -= this.speed;
      } else if(this.extentUp > this.y && !this.isBouncing && this.directionY == 1) {
        this.y += this.speed;
      }
    }
  }
}
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export { Scene, StaticObject, PhysicsObject, MovingObject, Vector };