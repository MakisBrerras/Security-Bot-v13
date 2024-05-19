const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const config = require('../config.json');
const verifySchema = require('../schemas/verify');
const client = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify-disable')
        .setDescription('Verify System'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `**No perms**`, ephemeral: true });
        let data = await verifySchema.findOne({ GuildId: interaction.guild.id });
        if (data) {
            const e = new MessageEmbed()
            .setDescription(`**Τo verify system έγινε disable**`)
            .setColor(config.color)
            .setAuthor(`${interaction.user.username}`,`${interaction.user.displayAvatarURL()}`)

            const c = await data.Logs;
            const cha = await interaction.guild.channels.cache.get(c);

            cha.delete();

            await interaction.reply({ embeds: [e] });
            await verifySchema.deleteOne({ GuildId: interaction.guild.id });

        } else {
            return await interaction.reply({ content: `**Το verify system δεν είναι enabled**`, ephemeral: true })    
        }
        


    }
};