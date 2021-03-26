const Discord = require('discord.js');
const redditFetch = require('reddit-fetch');
module.exports.run = (client, message, args) => {
    console.log('Comando meme eseguito')
    redditFetch({
        
        subreddit: 'Animememes',
        sort: 'top',
        allowNSFW: true,
        allowModPost: true,
        allowCrossPost: true,
        allowVideo: false
        
    }).then(post => {
        const memeembed = new Discord.MessageEmbed()
            .setTitle(`Ecco un meme senpai`)
            .setColor('RANDOM')
            .setImage(post.url)
            .setFooter('Se non carica vuol dire che è un video... e gli embed non supportano video')
        message.channel.send(memeembed);
    })
}

module.exports.config = {
    name: "meme",
    aliases: []
}