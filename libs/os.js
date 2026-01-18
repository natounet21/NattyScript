const fs = require("fs")
const child_process = require("child_process")
function tryConvert(arg) {
    let output = parseInt(arg);
    if (output.toString()=="NaN") {
        output = "parseInt(" + arg + ")"
    }
    return output;
}
function format(args) {
    return args.join(" ").replace(/\$(.+?)\$/g, '${$1}').split(" ")
}
module.exports = {
  commands: {
    run: (args) => {
        args = format(args)
        args.shift()
        if (!args[1]) return "// Error while parsing!";
        return `require("child_process").execSync(\`${args.join(" ")}\`)`
    },
  }
}