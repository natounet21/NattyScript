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
    "html.new": (args) => {
        return `let html = {
  style:\`\`,
  body:[]
}`
    },
    "html.style": (args) => {
        args = format(args)
        if (!args[1]) return "// Error while parsing!";
        args.shift()
        return `html.style = \`${args.join(" ")}\``
    },
    "html.start_div": (args) => {
        return `html.body.push(\`<div>\`)`
    },
    "html.end_div": (args) => {
        return `html.body.push(\`</div>\`)`
    },
    "html.add": (args) => {
        args = format(args)
        if (!args[1]||!args[2]) return "// Error while parsing!";
        args.shift()
        let type = args[0]
        args.shift()
        return `html.body.push(\`<${type}>${args.join(" ")}</${type}>\`)`
    },
    "html.make": (args) => {
        return `output = \`<!doctype HTML>
<html>
<head>
<style>
\${html.style}
</style>
</head>
<body>
\${html.body.join("\\n")}
</body>
</html>\``
    },
  }
}