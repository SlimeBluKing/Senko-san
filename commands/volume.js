const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    var vsong = args[0]
    if (args.length < 1) return
    const channel = message.member.voice.channel;
    if (!channel)return sendError(language(guild, 'NO_VOICE'), message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError(language(guild, 'NO_MUSIC'), message.channel);
    if (!serverQueue.connection) return sendError(language(guild, 'NO_MUSIC'), message.channel);
    if (!args[0])return message.channel.send(`${language(guild)} **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send(`:notes: ${language(guild, "ONLY_NUM")}`).catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError(language(guild, "VOLUME_ERROR"),message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .attachFiles('./assets/Music.gif')
    .setDescription(`${language(guild, "SET_VOLUME")} **${args[0]/1}/100**`)
    .setAuthor("Volume", 'attachment://Music.gif')
    .setColor("BLUE")
    return message.channel.send(xd);
}

module.exports.config = {
    name: "volume",
    aliases: ["v", "vol"]
}