const Discord = require('discord.js');
const language = require('../language')
module.exports.run = async (client, message, args) => {
    const { guild } = message
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(language(guild, "NOTPERM"))
    let pollChannel = message.mentions.channels.first();
    let pollDesc = args.slice(1).join(' ');

    if(!pollChannel){
        message.channel.bulkDelete(1)
        message.channel.send(language(guild, 'POOL_NOT_CHANNEL'))
        return
    }

    let embedPoll = new Discord.MessageEmbed()
        .setTitle(language(guild, 'POOL_TITLE'))
        .setDescription(pollDesc)
        .setColor('RANDOM')
        .setFooter(client.user.username, client.user.displayAvatarURL())
    message.channel.bulkDelete(1)
    let msgEmbed = await pollChannel.send(embedPoll);
    await msgEmbed.react('👍')
    await msgEmbed.react('👎')
}

module.exports.config = {
    name: "pool",
    aliases: []
}