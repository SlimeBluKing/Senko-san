const Discord = require('discord.js');
const redditFetch = require('reddit-fetch');
module.exports.run = (client, message, args) => {
    console.log('Comando waifu eseguito')
    redditFetch({
        
        subreddit: 'awwnime',
        sort: 'hot',
        allowNSFW: true,
        allowModPost: true,
        allowCrossPost: true,
        allowVideo: false
        
    }).then(post => {
        const waifuembed = new Discord.MessageEmbed()
            .setTitle('Eccoti una waifu senpai')
            .setColor('RANDOM')
            .setImage(post.url)
            .setFooter('Se non carica vuol dire che è un video... e gli embed non supportano video')
        message.channel.send(waifuembed);
    })
}

module.exports.config = {
    name: "waifu",
    aliases: []
}