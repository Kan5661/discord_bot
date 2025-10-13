const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const SERVER_ID = process.env.ENVIRONMENT == "TESTING"? process.env.TEST_SERVER_ID : process.env.SERVER_ID

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
    }
]

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('registering slash commands')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, SERVER_ID),
            { body: commands },
        )

        console.log('Successfully registered application commands.')
    } catch (error) {
        console.log(error)
    }
})();
