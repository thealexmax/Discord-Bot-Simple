//Import Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
//Import Config from ./config.json
const config = require('./config.json');
//Import YTDL Library
const ytdl = require('ytdl-core-discord');
//Import Youtube API
const YouTube = require('simple-youtube-api');
const ytapi = new YouTube(config.ytapikey);
//Import Custom responses
const responses = require('./responses.json');
//Are this LTT References?
let ltt = [
    "lttstore.com",
    "Esta canción está me gusta, y sabes que también me gusta, ¡Glasswire! Glasswire te permite monitorizar toda tu actividad de red. Usa el código 'Linus' para un 25% de descuento en enlace en la descripción",
    "Solo de escuchar esta canción me dan ganas de tirar un procesador de 1000$",
    "THIS VIDEO IS BROUGHT YOU BY FRESBOOKS",
    "https://www.youtube.com/watch?v=arwjAtrwl7w"
]
//BNA
let bna = [
    "OwO",
    "UwU",
    "https://media1.tenor.com/images/99d029fe30bd9605d3f6399dc88c74b1/tenor.gif?itemid=16748695",
    "https://i.imgur.com/sP5kXvI.png",
    "https://i.imgur.com/xLLBGHx.jpg"
]
//Server Music queue
let queue = [];

client.on('ready',() => {
    client.user.setPresence({ activity: { name: 'lttstore.com' }, status: "online" });
    //Output tag and prefix to the console
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Current prefix is: ${config.prefix}`);
});

//Check if a message has been sent
client.on('message', msg => {
    //Separate the message and store it in an Array
    let msgArray = msg.content.split(" ");
    //Join the array, will be useful for future commands
    let joinMsg = msgArray.slice(1).join(" ");
    //Check if the play command is sent
    if(msgArray[0] === `${config.prefix}play`) {
        if(!msgArray[1]) {
            msg.reply(`${responses.error.noURLFound[Math.floor(Math.random() * (responses.error.noURLFound.length))]}`);
            return;
        }
        //Check if the user is in a Voice Channel
        if(!msg.member.voice.channel) {
            msg.reply(`${responses.error.noJoinedVoiceChannel[Math.floor(Math.random() * (responses.error.noJoinedVoiceChannel.length))]}`);
            return;
        }
        //Check if there are any active Voice connections
        if(!msg.guild.me.voice.connection) {
            //Check if the message provided is a URL or a title
            if(!isYoutubeURL(msgArray[1])) {
                //Search for the URL of the requested song
                ytapi.searchVideos(joinMsg, 1).then(result => {
                    //If voice.connection is false join a voice channel
                    msg.member.voice.channel.join().then(conn => {
                        console.log(result[0].url);
                        queue.push(result[0].url);
                        play(conn, msg);
                    }).catch(console.error);
                });
            } else {
                //Join the voice channel and use the provided URL
                msg.member.voice.channel.join().then(conn => {
                    console.log(msgArray[1]);
                    queue.push(msgArray[1]);
                    play(conn, msg);
                }).catch(console.error);
            }
        } else {
            if(msg.member.voice.channel != msg.guild.me.voice.channel) {
                msg.reply(responses.error.notSameVC[Math.floor(Math.random()*responses.error.notSameVC.length)]);
                return;
            }
            if(!isYoutubeURL(msgArray[1])) {
                ytapi.searchVideos(joinMsg, 1).then(result => {
                    queue.push(result[0].url);
                    msg.channel.send(`✔️ ${result[0].title} añadido a la cola`);
                });
            } else {
                //Push URL into the queue
                queue.push(msgArray[1]);
                msg.channel.send("✔️ Canción añadida a la cola");
                console.log(queue);
                return;
            }
        }
    } else if(msgArray[0] === `${config.prefix}leave`) {
        //Check if the user isn't in a voice channel
        if(!msg.member.voice.channel) {
            msg.reply(`${responses.error.noJoinedVoiceChannel[Math.floor(Math.random() * (responses.error.noJoinedVoiceChannel.length))]}`);
            return;
        }
        //Check if the bot is connected to a voice channel
        if(!msg.guild.me.voice.connection) {
            msg.reply(`${responses.error.noVoiceConnection[Math.floor(Math.random() * (responses.error.noVoiceConnection.length))]}`);
            return
        }
        if(msg.member.voice.channel != msg.guild.me.voice.channel) {
            msg.reply(responses.error.notSameVC[Math.floor(Math.random()*responses.error.notSameVC.length)]);
            return;
        }
        //Clear queue
        queue = [];
        //Leave the voice channel
        msg.guild.me.voice.connection.channel.leave();
    } else if(msgArray[0] === `${config.prefix}skip`) {
        //Check if user is in a voice channel
        if(!msg.member.voice.channel) {
            msg.reply(`${responses.error.noJoinedVoiceChannel[Math.floor(Math.random() * (responses.error.noJoinedVoiceChannel.length))]}`);
            return;
        }
        //Check if the bot is not connected to a voice channel
        if(!msg.guild.me.voice.connection) {
            msg.reply(`${responses.error.noVoiceConnection[Math.floor(Math.random() * (responses.error.noVoiceConnection.length))]}`);
            return;
        }
        if(msg.member.voice.channel != msg.guild.me.voice.channel) {
            msg.reply(responses.error.notSameVC[Math.floor(Math.random()*responses.error.notSameVC.length)]);
            return;
        }
        if(!queue[0]) {
            msg.channel.send("No hay siguiente canción, procedo a salirme del canal...");
            msg.guild.me.voice.connection.channel.leave();
            return;
        }
        msg.channel.send("Reproduciendo la siguiente canción en la cola");
        //Create a new connection
        play(msg.guild.me.voice.connection, msg);
    } else if(msgArray[0] === `${config.prefix}warn`) {
        if(msg.author.id === `148401136007774208`) {
            msg.channel.send(`Estoy en modo de desarrollo, no espereis que funcione correctamente durante unos minutos`);
            msg.channel.send(`Gracias por su paciencia`);
            return;
        }
        return;
    } else if(msgArray[0] === `${config.prefix}playlist`) {
        msg.reply(`⚠️ Función de Playlist en Desarrollo`);
        msg.reply(`Si encontras algún bug repórtalo lo antes posible`);
        msg.reply(`- Alex`);
        //Check if the provided URL is a Youtube URL
        if(!isYoutubeURL) {
            msg.reply('Parece ser que el enlace que me has dado no es de youtube :/');
            return;
        }
        if(!msg.member.voice.channel) {
            msg.reply(`${responses.error.noJoinedVoiceChannel[Math.floor(Math.random() * (responses.error.noJoinedVoiceChannel.length))]}`);
            return;
        }
        if(msg.guild.me.voice.channel && msg.member.voice.channel) {
            if(msg.guild.me.voice.channel != msg.member.voice.channel) {
                msg.reply(responses.error.notSameVC[Math.floor(Math.random()*responses.error.notSameVC.length)]);
                return;
            }
        }
        //Get the playlist
        ytapi.getPlaylist(msgArray[1]).then(playlist => {
            //Get the list of videos from the playlist
            playlist.getVideos().then(videos => {
                for(i = 0; i < videos.length; i++) {
                    //Push all the videos to the queue
                    queue.push(videos[i].url);
                }
                //If voice.connection does not exist, join a voice channel
                if(!msg.guild.me.voice.connection) {
                    msg.member.voice.channel.join().then(conn => {
                        play(conn, msg);
                    }).catch(console.error);
                } else {
                    if(msg.member.voice.channel != msg.guild.me.voice.channel) {
                        msg.reply(responses.error.notSameVC[Math.floor(Math.random()*responses.error.notSameVC.length)]);
                        return;
                    }
                    //If a voice connection has already been established, don't join a voice channel
                    msg.reply(`He añadido la playlist a la cola de reproducción`);
                    return;
                }
            });
        });
    }
});

function isYoutubeURL(URL) {
    //Check if the URL provided matches this
    if(URL.match("^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+")) {
        return true;
    } else {
        return false;
    }
}

async function play(conn, message) {
    console.log(queue[0]);
    //Send the url of the song through a Text Channel
    message.channel.send(`🎵 Reproduciendo ${queue[0]} 🎵`);
    if(queue[0] == "https://www.youtube.com/watch?v=PKfxmFU3lWY") message.channel.send(ltt[Math.floor(Math.random()*ltt.length)]);
    if(queue[0] == "https://www.youtube.com/watch?v=ea-ThJDGJ1Y") message.channel.send(bna[Math.floor(Math.random()*bna.length)]);
    //Create a dispatcher
    let dispatcher = conn.play(await ytdl(queue[0], {filter: "audioonly", highWaterMark: 1<<25}), {type: 'opus'});
    //Shif the queue array
    queue.shift();
    //Check if the bot has finished playing the song
    dispatcher.on('finish', () => {
        console.log('Finished Playing');
        console.log(message.guild.me.voice.channel.members.size);
        if(message.guild.me.voice.channel.members.size === 1) {
            console.log(`VC Empty`);
            message.channel.send('El canal de voz está vacio, procedo a salirme');
            queue = [];
            message.guild.me.voice.connection.channel.leave();
            return;
        }
        //Check if there is something else in the queue
        if(queue[0]) {
            console.log('Playing Next song in queue');
            //if true play the next song
            play(conn, message);
        } else if(!queue[0]){
            //If false leave the voice channel
            console.log('Leaving Voice Channel');
            message.guild.me.voice.connection.channel.leave();
        }
    });
}

//Login
client.login(config.token);

/******************
 * 
 * Latios Core v0.1
 * By Alex W
 * 
*******************/
