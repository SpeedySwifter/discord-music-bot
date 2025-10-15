# Discord Music Bot (discord.js + Erela.js + Lavalink)

High-quality Discord music bot with slash commands and Dockerized Lavalink.

## Features

- **Sources**: YouTube, YouTube Music, SoundCloud.
- **Spotify**: via `erela.js-spotify` (requires client id/secret).
- **Deezer/Tidal/Amazon links**: resolved by searching on YouTube/SoundCloud (mapping). Optional `LavaSrc` plugin can improve resolution.
- **Commands**: `/play`, `/queue`, `/skip`, `/stop`, `/repeat`, `/eq`, `/np`, `/volume`, `/leave`, `/lyrics`.
- **Lyrics**: `genius-lyrics-api` (optional `GENIUS_TOKEN`).

## Requirements

- Node.js 18+
- Docker + Docker Compose
- Discord Bot Token and Application (slash commands)
- Spotify Client ID/Secret (optional, for Spotify links)

## Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Create `.env` from example and fill values:
```bash
cp .env.example .env
# Edit .env: DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID, SPOTIFY_CLIENT_ID/SECRET (optional), GENIUS_TOKEN (optional)
```

3. Start Lavalink with Docker:
```bash
# Create plugin directory
mkdir -p lavalink/plugins

# (Optional but recommended) Download LavaSrc plugin for Lavalink v4 to improve Spotify/Deezer/Tidal resolution
# Check latest release: https://github.com/topi314/LavaSrc/releases
# Example (replace VERSION with latest):
curl -L -o lavalink/plugins/lavasrc.jar \
  https://github.com/topi314/LavaSrc/releases/download/v4.3.4/lavasrc-plugin-4.3.4.jar

# Launch
docker compose up -d
```

4. Register slash commands (guild-scoped for faster updates):
```bash
npm run register:commands
```

5. Run the bot:
```bash
npm start
```

## Notes on Audio Quality

- Discord voice bitrate is limited by the server boost level and channel settings. The bot uses high-quality Opus, but effective bitrate depends on the guild.
- Player volume defaults to 80%. Adjust via `/volume`.

## Commands

- `/play query:<url or search>`: Add and play a track/playlist.
- `/queue`: Show queue and current track.
- `/skip`: Skip current track.
- `/stop`: Stop and leave.
- `/repeat enabled:<true|false>`: Toggle track repeat.
- `/eq band:<0-14> gain:<-0.25..1.0>`: Set EQ band.
- `/np`: Now playing with progress bar.
- `/volume level:<0..100>`: Set volume.
- `/leave`: Leave voice.
- `/lyrics`: Fetch lyrics for current track (needs `GENIUS_TOKEN` for best results).

## Configuration

- Lavalink config: `lavalink/application.yml` (already mapped by `docker-compose.yml`).
- Environment: `.env` controls Discord and Spotify credentials.

## Troubleshooting

- If slash commands don't appear, ensure `DISCORD_CLIENT_ID` and `GUILD_ID` are correct and you re-ran `npm run register:commands`.
- Ensure Lavalink is reachable at `${LAVALINK_HOST}:${LAVALINK_PORT}` and password matches.
- For Spotify links, verify `SPOTIFY_CLIENT_ID/SECRET` are set and valid.
- For lyrics, set `GENIUS_TOKEN`.
