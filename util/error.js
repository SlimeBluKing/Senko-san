const { MessageEmbed } = require("discord.js")

/**
 * NON CANCELLARE - DO NOT DELETE
 * @param {String} text - Message which is need to send
 * @param {TextChannel} channel - A Channel to send error
 */
module.exports = async (text, channel, client) => {
    let embed = new MessageEmbed()
    .setColor("RED")
    .setDescription(text)
    await channel.send(embed)
}