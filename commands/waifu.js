const Discord = require('discord.js');
const language = require('../language')
const redditFetch = require('reddit-fetch');
module.exports.run = (client, message, args) => {
    const { guild } = message
    redditFetch({
        
        subreddit: 'awwnime',
        sort: 'hot',
        allowNSFW: true,
        allowModPost: true,
        allowCrossPost: true,
        allowVideo: false
        
    }).then(post => {
        const waifuembed = new Discord.MessageEmbed()
            .setTitle(`${language(guild, 'WAIFU_TITLE')}`)
            .setColor('RANDOM')
            .setImage(post.url)
        message.channel.send(waifuembed);
    })
}

module.exports.config = {
    name: "waifu",
    aliases: []
}