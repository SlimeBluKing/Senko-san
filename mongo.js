const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();
const mongoPath = (`mongodb://localhost:27017/senkodata`)

module.exports = async () => {
    await mongoose.connect(mongoPath, { useNewUrlParser: true, useUnifiedTopology: true })
    return mongoose
}