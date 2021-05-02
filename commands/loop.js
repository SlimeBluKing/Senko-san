const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Loop **\`${serverQueue.loop === true ? "On" : "Off"}\`**`
                }
            });
        };
    return sendError(language(guild, "NO_MUSIC"), message.channel);
}

module.exports.config = {
    name: "loop",
    aliases: ["l", "repeat"]
}