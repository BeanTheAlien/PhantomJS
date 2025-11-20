import * as p2d from "./phantom2d.js";
import { Server } from "./phantom2d-server.js";
const canvas = document.getElementById("canvas");
const scene = new p2d.Scene(canvas, 1000, 1000, "100vw", "100vh");
const socket = new WebSocket("ws://localhost:3000"); // or change to IP if you're not the host
const server = new Server({ hostname: "0.0.0.0", port: 3000, scene, serve: "lan-server.html" });
server.listen();

function game() {
    scene.clear();
    scene.update();
    scene.render();
    requestAnimationFrame(game);
}
game();

const player = new p2d.PlayableCharacter({
    id: "player", shape: "rect", color: "#3bef47ff",
    width: 10, height: 30, x: 50, y: 50, strength: 0,
    binds: {
        "w": () => {
            player.moveY(-1);
            socket.send(player.movePayload(-1, 1));
        },
        "a": () => {
            player.moveX(-1);
            socket.send(player.movePayload(-1, 0));
        },
        "s": () => {
            player.moveY(1);
            socket.send(player.movePayload(1, 1));
        },
        "d": () => {
            player.move(1);
            socket.send(player.movePayload(1, 0));
        }
    }, custom: {
        movePayload: (d, a) => JSON.stringify({ type: "move", entity: player, distance: d, axis: a })
    }
});

socket.addEventListener("open", () => {
    console.log("Connected to server");
});

socket.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if(msg.type == "move") {
        scene.getById(msg.entity.id).move(msg.distance, msg.axis);
    }
});

socket.addEventListener("close", () => {
    console.log("Disconnected from server");
});