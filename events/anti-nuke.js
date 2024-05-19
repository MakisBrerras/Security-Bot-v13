const { Collection, MessageEmbed } = require('discord.js');
const protectionSchema = require('../schemas/protection');
const config = require('../config.json');
const client = require('../index');

const deletionCounts = new Collection();
const deletionThreshold = 5;
const deletionPeriod = 30000; // 30 seconds in milliseconds

client.on('channelDelete', async channel => {
    const logs = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_DELETE',
    });

    const entry = logs.entries.first();
    if (!entry) return;

    const executor = entry.executor;

    const now = Date.now();
    const userId = executor.id;

    const userDeletionCount = deletionCounts.get(userId) || 0;

    deletionCounts.set(userId, userDeletionCount + 1);

    if (userDeletionCount >= deletionThreshold) {
        const timeDifference = now - deletionCounts.get(userId + 'timestamp');

        if (timeDifference < deletionPeriod) {
            let data = await protectionSchema.findOne({ GuildId: channel.guild.id });
            if (!data) return;

            const channelId = data.AntiNuke;
            const channelLog = await channel.guild.channels.fetch(channelId);

            const exec = await channel.guild.members.fetch(executor.id)
            exec.kick()
            const embed = new MessageEmbed()
            .setTitle('Anti-Nuke Detector')
            .setDescription(`**User: ${executor} tried to nuke the server | Kicked Automatically**`)
            .setThumbnail(`${executor.displayAvatarURL()}`)
            .setColor(config.color)

            await channelLog.send({ embeds: [embed] });
        } else {
            // Reset the deletion count if the time difference exceeds the deletion period
            deletionCounts.set(userId, 1);
            deletionCounts.set(userId + 'timestamp', now);
        }
    } else {
        // Set the timestamp for the first deletion
        deletionCounts.set(userId + 'timestamp', now);
    }
});
