const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const util = require("../util/pagination");
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message
    const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) return sendError(language(guild, "ERROR_NOTPERM_QUEUE"), message.channel);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return sendError(language(guild, "NO_MUSIC"), message.channel);

        const que = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](${t.url}) - [<@${t.req.id}>]`);

        const chunked = util.chunk(que, 10).map((x) => x.join("\n"));

        const embed = new MessageEmbed()
            .setAuthor(language(guild, "QUEUE_TITLE"), "https://media.giphy.com/media/f2JmYpI53jxOT1tlbY/source.gif")
            .setThumbnail(message.guild.iconURL())
            .setColor("BLUE")
            .setDescription(chunked[0])
            .addField(language(guild, "PLAYING"), `[${queue.songs[0].title}](${queue.songs[0].url})`, true)
            .setFooter(`1/${chunked.length}.`);
        if (queue.songs.length === 1) embed.setDescription(language(guild, "NOT_NEXT"));

        try {
            const queueMsg = await message.channel.send(embed);
            if (chunked.length > 1) await util.pagination(queueMsg, message.author, chunked);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
}

module.exports.config = {
    name: "queue",
    aliases: ["q", "list", "songlist", "sl"]
}