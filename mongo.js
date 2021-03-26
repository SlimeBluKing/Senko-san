const mongoose = require('mongoose')
require('dotenv').config();
const { mongoPath } = (`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@senkodb.vhj2f.mongodb.net/test`)

module.exports = async () => {
    await mongoose.connect(mongoPath)
    return mongoose
}