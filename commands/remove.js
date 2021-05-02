const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    var nsong = args[0]
    if (args.length < 1) return
    if (Number.isNaN(+nsong)) return
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError(language(guild, "NO_QUEUE"),message.channel).catch(console.error);
    if (!args.length) return;
    if (isNaN(args[0])) return;
    if (queue.songs.length == 1) return sendError(language(guild, "NO_QUEUE"),message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`${language(guild, "QUEUE_ONLY")} ${queue.songs.length} ${language(guild, "QUEUE_LONG")}!`,message.channel).catch(console.error);
    try{
        const song = queue.songs.splice(args[0] - 1, 1); 
        sendError(`❌ **|** ${language(guild, "REMOVED")} **\`${song[0].title}\`** ${language(guild, "FROM_QUEUE")}.`,queue.textChannel).catch(console.error);
                   message.react("✅")
    } catch (error) {
        return sendError(`:notes: An unexpected error occurred.\nPossible type: ${error}`, message.channel);
    }
}

module.exports.config = {
    name: "remove",
    aliases: ["rm"]
}