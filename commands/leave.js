const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    let channel = message.member.voice.channel;
    if (!channel) return sendError(language(guild, 'NO_VOICE'), message.channel);
    if (!message.guild.me.voice.channel) return sendError(language(guild, 'NO_IN_VOICE'), message.channel);

    try {
        await message.guild.me.voice.channel.leave();
    } catch (error) {
        await message.guild.me.voice.kick(message.guild.me.id);
        return sendError(language(guild, 'LEAVE_TRY'), message.channel);
    }

    const Embed = new MessageEmbed()
        .attachFiles('./assets/Music.gif')
        .setAuthor("Leave", 'attachment://Music.gif')
        .setColor("GREEN")
        .setDescription(language(guild, 'LEAVE'))
        .setTimestamp();

    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Left The Voice Channel."));
}

module.exports.config = {
    name: "leave",
    aliases: ["exit"]
}