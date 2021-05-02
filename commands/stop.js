const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const channel = message.member.voice.channel
    if (!channel)return sendError(language(guild, 'NO_VOICE'), message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError(language(guild, 'NO_MUSIC'), message.channel);
    if(!serverQueue.connection)return
    if(!serverQueue.connection.dispatcher)return
     try{
      serverQueue.connection.dispatcher.end();
      } catch (error) {
        message.guild.me.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: ${language(guild, "ERROR_MUSIC")}: ${error}`, message.channel);
      }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react("✅")
}

module.exports.config = {
    name: "stop",
    aliases: ["st"]
}