import { Img, Scene, Vector } from "../../phantom2d";
const scene = new Scene({ canvas: "dest", w: 750, h: 750, border: "2px solid red" });
const core = new Img("/missing_content.png");
const center = new Vector(scene.width / 2, scene.height / 2);
scene.on("click", () => {
    if (scene.mouseInRect(center, 100, 100) && core.img.style.color != "rgba(0, 0, 0, 0)") {
        core.img.style.color = "rgba(0, 0, 0, 0)";
        setTimeout(() => core.img.style.color = "rgba(0, 0, 0, 1)", 500);
    }
});
scene.start(() => {
    scene.img(core, center.x, center.y, 100, 100);
});
