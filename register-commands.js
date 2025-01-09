const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: "vid",
        description: "download and sent video to chat. works for reels, tiktok, and twitter videos. YT IS BROKEN",
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
        name: "dl",
        description: "download and sent video to chat. Works for almost any website you can think of",
        options: [
            {
                name: 'url',
                description: "link",
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
        description: "What's the quote of the day?"
    },
    {
        name: "random_quote",
        description: "CONSTANT wisdom just for you"
    },
    {
        name: "download_stats",
        description: ":eyes:"
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
