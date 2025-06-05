const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch')
const { promisify } = require('util');
const stream = require('stream');
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
    try {
        console.log(`Downloading from ${url}`);
        
        // Validate URL format
        if (!url || typeof url !== 'string') {
            throw new Error('Invalid URL provided');
        }

        // Ensure output directory exists
        const outputDir = './output';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const output = await youtubedl(url, {
            mergeOutputFormat: 'mp4',
            maxFilesize: "50M",
            output: "./output/output.%(ext)s",
            noPlaylist: true, // Prevent downloading entire playlists
            retries: 2,
            // Set reasonable timeout
            socketTimeout: 30000,
        });
        
        return output;
    } catch (error) {
        console.error('Error in universal_download:', error.message);
        throw error; // Re-throw to be handled by caller
    }
};


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
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error('Error reading directory for cleanup:', err);
                resolve(); // Don't reject, just resolve to prevent crashes
                return;
            }

            if (files.length === 0) {
                resolve();
                return;
            }

            let deletedCount = 0;
            const totalFiles = files.length;

            files.forEach(file => {
                fs.unlink(path.join(dir, file), (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting file ${file}:`, unlinkErr);
                    } else {
                        console.log(`Deleted file: ${file}`);
                    }
                    
                    deletedCount++;
                    if (deletedCount === totalFiles) {
                        console.log("File cleanup completed");
                        resolve();
                    }
                });
            });
        });
    });
};


const getFileSize = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`File does not exist: ${filePath}`);
            return 0;
        }
        
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const sizeMB = parseFloat((fileSizeInBytes / (1024 * 1024)).toFixed(2));
        return sizeMB;
    } catch (err) {
        console.error('Error getting file size:', err);
        return 0; // Return 0 instead of null to prevent NaN issues
    }
};


const check_dir_for_file = (dirPath) => {
    return new Promise((resolve) => { // Remove reject parameter to prevent crashes
        try {
            if (!fs.existsSync(dirPath)) {
                resolve(false);
                return;
            }

            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    console.error('Error reading directory:', err);
                    resolve(false); // Resolve false instead of rejecting
                } else {
                    resolve(files.length > 0);
                }
            });
        } catch (error) {
            console.error('Error in check_dir_for_file:', error);
            resolve(false);
        }
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


module.exports = { rand_choice, universal_download, delete_file, download_file_from_url, get_quote, check_dir_for_file, delete_all_file_from, getFileSize };
