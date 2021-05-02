const Discord = require('discord.js');
const redditFetch = require('reddit-fetch');
const language = require('../language')
module.exports.run = (client, message, args) => {
    const { guild } = message
    redditFetch({
        
        subreddit: 'Animememes',
        sort: 'top',
        allowNSFW: true,
        allowModPost: true,
        allowCrossPost: true,
        allowVideo: false
        
    }).then(post => {
        const memeembed = new Discord.MessageEmbed()
            .setTitle(`${language(guild, 'MEME_TITLE')}`)
            .setColor('RANDOM')
            .setImage(post.url)
            .setFooter(`${language(guild, 'VIDEO_DISCLAMER_FOOTER')}`)
        message.channel.send(memeembed);
    })
}

module.exports.config = {
    name: "meme",
    aliases: []
}