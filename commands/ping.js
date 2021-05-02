const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
    return embedbuilder(client, message, `sBLUE`, `PING:`, `\`${client.ws.ping} ms\``)    
}

function embedbuilder(client, message, color, title, description){
    let embed = new Discord.MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);
    return message.channel.send(embed);
}

module.exports.config = {
    name: "ping",
    aliases: []
}