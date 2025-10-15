import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const commands = [
  new SlashCommandBuilder().setName('play').setDescription('Spielt einen Song').addStringOption(o => o.setName('query').setDescription('Link oder Suche').setRequired(true)),
  new SlashCommandBuilder().setName('queue').setDescription('Zeigt die Queue'),
  new SlashCommandBuilder().setName('skip').setDescription('Überspringt den aktuellen Song'),
  new SlashCommandBuilder().setName('stop').setDescription('Stoppt die Wiedergabe und leert die Queue'),
  new SlashCommandBuilder().setName('repeat').setDescription('Setzt Track-Repeat').addBooleanOption(o => o.setName('enabled').setDescription('Repeat an/aus').setRequired(true)),
  new SlashCommandBuilder().setName('eq').setDescription('Setzt Equalizer Band/Gain').addIntegerOption(o => o.setName('band').setDescription('Band 0-14').setRequired(true)).addNumberOption(o => o.setName('gain').setDescription('Gain -0.25 bis 1.0').setRequired(true)),
  new SlashCommandBuilder().setName('np').setDescription('Jetzt läuft'),
  new SlashCommandBuilder().setName('volume').setDescription('Setzt die Lautstärke').addIntegerOption(o => o.setName('level').setDescription('0-100').setRequired(true)),
  new SlashCommandBuilder().setName('leave').setDescription('Verlässt den Sprachkanal'),
  new SlashCommandBuilder().setName('lyrics').setDescription('Zeigt Lyrics des aktuellen Songs')
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  if (!process.env.DISCORD_CLIENT_ID || !process.env.GUILD_ID) {
    console.error('Bitte DISCORD_CLIENT_ID und GUILD_ID in .env setzen.');
    process.exit(1);
  }
  await rest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('Slash-Commands registriert');
}

main().catch(console.error);
