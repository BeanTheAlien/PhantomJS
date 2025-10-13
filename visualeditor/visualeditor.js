import * as phantom from "./../phantom2d.js";

const actionList = document.createElement("div");
actionList.className = "ve-cm";
document.body.appendChild(actionList);

const projectDiv = document.createElement("div");
projectDiv.className = "ve-pdiv";
// projectDiv.addEventListener("contextmenu", ActionList);
document.body.appendChild(projectDiv);
var project = [];

// function ActionList(e) {
//     e.preventDefault();
// }