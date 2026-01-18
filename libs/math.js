const fs = require("fs")
function tryConvert(arg) {
    let output = parseInt(arg);
    if (output.toString()=="NaN") {
        output = "parseInt(" + arg + ")"
    }
    return output;
}
function format(args) {
    let args2 = [args[0]]
    args.slice(1).forEach((element) => {
        let num = tryConvert(element)
        args2.push(num)
    });
    return args2.join(" ").replace(/\$(.+?)\$/g, '${$1}').split(" ")
}

module.exports = {
  commands: {
    add: (args) => {
        args = format(args)
        if (!args[1]||!args[2]) return "// Error while parsing!";
        return `output = ${args[1].toString()} + ${args[2].toString()} `
    },
    sub: (args) => {
        args = format(args)
        if (!args[1]||!args[2]) return "// Error while parsing!";
        return `output = ${args[1].toString()} - ${args[2].toString()} `
    },
    multiply: (args) => {
        args = format(args)
        if (!args[1]||!args[2]) return "// Error while parsing!";
        return `output = ${args[1].toString()} * ${args[2].toString()} `
    },
    divide: (args) => {
        args = format(args)
        if (!args[1]||!args[2]) return "// Error while parsing!";
        return `output = ${args[1].toString()} / ${args[2].toString()} `
    },
  }
}