import * as phantom from "./../phantom2d.js";

// const actionList = document.createElement("div");
// actionList.className = "ve-cm";
// document.body.appendChild(actionList);

const projectDiv = document.createElement("div");
projectDiv.className = "ve-pdiv";
// projectDiv.addEventListener("contextmenu", ActionList);
document.body.appendChild(projectDiv);
var project = [];

// collide, custom

const mk = (n, p = {}) => Object.assign(document.createElement(n), p);
const mkDiv = (p = {}) => mk("div", p);
const mkP = (p = {}) => mk("p", p);
const mkBtn = (p = {}) => mk("button", p);
const mkSpan = (p = {}) => mk("span", p);
const mkInput = (p = {}) => mk("input", p);
const mkSelect = (p = {}) => mk("select", p);
const mkOption = (p = {}) => mk("option", p);
const add = (parent, child) => parent.appendChild(child);
const rem = (parent, child) => parent.removeChild(child);

const types = {
    id: { type: "text", placeholder: "Enter ID..." },
    shape: { type: "select", opts: [{ text: "Rectangle", value: "rect" }] },
    color: { type: "color" },
    x: { type: "number", min: 0 },
    y: { type: "number", min: 0 },
    rot: { type: "number", min: 0, max: 360 },
    width: { type: "number", min: 0 },
    height: { type: "number", min: 0 }
};

function gen(obj) {
    const keys = Object.keys(obj);
    let els = [];
    for(let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if(!k) return;
        switch(k.type) {
            case "text":
                project.push(mkInput({
                    type: "text",
                    placeholder: k.placeholder ?? ""
                }));
                break;
            case "number":
                project.push(mkInput({
                    type: "number",
                    min: k.min ?? -Infinity,
                    max: k.max ?? Infinity
                }));
                break;
            case "color":
                project.push(mkInput({
                    type: "color"
                }));
                break;
            case "select":
                const s = mkSelect();
                for(const opt of k.opts) add(s, mkOption({ textContent: opt.text, value: opt.value }));
                proj.push(s);
                break;
        }
    }
}

// function ActionList(e) {
//     e.preventDefault();
//     actionList.style.display = "block";
//     actionList.style.left = `${e.pageX - 10}px`;
//     actionList.style.top = `${e.pageY - 10}px`;
// }

// document.addEventListener("click", (e) => {
//     if(e.target != actionList) {
//         actionList.style.display = "none";
//         actionList.style.left = "";
//         actionList.style.top = "";
//     }
// });

function Phantom2DEntity() {
    return `<div>
        <label for="id_input">Enter ID:</label>
        <input type="text" id="id_input" placeholder="Enter id" name="id_input">
        <br><br>
        <label for="shape_input">Select shape:</label>
        <select id="shape_input" name="shape_input">
            <option value="rect">Rectangle</option>
        </select>
        <br><br>
        <label for="colour_input">Select colour:</label>
        <input type="color" id="colour_input" name="colour_input">
        <br><br>
        <label for="x_input">Enter x-position:</label>
        <input type="number" id="x_input" name="x_input">
        <br><br>
        <label for="y_input">Enter y-position:</label>
        <input type="number" id="y_input" name="y_input">
        <br><br>
        <label for="rot_input">Enter rotation:</label>
        <input type="number" id="rot_input" name="rot_input" min="0" max="360">
        <br><br>
        <label for="width_input">Enter width:</label>
        <input type="number" id="width_input" name="width_input">
        <br><br>
        <label for="height_input">Enter height:</label>
        <input type="number" id="height_input" name="height_input">
    </div>`;
}

projectDiv.innerHTML = Phantom2DEntity();

// collide, custom props
