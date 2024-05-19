const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageAttachment,
} = require("discord.js");
const config = require("../config.json");
const verifySchema = require("../schemas/verify");
const client = require("../index");
const protectionSchema = require("../schemas/protection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify-enable")
        .setDescription("Verify System")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Verify system channel")
                .setRequired(true),
        )
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("Verify system role")
                .setRequired(true),
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({
                content: `**No perms**`,
                ephemeral: true,
            });
        let data = await verifySchema.findOne({
            GuildId: interaction.guild.id,
        });
        let data2 = await protectionSchema.findOne({
            GuildId: interaction.guild.id,
        });
        if (!data2) return;
        if (data) {
            return await interaction.reply({
                content: `**Το verify sytem είναι ήδη σεταρισμένο!**`,
                ephemeral: true,
            });
        } else {
            const channel = interaction.options.getChannel("channel");
            if (!channel.isText())
                return await interaction.reply({
                    content: `**Βάλε μόνο text channels**`,
                    ephemeral: true,
                });
            const role = interaction.options.getRole("role");

            const e = new MessageEmbed()
                .setDescription(`**Τo verify system έγινε enable**`)
                .setColor(config.color)
                .setAuthor(
                    `${interaction.user.username}`,
                    `${interaction.user.displayAvatarURL()}`,
                );

            const e2 = new MessageEmbed()
                .setColor(config.color)
                .setThumbnail(config.logo)
                .setDescription(
                    `**Για να γίνετε verified στον server πατήστε το κουμπί και ολοκληρώστε το verification**`,
                );

            const c = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("verifyB")
                    .setLabel("Verify")
                    .setStyle("SECONDARY"),
            );

            const cha = await interaction.guild.channels.create(`💻verify`, {
                parent: data2.ParentId,
            });

            await interaction.reply({ embeds: [e] });
            await channel.send({ embeds: [e2], components: [c] });

            data = new verifySchema({
                GuildId: interaction.guild.id,
                VerifyChannel: channel.id,
                VerifyRole: role.id,
                Logs: cha.id,
            });

            await data.save();
        }
    },
};

client.on("interactionCreate", async (p) => {
    if (p.customId == "verifyB") {
        let data = await verifySchema.findOne({ GuildId: p.guild.id });
        if (data) {
            await p.update({});
            try {
                const captcha = new Captcha();
                captcha.async = true;
                captcha.addDecoy();
                captcha.drawTrace();
                captcha.drawCaptcha();

                const a = new MessageAttachment(
                    await captcha.png,
                    "captcha.png",
                );

                const embed = new MessageEmbed()
                    .setColor(config.color)
                    .setImage("attachment://captcha.png")
                    .setFooter({ text: `Verify Yourself` });

                const msg = await p.user.send({ embeds: [embed], files: [a] });
                const roleId = data.VerifyRole;
                const role = await p.guild.roles.cache.get(roleId);
                const log = await p.guild.channels.cache.get(data.Logs);

                const em = new MessageEmbed()
                    .setTitle(`Verification`)
                    .setDescription(`**Ο χρήστης ${p.user} έγινε verified**`)
                    .setColor(config.color)
                    .setTimestamp()
                    .setThumbnail(`${p.user.displayAvatarURL()}`);

                const c = msg.channel.createMessageCollector();
                c.on("collect", async (message) => {
                    if (message.author.id !== p.user.id) return;
                    if (message.content === captcha.text) {
                        await p.member.roles.add(role);
                        await p.user.send({ content: `**Έγινες verified**` });
                        log.send({ embeds: [em] });
                    } else {
                        await message.author.send(`**Try again**`);
                    }
                });
            } catch (error) {
                return console.log(error);
            }
        } else {
            return await p.reply({
                content: `**Το verify system είναι disabled**`,
                ephemeral: true,
            });
        }
    }
});
