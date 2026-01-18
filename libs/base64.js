function format(args) {
    return args.join(" ").replace(/\$([a-zA-Z_]\w*)/g, '${$1}').split(" ")
}

module.exports = {
  commands: {
    "base64.encode": (args) => {
        args = format(args)
        if (!args[1]) return "// Error while parsing!";
        return `output = Buffer.from(\`${args.slice(1).join(" ")}\`).toString('base64')`
    },
    "base64.decode": (args) => {
        args = format(args)
        if (!args[1]) return "// Error while parsing!";
        return `output = Buffer.from(\`${args.slice(1).join(" ")}\`,"base64").toString('utf8')`
    },
  }
}