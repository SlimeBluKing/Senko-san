const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");
const language = require('../language')
const splitlyrics = require("../util/pagination");

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError(language(guild, "NO_MUSIC"), message.channel).catch(console.error);

    let lyrics = null;

    try {
        lyrics = await lyricsFinder(queue.songs[0].title, "");
        if (!lyrics) lyrics = `${language(guild, "NO_LYRICS")} ${queue.songs[0].title}.`;
    } catch (error) {
        lyrics = `${language(guild, "NO_LYRICS")} ${queue.songs[0].title}.`;
    }
    const splittedLyrics = splitlyrics.chunk(lyrics, 1024);

    let lyricsEmbed = new MessageEmbed()
        .setAuthor(`${queue.songs[0].title} — Lyrics`, "https://media.giphy.com/media/f2JmYpI53jxOT1tlbY/source.gif")
        .setThumbnail(queue.songs[0].img)
        .setColor("YELLOW")
        .setDescription(splittedLyrics[0])
        .setFooter(`1/${splittedLyrics.length}.`)
        .setTimestamp();

    const lyricsMsg = await message.channel.send(lyricsEmbed);
    if (splittedLyrics.length > 1) await splitlyrics.pagination(lyricsMsg, message.author, splittedLyrics);
}

module.exports.config = {
    name: "lyrics",
    aliases: ["ly"]
}