const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError(language(guild, "NO_MUSIC"), message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .attachFiles('./assets/Music.gif')
      .setAuthor(language(guild, "PLAYING"), 'attachment://Music.gif')
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField(language(guild, 'QUEUE_NAME'), song.title, true)
      .addField(language(guild, 'QUEUE_DURATION'), song.duration, true)
      .addField(language(guild, 'QUEUE_REQUEST'), song.req.tag, true)
      .setFooter(`${language(guild, 'QUEUE_VIEWS')}: ${song.views} | ${song.ago}`);
    return message.channel.send(thing)
}

module.exports.config = {
    name: "nowplaying",
    aliases: ["np"]
}