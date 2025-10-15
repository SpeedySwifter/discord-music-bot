import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('eq')
    .setDescription('Setzt Equalizer Band/Gain.')
    .addIntegerOption(o => o.setName('band').setDescription('Band 0-14').setRequired(true))
    .addNumberOption(o => o.setName('gain').setDescription('Gain -0.25 bis 1.0').setRequired(true)),
  async execute({ client, interaction }) {
    const band = interaction.options.getInteger('band', true);
    const gain = interaction.options.getNumber('gain', true);
    if (band < 0 || band > 14) return interaction.reply({ content: '❌ Band muss zwischen 0 und 14 sein.', ephemeral: true });
    if (gain < -0.25 || gain > 1.0) return interaction.reply({ content: '❌ Gain muss zwischen -0.25 und 1.0 sein.', ephemeral: true });
    const player = client.manager.players.get(interaction.guild.id);
    if (!player) return interaction.reply({ content: 'ℹ️ Kein Player aktiv.', ephemeral: true });
    player.setEQ([{ band, gain }]);
    return interaction.reply({ content: `🎚️ EQ gesetzt: Band ${band}, Gain ${gain}` });
  }
};
