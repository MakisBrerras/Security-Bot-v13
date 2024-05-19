const client = require('../index');
const protectionSchema = require('../schemas/protection');
const whitelistSchema = require('../schemas/whitelists');
const config = require('../config.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

client.on('messageCreate', async message => {
    if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg')) {
        let data = await protectionSchema.findOne({ GuildId: message.guild.id });
        let data2 = await whitelistSchema.findOne({ GuildId: message.guild.id, UserId: message.author.id });
        if (!data) return;
        if (message.member.permissions.has('ADMINISTRATOR')) return;
        if (data2) return;

        const channel = await message.guild.channels.fetch(data.AntiLink);
        await message.delete();
        const embed = new MessageEmbed()
        .setColor(config.color)
        .setTitle('Anti-Link Detector')
        .setThumbnail(`${message.author.displayAvatarURL()}`)
        .setDescription(`**User: ${message.author}\n Message: \`${message.content}\`\nChannel: ${message.channel}**`)

        const btn = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('timeoutA').setStyle('DANGER').setLabel('Timeout')
        )

        await channel.send({ embeds: [embed], components: [btn], content: `${message.author}` });

    }
})

client.on('interactionCreate', async p => {
    if (p.customId === 'timeoutA') {

        const btn = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('timeoutA').setStyle('DANGER').setLabel('Timeout').setDisabled(true)
        )

        const user = p.message.mentions.users.first();
        const user2 = await p.guild.members.cache.get(user.id);
        const time = 10800000;

        await user2.timeout(time)
        p.update({ components: [btn] });
    }
})