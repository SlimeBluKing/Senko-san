const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    console.log('Comando pool eseguito')
    let pollChannel = message.mentions.channels.first();
    let pollDesc = args.slice(1).join(' ');

    if(!pollChannel){
        message.channel.bulkDelete(1)
        message.channel.send('Senpai, devi menzionare il canale')
        return
    }

    let embedPoll = new Discord.MessageEmbed()
        .setTitle('**SONDAGGIO**')
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