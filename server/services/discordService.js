const { Client, GatewayIntentBits } = require('discord.js');
const { analyzeMessage } = require('./workTypeService');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let isReady = false;
let initPromise = null;

async function initializeBot() {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    client.once('ready', () => {
      console.log('Discord bot je připraven!');
      console.log(`Přihlášen jako: ${client.user.tag}`);
      isReady = true;
      resolve();
    });

    client.on('error', error => {
      console.error('Discord bot error:', error);
      isReady = false;
      reject(error);
    });

    client.login(process.env.DISCORD_TOKEN).catch(error => {
      console.error('Chyba při přihlašování:', error);
      reject(error);
    });
  });

  return initPromise;
}

async function fetchWorkLogs(channelId) {
  console.log('Začínám načítání work logs...');
  
  try {
    await initializeBot();
    console.log('Bot inicializován, pokračuji...');

    console.log('Načítám kanál:', channelId);
    const channel = await client.channels.fetch(channelId);
    
    if (!channel) {
      throw new Error(`Kanál s ID ${channelId} nebyl nalezen`);
    }

    console.log(`Kanál nalezen: ${channel.name}`);
    
    const messages = await channel.messages.fetch({ limit: 100 });
    console.log(`Načteno ${messages.size} zpráv`);
    
    const analyzedMessages = await Promise.all(
      Array.from(messages.values()).map(async msg => {
        // Získáme člena serveru
        const member = channel.guild.members.cache.get(msg.author.id);
        const displayName = member ? member.displayName : msg.author.username;
        
        const analysis = await analyzeMessage(msg.content);
        return {
          author: msg.author.id,
          authorName: displayName, // Použijeme přezdívku ze serveru
          content: msg.content,
          timestamp: msg.createdTimestamp,
          workType: analysis?.workType,
          pay: analysis?.pay,
          duration: analysis?.duration,
          timeRange: analysis?.timeRange,
          minPay: analysis?.minPay,
          maxPay: analysis?.maxPay
        };
      })
    );

    return analyzedMessages;
  } catch (error) {
    console.error('Detailní chyba:', error);
    throw new Error(`Chyba při načítání zpráv: ${error.message}`);
  }
}

initializeBot().catch(console.error);

module.exports = { fetchWorkLogs }; 