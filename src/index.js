import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { Manager } from 'erela.js';
import Spotify from 'erela.js-spotify';
import express from 'express';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'modules');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(url.pathToFileURL(filePath))).default;
  client.commands.set(command.data.name, command);
}

const nodes = [
  {
    host: process.env.LAVALINK_HOST || '127.0.0.1',
    port: Number(process.env.LAVALINK_PORT) || 2333,
    password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
    secure: false
  }
];

client.manager = new Manager({
  nodes,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
  plugins: [
    new Spotify({
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      playlistLimit: 100,
      albumLimit: 50,
      showPageLimit: 5
    })
  ]
})
  .on('nodeConnect', node => console.log(`Lavalink node connected: ${node.options.host}`))
  .on('nodeError', (node, error) => console.error(`Node error: ${node.options.host}`, error))
  .on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    channel?.send({ content: `▶️ Now playing: ${track.title} - ${track.author}` }).catch(() => {});
  })
  .on('queueEnd', player => {
    const channel = client.channels.cache.get(player.textChannel);
    channel?.send({ content: '✅ Queue ended. Leaving voice channel.' }).catch(() => {});
    player.destroy();
  });

client.once(Events.ClientReady, async c => {
  console.log(`Logged in as ${c.user.tag}`);
  client.manager.init(c.user.id);
});

client.on('raw', d => client.manager.updateVoiceState(d));

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: '❌ Fehler bei der Ausführung des Befehls.', ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: '❌ Fehler bei der Ausführung des Befehls.', ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

// Replit keep-alive HTTP server
const app = express();
app.get('/', (_req, res) => res.send('Discord music bot is running.'));
app.get('/health', (_req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`));
