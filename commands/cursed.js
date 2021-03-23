const Discord = require('discord.js');
const redditFetch = require('reddit-fetch');
module.exports.run = (client, message, args) => {
    console.log('Comando cursed eseguito')
    redditFetch({
        
        subreddit: 'CursedAnime',
        sort: 'hot',
        allowNSFW: true,
        allowModPost: true,
        allowCrossPost: true,
        allowVideo: false
        
    }).then(post => {
        const cursedembed = new Discord.MessageEmbed()
            .setTitle('Immagine strana in arrivo senpai')
            .setColor('RANDOM')
            .setImage(post.url)
            .setFooter('Se non carica vuol dire che è un video... e gli embed non supportano video')
        message.channel.send(cursedembed);
    })
}

module.exports.config = {
    name: "cursed",
    aliases: []
}