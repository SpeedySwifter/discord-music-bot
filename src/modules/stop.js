import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stoppt die Wiedergabe und leert die Queue.'),
  async execute({ client, interaction }) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player) return interaction.reply({ content: 'ℹ️ Kein Player aktiv.', ephemeral: true });
    player.queue.clear();
    player.destroy();
    return interaction.reply({ content: '⏹️ Gestoppt und verlassen.' });
  }
};
