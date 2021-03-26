const mongo = require('../mongo')
const languageSchema = require('../schemas/language-schema')
const { languages } = require('../lang.json')
const { setLanguage } = require('../language')

module.exports = {
  commands: ['setlang', 'setlanguage'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<Language>',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const { guild } = message

    const targetLanguage = arguments[0].toLowerCase()
    if (!languages.includes(targetLanguage)) {
      message.reply('That language is not supported.')
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
  },
}