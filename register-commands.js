const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: "vid",
        description: "download and sent video to chat",
        options: [
            {
                name: 'url',
                description: "download link",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
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
