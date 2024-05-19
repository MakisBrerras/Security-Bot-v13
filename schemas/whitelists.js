const { model, Schema } = require('mongoose')

const whitelistSchema = new Schema({
    GuildId: String,
    UserId: String
})

module.exports = model('whitelistSchema', whitelistSchema);