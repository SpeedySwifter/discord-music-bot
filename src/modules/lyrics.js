import { SlashCommandBuilder } from 'discord.js';
import { getLyrics, getSong } from 'genius-lyrics-api';

export default {
  data: new SlashCommandBuilder().setName('lyrics').setDescription('Zeigt Lyrics des aktuellen Songs.'),
  async execute({ client, interaction }) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player || !player.queue.current) return interaction.reply({ content: 'ℹ️ Es läuft gerade nichts.', ephemeral: true });

    await interaction.deferReply();

    const track = player.queue.current;
    const title = track.title || '';
    const artist = track.author || '';

    const opts = {
      apiKey: process.env.GENIUS_TOKEN || '',
      title,
      artist,
      optimizeQuery: true
    };

    try {
      let lyrics = await getLyrics(opts);
      if (!lyrics) {
        const song = await getSong(opts);
        lyrics = song?.lyrics || null;
      }
      if (!lyrics) return interaction.editReply({ content: '❌ Keine Lyrics gefunden.' });

      if (lyrics.length > 1900) {
        lyrics = lyrics.slice(0, 1900) + '\n...';
      }
      await interaction.editReply({ content: `📜 Lyrics zu: ${title}\n\n${lyrics}` });
    } catch (e) {
      console.error('Lyrics error:', e);
      await interaction.editReply({ content: '❌ Fehler beim Abrufen der Lyrics.' });
    }
  }
};
