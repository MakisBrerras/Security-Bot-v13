const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js')
const config = require('../config.json');
const client = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('punish')
        .setDescription('Punish a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to punish').setRequired(true)),
        async execute (interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `**No perms**`, ephemeral: true });
        const user = interaction.options.getUser('user')
        const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId('punishSelect')
        .setPlaceholder('Select')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
            {
                label: 'Kick',
                value: 'kick',
                emoji: '❌'
            },
            {
                label: 'Ban',
                value: 'ban',
                emoji: '‼️'
            }
        ])
       )

       await interaction.reply({ components: [row], content: `**${interaction.user.username} select punishment for ${user}**`});
    }
};

client.on('interactionCreate', async p => {
    const proallaegyO = p.values && p.values.length > 0 ? p.values[0] : null;
    if (proallaegyO === 'kick') {
        const user = p.message.mentions.users.first();    
        const member = await p.guild.members.fetch({ user });
        try {
            await member.kick();
            await p.update({ content: `**Ο/Η ${user.tag} έγινε kicked**`, components: [] });
        } catch (error) {
            console.error('Failed to kick the user:', error);
            await p.update({ content: 'Failed to kick' });
        }
    }
    if (proallaegyO === 'ban') {
        const user = p.message.mentions.users.first();    
        const member = await p.guild.members.fetch({ user });
        try {
            await member.ban();
            await p.update({ content: `**O/H ${user.tag} έγινε banned**`, components: [] });
        } catch (error) {
            console.error('Failed to kick the user:', error);
            await p.update({ content: 'Failed to ban' });
        }
    }
    
})
