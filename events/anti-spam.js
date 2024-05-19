const { Collection, MessageEmbed } = require('discord.js');
const protectionSchema = require('../schemas/protection');
const whitelistSchema = require('../schemas/whitelists');
const config = require('../config.json');
const client = require('../index');

const messageCounts = new Collection();
const spamDetectionThreshold = 10;
const spamDetectionPeriod = 60000; 

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const now = Date.now();
    const userId = message.author.id;

    const userMessageCount = messageCounts.get(userId) || 0;
    messageCounts.set(userId, userMessageCount + 1);

    if (userMessageCount >= spamDetectionThreshold) {
        const timeDifference = now - messageCounts.get(userId + 'timestamp');
        if (timeDifference < spamDetectionPeriod) {
            let data = await protectionSchema.findOne({ GuildId: message.guild.id });
            if (!data) return;
            let data2 = await whitelistSchema.findOne({ GuildId: message.guild.id, UserId: message.author.id });
            if (data2) return;

            const channelId = data.AntiSpam;
            const channel = await message.guild.channels.fetch(channelId)
            const usr = message.guild.members.cache.get(message.author.id);
            await usr.timeout(10800000)

            const userMessages = await message.channel.messages.fetch({ limit: 100 });
            const spamUserMessages = userMessages.filter(msg => msg.author.id === userId && now - msg.createdTimestamp <= spamDetectionPeriod);

            const embed = new MessageEmbed()
            .setColor(config.color)
            .setDescription(`**User: ${message.author}\nMessages Sent: \`${spamUserMessages.size}\`**`)
            .setTitle(`Anti-Spam Detector`)
            .setThumbnail(`${message.author.displayAvatarURL()}`)
            .setTimestamp()

            await channel.send({ embeds: [embed] });

            try {
                await Promise.all(spamUserMessages.map(msg => msg.delete()));
            } catch (error) {
                console.error('Failed to delete spam user messages:', error);
            }
        } else {
            messageCounts.set(userId, 1);
            messageCounts.set(userId + 'timestamp', now);
        }
    } else {
        messageCounts.set(userId + 'timestamp', now);
    }
});
