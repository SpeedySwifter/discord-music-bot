import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('np').setDescription('Zeigt den aktuell spielenden Titel.'),
  async execute({ client, interaction }) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player || !player.queue.current) return interaction.reply({ content: 'ℹ️ Es läuft gerade nichts.', ephemeral: true });
    const t = player.queue.current;
    const position = player.position || 0;
    const duration = t.duration || 0;
    const fmt = ms => {
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${m}:${r.toString().padStart(2, '0')}`;
    };
    const barLen = 20;
    const idx = Math.min(barLen, Math.floor((position / duration) * barLen));
    const bar = `${'─'.repeat(idx)}🔘${'─'.repeat(Math.max(0, barLen - idx))}`;
    await interaction.reply({ content: `▶️ ${t.title} - ${t.author}\n${fmt(position)} ${bar} ${fmt(duration)}` });
  }
};
