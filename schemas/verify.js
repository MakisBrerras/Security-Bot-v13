const { model, Schema } = require('mongoose');

const verifySchema = new Schema({
    GuildId: String,
    VerifyChannel: String,
    VerifyRole: String,
    Logs: String,
})

module.exports = model('verifySchema', verifySchema);