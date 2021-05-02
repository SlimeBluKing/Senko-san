const Discord = require('discord.js');
const avatarEmbed = require('discord.js-avatar');
module.exports.run = async (client, message, args) => {
    avatarEmbed(message, language = 'english');
}

module.exports.config = {
    name: "avatar",
    aliases: []
}