import * as cp from "child_process";
export default function() {
    cp.exec(`cp ".\\node_modules\\@beanthealien\\phantomjs\\phantom2d.ts" ".\\phantom2d.ts"`, (e, stdout, stderr) => {
        if(e) throw e;
        console.log(stderr.length ? stderr : stdout);
    });
}