const fs = require('fs');
const { format } = require('path');
const ytdl = require('ytdl-core');

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


const get_vid = (filePath) => {
    try {
        const file = fs.readFileSync(filePath);
        return file;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}


const delete_yt = () => {
    const file_path = './output/yt_short.mp4'
    fs.unlink(file_path, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('File deleted successfully');
        }
    })
}


module.exports = { rand_choice, yt_download, get_vid, delete_yt };
