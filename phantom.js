// Phantom.js v0.0.0

export function expect(obj, keys) {
  return Object.keys(obj).every(k => keys.includes(k));
}