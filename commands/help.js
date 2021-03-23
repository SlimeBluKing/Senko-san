const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
    console.log('Comando help eseguito')
    const helpembed = new Discord.MessageEmbed()
        .setColor('#08415D')
        .setTitle('**COSA MI HA INSEGNATO IL MIO SENPAI**(per ora)')
        .setDescription('**MUSIC BOT**\nplay <titolo/url>, stop, skip, queue, loop o repeat, seek, volume, jump, autoplay\n-------------------------\n**COSE DA WEEB**\nwaifu, meme, cursed, howweeb\n-------------------------\n**ALTRO**\nhelp, bugs, pool')
        .setImage('https://m.media-amazon.com/images/M/MV5BYWE4NDNhMzYtZDQ4Yi00ZWJhLTkxNTUtNTFkYjEyNDMyZTQwXkEyXkFqcGdeQXVyMzI2Mjc1NjQ@._V1_.jpg')
        .setFooter(client.user.username, client.user.displayAvatarURL())
    message.channel.send(helpembed)
}

module.exports.config = {
    name: "help",
    aliases: []
}