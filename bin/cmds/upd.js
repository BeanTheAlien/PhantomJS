const cp = require("child_process");

function upd(args) {
    cp.exec(`npm update @beanthealien/phantomjs`, (err, stdout, stderr) => {
        if(err) return console.error(`exec error: ${err}`);
        if(stderr.length) console.error(stderr);
        else console.log(stdout);
    });
}

module.exports = { default: upd };