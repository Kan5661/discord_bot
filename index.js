const { Client, IntentsBitField, MessageAttachment } = require("discord.js");
const { rand_choice, yt_download, get_vid, delete_yt } = require("./utils");

// const cron = require("node-cron");
const dotenv = require("dotenv");
const fs = require('fs')

dotenv.config();
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const bot_replies = [
    "<:nerd:1157435339737157704>",
];

client.on("ready", (c) => {
    console.log(`BOT ${c.user.tag} is online`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return

    // absoultely random stuff
    if (
        Math.random() < 0.5 &&
        message.author.id == process.env.RADIATED_BALLS
    ) {
        const words = message.content.toLowerCase().split(/\s+/);
        if (words.includes("hw") || words.includes("homework")) {
            message.reply(rand_choice(bot_replies));
        }
    }

    if (message.content.toLowerCase() == "!flipcoin") {
        const coin = Math.random() < 0.5 ? "heads" : "tails";
        message.reply(coin);
    }

    // detect video link, download it, and sent to chat


});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == "vid") {
        const url = interaction.options.get('url').value;
        if (url.includes("https://www.youtube.com/shorts")) {
            try {
                const video = await yt_download(url);
                console.log(video);
                if (video) {
                    const file = await get_vid("./output/yt_short.mp4");
                    interaction.reply("downloading video....")
                    await interaction.channel.send({ files: [{
                        attachment: file,
                        contentType: "video/mp4",
                        name: "fked_mc_download.mp4",
                    }] });
                    interaction.channel.send(`nice vid <@${interaction.user.id}>`)
                    interaction.deleteReply()
                    delete_yt()
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            console.log("url not valid");
            await interaction.reply("bad link");
        }
    }
});





client.login(process.env.BOT_TOKEN);
