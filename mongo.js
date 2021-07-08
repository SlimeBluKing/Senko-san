const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();
//const mongoPath = (`mongodb://localhost:27017/senkodata`)
const mongoPath = (`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@senkodb.vhj2f.mongodb.net/senkodata`)

module.exports = async () => {
    await mongoose.connect(mongoPath, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    return mongoose
}