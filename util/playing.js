const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("discord-ytdl-core");
const sendError = require("../util/error");
const scdl = require("soundcloud-downloader").default;
const language = require('../language')

module.exports = {
    async play(song, message) {
        const { guild } = message
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            message.guild.me.voice.channel.leave();
            message.client.queue.delete(message.guild.id);
            return;
        }
        let stream;
        let streamType;

        try {
            if (song.url.includes("soundcloud.com")) {
                try {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, client.config.SOUNDCLOUD);
                } catch (error) {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, client.config.SOUNDCLOUD);
                    streamType = "unknown";
                }
            } else if (song.url.includes("youtube.com")) {
                stream = await ytdlDiscord(song.url, { filter: "audioonly", quality: "highestaudio", highWaterMark: 1 << 25, opusEncoded: true });
                streamType = "opus";
                stream.on("error", function (er) {
                    if (er) {
                        if (queue) {
                            module.exports.play(queue.songs[0], message);
                            return sendError(`An unexpected error has occurred.\nPossible type \`${er}\``, message.channel);
                        }
                    }
                });
            }
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }
        }

        queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

        const dispatcher = queue.connection
            .play(stream, { type: streamType })
            .on("finish", () => {
                const shiffed = queue.songs.shift();
                if (queue.loop === true) {
                    queue.songs.push(shiffed);
                }
                module.exports.play(queue.songs[0], message);
            })
            .on("error", (err) => {
                console.error(err);
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            });

        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        let thing = new MessageEmbed()
            .setAuthor(language(guild, "PLAYING"), "https://media.giphy.com/media/f2JmYpI53jxOT1tlbY/source.gif")
            .setThumbnail(song.img)
            .setColor("BLUE")
            .addField(language(guild, 'QUEUE_NAME'), song.title, true)
            .addField(language(guild, 'QUEUE_DURATION'), song.duration, true)
            .addField(language(guild, 'QUEUE_REQUEST'), song.req.tag, true)
            .setFooter(`${language(guild, 'QUEUE_VIEWS')}: ${song.views} | ${song.ago}`);
        queue.textChannel.send(thing);
    },
};