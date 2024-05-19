const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const whitelistSchema = require('../schemas/whitelists')
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-add')
        .setDescription('Add whitelist to a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to add whitelist').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        const user = interaction.options.getUser('user')
        let data = await whitelistSchema.findOne({ GuildId: interaction.guild.id, UserId: user.id });
        if (data) {
            return interaction.reply({ content: `**Αυτός ο χρήστης είναι ήδη whitelisted!**`, ephemeral: true });
        } else {
            data = new whitelistSchema({
                GuildId: interaction.guild.id,
                UserId: user.id
            });

            const embed = new MessageEmbed()
            .setColor(config.color)
            .setAuthor(`${interaction.user.username}`,`${interaction.user.displayAvatarURL()}`)
            .setDescription(`**Προστέθηκε whitelist στον/ην ${user} επιτυχώς**`)

            await data.save();
            interaction.reply({ embeds: [embed] });
            
        }
    }
};
