import { expect, findMissing, random, is } from "/phantom.js";

// Phantom2D v0.0.6
class Phantom2DEntity {
  constructor(expects, objname, settings) {
    // id, shape and color are all base properties
    const base = ["id", "shape", "color"];
    if(!expect(settings, [...base, ...expects])) throw new Error(`Missing keys(s) in ${objname} settings. (missing: ${findMissing(settings, [...base, ...expects]).join(", ")})`);
    this.id = settings.id;
    this.shape = settings.shape;
    this.color = settings.color;
    this.collide = settings.collide ?? (() => {});
    this.x = settings.x ?? 0;
    this.y = settings.y ?? 0;
    this.rot = settings.rot ?? 0;
    this.width = settings.width ?? 0;
    this.height = settings.height ?? 0;
    if(settings.customProperties) {
      for(const [key, value] of Object.entries(settings.customProperties)) {
        this[key] = value;
      }
    }
  }
  setPos(x, y) {
    this.x = x;
    this.y = y;
  }
  setRot(rad) {
    this.rot = rad;
  }
  setWidth(width) {
    this.width = width;
  }
  setHeight(height) {
    this.height = height;
  }
  getForwardVector() {
    const dx = Math.cos(this.rot);
    const dy = Math.sin(this.rot);
    return { dx, dy };
  }
  move(distance, axis) {
    if(axis == "x" || axis == 0) {
      this.x += distance;
    }
    else if(axis == "y" || axis == 1) {
      this.y += distance;
    }
  }
  moveX(distance) {
    this.x += distance;
  }
  moveY(distance) {
    this.y += distance;
  }
  clampPos(min, max, axis) {
    if(axis == "x" || axis == 0) this.x = Math.min(Math.max(this.x, min), max);
    else if(axis == "y" || axis == 1) this.y = Math.min(Math.max(this.y, min), max);
  }
  clampPosX(min, max) {
    this.x = Math.min(Math.max(this.x, min), max);
  }
  clampPosY(min, max) {
    this.y = Math.min(Math.max(this.y, min), max);
  }
  getPos() {
    return { x: this.x, y: this.y };
  }
  getCenter() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
  getPosX() {
    return this.x;
  }
  getPosY() {
    return this.y;
  }
  setPosX(x) {
    this.x = x;
  }
  setPosY(y) {
    this.y = y;
  }
  setRanPos(min, max) {
    this.x = random(min, max + 1);
    this.y = random(min, max + 1);
  }
  raycast(settings) {
    if(!expect(settings, ["angle", "maxDist", "scene"])) throw new Error(`Missing properties in raycast settings. (missing: ${findMissing(settings, ["angle", "maxDist", "scene"]).join(", ")})`);
    return settings.scene.raycast(this.getCenter(), settings.angle, settings.maxDist, settings.filter ?? (() => true));
  }
  debugRay(settings) {
    if(!expect(settings, ["angle", "dist", "color", "scene"])) throw new Error(`Missing properties in raycast settings. (missing: ${findMissing(settings, ["angle", "dist", "color", "scene"]).join(", ")})`);
    settings.scene.debugRay(this.getCenter(), settings.angle, settings.dist, settings.color);
  }
  distTo(object) {
    return Math.hypot(object.x - this.x, object.y - this.y);
  }
}
class SceneObject extends Phantom2DEntity {
  constructor(expects, objname, settings) {
    super(expects, `${objname} object`, settings);
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
    this.y += this.gravspd;
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
class BouncyObject extends SceneObject {
  // TODO:
  // Add passthrough/stop logic with ignore/target returns
  // Allow for existing colliding setting, mix with required colliding setting
  constructor(settings) {
    settings.collide = null;
    super(["strength"], "bouncy", settings);
    this.strength = settings.strength;
    this.ignore = settings.ignore ?? [];
    this.ignoreByType = settings.ignoreByType ?? [];
    this.target = settings.target ?? [];
    this.targetByType = settings.targetByType ?? [];
    this.collide = (col) => {
      // Exits prematurely if colliding object should be ignored
      if(this.ignore.includes(col) || this.ignoreByType.some(type => col instanceof type)) return;
      // Checks for match within targeted entities and types
      const matchesTarget = this.target.includes(col);
      const matchesTargetByType = this.targetByType.some(type => col instanceof type);
      if((this.target.length > 0 || this.targetByType.length > 0) && !(matchesTarget || matchesTargetByType)) return;
      if(col.velocity) {
        col.velocity.x *= -(this.strength);
        col.velocity.y *= -(this.strength);
      }
    }
  }
  update() {}
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
      case 0: this.y -= this.speed; break;
      case 1: this.x += this.speed; break;
      case 2: this.y += this.speed; break;
      case 3: this.x -= this.speed; break;
      default:
        // assumes dir is an angle and not a direction
        // to get the forward vector, we use (where theta is the angle):
        // (cos(theta), sin(theta))
        const dx = Math.cos(this.dir);
        const dy = Math.sin(this.dir);
        // Update the position by adding the scaled direction vector
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        break;
    }
    if(this.x + this.width < this.clampLeft || this.x + this.width > this.clampRight || this.y + this.height < this.clampUp || this.y + this.height > this.clampDown) {
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
class Character extends Phantom2DEntity {
  constructor(expects, objname, settings) {
    super(expects, `${objname} character`, settings);
    this.gravspd = 0;
    this.strength = settings.strength ?? 0;
  }
  setGravSpd(newSpd) {
    this.gravspd = newSpd;
  }
  jump(height) {
    this.gravspd = -(height);
  }
}
class PlayableCharacter extends Character {
  #binds;
  #keys;
  constructor(settings) {
    super(["width", "height"], "playable", settings);
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
  unbind(key) {
    delete this.#binds[key];
  }
  update() {
    this.gravspd += this.strength;
    this.y += this.gravspd;
    for(const [name, action] of Object.entries(this.#binds)) {
      if(this.#keys[name]) action();
    }
  }
}
class NonPlayableCharacter extends Character {
  #states;
  constructor(settings) {
    super(["states"], "non-playable", settings);
    this.#states = settings.states;
    this.interval = null;
    this.moveInterval = null;
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
  moveTo(target, step, tick) {
    if(target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(target, ["x", "y"]).join(", ")})`);
    this.moveInterval = setInterval(() => {
      if(isColliding(this, target)) {
        clearInterval(this.moveInterval);
        return;
      }
      if(target.x < this.x) this.x -= step;
      else if(target.x > this.x) this.x += step;
      if(target.y < this.y) this.y -= step;
      else if(target.y > this.y) this.y += step;
    }, tick);
  }
  stopInterval() {
    clearInterval(this.interval);
  }
  stopMoveInterval() {
    clearInterval(this.interval);
  }
  update() {
    this.gravspd += this.strength;
    this.y += this.gravspd;
  }
}
// class Light extends Phantom2DEntity {
//   constructor(expects, objname, settings) {
//     super(expects, `${objname} light`, settings);
//     // candelas (cd) is the measurement of a light source in a specific direction
//     // lumens (lm) is the measurement of a light source in all directions
//     // attenuation is the decaying effect lights produce
//     // you can find the intensity of a light at a position
//     // using the inverse-square law
//     this.attenuation = settings.atten ?? 1;
//     this.reach = settings.reach ?? 0;
//   }
//   intensityAt(intensity, startDist, endDist) {
//     // inverse-square law
//     // (I1 / I2) = (D2^2) / (D1^2)
//     // I2 = I1 * (D1 / D2)^2
//     // where:
//     // I1 represents the starting intensity
//     // I2 represents the ending intensity
//     // D1 represents the starting distance
//     // D2 represents the ending distance
//     return intensity * (startDist * startDist) / (endDist * endDist);
//   }
// }
// class DirectionLight extends Light {
//   constructor(settings) {
//     super(["cd", "beamSize"], "direction", settings);
//     this.candelas = settings.cd;
//     this.beamSize = settings.beamSize;
//   }
// }
// class AreaLight extends Light {
//   constructor(settings) {
//     super(["lm"], "area", settings);
//     this.lumens = settings.lm;
//   }
// }
// class NavigationMesh extends Phantom2DEntity {
//   constructor(settings) {
//     super(["x", "y", "width", "height", "size"], "navigation mesh", settings);
//     this.nodes = [];
//   }
//   generate() {
//     this.nodes = [];
//   }
// }
class Scene {
  #components;
  #imgCache;
  #focusTarget;
  constructor(canvas, width, height, cssWidth = "100vw", cssHeight = "100vh") {
    if(!(canvas instanceof HTMLCanvasElement)) throw new Error("Please provide a valid canvas.");
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = cssWidth;
    this.canvas.style.height = cssHeight;
    this.ctx = this.canvas.getContext("2d");
    this.#components = [];
    this.mousePos = { x: 0, y: 0 };
    document.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mousePos = { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
    });
    this._events = {};
    this.#imgCache = new Map();
    this.#focusTarget = null;
    // this.scaleFactor = 1;
  }
  add(...comps) {
    for(const comp of comps) {
      if(!is(comp, Phantom2DEntity)) throw new Error("Cannot add invalid type object.");
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
  img(x, y, w, h, path) {
    const img = this.loadImg(path);
    if(img.complete) {
      this.ctx.drawImage(img, x, y, w, h);
    } else {
      img.onload = () => this.ctx.drawImage(img, x, y, w, h);
    }
  }
  loadImg(path) {
    if(this.#imgCache.has(path)) return this.#imgCache.get(path);
    const img = new Image();
    img.src = path;
    this.#imgCache.set(path, img);
    return img;
  }
  render() {
    for(const comp of this.#components) {
      if(!is(comp, Phantom2DEntity)) throw new Error("Cannot render invalid type object.");
    }
    let offsetX = 0;
    let offsetY = 0;
    if(this.#focusTarget) {
      const focusCenterX = this.#focusTarget.x + this.#focusTarget.width / 2;
      const focusCenterY = this.#focusTarget.y + this.#focusTarget.height / 2;
      offsetX = this.width() / 2 - focusCenterX;
      offsetY = this.height() / 2 - focusCenterY;
    }
    this.#components.forEach(component => {
      this.ctx.fillStyle = component.color;
      // position relative to camera
      const drawX = component.x + offsetX;
      const drawY = component.y + offsetY;
      this.ctx.save();
      // this.ctx.scale(this.scaleFactor, this.scaleFactor);
      // move to the center of the object (after offset)
      this.ctx.translate(drawX + component.width / 2, drawY + component.height / 2);
      // Rotate the canvas
      this.ctx.rotate(component.rot);
      // Draw the rectangle at the new origin (its center)
      this.ctx.fillRect(-component.width / 2, -component.height / 2, component.width, component.height);
      // Restore the canvas to its original state
      this.ctx.restore();
    });
  }
  update() {
    for(const comp of this.#components) {
      if(!is(comp, Phantom2DEntity)) throw new Error("Cannot update invalid type object.");
    }
    this.#components.forEach(component => {
      component.update();
    });
    this.#resolveCollisions();
  }
  getById(id) {
    return this.#components.find(component => component.id == id);
  }
  getByAttr(attr, value) {
    return this.#components.find(component => component[attr] == value);
  }
  getByIdx(idx) {
    return this.#components[idx];
  }
  setById(id, newItem) {
    const comp = this.#components.find(component => component.id == id);
    const idx = this.#components.indexOf(comp);
    if(!comp || idx == -1) return;
    this.#components[idx] = newItem;
  }
  setByAttr(attr, value, newItem) {
    const comp = this.#components.find(component => component[attr] == value);
    const idx = this.#components.indexOf(comp);
    if(!comp || idx == -1) return;
    this.#components[idx] = newItem;
  }
  setByIdx(idx, newItem) {
    this.#components[idx] = newItem;
  }
  hasItem(item) {
    return this.#components.includes(item);
  }
  hasItemWithId(id) {
    return this.#components.some(component => component.id == id);
  }
  hasItemWithAttr(attr, value) {
    return this.#components.some(component => component[attr] == value);
  }
  idxOf(component) {
    return this.#components.indexOf(component);
  }
  len() {
    return this.#components.length;
  }
  fillBg(colour) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  #resolveCollisions() {
    this.#components.forEach(component1 => {
      this.#components.forEach(component2 => {
        if(component1 == component2) return;
        if(isColliding(component1, component2)) {
          component1.collide(component2);
        }
      });
    });
  }
  worldToScreen(pos) {
    let offsetX = 0;
    let offsetY = 0;
    if(this.#focusTarget) {
      const focusCenterX = this.#focusTarget.x + this.#focusTarget.width / 2;
      const focusCenterY = this.#focusTarget.y + this.#focusTarget.height / 2;
      offsetX = this.width() / 2 - focusCenterX;
      offsetY = this.height() / 2 - focusCenterY;
    }
    return { x: pos.x + offsetX, y: pos.y + offsetY };
  }
  screenToWorld(pos) {
    let offsetX = 0;
    let offsetY = 0;
    if(this.#focusTarget) {
      const focusCenterX = this.#focusTarget.x + this.#focusTarget.width / 2;
      const focusCenterY = this.#focusTarget.y + this.#focusTarget.height / 2;
      offsetX = this.width() / 2 - focusCenterX;
      offsetY = this.height() / 2 - focusCenterY;
    }
    return { x: pos.x - offsetX, y: pos.y - offsetY };
  }
  getMouseRotTo(target) {
    if(target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(target, ["x", "y"]).join(", ")})`);
    // get world screen position
    const targetScreen = this.worldToScreen(target);
    // Calculate difference vector
    const deltaX = this.mousePos.x - targetScreen.x;
    const deltaY = this.mousePos.y - targetScreen.y;
    // For utilizing rotation canvas items, it requires radians
    const radians = Math.atan2(deltaY, deltaX);
    return radians;
  }
  getRotTo(source, target) {
    if(source.x == null || source.y == null || target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${[findMissing(source, ["x", "y"]), findMissing(target, ["x", "y"])].flat(Infinity).join(", ")})`);
    const s = this.worldToScreen(source);
    const t = this.worldToScreen(target);
    const deltaX = t.x - s.x;
    const deltaY = t.y - s.y;
    const radians = Math.atan2(deltaY, deltaX);
    return radians;
  }
  getRotToMouse(source) {
    if(source.x == null || source.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(source, ["x", "y"]).join(", ")})`);
    const srcScreen = this.worldToScreen(source);
    const deltaX = this.mousePos.x - srcScreen.x;
    const deltaY = this.mousePos.y - srcScreen.y;
    const radians = Math.atan2(deltaY, deltaX);
    return radians;
  }
  addEvent(name, exec) {
    this._events[name] = exec;
    this.canvas.addEventListener(name, exec);
  }
  remEvent(name) {
    if(this._events[name]) {
      const exec = this._events[name];
      this.canvas.removeEventListener(name, exec);
      delete this._events[name];
    }
  }
  width() {
    return this.canvas.width;
  }
  height() {
    return this.canvas.height;
  }
  raycast(origin, angle, maxDist = Infinity, filter = () => true) {
    const rayDir = { x: Math.cos(angle), y: Math.sin(angle) };
    let closestHit = null;
    let closestDist = maxDist;
    for(const comp of this.#components) {
      if(!filter(comp)) continue;
      const hit = rayIntersectsRect(origin, rayDir, comp);
      if(hit != null && hit < closestDist) {
        closestDist = hit;
        closestHit = {
          object: comp,
          point: {
            x: origin.x + rayDir.x * hit,
            y: origin.y + rayDir.y * hit
          },
          distance: hit
        };
      }
    }
    return closestHit;
  }
  debugRay(origin, angle, dist, colour) {
    this.ctx.strokeStyle = colour;
    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(origin.x + Math.cos(angle) * dist, origin.y + Math.sin(angle) * dist);
    this.ctx.stroke();
  }
  imgBg(path) {
    this.img(0, 0, this.canvas.width, this.canvas.height, path);
  }
  // bake() {
  //   const lights = this.#components.slice(0).filter(component => is(component, Light));
  //   lights.forEach(light => {
  //     const { x, y, reach, color } = light;
  //     // Create a radial gradient for the light
  //     const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, reach);
  //     gradient.addColorStop(0, color); // Inner part of the light
  //     gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fades to transparent at the edge
  //     // Set the composite operation to 'lighter' for additive blending
  //     this.ctx.globalCompositeOperation = "lighter";
  //     // Draw the light area using the gradient
  //     this.ctx.fillStyle = gradient;
  //     this.ctx.beginPath();
  //     this.ctx.arc(x, y, reach, 0, Math.PI * 2);
  //     this.ctx.fill(); 
  //   });
  //   // Reset composite operation to default
  //   this.ctx.globalCompositeOperation = "source-over";
  // }
  focus(target) {
    if(target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(target, ["x", "y"]).join(", ")})`);
    this.#focusTarget = target;
  }
  unfocus() {
    this.#focusTarget = null;
  }
  // scale(scaleFactor) {
  //   this.scaleFactor = scaleFactor;
  // }
}
function isColliding(object1, object2) {
  const obj1W = object1.width;
  const obj1H = object1.height;
  const obj1X = object1.x;
  const obj1Y = object1.y;
  const obj2W = object2.width;
  const obj2H = object2.height;
  const obj2X = object2.x;
  const obj2Y = object2.y;
  return obj2X < obj1X + obj1W && obj2X + obj2W > obj1X && obj2Y < obj1Y + obj1H && obj2Y + obj2H > obj1Y;
}
function rayIntersectsRect(rayOrigin, rayDir, rect) {
  const t1 = (rect.x - rayOrigin.x) / rayDir.x;
  const t2 = (rect.x + rect.width - rayOrigin.x) / rayDir.x;
  const t3 = (rect.y - rayOrigin.y) / rayDir.y;
  const t4 = (rect.y + rect.height - rayOrigin.y) / rayDir.y;

  const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
  const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

  if(tmax < 0 || tmin > tmax) return null; // No hit
  return tmin >= 0 ? tmin : tmax; // Nearest intersection distance
}

export { Scene, SceneObject, StaticObject, PhysicsObject, MovingObject, BouncyObject, BulletObject, Vector, PlayableCharacter, NonPlayableCharacter, random, isColliding };
