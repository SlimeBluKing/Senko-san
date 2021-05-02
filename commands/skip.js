const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const channel = message.member.voice.channel
    if (!channel)return sendError(language(guild, 'NO_VOICE'), message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError(language(guild, 'NO_MUSIC'), message.channel);
        if(!serverQueue.connection)return
    if(!serverQueue.connection.dispatcher)return
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume(); //FOR NOW DOESN'T WORK BECAUSE THE PAUSE.JS IS MISSING, u can't put in pause
      let xd = new MessageEmbed() //FOR NOW DOESN'T WORK BECAUSE THE PAUSE.JS IS MISSING
      .setDescription("▶ Resumed the music for you!") //FOR NOW DOESN'T WORK BECAUSE THE PAUSE.JS IS MISSING
      .setColor("YELLOW") //FOR NOW DOESN'T WORK BECAUSE THE PAUSE.JS IS MISSING
      .setTitle("Music has been Resumed!") //FOR NOW DOESN'T WORK BECAUSE THE PAUSE.JS IS MISSING
       
        return message.channel.send(xd).catch(err => console.log(err));
    }


       try{
      serverQueue.connection.dispatcher.end()
      } catch (error) {
        serverQueue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: ${language(guild, "ERROR_MUSIC")}: ${error}`, message.channel);
      }
    message.react("✅")
}

module.exports.config = {
    name: "skip",
    aliases: ["s"]
}