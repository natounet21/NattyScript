function format(args) {
    return args.join(" ").replace(/\$(.+?)\$/g, '${$1}').split(" ")
}

module.exports = {
  commands: {
    "env.init": (args) => {
        return `require("dotenv").config({ path: './.env' });`
    },
  }
}