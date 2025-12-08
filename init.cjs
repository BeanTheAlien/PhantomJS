const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

async function init() {
    const name = await ask("Project name: ");
    console.log(`Generating '/${name}'...`);
    fs.mkdirSync(name);
    const p = `${name}/${name}`;
    console.log(`Generating '${name}.html'...`);
    fs.writeFileSync(`${p}.html`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${name}.css">
    <title>${name}</title>
</head>
<body>
    <canvas id="p2d-canvas"></canvas>
    <script src="${name}.js" type="module"></script>
</body>
</html>`);
    fs.writeFileSync(`${p}.js`, `import * as phantom from "../phantom2d.js";
const canvas = document.getElementById("p2d-canvas");
const scene = new phantom.Scene(canvas, 500, 500, "100vw", "100vh");

function render() {
    scene.clear();
    scene.update();
    scene.render();
    requestAnimationFrame(render);
}
render();`);
    console.log(`Generating '${name}.css'...`);
    fs.writeFileSync(`${p}.css`, "");
    console.log("Finished.");
    rl.close();
}
init();