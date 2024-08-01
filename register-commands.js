const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: "vid",
        description: "download and sent video to chat. Supports yt shorts, reels, tiktok, and twitter videos",
        options: [
            {
                name: 'url',
                description: "download link",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "coin_flip",
        description: "flips a coin"
    },
    {
        name: "qotd",
        description: "Quote of the day"
    }
]

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('registering slash commands')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
            { body: commands },
        )

        console.log('Successfully registered application commands.')
    } catch (error) {
        console.log(error)
    }
})();
