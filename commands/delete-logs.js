const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const config = require('../config.json');
const protectionSchema = require('../schemas/protection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs-remove')
        .setDescription('Remove protection logs'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        let data = await protectionSchema.findOne({ GuildId: interaction.guild.id });
        if (data) { 

            const embed = new MessageEmbed()
            .setColor(config.color) 
            .setDescription(`**Τα protection logs αφαιρέθηκαν επιτυχώς**`)
            .setAuthor(`${interaction.user.username}`, `${interaction.user.displayAvatarURL()}`)

             interaction.reply({ embeds: [embed] });

            const antiLink = data.AntiLink;
            const antiAlt = data.AntiAlt;
            const antiSpam = data.AntiSpam;
            const antiNuke = data.AntiNuke;
            const membersA = data.MembersActivity;
            const cat = data.ParentId;
            
            const antiLinkC = await interaction.guild.channels.fetch(antiLink);
            const antiAltC = await interaction.guild.channels.fetch(antiAlt);
            const antiSpamC = await interaction.guild.channels.fetch(antiSpam);
            const antiNukeC = await interaction.guild.channels.fetch(antiNuke);
            const membersAC = await interaction.guild.channels.fetch(membersA);
            const catC = await interaction.guild.channels.fetch(cat);

            await antiLinkC.delete();
            await antiAltC.delete();
            await antiSpamC.delete();
            await antiNukeC.delete();
            await membersAC.delete();
            await catC.delete();

            await protectionSchema.deleteOne({ GuildId: interaction.guild.id });
        } else {
            return interaction.reply({ content: `**Τα protection logs δεν είναι σεταρισμένα**`, ephemeral: true });
        }
    }
};
