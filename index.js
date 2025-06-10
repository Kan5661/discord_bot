const { Client, IntentsBitField } = require("discord.js");
const { universal_download, get_quote, check_dir_for_file, delete_all_file_from, getFileSize } = require("./utils");
const cron = require("node-cron");
const dotenv = require("dotenv");
const fs = require('fs')


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit the process, just log the error
});


dotenv.config();
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const SERVER_ID = process.env.ENVIRONMENT == "TESTING" ? process.env.TEST_SERVER_ID : process.env.SERVER_ID
console.log("Env: ", process.env.ENVIRONMENT)
let quote = get_quote()


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
        let video_file_size = 0;
        const file_path = './output/output.mp4';
        let replyMessage = null;

        try {
            const download_url = interaction.options.get('url')?.value;

            // Validate URL
            if (!download_url) {
                await interaction.reply("❌ Please provide a valid URL.");
                return;
            }

            // Send initial reply
            replyMessage = await interaction.reply("⏳ Downloading video...");

            // Wrap universal_download in additional error handling
            let downloadResult = null;
            try {
                downloadResult = await Promise.race([
                    universal_download(download_url),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Download timeout')), 60000) // 60 second timeout
                    )
                ]);
            } catch (downloadError) {
                console.error("Download error:", downloadError);
                await interaction.editReply("❌ Failed to download video. The URL might be invalid or the video might be too large.");
                return;
            }

            // Check if file exists and get size safely
            let video_file_exist = false;
            try {
                video_file_exist = fs.existsSync(file_path);
                if (video_file_exist) {
                    video_file_size = getFileSize(file_path) || 0;
                    console.log("File size:", video_file_size, 'MB');
                }
            } catch (fsError) {
                console.error("File system error:", fsError);
                await interaction.editReply("❌ Error accessing downloaded file.");
                return;
            }

            // Validate file size
            if (video_file_size > 50) {
                await interaction.editReply(`❌ Video too large: ${video_file_size.toFixed(2)} MB. Discord limit is 50MB.`);
                return;
            }

            if (downloadResult && video_file_exist && video_file_size > 0) {
                try {
                    console.log("Sending file to Discord");

                    // Check file size before reading into memory
                    const stats = fs.statSync(file_path);
                    if (stats.size > 50 * 1024 * 1024) { // 50MB in bytes
                        await interaction.editReply(`❌ File too large: ${video_file_size.toFixed(2)} MB`);
                        return;
                    }

                    // Read file with error handling
                    const file = await fs.promises.readFile(file_path).catch(readError => {
                        console.error("File read error:", readError);
                        throw new Error("Failed to read video file");
                    });

                    if (!file || file.length === 0) {
                        throw new Error("Downloaded file is empty");
                    }
                    await Promise.race([
                        interaction.editReply({
                            content: `Here's your video bud <@${interaction.user.id}> - ${video_file_size.toFixed(2)} MB`,
                            files: [{
                                attachment: file,
                                contentType: "video/mp4",
                                name: "downloaded_video.mp4",
                            }]
                        }),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Upload timeout')), 60000) // 30 second timeout
                        )
                    ]);

                } catch (uploadError) {
                    console.error("Upload error:", uploadError);
                    await interaction.editReply(`❌ Failed to upload video. Size: ${video_file_size.toFixed(2)} MB`);
                }
            } else {
                const errorMsg = !downloadResult ? "Download failed" :
                    !video_file_exist ? "File not found after download" :
                        "Downloaded file is empty";
                await interaction.editReply(`❌ ${errorMsg}. Video size: ${video_file_size.toFixed(2)} MB`);
            }

        } catch (error) {
            console.error("Critical error in vid command:", error);

            // Ensure we can still respond to the user
            try {
                if (replyMessage) {
                    await interaction.editReply(`❌ An unexpected error occurred. Please try again later.`);
                } else {
                    await interaction.reply(`❌ An unexpected error occurred. Please try again later.`);
                }
            } catch (replyError) {
                console.error("Failed to send error message to user:", replyError);
            }
        } finally {
            // Cleanup - always runs regardless of success/failure
            try {
                const file_in_output = await check_dir_for_file('./output');
                if (file_in_output) {
                    delete_all_file_from('./output');
                    console.log("Cleanup completed");
                }
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
                // Don't let cleanup errors crash the process
            }
        }
    }

});


cron.schedule('0 0 * * *', () => {
    quote = get_quote()
    console.log("Quote of the day: " + quote.quoteText)
});


client.login(process.env.BOT_TOKEN);
