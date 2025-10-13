import * as phantom from "./../phantom2d.js";

const actionList = document.createElement("div");
actionList.className = "ve-cm";
document.body.appendChild(actionList);

const projectDiv = document.createElement("div");
projectDiv.className = "ve-pdiv";
projectDiv.addEventListener("contextmenu", ActionList);
document.body.appendChild(projectDiv);
var project = [];

function ActionList(e) {
    e.preventDefault();
    actionList.style.display = "block";
    actionList.style.left = `${e.pageX - 10}px`;
    actionList.style.top = `${e.pageY - 10}px`;
}

document.addEventListener("click", (e) => {
    if(e.target != actionList) {
        actionList.style.display = "none";
        actionList.style.left = "";
        actionList.style.top = "";
    }
});