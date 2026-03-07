const fs = require("fs");
const path = require("path");
const readline = require("readline");
const prompts = require("prompts");

async function init() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = (q) => new Promise(res => rl.question(q, res));
    const name = await ask("Project Name: ");
    rl.close();
    const ver = await prompts.prompts({
        type: "select",
        name: "ver",
        message: "Choose the framework version to use:",
        choices: [
            { title: "Phantom2D Legacy (JavaScript)", value: "legacy" },
            { title: "Phantom2D (TypeScript)", value: "new" }
        ]
    }).ver;

    const projectDir = path.join(process.cwd(), name);
    if(fs.existsSync(projectDir)) {
        console.error(`Error: Project "${name}" already exists here.`);
        return;
    }

    fs.mkdirSync(projectDir, { recursive: true });
    const fnm = ver == "legacy" ? "phantom2d.js" : "phantom2d.ts";
    const res = await fetch(`https://raw.githubusercontent.com/BeanTheAlien/PhantomJS/refs/heads/main/${fnm}`);
    if(!res.ok) throw new Error(`Failed to fetch. Status code ${res.status}.`);
    const tx = await res.text();
    fs.writeFileSync(path.join(projectDir, fnm), tx);
    fs.writeFileSync(path.join(projectDir, "index.html"), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link ref="stylesheet" href="testing.css">
    <title>${name}</title>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script src="index.js" type="module"></script>
</body>
</html>`);
    fs.writeFileSync(path.join(projectDir, "index.js"), `import * as p2d from "./phantom2d.js";
const scene = new p2d.Scene({ canvas: "canvas" });
scene.start();`);

    console.log(`\nCreated PhantomJS project in: ${projectDir}`);
}

module.exports = { default: init };