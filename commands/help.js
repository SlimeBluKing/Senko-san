const Discord = require('discord.js');
const language = require('../language')
module.exports.run = (client, message, args) => {
    const { guild } = message
    const helpembed = new Discord.MessageEmbed()
        .setColor('#08415D')
        .setTitle(`${language(guild, 'HELP_TITLE')}`)
        .setDescription(`${language(guild, 'HELP')}`)
        .setImage('https://m.media-amazon.com/images/M/MV5BYWE4NDNhMzYtZDQ4Yi00ZWJhLTkxNTUtNTFkYjEyNDMyZTQwXkEyXkFqcGdeQXVyMzI2Mjc1NjQ@._V1_.jpg')
        .setFooter(client.user.username, client.user.displayAvatarURL())
    message.channel.send(helpembed)
}

module.exports.config = {
    name: "help",
    aliases: []
}