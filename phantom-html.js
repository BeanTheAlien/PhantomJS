import { expect, findMissing, random, is, wait, getRemoteImg, getRemoteAudio, download, downloadJSON } from "./phantom.js";

class PhantomElement {
    #root;
    /**
     * The PhantomElement constructor.
     * @param {string[]} expects - Keys that are required within settings.
     * @param {string} objname - The name of the constructing class.
     * @param {{ x?: number, y?: number }} settings - The characteristics of the entity.
     */
    constructor(expects, objname, settings) {
        //if(!expect(settings, [...base, ...expects])) throw new Error(`Missing keys(s) in ${objname} settings. (missing: ${findMissing(settings, [...base, ...expects]).join(", ")})`);
        this.#root = document.createElement("div");
        this.x = settings.x ?? 0;
        this.y = settings.y ?? 0;
    }
    #genStyles() {
        Object.assign(this.#root.style, {
            left: this.x, top: this.y
        });
    }
    gen() {
        this.#genStyles();
    }
    #enforceEl(item) {
        if(!is(item, HTMLElement)) throw new Error("Received non-HTMLElement.");
    }
    addTo(parent = document.body) {
        this.#enforceEl(parent);
        parent.appendChild(this.#root);
    }
    addChild(child) {
        this.#enforceEl(child);
        this.#root.appendChild(child);
    }
    rmFrom(parent) {
        this.#enforceEl(parent);
        parent.removeChild(this);
    }
    rmChild(child) {
        this.#enforceEl(child);
        this.#root.removeChild(child);
    }
}
class LayeredElement extends PhantomElement {
    consturctor(settings) {
        super(["layer"], "layered element", settings);
        this.layer = settings.layer;
    }
}

export { PhantomElement };