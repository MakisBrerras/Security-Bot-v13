const { Client, Collection, Intents, GatewayIntentBits } = require("discord.js");
const config = require("./config.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
})
const path = require("path");
const fs = require("fs");
const { connect } = require("mongoose");
const deployCommands = require("./proallaegy");
const mongoose = require('mongoose');

module.exports = client;
client.commands = new Collection();
client.events = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

eventFiles.forEach((file) => {
    const eventFilePath = path.join(eventsPath, file);
    require(eventFilePath);
});

process.on("unhandledRejection", (err) => {
    return console.log(err);
});

process.on("uncaughtExceptionMonitor", (err) => {
    return console.log(err);
});

process.on("uncaughtException", (err) => {
    return console.log(err);
});

mongoose.set('strictQuery', false); // or true


deployCommands(client)
    .then(() => {
        connect(config.database)
            .then(() => {
                console.log("Database Established");
            })
            .catch(console.error);
    })
    .then(() => {
        client.login(config.token);
    })
    .catch(console.error);
