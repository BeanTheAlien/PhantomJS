import { Entity, objIs, Scene, Vector } from "./phantom2d.js";

const scene = new Scene({ canvas: "editor", border: "2px solid red", w: 500, h: 500 });
const barLeft = document.getElementById("editor-bar-left") as HTMLDivElement;
const create = document.createElement.bind(document);
const add = (t: HTMLElement, ...n: Node[]) => n.forEach(x => t.appendChild(x));
function input(k: string, v: any) {
    console.log(k, v);
    const type = typeof v;
    const title = k.replace(/([A-Z])/g, "$1").replace(/^./, (m) => m.toUpperCase()).trim();
    if(type == "object" || type == "function") return "";
    if(type == "string") {
        if(k == "color") {
            return `<div>
                <p>Color</p>
                <input type="color">
            </div>`;
        }
    }
    return `<div>
        <p>${title}</p>
        <input type=${type == "string" ? "text" : type} placeholder="Enter ${k}..." id=${k}>
    </div>`
}
// type InputElementType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" |
//     "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" |
//     "time" | "url" | "week";
function select(ent: Entity) {
    barLeft.innerHTML = "";
    const out: string[] = [];
    for(const [k, v] of Object.entries(ent)) {
        out.push(input(k, v));
    }
    barLeft.innerHTML = out.join("<br>");
    for(const [k] of Object.entries(ent)) {
        const i = document.getElementById(k) as HTMLInputElement | undefined;
        if(i) i.addEventListener("change", () => { console.log("value change:", ent[k]); ent[k] = i.value; console.log("=>", ent[k]); });
    }
}
function deselect() {
    barLeft.innerHTML = `<p style="color: #414141; font-family: Verdana;">Nothing selected.</p>`;
}
deselect();
scene.on("click", (e) => {
    const tol = 1.5;
    const m = scene.mouseAt(e);
    const ent = scene.getByMouse(m, tol);
    if(ent) {
        select(ent);
    } else {
        deselect();
    }
});
scene.add(new Entity({ x: 10, y: 10, width: 30, height: 30, color: "red" }));
scene.start();