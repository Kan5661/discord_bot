const { Client, IntentsBitField } = require("discord.js");
const { rand_choice, yt_download, universal_download, get_vid, delete_file, get_insta_download_url, download_file_from_url,
    get_tiktok_download_url, get_twitter_download_url, get_yt_download_url, get_quote, check_dir_for_file, delete_all_file_from } = require("./utils");
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

const SERVER_ID = process.env.ENVIRONMENT == "TESTING"? process.env.TEST_SERVER_ID : process.env.SERVER_ID
console.log("Env: ", process.env.ENVIRONMENT)
let quote = get_quote()

async function sendShutdownMessage(message) {
  if (!client.isReady() || process.env.ENVIRONMENT == "TESTING") return;

  const channel = client.channels.cache.filter(
    channel => channel.name === "memes" && guild_id == SERVER_ID);

  if (channel.size > 0) {
    const promises = [];

    channel.forEach(channel => {
      promises.push(
        channel.send(message)
          .catch(err => console.error(`Failed to send shutdown message to ${channel.name} in ${channel.guild.name}:`, err))
      );
    });

    await Promise.allSettled(promises);
  }
}

process.on('SIGINT', async () => {
  console.log('Received SIGINT (Ctrl+C). Shutting down...');
  await sendShutdownMessage('Bot is shutting down (manual termination)');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down...');
  await sendShutdownMessage('Bot is shutting down (termination signal)');
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await sendShutdownMessage('Bot is shutting down due to an error');
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await sendShutdownMessage('Bot is shutting down due to an unhandled promise rejection');
  process.exit(1);
});


client.on("ready", async (c) => {
    console.log(`BOT ${c.user.tag} is online`);
    const server = client.guilds.cache.get(SERVER_ID)
    if (server) {
        const channel = server.channels.cache.find(channel => channel.name == "memes")
        if (channel) {
            channel.send("Absolute Cinema is online <:Happy:860567775138414633>")
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
        console.log("download from: " + url)
        // yt shorts
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
	    console.log("downloading: " + url)
            try {
                interaction.reply("use /dl command for youtube u rat monkey boy, always crashing my shit <a:pug_dance:990680940172951612>")
            } catch (error) {
                console.error("error: ", error)
                if (error.rawError.message == "Request entity too large") {
                    interaction.editReply("video exceed file size limit")
                }
                else interaction.editReply("an issue occured while downloading video")
            }
            return
        }


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
            const file_path = './output/output.mp4';
            await interaction.reply("downloading video.....");
            const res = await universal_download(url=download_url);
            console.log(res)
            const video_file_exist = fs.existsSync(file_path)

            if (res && video_file_exist) {
                console.log("sending file to discord")
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
            } else {
                interaction.editReply("An issue occurred while downloading video. Vid size too large?");

            }
        } catch (error) {
            console.error("Error in dl command:", error);
                interaction.editReply("exceed vid size limit");

        }
        const file_in_output = await check_dir_for_file('./output');
        if (file_in_output) delete_all_file_from('./output')
    }

});


cron.schedule('0 0 * * *', () => {
    quote = get_quote()
    console.log("Quote of the day: " + quote.quoteText)
});


client.login(process.env.BOT_TOKEN);
