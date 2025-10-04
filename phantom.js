// Phantom.js v0.0.0

function expect(obj, keys) {
  return keys.every(k => Object.prototype.hasOwnProperty.call(obj, k));
}

function findMissing(input, expected) {
  return expected.filter(k => !Object.prototype.hasOwnProperty.call(input, k));
}

export { expect, findMissing };