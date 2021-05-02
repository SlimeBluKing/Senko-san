const Discord = require('discord.js');
const language = require('../language')
const redditFetch = require('reddit-fetch');
module.exports.run = (client, message, args) => {
    const { guild } = message
    redditFetch({
        
        subreddit: 'CursedAnime',
        sort: 'hot',
        allowNSFW: true,
        allowModPost: true,
        allowCrossPost: true,
        allowVideo: false
        
    }).then(post => {
        const cursedembed = new Discord.MessageEmbed()
            .setTitle(language(guild, 'CURSED_TITLE'))
            .setColor('RANDOM')
            .setImage(post.url)
            .setFooter(language(guild, 'VIDEO_DISCLAMER_FOOTER'))
        message.channel.send(cursedembed);
    })
}

module.exports.config = {
    name: "cursed",
    aliases: []
}