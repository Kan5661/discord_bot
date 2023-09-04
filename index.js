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


const users_to_ping = [process.env.KAN, process.env.RADIATED_BALLS, process.env.LOSER_EPIC]
const pingUsers = users_to_ping.map(id => `<@${id}>`).join(' ');

let sendPings = false;

client.on('ready', (c) => {
    console.log(`Logged in as ${c.user.tag}!`);

    cron.schedule('59 0 * * 1,4,6', async () => {
      console.log('Cron job triggered for sending pings');
      if (sendPings) {
        console.log('Sending pings is enabled.');
        const guild = client.guilds.cache.get(process.env.SERVER_ID);
        if (!guild) return console.log('Guild not found');
        
        const channel = guild.channels.cache.get(process.env.CHANNEL_ID);
        if (!channel) return console.log('Channel not found or not a text channel');
    
        try {
          await channel.send(`${pingUsers}, time for CL u mfs`);
          console.log('Message sent successfully');
        } catch (error) {
          console.error('Error sending the message:', error);
        }
      } else {
        console.log('Sending pings is disabled.');
      }
    }
    );
  
    cron.schedule('0 0 * * 1', () => {
      console.log('Cron job triggered for toggling sendPings state');
      sendPings = !sendPings;
      console.log(`Toggled sendPings to ${sendPings}`);
    });
  });

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!test') {
        message.channel.send('beep bop im ur CL reminder bot!');
    } 
});

client.on('interactionCreate',  (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'hey') {
        interaction.reply('hey there!')
    }
})

client.login(process.env.BOT_TOKEN);
