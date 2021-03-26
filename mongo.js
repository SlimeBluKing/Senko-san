const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();
const mongoPath = (`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@senkodb.vhj2f.mongodb.net/test`)

module.exports = async () => {
    await mongoose.connect(mongoPath)
    return mongoose
}