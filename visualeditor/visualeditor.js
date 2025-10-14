import * as phantom from "./../phantom2d.js";

// const actionList = document.createElement("div");
// actionList.className = "ve-cm";
// document.body.appendChild(actionList);

const projectDiv = document.createElement("div");
projectDiv.className = "ve-pdiv";
// projectDiv.addEventListener("contextmenu", ActionList);
document.body.appendChild(projectDiv);
var project = [];

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
        <label for="shape_input">Select shape:</label>
        <select id="shape_input" name="shape_input">
            <option value="rect">Rectangle</option>
        </select>
        <label for="colour_input">Select colour:</label>
        <input type="color" id="colour_input" name="colour_input">
        <label for="x_input">Enter x-position:</label>
        <input type="number" id="x_input" name="x_input">
        <label for="y_input">Enter y-position:</label>
        <input type="number" id="y_input" name="y_input">
        <label for="rot_input">Enter rotation:</label>
        <input type="number" id="rot_input" name="rot_input" min="0" max="360">
        <label for="width_input">Enter width:</label>
        <input type="number" id="width_input" name="width_input">
        <label for="height_input">Enter height:</label>
        <input type="number" id="height_input" name="height_input">
    </div>`;
}

// collide, custom props