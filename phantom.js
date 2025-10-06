// Phantom.js v0.0.0

function expect(obj, keys) {
  return keys.every(k => Object.prototype.hasOwnProperty.call(obj, k));
}

function findMissing(input, expected) {
  return expected.filter(k => !Object.prototype.hasOwnProperty.call(input, k));
}

function random(a = null, b = null) {
    if(a == null && b == null) {
        return Math.floor(Math.random() * 101);
    } else if(a != null && b == null) {
        return Math.floor(Math.random() * a);
    } else if(a != null && b != null) {
        let min;
        let max;
        if(a > b) {
            min = Math.ceil(b);
            max = Math.floor(a);
            return Math.floor(Math.random() * (max - min)) + min;
        } else if(a < b) {
            min = Math.ceil(a);
            max = Math.floor(b);
            return Math.floor(Math.random() * (max - min)) + min;
        } else {
            return Math.floor(Math.random() * a);
        }
    }
}

export { expect, findMissing, random };