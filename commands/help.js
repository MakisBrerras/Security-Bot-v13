const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('See the bot\'s commands'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        const embed = new MessageEmbed()
        .setColor(config.color)
        .setDescription(`**/setup -> Setups protection logs\n/logs-remove -> deletes protection logs\n\n/whitelist-add -> add a user to whitelist\n/whitelist-remove -> removes a user from whitelist\n/whitelisted -> displays whitelisted users\n\n/punish -> punish menu\n/scan -> scans server**`)
        .setTitle(`Help | ${config.name}`)

        await interaction.reply({ embeds: [embed] });
    }
};
