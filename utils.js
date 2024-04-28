const fs = require('fs');
const { format } = require('path');
const fetch = require('node-fetch')
const ytdl = require('ytdl-core');
const { promisify } = require('util');
const stream = require('stream');
const { tikdown, ndown, ytdown, twitterdown } = require("nayan-media-downloader")
const pipeline = promisify(stream.pipeline);

const rand_choice = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

const yt_download = (url) => {
    return new Promise((resolve, reject) => {
        const out_path = './output/yt_short.mp4';
        const writeStream = fs.createWriteStream(out_path);

        writeStream.on('finish', () => {
            resolve(true); // Resolve the promise with true when the write operation finishes
        });

        writeStream.on('error', (error) => {
            reject(error); // Reject the promise with an error if there's an error during the write operation
        });

        ytdl(url, { filter: 'audioandvideo' }).pipe(writeStream);
    });
};

const get_yt_download_url = async (url) => {
    const info = await ytdown(url)
    console.log(info)
}

const get_insta_download_url = async (url) => {
    const info = await ndown(url)
    return info.data[0].url
}

const get_tiktok_download_url = async (url) => {
    const info = await tikdown(url)
    console.log(info)
    return info.data.video
}

const get_twitter_download_url = async (url) => {
    const info = await twitterdown(url)
    console.log(info)
    return info.data.HD
}

const get_vid = (filePath) => {
    try {
        const file = fs.readFileSync(filePath);
        return file;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}


const delete_file = (delete_file_path) => {
    fs.unlink(delete_file_path, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('File deleted successfully');
        }
    })
}


const download_file_from_url = async (url, filePath) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(filePath);
    await pipeline(response.body, fileStream);

    console.log('Download completed');
    return true
  } catch (error) {
    throw new Error(`Error downloading: ${error.message}`);
  }
};


module.exports = { rand_choice, yt_download, get_vid, delete_file, get_insta_download_url, download_file_from_url, get_tiktok_download_url, get_twitter_download_url, get_yt_download_url };
