const { play } = require("../util/playing");
const { Util, MessageEmbed } = require("discord.js");
const language = require('../language')
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const sendError = require("../util/error");
const scdl = require("soundcloud-downloader").default;

module.exports.run = async (client, message, args) => {
    const { guild } = message
    let channel = message.member.voice.channel;
        if (!channel) return sendError(language(guild, 'ERROR_PLAY'), message.channel);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError(language(guild, 'ERROR_NOTPERM_CONNECT'), message.channel);
        if (!permissions.has("SPEAK")) return sendError(language(guild, 'ERROR_NOTPERM_SPEAK'), message.channel);

        var searchString = args.join(" ");
        if (!searchString) return sendError(language(guild, 'BLANK_PLAY'), message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var serverQueue = message.client.queue.get(message.guild.id);

        let songInfo;
        let song;
        if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            try {
                songInfo = await ytdl.getInfo(url);
                if (!songInfo) return sendError(language(guild, 'ERROR_YT'), message.channel);
                song = {
                    id: songInfo.videoDetails.videoId,
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    ago: songInfo.videoDetails.publishDate,
                    views: String(songInfo.videoDetails.viewCount).padStart(10, " "),
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else if (url.match(/^https?:\/\/(soundcloud\.com)\/(.*)$/gi)) {
            try {
                return // not support for now
                songInfo = await scdl.getInfo(url);
                if (!songInfo) return sendError(language(guild, 'ERROR_SC'), message.channel);
                song = {
                    id: songInfo.permalink,
                    title: songInfo.title,
                    url: songInfo.permalink_url,
                    img: songInfo.artwork_url,
                    ago: songInfo.last_modified,
                    views: String(songInfo.playback_count).padStart(10, " "),
                    duration: Math.ceil(songInfo.duration / 1000),
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return sendError(error.message, message.channel).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);
                if (searched.videos.length === 0) return sendError(language(guild, 'ERROR_YT'), message.channel);

                songInfo = searched.videos[0];
                song = {
                    id: songInfo.videoId,
                    title: Util.escapeMarkdown(songInfo.title),
                    views: String(songInfo.views).padStart(10, " "),
                    url: songInfo.url,
                    ago: songInfo.ago,
                    duration: songInfo.duration.toString(),
                    img: songInfo.image,
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            let thing = new MessageEmbed()
                .attachFiles('./assets/Music.gif')
                .setAuthor(language(guild, 'ADD_QUEUE'), 'attachment://Music.gif')
                .setThumbnail(song.img)
                .setColor("YELLOW")
                .addField(language(guild, 'QUEUE_NAME'), song.title, true)
                .addField(language(guild, 'QUEUE_DURATION'), song.duration, true)
                .addField(language(guild, 'QUEUE_REQUEST'), song.req.tag, true)
                .setFooter(`${language(guild, 'QUEUE_VIEWS')}: ${song.views} | ${song.ago}`);
            return message.channel.send(thing);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 80,
            playing: true,
            loop: false,
        };
        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(`${language(guild, "ERROR_NOTENTRY")}: ${error}`, message.channel);
        }
}

module.exports.config = {
    name: "play",
    aliases: ["p"]
}