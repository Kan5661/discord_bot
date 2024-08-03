const { Client, IntentsBitField } = require("discord.js");
const { rand_choice, yt_download, universal_download, get_vid, delete_file, get_insta_download_url, download_file_from_url,
    get_tiktok_download_url, get_twitter_download_url, get_yt_download_url, get_quote, check_dir_for_file } = require("./utils");
const cron = require("node-cron");
const dotenv = require("dotenv");
const fs = require('fs')
const quotes = require("./quotes.json")


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

let quote = get_quote()


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

});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == "coin_flip") {
        if (Math.random() < 0.5) {
            interaction.reply("head")
        }
        else interaction.reply("tail")
    }

    if (interaction.commandName == "qotd") {
        interaction.reply(`"${quote.quoteText}"\n--- ${quote.quoteAuthor}`)
    }

    if (interaction.commandName == "random_quote") {
        let random_quote = get_quote()
        interaction.reply(`"${random_quote.quoteText}"\n --- ${random_quote.quoteAuthor}`)
    }

    if (interaction.commandName == "vid") {
        let url = interaction.options.get('url').value;

        // yt shorts
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
	    console.log("downloading: " + url)
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
                else if (!video) {
                    interaction.reply("Error downloading video")
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

        // need to add error handling
        // if (url.includes("youtube.com") || url.includes("youtu.be")) {
        //     interaction.reply("downloading video....")
        //     let video
        //     try {
        //         const download_url = await get_yt_download_url(url)

        //         if (!download_url) {
        //             interaction.editReply("unable to access url")
        //             return
        //         }

        //         const vid_file = './output/yt.mp4'

        //         try {
        //             video = await download_file_from_url(download_url, vid_file)
        //             if (video) {
        //                 const file = await get_vid(vid_file);
        //                 await interaction.editReply({
        //                     content: `here's ur vid bud <@${interaction.user.id}>`,
        //                     files: [{
        //                         attachment: file,
        //                         contentType: "video/mp4",
        //                         name: "fked_mc_download.mp4",
        //                 }] });
        //                 delete_file(vid_file)
        //             }
        //         }
        //         catch (error) {
        //             console.error("error: ", error)
        //             interaction.editReply("an issue occured while downloading video")
        //             return
        //         }
        //     }
        //     catch (error) {
        //         console.error("error: ", error)
        //         if (error.rawError.message == "Request entity too large") {
        //             interaction.editReply("video exceed file size limit")
        //         }
        //         else interaction.editReply("error : (")
        //     }

        //     return
        // }



        // insta reels / fb post
        if (url.includes("instagram.com/reel") || url.includes("www.facebook.com")) {
            interaction.reply("downloading video....")
            let video

            try {
                const download_url = await get_insta_download_url(url)
                if (!download_url) {
                    interaction.editReply("unable to access url")
                    return
                }
                const vid_file = './output/insta_reel.mp4'

                try {
                    video = await download_file_from_url(download_url, vid_file)
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
                }
                catch (error) {
                    console.error("error: ", error)
                    interaction.editReply("an issue occured while downloading video")
                    return
                }

            } catch (error) {
                console.error("error: ", error)
                if (error.rawError.message == "Request entity too large") {
                    interaction.editReply("video exceed file size limit")
                }
                else interaction.editReply("error : (")
            }

            return
        }
        // tiktok
        if (url.includes("tiktok.com")) {
            interaction.reply("downloading video....")

            try {
                const download_url = await get_tiktok_download_url(url)
                if (!download_url) {
                    interaction.editReply("unable to access url")
                    return
                }
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
                if (!download_url) {
                    interaction.editReply("unable to access url")
                    return
                }
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

    if (interaction.commandName == "dl") {
        try {
            const download_url = interaction.options.get('url').value;
            await interaction.reply("downloading video.....");
            const res = await universal_download(url=download_url);
            const video_file_exist = await check_dir_for_file('./output');

            if (res && video_file_exist) {
                const file_path = './output/output.mp4';
                const file = await fs.promises.readFile(file_path);
                if (!file) {
                    throw new Error("Failed to read video file");
                }
                await interaction.editReply({
                    content: `here's ur vid bud <@${interaction.user.id}>`,
                    files: [{
                        attachment: file,
                        contentType: "video/mp4",
                        name: "fked_mc_download.mp4",
                    }]
                });
                await delete_file(file_path);
            } else {
                await interaction.editReply("An issue occurred while downloading video");
                if (video_file_exist) delete_all_file_from('./output')
            }
        } catch (error) {
            const video_file_exist = await check_dir_for_file('./output');
            console.error("Error in dl command:", error);
            await interaction.editReply("An error occurred while processing your request.");
            if (video_file_exist) delete_all_file_from('./output')
        }
    }

});


cron.schedule('0 0 * * *', () => {
    quote = get_quote()
    console.log("Quote of the day: " + quote.quoteText)
});


client.login(process.env.BOT_TOKEN);
