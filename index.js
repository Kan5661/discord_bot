const { Client, IntentsBitField } = require("discord.js");
const { rand_choice, yt_download, get_vid, delete_file, get_insta_download_url, download_file_from_url,
    get_tiktok_download_url, get_twitter_download_url, get_yt_download_url } = require("./utils");

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

});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == "vid") {
        let url = interaction.options.get('url').value;

        // yt shorts
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            interaction.reply("downloading video....")
            try {
                const video = await yt_download(url);
                const vid_file = './output/yt_short.mp4'
                console.log(video);
                if (video) {
                    const file = await get_vid(vid_file);
                    await interaction.editReply({
                        content: `here's ur vid bud <@${interaction.user.id}>`,
                            files: [{
                            attachment: file,
                            contentType: "video/mp4",
                            name: "fked_mc_download.mp4",
                    }] });
                    delete_file(vid_file)
                }
            } catch (error) {
                console.error("error: ", error)
                if (error.rawError.message == "Request entity too large") {
                    interaction.editReply("video exceed file size limit")
                }
                else interaction.editReply("an issue occured while downloading video")
            }
            return
        }


        // if (url.includes("youtube.com")) {
        //     const download_url = await get_yt_download_url(url)
        //     const vid_file = './output/yt_vid.mp4'
        // interaction.reply("downloading video....")

        //     try {
        //         const video = await download_file_from_url(download_url, vid_file)
        //         if (video) {
        //             const file = await get_vid(vid_file);
        //             interaction.reply("downloading video....")
        //             await interaction.channel.send({ files: [{
        //                 attachment: file,
        //                 contentType: "video/mp4",
        //                 name: "fked_mc_download.mp4",
        //             }] });
        //             interaction.channel.send(`nice short bozo <@${interaction.user.id}>`)
        //             interaction.deleteReply()
        //             delete_file(vid_file)
        //         }

        //     } catch (error) {
        //         console.error("error: ", error)
        //     }

        //     return
        // }



        // insta reels / fb post
        if (url.includes("instagram.com/reel") || url.includes("www.facebook.com")) {
            interaction.reply("downloading video....")

            try {
                const download_url = await get_insta_download_url(url)
                const vid_file = './output/insta_reel.mp4'
                const video = await download_file_from_url(download_url, vid_file)
                console.log("download url: " + video)
                if (video) {
                    const file = await get_vid(vid_file);
                    await interaction.editReply({
                        content: `here's ur vid bud <@${interaction.user.id}>`,
                        files: [{
                            attachment: file,
                            contentType: "video/mp4",
                            name: "fked_mc_download.mp4",
                    }] });
                    delete_file(vid_file)
                }

            } catch (error) {
                console.error("error: ", error)
                if (error.rawError.message == "Request entity too large") {
                    interaction.editReply("video exceed file size limit")
                }
                else interaction.editReply("an issue occured while downloading video")
            }

            return
        }
        // tiktok
        if (url.includes("tiktok.com")) {
            interaction.reply("downloading video....")

            try {
                const download_url = await get_tiktok_download_url(url)
                const vid_file = './output/tik_tok.mp4'
                const video = await download_file_from_url(download_url, vid_file)
                console.log("download url: " + video)
                if (video) {
                    const file = await get_vid(vid_file);
                    await interaction.editReply({
                        content: `here's ur vid bud <@${interaction.user.id}>`,
                        files: [{
                            attachment: file,
                            contentType: "video/mp4",
                            name: "fked_mc_download.mp4",
                    }] });
                    delete_file(vid_file)
                }

            } catch (error) {
                console.error("error: ", error)
                if (error.rawError.message == "Request entity too large") {
                    interaction.editReply("video exceed file size limit")
                }
                else interaction.editReply("an issue occured while downloading video")
            }

            return
        }

        if (url.includes("twitter.com") || url.includes("x.com")) {
            if (url.includes("x.com")) {
                url = url.replace("x.com", "twitter.com")
            }
            console.log(url)
            interaction.reply("downloading video....")

            try {
                const download_url = await get_twitter_download_url(url)
                const vid_file = './output/tweet.mp4'
                const video = await download_file_from_url(download_url, vid_file)
                console.log("download url: " + video)
                if (video) {
                    const file = await get_vid(vid_file);
                    await interaction.editReply({
                        content: `here's ur vid bud <@${interaction.user.id}>`,
                        files: [{
                            attachment: file,
                            contentType: "video/mp4",
                            name: "fked_mc_download.mp4",
                    }] });
                    delete_file(vid_file)
                }

            } catch (error) {
                console.error("error: ", error)
                if (error.rawError.message == "Request entity too large") {
                    interaction.editReply("video exceed file size limit")
                }
                else interaction.editReply("an issue occured while downloading video")
            }

            return
        }

        else {
            console.log("url not valid");
            await interaction.reply("bad link");
        }
    }
});





client.login(process.env.BOT_TOKEN);
