require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to play music!');
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a song URL or search term!');
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false
            });

            let stream;
            let type;

            // Check if the input is a URL
            if (query.startsWith('http')) {
                if (query.includes('spotify.com')) {
                    const spotifyData = await play.spotify(query);
                    if (spotifyData.type === 'track') {
                        stream = await play.stream(spotifyData.url);
                        type = 'spotify';
                    } else {
                        return message.reply('Please provide a Spotify track URL!');
                    }
                } else if (query.includes('youtube.com') || query.includes('youtu.be')) {
                    const ytData = await play.video_info(query);
                    stream = await play.stream(query);
                    type = 'youtube';
                } else if (query.includes('soundcloud.com')) {
                    stream = await play.stream(query);
                    type = 'soundcloud';
                }
            } else {
                // Search YouTube if no URL is provided
                const ytSearch = await play.search(query, { limit: 1 });
                if (ytSearch.length === 0) {
                    return message.reply('No results found!');
                }
                stream = await play.stream(ytSearch[0].url);
                type = 'youtube';
            }

            const resource = stream.stream;
            const player = connection.play(resource);

            message.reply(`Now playing: ${query}`);

            player.on('stateChange', (oldState, newState) => {
                if (newState.status === 'idle') {
                    message.channel.send('Finished playing!');
                    connection.destroy();
                }
            });

            connection.on('error', error => {
                console.error(error);
                message.channel.send('An error occurred while playing music!');
                connection.destroy();
            });

        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to play the music!');
        }
    }

    if (command === 'stop') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to stop music!');
        }

        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            message.reply('Stopped playing music!');
        } else {
            message.reply('I am not playing any music!');
        }
    }
});

client.login(process.env.DISCORD_TOKEN); 