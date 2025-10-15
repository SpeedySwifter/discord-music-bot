import { SlashCommandBuilder, ChannelType, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('play').setDescription('Spielt einen Song.').addStringOption(o => o.setName('query').setDescription('Link oder Suche').setRequired(true)),
  async execute({ client, interaction }) {
    const query = interaction.options.getString('query', true);
    const { channel } = interaction.member.voice;
    if (!channel) return interaction.reply({ content: '🔊 Du musst in einem Sprachkanal sein.', ephemeral: true });
    if (!channel.joinable) return interaction.reply({ content: '❌ Kann dem Sprachkanal nicht beitreten.', ephemeral: true });

    await interaction.deferReply();

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: channel.id,
        textChannel: interaction.channel.id,
        volume: 80
      });
      player.connect();
    } else if (player.voiceChannel !== channel.id) {
      return interaction.editReply({ content: '❌ Du musst im selben Sprachkanal wie der Bot sein.' });
    }

    const res = await client.manager.search(query, interaction.user);
    if (res.loadType === 'LOAD_FAILED' || res.loadType === 'NO_MATCHES') {
      return interaction.editReply({ content: '❌ Nichts gefunden.' });
    }

    if (res.loadType === 'PLAYLIST_LOADED') {
      for (const track of res.tracks) player.queue.add(track);
      if (!player.playing && !player.paused) player.play();
      return interaction.editReply({ content: `✅ Playlist hinzugefügt: ${res.playlist.name} (${res.tracks.length} Titel)` });
    } else {
      const track = res.tracks[0];
      player.queue.add(track);
      if (!player.playing && !player.paused) player.play();
      return interaction.editReply({ content: `✅ Hinzugefügt: ${track.title} - ${track.author}` });
    }
  }
};
