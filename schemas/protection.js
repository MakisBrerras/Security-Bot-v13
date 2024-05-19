const { model, Schema } = require('mongoose');

const protectionSchema = new Schema({
    GuildId: String,
    ParentId: String,
    AntiLink: String,
    AntiAlt: String,
    AntiSpam: String,
    AntiNuke: String,
    MembersActivity: String
});

module.exports = model('protectionSchema', protectionSchema);