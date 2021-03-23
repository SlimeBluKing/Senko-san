const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    console.log('Comando weebmeter eseguito')
    const menzione = message.mentions.members.first();
    if(!menzione){
        const weebembed = new Discord.MessageEmbed()
            .setTitle("**WEEBMETER**")
            .setDescription("Sei weeb al " + Math.floor(Math.random() * 101) + "%")
            .setColor("RANDOM")
            .setFooter(client.user.username, client.user.displayAvatarURL())
        message.channel.send(weebembed)
    }else{
        const weebembed = new Discord.MessageEmbed()
            .setTitle("**WEEBMETER**")
            .setDescription("<@" + menzione + ">" + " è weeb al " + Math.floor(Math.random() * 101) + "%")
            .setColor("RANDOM")
            .setFooter(client.user.username, client.user.displayAvatarURL())
        message.channel.send(weebembed)
    }
    console.log('Comando weebmeter eseguito')
}

module.exports.config = {
    name: "howweeb",
    aliases: []
}