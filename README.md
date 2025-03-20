# Discord Music Bot

A Discord bot that can play music from Spotify, YouTube, and SoundCloud.

## Features

- Play music from Spotify tracks
- Play music from YouTube videos
- Play music from SoundCloud tracks
- Search and play YouTube videos by name
- Stop playback command

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a Discord bot and get your bot token:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section and create a bot
   - Copy the bot token

3. Configure the bot:
   - Rename `.env.example` to `.env`
   - Replace `your_discord_bot_token_here` with your actual bot token

4. Start the bot:
```bash
npm start
```

## Commands

- `!play <URL or search term>` - Play music from a URL or search YouTube
- `!stop` - Stop the current playback

## Supported URLs

- Spotify track URLs
- YouTube video URLs
- SoundCloud track URLs

## Requirements

- Node.js 16.x or higher
- FFmpeg installed on your system
- Discord.js v14
- @discordjs/voice
- @discordjs/opus
- play-dl

---

Copyright © 2025 Aerucodes. All rights reserved. 