const { Client, IntentsBitField } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.FLAGS.GUILDS, 
        IntentsBitField.FLAGS.GUILD_MESSAGES,
        IntentsBitField.FLAGS.GUILD_MEMBERS,
        IntentsBitField.FLAGS.MessageContent,
    ],
});

client.login(process.env.BOT_TOKEN)
