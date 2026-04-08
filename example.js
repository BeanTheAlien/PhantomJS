const fs = require("fs");
const path = require("path");
let [,, ...nm] = process.argv;
nm = nm.join(" ");
const p = path.join("examples", nm);
fs.mkdirSync(p);
fs.writeFileSync(path.join(p, "index.html"), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nm.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Example</title>
</head>
<body>
    <canvas id="${nm}"></canvas>
    <script src="index.js" type="module"></script>
</body>
</html>`);
fs.writeFileSync(path.join(p, "index.ts"), `import * as p2d from "../../phantom2d.js";
const scene = new p2d.Scene({ canvas: "${nm}" });

scene.start();`);