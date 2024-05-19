const { Collection, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const protectionSchema = require('../schemas/protection');
const whitelistSchema = require('../schemas/whitelists');
const config = require('../config.json');
const client = require('../index');

client.on('guildMemberAdd', async member => {
    if (Date.now() - member.user.createdAt < 604800000) { // 1 Week 
        let data = await protectionSchema.findOne({ GuildId: member.guild.id });
        if (!data) return;
        const logs = member.guild.channels.cache.get(data.AntiAlt);

        const embed = new MessageEmbed()
        .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .addFields(
            {name: "**User**", value: `${member}`, inline: true},
            {name: "**User Id**", value: `\`\`${member.id}\`\``, inline: true},
            {name: "**Register**", value: `**<t:${Math.round(member.user.createdAt.getTime() / 1000)}:R>**`, inline: true}
            )
          .setTitle("**Anti Alt**")
          .setColor("RED")
          .setTimestamp();

          const koumpi = new MessageButton()
          .setEmoji("🦵")
          .setStyle("DANGER")
          .setLabel("Kick")
          .setCustomId("kick_alt")
      const row = new MessageActionRow().addComponents(koumpi)

          logs.send({embeds: [embed],components: [row], content: `${member}` });
      } else {
        console.log('test')
      }
})

client.on('interactionCreate', async p => {
    if (p.customId === 'kick_alt') {
        const user = p.message.mentions.users.first();
        const userToKick = await p.guild.members.fetch(user.id);

        await userToKick.kick(`Alt Account`)
        
        const koumpi = new MessageButton()
          .setEmoji("🦵")
          .setStyle("DANGER")
          .setLabel("Kick")
          .setDisabled(true)
          .setCustomId("kick_alt")
      const row = new MessageActionRow().addComponents(koumpi)

      await p.update({ components: [row], content: `**${user} | Kicked By ${p.user}**` });
      try {
        userToKick.send({content: `**Έγινες kick από τον ${p.guild.name}, επειδή είσαι Alt λογαριασμός.**`})
      } catch(err) {
        return console.log(`Error sending the message to user: ${err}`);
      }
    }
})