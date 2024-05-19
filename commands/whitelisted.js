const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const whitelistSchema = require('../schemas/whitelists');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelisted')
        .setDescription('See the whitelisted users'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        const data = await whitelistSchema.find({ GuildId: interaction.guild.id });
        if (data.length === 0) {
            return interaction.reply({ content: `**Κανένας δεν είναι whitelisted**`, ephemeral: true });
        }

        let index = 1;
        let descriptions = []
        data.forEach(doc => {
            const userId = doc.UserId;
            const user = `<@${userId}>`;
            descriptions.push(`${index}. ${user} | ✅`);
            index++;
        });

        const embed = new MessageEmbed()
        .setThumbnail(config.logo)
        .setColor(config.color)
        .setDescription(descriptions.join('\n'));
        
        interaction.reply({ embeds: [embed] });
    }
};
