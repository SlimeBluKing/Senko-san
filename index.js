const Discord = require('discord.js');
require('dotenv').config();
const { executionAsyncResource } = require('async_hooks');
const fs = require('fs')
const mongo = require('./mongo');
const { lookup, CONNREFUSED } = require('dns');
const { waitForDebugger } = require('inspector');
const redditFetch = require('reddit-fetch');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (e, f) => {
    if(e) return console.error(e);
    f.forEach(file => {
        if(!file.endsWith(".js")) return
        console.log(`${file} caricato`)
        let cmd = require(`./commands/${file}`);
        let cmdName = cmd.config.name;
        client.commands.set(cmdName, cmd)
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
        })
    })
})
const queue = new Map();
const prefix = process.env.prefix;
const DisTube = require('distube');
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true, highWaterMark: 1 <<25})
const filters = ["3d","bassboost","echo","karaoke","nightcore","vaporwave","flanger"];
 
client.on("ready", async () => {
    console.log("ヾ(•ω•`)oSono qua senpai!ヾ(•ω•`)o")
    client.user.setActivity("con il mio senpai | !?help")
    await mongo().then(mongoose => {
        try{
            console.log('Mi sono connessa a MongoDB senpai q(≧▽≦q)')
        }finally {
            mongoose.connection.close()
        }
    })
})

//commands handler
client.on("message", async(message) => {
    if(!message.content.startsWith(prefix)) return

    if (!message.guild) {
        return
    }

    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return

    try{
        cmd.run(client, message, args);
    }catch (err){
        return console.error(err)
    }
})

//distube-musica
client.on("message", message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return
    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "ping"){
        return embedbuilder(client, message, `sBLUE`, `PING:`, `\`${client.ws.ping} ms\``)
    }
    if(command === "play" || command === "p"){
        embedbuilder(client, message, "YELLOW", "Sto cercando...", args.join(" "))
        return distube.play(message, args.join(" "));
    }
    if(command === "skip" || command === "s"){
        embedbuilder(client, message, "YELLOW", "Skippata!", `Ho skippato il brano senpai`)
        return distube.skip(message);
    } 
    if(command === "stop" || command === "leave"){
        embedbuilder(client, message, "RED", "Stop", `Ok senpai.`)
        return distube.stop(message);
    }
    if(command === "seek"){
        embedbuilder(client, message, "GREEN", "In avanti", `Ho portato avanti il brano di \`${args[0]} secondi\` senpai`)
        return distube.seek(message, Number(args[0]*1000));
    } 
    if(filters.includes(command)) {
        let filter = distube.setFilter(message, command);
        return embedbuilder(client, message, "YELLOW", "Filtri", filter)
    }
    if(command === "volume" || command === "vol"){
        
        embedbuilder(client, message, "GREEN", "Volume", `Volume cambiato a \`${args[0]} %\` senpai`)
        return distube.setVolume(message, args[0]);
    } 
    if (command === "queue" || command === "qu"){
        let queue = distube.getQueue(message);
        let curqueue = queue.songs.map((song, id) =>
        `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).join("\n");
        return  embedbuilder(client, message, "GREEN", "Ecco la coda senpai", curqueue)
    }
    if (command === "loop" || command === "repeat"){
        if(0 <= Number(args[0]) && Number(args[0]) <= 2){
            distube.setRepeatMode(message,parseInt(args[0]))
            embedbuilder(client, message, "GREEN", "Ho impostato il loop a:", `${args[0].replace("0", "OFF").replace("1", "Ripeto il brano").replace("2", "Ripeto la coda")}`)
        }
        else{
            embedbuilder(client, message, "RED", "Hey!", `Scegli un numero tra **0**-**2** senpai   |   *(0: Off , 1: Ripeto il brano, 2: Ripeto la coda)*`)
        }
    }
    if ( command === "jump"){
        let queue = distube.getQueue(message);
        if(0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length){
            embedbuilder(client, message, "GREEN", "Saltato", `Saltato al brano ${parseInt(args[0])} senpai`)
            return distube.jump(message, parseInt(args[0]))
        }
        else{
            embedbuilder(client, message, "RED", "Hey!", `Scegli un numero tra **0**-**${DisTube.getQueue(message).length}** senpai  |   *(0: Off, 1: Ripeto il brano, 2: Ripeto la coda)*`)
        }
    }
    if (command == "autoplay") {
        let mode = distube.toggleAutoplay(message);
        message.channel.send("Ok senpai. Ho messo l'autoplay a `" + (mode ? "On" : "Off") + "`");
    }

})

const status = (queue) => `Volume: \`${queue.volume}\` | Filtro: \`${queue.filter || "OFF"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "Intera coda" : "Questa canzone" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``

distube
    .on("playSong", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Riproducendo", `Brano: \`${song.name}\`  -  \`${song.formattedDuration}\` \n\nRichiesto da: ${song.user}\n${status(queue)}`)
    })
    .on("addSong", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Ho aggiunto il brano senpai!", `Song: \`${song.name}\`  -  \`${song.formattedDuration}\` \n\nRichiesto da: ${song.user}`)
    })
    .on("playList", (message, queue, playlist, song) => {
        embedbuilder(client, message, "GREEN", "Riproducendo una playlist", `Playlist: \`${playlist.title}\`  -  \`${playlist.total_items}\` \n\nRichiesto da: ${song.user}\n\nInizio da: \`${song.name}\`  -  \`${song.formattedDuration}\`\n${status(queue)}`)
    })
    .on("addList", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Playlist aggiunta", `Playlist: \`${playlist.title}\`  -  \`${playlist.total_items}\` \n\nRichiesto da: ${song.user}`)
    })
    .on("searchResult", (message, result) => {
        let i = 0;
        embedbuilder(client, message, "YELLOW", "", `**Scegli uno tra questi...**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Inserisci qualcos'altro o attendi 60 secondi per annullare*`)
    })
    .on("searchCancel", (message) =>  embedbuilder(client, message, "RED", `Ricerca annullata`, "")
    )
    .on("error", (message, err) => embedbuilder(client, message, "RED", "Errore:", err)
    )

function embedbuilder(client, message, color, title, description){
    let embed = new Discord.MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);
    return message.channel.send(embed);
}

client.login(process.env.token)