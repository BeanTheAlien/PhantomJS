
class PhantomElement {
    constructor(expects, objname, settings) {
        // id, shape and color are all base properties
        const base = ["id", "shape", "color"];
        if(!expect(settings, [...base, ...expects])) throw new Error(`Missing keys(s) in ${objname} settings. (missing: ${findMissing(settings, [...base, ...expects]).join(", ")})`);
    }
}