import { Entity, objIs, Scene, Vector } from "./phantom2d.js";

const scene = new Scene({ canvas: "editor", border: "2px solid red" });
const barLeft = document.getElementById("editor-bar-left") as HTMLDivElement;
function input(val: any) {
    if(objIs(val, Vector)) {}
}
function select(ent: Entity) {
    //
}
function deselect() {
    barLeft.innerHTML = `<p style="color: #414141; font-family: Verdana;">Nothing selected.</p>`;
}
deselect();