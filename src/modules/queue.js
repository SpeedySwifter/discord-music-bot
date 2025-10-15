import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('queue').setDescription('Zeigt die Queue.'),
  async execute({ client, interaction }) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player || (!player.queue.current && player.queue.size === 0)) {
      return interaction.reply({ content: 'ℹ️ Keine Titel in der Queue.', ephemeral: true });
    }
    const current = player.queue.current;
    const rest = player.queue.slice(0, 10).map((t, i) => `${i + 1}. ${t.title} - ${t.author}`);
    const msg = [`▶️ Jetzt: ${current?.title || '—'}`, ...(rest.length ? rest : ['—'])].join('\n');
    await interaction.reply({ content: msg });
  }
};
