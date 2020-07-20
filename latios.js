const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const ytdl = require('ytdl-core-discord');

const youtube = require('simple-youtube-api');
const ytapi = new youtube(config.ytapi);

var queue = [];
client.on('ready', () => {
    console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', async msg => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith(config.prefix)) return;
    //Convert Message String into an Array
    let msgArray = msg.content.slice(config.prefix.length).split(" ");
    let joinArgs = msgArray.join(" ").slice(msgArray[0].length + 1);
    console.log(joinArgs);
    console.log(msgArray);
    switch(msgArray[0].toLowerCase()) {
        case "play":
            if(!msgArray[1]) {
                msg.reply("No has proporcionado ningún título o URL :/");
                return;
            }
            if(!msg.member.voice.channel) {
                msg.reply("Necesito que te conectes a un canal de voz para hacer eso >.< !!!");
                return;
            }
            if(!msg.guild.me.voice.connection) {
                msg.member.voice.channel.join().then(connection => {
                    console.log("Connected to Voice Channel!");
                    queue.push(joinArgs);
                    play(msg, connection);
                }).catch(console.error);
                return;
            }
            if(msg.guild.me.voice.connection) {
                if(msg.guild.me.voice.channel.id != msg.member.voice.channel.id) return;
                queue.push(joinArgs);
                msg.channel.send("Canción añadida a la cola");
                return;
            }
            break;
        case "stop":
            if(!msg.guild.me.voice.connection) {
                msg.reply("No estoy en ningún canal de voz ahora mismo");
                return;
            }
            if(!msg.member.voice.channel) {
                msg.reply("Necesito que te metas al canal de voz para hacer eso >.<");
                return;
            }
            if(msg.member.voice.channel.id != msg.guild.me.voice.channel.id) {
                msg.reply("Debes de estar en el mismo canal de voz que yo para hacer eso");
                return;
            }
            queue = [];
            msg.guild.me.voice.channel.leave();
            break;
        case "skip":
            if(!msg.guild.me.voice.connection) {
                msg.reply("No estoy en ningún canal de voz ahora mismo");
                return;
            }
            if(!msg.member.voice.channel) {
                msg.reply("Necesito que te metas al canal de voz para hacer eso >.<");
                return;
            }
            if(msg.member.voice.channel.id != msg.guild.me.voice.channel.id) {
                msg.reply("Debes de estar en el mismo canal de voz que yo para hacer eso");
                return;
            }
            queue.shift();
            if(!queue[0]) {
                console.log("Queue[0] is null leaving VC");
                msg.guild.me.voice.channel.leave();
                return;
            }
            play(msg, msg.guild.me.voice.connection);
            break;
        case "playlist":
            if(!msgArray[1]) {
                msg.reply("Necesito que me pases un enlace!");
                return;
            }
            if(!msg.guild.me.voice.connection) {
                msg.member.voice.channel.join().then(async connection => {
                    let playlist = await getPlaylistInfo(joinArgs);
                    playlist.forEach(v => {
                        queue.push(v.url);
                    });
                    play(msg, connection);
                    return;
                }).catch(console.error);
            }
            if(!msg.member.voice.channel) {
                msg.reply("Necesito que te metas al canal de voz para hacer eso >.<");
                return;
            }
            if(msg.member.voice.channel.id != msg.guild.me.voice.channel.id) {
                msg.reply("Debes de estar en el mismo canal de voz que yo para hacer eso");
                return;
            }
            let playlist = await getPlaylistInfo(joinArgs);
            playlist.forEach(v => {
                queue.push(v.url);
            });
            break;
    } 
});

function isYoutubeURL(url) {
    console.log(`Checking if: ${url} is Youtube`);
    if(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/.test(url) == true) {
        return true;
    } else {
        return false;
    }
}

async function titleToURL(title) {
    console.log("Converting title to URL");
    let videos = await ytapi.searchVideos(title);
    return videos[0].url;
}

async function getPlaylistInfo(url) {
    console.log("Playlist Function Triggered");
    let videos = await (await ytapi.getPlaylist(url)).getVideos();
    return videos;
}

async function play(message, connection) {
    console.log(queue[0])
    if(isYoutubeURL(queue[0]) == false) {
        console.log(isYoutubeURL(queue[0]));
        queue[0] = await titleToURL(queue[0]);
    }
    let dispatcher = connection.play(await ytdl(queue[0], {filter: "audioonly", highWaterMark: 1<<25}), {type: 'opus'});
    dispatcher.on('finish', () => {
        console.log("Finished Playing");
        queue.shift();
        if(message.guild.me.voice.channel.members.size === 1) {
            console.log('VC Empty');
            queue = [];
            message.guild.me.voice.connection.channel.leave();
            return;
        }
        if(queue[0]) {
            play(message, connection);
        } else {
            console.log("queue[0] is null ");
            message.guild.me.voice.connection.channel.leave();
            return;
        }
    });
}

client.login(config.token);
