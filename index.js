const { Client, IntentsBitField } = require("discord.js");
const { rand_choice } = require("./utils");
// const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// CL week = true, Quest week = false
let sendPings = false;
const users_to_ping = [
    process.env.KAN,
    process.env.RADIATED_BALLS,
    process.env.LOSER_EPIC,
];
const pingUsers = users_to_ping.map((id) => `<@${id}>`).join(" ");
const bot_replies = [
    "<:nerd:1157435339737157704>",
];

client.on("ready", (c) => {
    console.log(`BOT ${c.user.tag} is online`);
});

client.on("messageCreate", async (message) => {
    if (
        Math.random() < 0.5 &&
        message.author.id == process.env.RADIATED_BALLS
    ) {
        const words = message.content.toLowerCase().split(/\s+/);
        if (words.includes("hw") || words.includes("homework")) {
            message.reply(rand_choice(bot_replies));
        }
    }
    if (
        Math.random() < 0.75 &&
        (message.content.toLowerCase().includes("are trash") ||
            message.content.toLowerCase().includes("is trash"))
    ) {
        message.reply("skill issue <:no_skill:1157433009411199056>");
    }

    if (message.content.toLowerCase() == "!flipcoin") {
        const coin = Math.random() < 0.5 ? "heads" : "tails";
        message.reply(coin);
    }
    if (message.content.toLowerCase().includes("fuck") && message.author.id == process.env.MISS || message.author.id == process.env.KAN) {
        if (Math.random() > 0.5) {
            setTimeout(() => {
                message.reply("HEY U RELAX RN");
                console.log(message.author);
            }, 1000);
        }
    }
});

client.login(process.env.BOT_TOKEN);
