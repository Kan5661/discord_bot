// Import the 'tiktok-scraper' package
const TikTokScraper = require('tiktok-scraper');

// Function to download a TikTok video
async function downloadTikTokVideo(videoUrl) {
  try {
    // Download the video without a watermark[^1^][1]
    const videoMeta = await TikTokScraper.video(videoUrl, { noWaterMark: true, hdVideo: true });

    // Save the video
    const fs = require('fs');
    const path = require('path');
    const videoBuffer = await TikTokScraper.getVideoMeta(videoMeta.collector[0].videoUrlNoWaterMark);

    // Define the path for the downloaded video
    const filePath = path.resolve(__dirname, 'downloaded_video.mp4');

    // Write the video file to the system
    fs.writeFileSync(filePath, videoBuffer.data);
    console.log(`Video has been downloaded and saved as ${filePath}`);
  } catch (error) {
    console.error('Failed to download the video:', error);
  }
}

// Example usage
const videoUrl = 'https://www.tiktok.com/@tiktok/video/6807491984882765062'; // Replace with the actual video URL
downloadTikTokVideo(videoUrl);
