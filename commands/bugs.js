const Discord = require('discord.js');
module.exports.run = (client, message) => {
    console.log('Comando bugs eseguito')
    const bugembed = new Discord.MessageEmbed()
        .setColor('#08415D')
        .setTitle('**I BUG CHE HO**')
        .setDescription('=>Se metti in pausa una canzone non puoi rimetterla in play... non è un mio bug... ma un bug di ytdl\n=>Sono instabile, tendo a crashare spesso se un comando è scritto in maniera sbagliata UwU\nSe trovi altri bug contatta subito @『SlimeBluKingツ』#5268\nGrazie (´▽`ʃ♡ƪ)')
        .attachFiles('./images/iloveu.gif')
        .setImage('attachment://iloveu.gif')
        .setFooter(client.user.username, client.user.displayAvatarURL())
    message.channel.send(bugembed)
}

module.exports.config = {
    name: "bugs",
    aliases: []
}