import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Schaltet Track-Repeat an/aus.')
    .addBooleanOption(o => o.setName('enabled').setDescription('Repeat an/aus').setRequired(true)),
  async execute({ client, interaction }) {
    const enabled = interaction.options.getBoolean('enabled', true);
    const player = client.manager.players.get(interaction.guild.id);
    if (!player) return interaction.reply({ content: 'ℹ️ Kein Player aktiv.', ephemeral: true });
    player.setTrackRepeat(enabled);
    return interaction.reply({ content: enabled ? '🔁 Track-Repeat aktiviert.' : '🔁 Track-Repeat deaktiviert.' });
  }
};
