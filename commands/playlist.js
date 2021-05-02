const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
var ytpl = require("ytpl");
const sendError = require("../util/error");
const { play } = require("../util/playing");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const channel = message.member.voice.channel;
    if (!channel) return sendError(language(guild, 'NO_VOICE'), message.channel);
    const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    var searchString = args.join(" ");
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return sendError(language(guild, 'ERROR_NOTPERM_CONNECT'), message.channel);
    if (!permissions.has("SPEAK")) return sendError(language(guild, 'ERROR_NOTPERM_SPEAK'), message.channel);

    if (!searchString || !url) return;
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        try {
            const playlist = await ytpl(url.split("list=")[1]);
            if (!playlist) return sendError(language(guild, 'NO_PLAYLIST'), message.channel);
            const videos = await playlist.items;
            for (const video of videos) {
                // eslint-disable-line no-await-in-loop
                await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send({
                embed: {
                    color: "BLUE",
                    description: `✅  **|**  Playlist: **\`${videos[0].title}\`** ${language(guild, "PLAYLIST_ADD_QUEUE")}`,
                },
            });
        } catch (error) {
            console.error(error);
            return sendError(language(guild, 'NO_PLAYLIST'), message.channel).catch(console.error);
        }
    } else {
        try {
            var searched = await yts.search(searchString);

            if (searched.playlists.length === 0) return sendError(language(guild, 'ERROR_PLAYLIST_YT'), message.channel);
            var songInfo = searched.playlists[0];
            let listurl = songInfo.listId;
            const playlist = await ytpl(listurl);
            const videos = await playlist.items;
            for (const video of videos) {
                // eslint-disable-line no-await-in-loop
                await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
            }
            let thing = new MessageEmbed()
                .attachFiles('./assets/Music.gif')
                .setAuthor(language(guild, "PLAYLIST_ADD_QUEUE2"), 'attachment://Music.gif')
                .setThumbnail(songInfo.thumbnail)
                .setColor("GREEN")
                .setDescription(`✅  **|**  Playlist: **\`${songInfo.title}\`** ${language(guild, "HAS_BEEN_ADDED")} \`${songInfo.videoCount}\` ${language(guild, "VIDEO_TO_QUEUE")}`);
            return message.channel.send(thing);
        } catch (error) {
            return sendError("An unexpected error has occurred", message.channel).catch(console.error);
        }
    }

    async function handleVideo(video, message, channel, playlist = false) {
        const serverQueue = message.client.queue.get(message.guild.id);
        const song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            views: video.views ? video.views : "-",
            ago: video.ago ? video.ago : "-",
            duration: video.duration,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            img: video.thumbnail,
            req: message.author,
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: channel,
                connection: null,
                songs: [],
                volume: 80,
                playing: true,
                loop: false,
            };
            message.client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            try {
                var connection = await channel.join();
                queueConstruct.connection = connection;
                play(queueConstruct.songs[0], message);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                message.client.queue.delete(message.guild.id);
                return sendError(`${language(guild, "ERROR_PLAY")}: ${error}`, message.channel);
            }
        } else {
            serverQueue.songs.push(song);
            if (playlist) return;
            let thing = new MessageEmbed()
                .setAuthor(language(guild, "ADD_QUEUE"), "https://media.giphy.com/media/f2JmYpI53jxOT1tlbY/source.gif")
                .setThumbnail(song.img)
                .setColor("YELLOW")
                .addField(language(guild, 'QUEUE_NAME'), song.title, true)
                .addField(language(guild, 'QUEUE_DURATION'), song.duration, true)
                .addField(language(guild, 'QUEUE_REQUEST'), song.req.tag, true)
                .setFooter(`${language(guild, 'QUEUE_VIEWS')}: ${song.views} | ${song.ago}`);
            return message.channel.send(thing);
        }
        return;
    }
}

module.exports.config = {
    name: "playlist",
    aliases: ["pl"]
}