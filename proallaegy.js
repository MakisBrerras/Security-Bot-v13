const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");

async function deployCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }

    const config = require("./config.json");
    const rest = new REST({ version: "9" }).setToken(config.token);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(config.applicationID), {
            body: commands,
        });

        console.log("Successfully registered application (/) commands.");
    } catch (error) {
        console.error("Error registering application (/) commands:", error);
    }
}

module.exports = deployCommands;
