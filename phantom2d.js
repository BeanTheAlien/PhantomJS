import { expect, findMissing, random } from "/phantom.js";

/* Phantom2D v0.0.1 */
class SceneObject {
  constructor(expects, objname, settings) {
    if(!expect(settings, ["id", "shape", "collide", "color", ...expects])) throw new Error(`Missing key(s) in ${objname} object settings. (missing keys: ${findMissing(settings, ["id", "shape", "collide", "color", ...expects]).join(", ")})`);
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
      if(this.extentLeft >= this.pos.x && this.isBouncing && this.directionX == 0) {
        this.pos.x += this.speed;
        this.directionX = 1;
      } else if(this.extentRight <= this.pos.x && this.isBouncing && this.directionX == 1) {
        this.pos.x -= this.speed;
        this.directionX = 0;
      } else if(this.extentLeft < this.pos.x && !this.isBouncing && this.directionX == 0) {
        this.pos.x -= this.speed;
      } else if(this.extentRight > this.pos.x && !this.isBouncing && this.directionX == 1) {
        this.pos.x += this.speed;
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
class BouncyObject extends SceneObject {
  // TODO:
  // Add passthrough/stop logic with ignore/target returns
  // Allow for existing colliding setting, mix with required colliding setting
  constructor(settings) {
    settings.collide = (col) => {
      // Exits prematurely if colliding object should be ignored
      if(this.ignore.includes(col) || this.ignoreByType.some(type => col instanceof type)) return;
      // Checks for match within targeted entities and types
      const matchesTarget = this.target.includes(col);
      const matchesTargetByType = this.targetByType.some(type => col instanceof type);
      if((this.target.length > 0 || this.targetByType.length > 0) && !(matchesTarget || matchesTargetByType)) return;
      col.velocity.x *= -(this.strength);
      col.velocity.y *= -(this.strength);
    };
    super(["strength"], "bouncy", settings);
    this.strength = settings.strength;
    this.ignore = settings.ignore ?? [];
    this.ignoreByType = settings.ignoreByType ?? [];
    this.target = settings.target ?? [];
    this.targetByType = settings.targetByType ?? [];
  }
}
class BulletObject extends SceneObject {
  constructor(settings) {
    super(["clampLeft", "clampRight", "clampUp", "clampDown", "speed", "dir", "scene"], "bullet", settings);
    this.clampLeft = settings.clampLeft;
    this.clampRight = settings.clampRight;
    this.clampUp = settings.clampUp;
    this.clampDown = settings.clampDown;
    this.speed = settings.speed;
    // 0 is NORTH, 1 is EAST, 2 is SOUTH, 3 is WEST
    this.dir = settings.dir;
    this.onDestroyed = settings.onDestroyed ?? (() => {});
    // Needs a reference to the scene to be able to self-destruct
    this.scene = settings.scene;
  }
  update() {
    switch(this.dir) {
      case 0: this.pos.y -= this.speed; break;
      case 1: this.pos.x += this.speed; break;
      case 2: this.pos.y += this.speed; break;
      case 3: this.pos.x -= this.speed; break;
    }
    if(this.pos.x + this.width < this.clampLeft || this.pos.x + this.width > this.clampRight || this.pos.y + this.height < this.clampUp || this.pos.y + this.height > this.clampDown) {
      this.scene.remove(this);
    }
  }
}
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Character {
  constructor(expects, objname, settings) {
    if(!expect(settings, ["id", "shape", "collide", "color", ...expects])) throw new Error(`Missing key(s) in ${objname} object settings. (missing keys: ${findMissing(settings, ["id", "shape", "collide", "color", ...expects]).join(", ")})`);
    this.id = settings.id;
    this.shape = settings.shape;
    this.collide = settings.collide ?? (() => {});
    this.color = settings.color;
    this.pos = { x: settings.px ?? 0, y: settings.py ?? 0 };
    this.rot = { x: settings.rx ?? 0, y: settings.ry ?? 0 };
    this.width = settings.width ?? 0;
    this.height = settings.height ?? 0;
    this.gravspd = 0;
    this.strength = settings.strength ?? 0;
    if(settings.customProperties) {
      for(const { key, value } of Object.entries(settings.customProperties)) {
        this[key] = value;
      }
    }
  }
  move(distance, axis) {
    if(axis == "x" || axis == 0) {
      this.pos.x += distance;
    }
    else if(axis == "y" || axis == 1) {
      this.pos.y += distance;
    }
  }
  moveX(distance) {
    this.pos.x += distance;
  }
  moveY(distance) {
    this.pos.y += distance;
  }
  setPos(x, y) {
    this.pos = { x, y };
  }
}
class PlayableCharacter extends Character {
  #binds;
  #keys;
  constructor(settings) {
    super(["width", "height"], "playable character", settings);
    this.#binds = settings.binds ?? {};
    this.#keys = {};
    window.addEventListener("keydown", (event) => this.#keys[event.key] = true);
    window.addEventListener("keyup", (event) => this.#keys[event.key] = false);
  }
  getBind(key) {
    return this.#binds[key];
  }
  setBind(key, action) {
    this.#binds[key] = action;
  }
  update() {
    this.gravspd += this.strength;
    this.pos.y += this.gravspd;
    for(const [name, action] of Object.entries(this.#binds)) {
      if(this.#keys[name]) action();
    }
  }
}
class NonPlayableCharacter extends Character {
  #states;
  constructor(settings) {
    super(["states"], "non-playable character", settings);
    this.#states = settings.states;
    this.interval = null;
  }
  getState(name) {
    return this.#states[name];
  }
  setState(name, action) {
    this.#states[name] = action;
  }
  applyState(name) {
    this.#states[name]();
  }
  useInterval(name, delay) {
    this.interval = setInterval(this.#states[name], delay);
  }
  update() {
    this.gravspd += this.strength;
    this.pos.y += this.gravspd;
  }
}
class NavigationMesh {
  constructor(settings) {
    if(!expect(settings, ["id", "x", "y", "width", "height"])) throw new Error(`Missing key(s) in navigation mesh settings. (missing keys: ${findMissing(settings, []).join(", ")}`);
    this.id = settings.id;
    this.pos = { x: settings.x, y: settings.y };
    this.width = settings.width;
    this.height = settings.height;
    this.color = "rgba(0, 0, 0, 0)";
  }
}
class Scene {
  #components;
  #validTypes;
  constructor(canvas, width, height, cssWidth = "100vw", cssHeight = "100vh") {
    if(!(canvas instanceof HTMLCanvasElement)) throw new Error("Please provide a valid canvas.");
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = cssWidth;
    this.canvas.style.height = cssHeight;
    this.ctx = this.canvas.getContext("2d");
    this.#components = [];
    this.#validTypes = [
      Scene, SceneObject, StaticObject,
      PhysicsObject, MovingObject, BouncyObject, BulletObject,
      Vector, PlayableCharacter, NonPlayableCharacter
    ];
  }
  add(...comps) {
    for(const comp of comps) {
      if(!this.#validTypes.some(type => comp instanceof type)) throw new Error("Cannot add invalid type object.");
    }
    this.#components.push(...comps);
  }
  remove(...comps) {
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
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  render() {
    for(const comp of this.#components) {
      if(!this.#validTypes.some(type => comp instanceof type)) throw new Error("Cannot render invalid type object.");
    }
    this.#components.forEach(component => {
      this.ctx.fillStyle = component.color;
      this.ctx.fillRect(component.pos.x, component.pos.y, component.width, component.height);
    });
  }
  getById(id) {
    return this.#components.find(component => component.id == id);
  }
  getByAttr(attr, value) {
    return this.#components.find(component => component[attr] == value);
  }
}
function isColliding(object1, object2) {
  const obj1W = object1.width;
  const obj1H = object1.height;
  const obj1X = object1.pos.x;
  const obj1Y = object1.pos.y;
  const obj2W = object2.width;
  const obj2H = object2.height;
  const obj2X = object2.pos.x;
  const obj2Y = object2.pos.y;
  return obj2X < obj1X + obj1W && obj2X + obj2W > obj1X && obj2Y < obj1Y + obj1H && obj2Y + obj2H > obj1Y;
}

export { Scene, SceneObject, StaticObject, PhysicsObject, MovingObject, BouncyObject, BulletObject, Vector, PlayableCharacter, NonPlayableCharacter, random, isColliding };
