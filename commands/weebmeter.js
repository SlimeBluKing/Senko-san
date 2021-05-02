const Discord = require('discord.js');
const language = require('../language')
module.exports.run = async (client, message, args) => {
    const { guild } = message
    const menzione = message.mentions.members.first();
    if(!menzione){
        const weebembed = new Discord.MessageEmbed()
            .setTitle("**WEEBMETER**")
            .setDescription(language(guild, 'WEEBMETER_INDIVIDUAL') + Math.floor(Math.random() * 101) + "%")
            .setColor("RANDOM")
            .setFooter(client.user.username, client.user.displayAvatarURL())
        message.channel.send(weebembed)
    }else{
        const weebembed = new Discord.MessageEmbed()
            .setTitle("**WEEBMETER**")
            .setDescription("<@" + menzione + ">" + language(guild, 'WEEBMETER_MENTION') + Math.floor(Math.random() * 101) + "%")
            .setColor("RANDOM")
            .setFooter(client.user.username, client.user.displayAvatarURL())
        message.channel.send(weebembed)
    }
}

module.exports.config = {
    name: "howweeb",
    aliases: []
}