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

const player = new p2d.PlayableCharacter({
    id: "ws_player", shape: "rect", color: "blue",
    width: 10, height: 30, x: 50, y: 50, strength: 0,
    binds: {
        "w": () => {
            player.moveY(-1);
            ws.send(player.movePayload(-1, 1));
        },
        "a": () => {
            player.moveX(-1);
            ws.send(player.movePayload(-1, 0));
        },
        "s": () => {
            player.moveY(1);
            ws.send(player.movePayload(1, 1));
        },
        "d": () => {
            player.move(1);
            ws.send(player.movePayload(1, 0));
        }
    }, custom: {
        movePayload: (d, a) => JSON.stringify({ type: "move", entity: player, distance: d, axis: a })
    }
});

ws.onopen = () => {
    console.log("Connected to server");
}

ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if(msg.type == "move") {
        scene.getById(msg.entity.id).move(msg.distance, msg.axis);
    }
}

ws.onclose = () => {
    console.log("Disconnected from server");
}