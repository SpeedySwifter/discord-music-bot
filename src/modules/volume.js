import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Setzt die Lautstärke (0-100).')
    .addIntegerOption(o => o.setName('level').setDescription('0-100').setRequired(true)),
  async execute({ client, interaction }) {
    const level = interaction.options.getInteger('level', true);
    if (level < 0 || level > 100) return interaction.reply({ content: '❌ Lautstärke muss zwischen 0 und 100 sein.', ephemeral: true });
    const player = client.manager.players.get(interaction.guild.id);
    if (!player) return interaction.reply({ content: 'ℹ️ Kein Player aktiv.', ephemeral: true });
    player.setVolume(level);
    return interaction.reply({ content: `🔊 Lautstärke auf ${level}% gesetzt.` });
  }
};
