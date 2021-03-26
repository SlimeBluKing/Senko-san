const mongoose = require('mongoose')
require('dotenv').config();
const { mongoPath } = process.env.mdb

module.exports = async () => {
    await mongoose.connect(mongoPath)
    return mongoose
}