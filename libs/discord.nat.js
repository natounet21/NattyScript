function format(args) {
    return args.join(" ").replace(/\$(.+?)\$/g, '${$1}').split(" ")
}

module.exports = {
  commands: {
    init: (args) => {
        return `const discordjs = require("discord.js");
const client = new discordjs.Client({
    intents: [
        discordjs.GatewayIntentBits.Guilds, 
        discordjs.GatewayIntentBits.GuildVoiceStates,
        discordjs.GatewayIntentBits.GuildMessages, 
        discordjs.GatewayIntentBits.GuildMembers,
        discordjs.GatewayIntentBits.MessageContent
    ]
});`
    },
    ready: (args) => {
        return `client.on(discordjs.Events.ClientReady, async (readyClient) => {`
    },
    newmessage: (args) => {
        return `client.on(discordjs.Events.MessageCreate, async (message) => {`
    },
    "d.end": (args) => {
        return `});`
    },
    login: (args) => {
        args = format(args)
        if (!args[1]) return "// Error while parsing!";
        return `client.login(\`${args[1]}\`);`
    },
  }
}