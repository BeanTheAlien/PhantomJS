// Phantom.js v0.0.0

function expect(obj, keys) {
  return Object.keys(obj).every(k => keys.includes(k));
}

/* Phantom 2D */
export class phantom2d {}
phantom2d.scene = class {
  constructor(canvas, width, height) {
    if(!(canvas instanceof HTMLCanvasElement)) throw new Error("Please provide a valid canvas.");
    this.canvas = canvas;
    this.canvas.style.width = width;
    this.canvas.style.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.components = [];
  }
  add(...c) {
    this.components.push(...c);
  }
  render() {}
}
phantom2d.physObj = class {
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

/* Phantom 3D */
export class phantom3d {}

export { phantom2d, phantom3d };
