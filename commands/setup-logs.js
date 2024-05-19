const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const config = require('../config.json');
const protectionSchema = require('../schemas/protection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup protection logs'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        let data = await protectionSchema.findOne({ GuildId: interaction.guild.id });
        if (data) {
            return interaction.reply({ content: `**Τα protection logs είναι ήδη σεταρισμένα**`, ephemeral: true });
        } else {
            const embed = new MessageEmbed()
            .setColor(config.color) 
            .setDescription(`**Τα protection logs δημιουργήθηκαν επιτυχώς**`)
            .setAuthor(`${interaction.user.username}`, `${interaction.user.displayAvatarURL()}`)

            await interaction.reply({ embeds: [embed] });
            
            const cat = await interaction.guild.channels.create('Protection Logs By Proallaegy', {
                type: 'GUILD_CATEGORY',
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            });

            const antiLinkC = await interaction.guild.channels.create('💻anti-link', {
                parent: cat,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            })
            const antiAltC = await interaction.guild.channels.create('💻anti-alt', {
                parent: cat,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            })
            const antiSpamC = await interaction.guild.channels.create('💻anti-spam', {
                parent: cat,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            })
            const antiNukeC = await interaction.guild.channels.create('💻anti-nuke', {
                parent: cat,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            })
            const membersActivityC = await interaction.guild.channels.create('💻members-activity', {
                parent: cat,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'] 
                    }
                ]
            })

            data = new protectionSchema({
                GuildId: interaction.guild.id,
                AntiLink: antiLinkC.id,
                AntiAlt: antiAltC.id,
                AntiSpam: antiSpamC.id,
                AntiNuke: antiNukeC.id,
                MembersActivity: membersActivityC.id,
                ParentId: cat.id
            });

            await data.save();
        }
    }
};
