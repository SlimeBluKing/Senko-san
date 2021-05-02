const mongo = require('../mongo')
const languageSchema = require('../schemas/language-schema')
const { languages } = require('../lang.json')
const { setLanguage } = require('../language')
const language = require('../language')

module.exports.run = async (client, message, args) => {
    const { guild } = message

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(language(guild, "NOTPERM"))

    const targetLanguage = args[0].toLowerCase()
    if (!languages.includes(targetLanguage)) {
      message.reply('I don\'t support for now this language.')
      return
    }

    setLanguage(guild, targetLanguage)

    await mongo().then(async (mongoose) => {
      try {
        await languageSchema.findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            _id: guild.id,
            language: targetLanguage,
          },
          {
            upsert: true,
          }
        )

        message.reply('Language set!').then((message) => {
          const seconds = 3
          message.delete({
            timeout: 1000 * seconds,
          })
        })
      } finally {
        mongoose.connection.close()
      }
    })
}

module.exports.config = {
    name: "setlanguage",
    aliases: ["setlang"],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<Language>',
    permissions: 'ADMINISTRATOR'
}