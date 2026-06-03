import { Scene } from "./phantom2d.js";
const scene = new Scene({ canvas: "editor", border: "2px solid red" });
const barLeft = document.getElementById("editor-bar-left");
function select(ent) { }
function deselect() {
    barLeft.innerHTML = `<p style="color: #414141; font-family: Verdana;">Nothing selected.</p>`;
}
deselect();
