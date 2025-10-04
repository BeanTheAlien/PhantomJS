// Phantom.js v0.0.0

function expect(obj, keys) {
  return Object.keys(obj).every(k => keys.includes(k));
}

function findMissing(input, expected) {
  let missing = [];
  for(const key of expected) {
    if(!input.includes(key)) missing.push(key);
  }
}

export { expect, findMissing };