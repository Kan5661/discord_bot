const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch')
const ytdl = require('ytdl-core');
const { promisify } = require('util');
const stream = require('stream');
const { tikdown, ndown, ytdown, twitterdown } = require("nayan-media-downloader")
const pipeline = promisify(stream.pipeline);
const quotes = require('./quotes.json')
const youtubedl = require('youtube-dl-exec')

const rand_choice = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

const get_quote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex]
    return quote
}

const universal_download = async (url) => {
    console.log(`Downloading from ${url}`)
    const output = await youtubedl(url, {
        mergeOutputFormat: 'mp4',
        // maxFilesize: "50M", // Cancle download if video over 50Mb
        format: "b[filesize<50M] / w", // downloads best video with audio available under 50Mb
        output: "./output/output.%(ext)s", // File path and set file name
        // defaultSearch: "ytsearch"
    })
    return output
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
    try {
        const info = await ytdown(url)
        console.log(info)
        return info.data.video
    }
    catch (error) {
        console.error(error)
        return null
    }
}

const get_insta_download_url = async (url) => {
    try {
        const info = await ndown(url)
        return info.data[0].url
    }
    catch (error) {
        console.error(error)
        return null
    }
}

const get_tiktok_download_url = async (url) => {
    try {
        const info = await tikdown(url)
        console.log(info)
        return info.data.video
    }
    catch (error) {
        console.error(error)
        return null
    }
}

const get_twitter_download_url = async (url) => {
    try {
        const info = await twitterdown(url)
        console.log(info)
        return info.data.HD
    }
    catch (error) {
        console.error(error)
        return null
    }
}

const get_vid = async (filePath) => {
    try {
        // Note: using readFile, not readFileSync
        const file = await fs.promises.readFile(filePath);
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

const delete_all_file_from = (dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
        fs.unlink(path.join(dir, file), err => {
            if (err) throw err;
        });
        }
    });
    console.log("file deleted")
}

const getFileSize = (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        return fileSizeInBytes;
    } catch (err) {
        console.error('Error getting file size:', err);
        return null;
    }
}

const check_dir_for_file = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                reject(false);
            } else if (files.length === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};


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


module.exports = { rand_choice, universal_download, yt_download, get_vid, delete_file, get_insta_download_url, download_file_from_url,
    get_tiktok_download_url, get_twitter_download_url, get_yt_download_url, get_quote, check_dir_for_file, delete_all_file_from, getFileSize };
