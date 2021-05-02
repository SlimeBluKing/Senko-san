const Discord = require('discord.js');
const language = require('../language')
module.exports.run = (client, message) => {
    const { guild } = message
    const bugembed = new Discord.MessageEmbed()
        .setColor('#08415D')
        .setTitle(language(guild, 'BUGS_TITLE'))
        .setDescription(language(guild, 'BUGS'))
        .attachFiles('./assets/iloveu.gif')
        .setImage('attachment://iloveu.gif')
        .setFooter(client.user.username, client.user.displayAvatarURL())
    message.channel.send(bugembed)
}

module.exports.config = {
    name: "bugs",
    aliases: []
}