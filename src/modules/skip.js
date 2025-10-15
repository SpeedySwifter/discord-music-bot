import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('skip').setDescription('Überspringt den aktuellen Song.'),
  async execute({ client, interaction }) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player || !player.queue.current) return interaction.reply({ content: 'ℹ️ Nichts läuft.', ephemeral: true });
    player.stop();
    return interaction.reply({ content: '⏭️ Übersprungen.' });
  }
};
