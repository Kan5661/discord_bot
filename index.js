const { Client, IntentsBitField } = require('discord.js');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
;

const users_to_ping = [process.env.KAN, process.env.RADIATED_BALLS, process.env.LOSER_EPIC]
const pingUsers = users_to_ping.map(id => `<@${id}>`).join(' ');

let sendPings = true

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);

  cron.schedule('4 12 * * 0,3,5,6', async () => {
    if (sendPings) {
      const guild = client.guilds.cache.get(process.env.SERVER_ID);
      if (!guild) return console.log('Guild not found');

      const channel = guild.channels.cache.get(process.env.CHANNEL_ID);
      if (!channel) return console.log('Channel not found or not a text channel');
  
      await channel.send(`${pingUsers}, CL time mfs`);
      console.log('Message sent');
    }
  });

  cron.schedule('0 0 * * 1', () => {
    sendPings = !sendPings;
  });

});


client.login(process.env.BOT_TOKEN);
