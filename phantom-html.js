import { expect, findMissing, random, is, wait, getRemoteImg, getRemoteAudio, download, downloadJSON } from "./phantom.js";

class PhantomElement {
    #root;
    constructor(expects, objname, settings) {
        //if(!expect(settings, [...base, ...expects])) throw new Error(`Missing keys(s) in ${objname} settings. (missing: ${findMissing(settings, [...base, ...expects]).join(", ")})`);
        this.#root = document.createElement("div");
        this.left = settings.left ?? 0;
        this.top = settings.top ?? 0;
        this.right = settings.right ?? 0;
        this.bottom = settings.bottom ?? 0;
    }
    #genStyles() {
        Object.assign(this.#root.style, {
            left: this.left
        });
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
}