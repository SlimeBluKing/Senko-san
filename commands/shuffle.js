const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError(language(guild, 'NO_QUEUE'),message.channel).catch(console.error);
    try{
        let songs = serverQueue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
          let j = 1 + Math.floor(Math.random() * i);
          [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        serverQueue.songs = songs;
        message.client.queue.set(message.guild.id, serverQueue);
        message.react("✅")
    } catch (error) {
        message.guild.me.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: ${language(guild, 'ERROR_MUSIC')}: \`${error}\``, message.channel);
    }
}

module.exports.config = {
    name: "shuffle",
    aliases: ["sh"]
}