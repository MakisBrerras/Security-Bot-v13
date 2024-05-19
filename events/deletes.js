const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const protectionSchema = require('../schemas/protection');
const whitelistSchema = require('../schemas/whitelists');
const config = require('../config.json');
const client = require('../index');

async function kickWhitelist(g) {
    const user = await g.message.mentions.users.first();
    const member = await g.guild.members.fetch(user.id);

    const btn = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('proallaegyKick').setLabel('Kick').setStyle('SECONDARY').setEmoji('🦵').setDisabled(true)
    )
    
    g.update({ components: [btn], content: `` });
    await member.kick(); 
}

async function kick(g, user) {
    const member = await g.guild.members.fetch(user.id);
    await member.kick(); 
}

async function sendLog(g,d, e,usr) {
    const channel = await g.guild.channels.cache.get(d.MembersActivity);
    await channel.send({ embeds: [e] });
}

async function sendLog2(g,d, e,b, usr) {
    const channel = await g.guild.channels.cache.get(d.MembersActivity);
    await channel.send({ embeds: [e], components: [b], content: `${usr}` });
}

client.on('channelDelete', async channel => {
    const logs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' });
    const entry = logs.entries.first()
    if (!entry) return;
    const { executor } = entry;
    let protectionData = await protectionSchema.findOne({ GuildId: channel.guild.id });
    if (!protectionData) return;
    let data = await whitelistSchema.findOne({ GuildId: channel.guild.id, UserId: executor.id });
    let isW;
    data ? isW = '✅' : isW = '❌'

    const embed = new MessageEmbed()
    .setColor(config.color)
    .setDescription(`**User: ${executor}\nReason: \`Deletes channels\`\nWhitelisted: ${isW}**`)
    .setThumbnail(executor.displayAvatarURL())

    if (!data) {
        kick(channel, executor)
        return sendLog(channel,protectionData,embed);
    }

    const btn = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('proallaegyKick').setLabel('Kick').setStyle('SECONDARY').setEmoji('🦵')
    )
    
    sendLog2(channel,protectionData,embed,btn,executor);

});

client.on('roleDelete', async role => {
    const logs = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE', limit: 1 });
    const entry = logs.entries.first()
    if (!entry) return;
    const { executor } = entry;
    let protectionData = await protectionSchema.findOne({ GuildId: role.guild.id });
    if (!protectionData) return;
    let data = await whitelistSchema.findOne({ GuildId: role.guild.id, UserId: executor.id });
    let isW;
    data ? isW = '✅' : isW = '❌'

    const embed = new MessageEmbed()
    .setColor(config.color)
    .setDescription(`**User: ${executor}\nReason: \`Deletes roles\`\nWhitelisted: ${isW}**`)
    .setThumbnail(executor.displayAvatarURL())

    if (!data) {
        kick(role, executor)
        return sendLog(role,protectionData,embed);
    }
    
    const btn = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('proallaegyKick').setLabel('Kick').setStyle('SECONDARY').setEmoji('🦵')
    )

    sendLog2(role,protectionData,embed,btn,executor);
    

})

client.on('guildBanRemove', async p => {
    const logs = await p.guild.fetchAuditLogs({ type: 'BAN_REMOVE', limit: 1 });
    const entry = logs.entries.first()
    if (!entry) return;
    const { executor } = entry;
    let protectionData = await protectionSchema.findOne({ GuildId: p.guild.id });
    if (!protectionData) return;
    let data = await whitelistSchema.findOne({ GuildId: p.guild.id, UserId: executor.id });
    let isW;
    data ? isW = '✅' : isW = '❌'

    const embed = new MessageEmbed()
    .setColor(config.color)
    .setDescription(`**User: ${executor}\nReason: \`Unbans members\`\nWhitelisted: ${isW}**`)
    .setThumbnail(executor.displayAvatarURL())

    if (!data) {
        kick(p, executor)
        return sendLog(p,protectionData,embed);
    }

    const btn = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('proallaegyKick').setLabel('Kick').setStyle('SECONDARY').setEmoji('🦵')
    )

    sendLog2(p,protectionData,embed,btn,executor);

})

/* */
client.on('interactionCreate', async p => {
    if (p.customId === 'proallaegyKick') {
        await kickWhitelist(p)
    }
})