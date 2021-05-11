const Discord = require('discord.js');
require('dotenv').config();
const { loadLanguages } = require('./language')
const { languages } = require('./lang.json')
const { executionAsyncResource } = require('async_hooks');
const fs = require('fs')
const mongo = require('./mongo');
const { lookup, CONNREFUSED } = require('dns');
const { waitForDebugger } = require('inspector');
const redditFetch = require('reddit-fetch');
const client = new Discord.Client();
client.config = {
    prefix: process.env.prefix,
    SOUNDCLOUD: process.env.SOUNDCLOUD_CLIENT_ID
}
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
const language = require('./language')
const prefix = process.env.prefix;
client.queue = new Map()
 
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
    loadLanguages(client)
})

//commands handler
client.on("message", async(message) => {
    if(!message.content.startsWith(prefix)) return

    if (!message.guild) {
        return
    }

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

client.login(process.env.token)