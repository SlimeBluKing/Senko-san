const mongoose = require('mongoose')
const { mongoPath } = process.env.mdb

module.exports = async () => {
    await mongoose.connect(mongoPath)
    return mongoose
}