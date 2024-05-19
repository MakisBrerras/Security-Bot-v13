const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const whitelistSchema = require('../schemas/whitelists')
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-remove')
        .setDescription('Remove whitelist from a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to remove whitelist').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        const user = interaction.options.getUser('user')
        let data = await whitelistSchema.findOne({ GuildId: interaction.guild.id, UserId: user.id });
        if (data) {
            
            await whitelistSchema.deleteOne({
                GuildId: interaction.guild.id,
                UserId: user.id
            });

            const embed = new MessageEmbed()
            .setColor(config.color)
            .setAuthor(`${interaction.user.username}`,`${interaction.user.displayAvatarURL()}`)
            .setDescription(`**Αφαιρέθηκε whitelist στον/ην ${user} επιτυχώς**`)

            interaction.reply({ embeds: [embed] });
        } else {
            return interaction.reply({ content: `**Αυτός ο χρήστης δεν είναι whitelisted!**`, ephemeral: true });
        }
    }
};
