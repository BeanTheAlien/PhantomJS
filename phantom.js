// Phantom.js v0.0.0

function expect(obj, keys) {
  return Object.keys(obj).every(k => keys.includes(k));
}

/* Phantom 2D */
class phantom2d {}
phantom2d.scene = class {
  constructor(canvas, width, height) {
    if(!(canvas instanceof HTMLCanvasElement)) throw new Error("Please provide a valid canvas.");
    this.canvas = canvas;
    this.canvas.style.width = width;
    this.canvas.style.height = height;
  }
}
phantom2d.physics = class {
  constructor(settings) {
    if(!expect(settings, ["name", "shape", "strength", "collision"])) throw new Error("Missing key(s) in physics object settings.");
    this.name = settings.name;
    this.shape = settings.shape;
    this.strength = settings.strength;
    this.collision = settings.collision ?? () => {};
  }
}
phantom2d.physics.physObj = class extends phantom2d.physics {
  constructor(settings) {
    super(settings);
  }
}

/* Phantom 3D */
class phantom3d {}
