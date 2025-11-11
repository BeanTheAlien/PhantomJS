import * as p2d from "./phantom2d.js";
const ws = new WebSocket("ws://localhost:3000");
const canvas = document.getElementById("canvas");
const scene = new p2d.Scene(canvas, 500, 500);

function game() {
    scene.clear();
    scene.update();
    scene.render();
    requestAnimationFrame(game);
}
game();

ws.onopen = () => {
    console.log("Connected to server");
}

ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    // do something based on message
}

ws.onclose = () => {
    console.log("Disconnected from server");
}