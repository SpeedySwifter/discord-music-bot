import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('leave').setDescription('Verlässt den Sprachkanal.'),
  async execute({ client, interaction }) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player) return interaction.reply({ content: 'ℹ️ Kein Player aktiv.', ephemeral: true });
    player.destroy();
    return interaction.reply({ content: '👋 Verlassen.' });
  }
};
