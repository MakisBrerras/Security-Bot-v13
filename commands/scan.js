const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const config = require('../config.json');
const verifySchema = require('../schemas/verify');
const whitelistSchema = require('../schemas/whitelists')
const protectionSchema = require('../schemas/protection')
const client = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scan')
        .setDescription('Scanning server for protection'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `**No perms**`, ephemeral: true });

        const e = new MessageEmbed()
        .setColor(config.color)
        .setTimestamp()
        .setAuthor(`Server Details`)
        .setThumbnail(config.logo)

        let data1 = await verifySchema.findOne({ GuildId: interaction.guild.id });
        let data2 = await whitelistSchema.findOne({ GuildId: interaction.guild.id });
        let data3 = await protectionSchema.findOne({ GuildId: interaction.guild.id });

        if (!data1) e.addField('Verify System is not enabled', '```diff\n- Make sure you have verify enabled to avoid alt account. Enable it by using /verify-enable```');
        if (!data2) e.addField('Whitelist is not enabled', '```diff\n- Make sure you have whitelists enabled to avoid accidental bans. Enable it by using /whitelist-add```');
        if (!data3) e.addField('Protection Logs are not enabled', '```diff\n- Enable protection logs to avoid nukes, alt accounts and many more. Enable it by using /setup```');

        
        if (interaction.guild.verificationLevel === 'NONE') {
            e.addField('Verification Levels Not Set Up', '```diff\n! No verification levels have been set up for this server```');
        }
        
        const nsfwChannels = interaction.guild.channels.cache.filter(channel => channel.nsfw);
        if (nsfwChannels.size > 0) {
            e.addField('NSFW Channels Found', '```diff\n! We dont recommend nsfw channels in servers```');
        }
        
        
        await interaction.reply({ embeds: [e] });
    }
};