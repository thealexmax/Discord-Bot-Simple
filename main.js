const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const faces = require('./faces.json');
const fs = require('fs');
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {
        console.log("Couldn't find Commands");
        return;
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} Loaded!`);
        client.commands.set(props.help.name, props);
    });
});

client.on('ready', () => {
    console.log(`Latios Main Service Started: ${client.user.tag}`);
    console.log(`Using prefix: ${config.prefix}`);
});

client.on('message', async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
    //if(!msg.content.startsWith(config.prefix)) return;
    let msgArray = msg.content.split(" ");
    let cmd = msgArray[0];
    let args = msgArray.slice(1);
    let commandfile = client.commands.get(cmd.slice(config.prefix.length));
    if(commandfile && msg.content.startsWith(config.prefix)) commandfile.run(client, msg, args);
    if(!commandfile) {
        if(msgArray.length === 1) {
            msgAn = msgArray[0].split("");
            if(msgAn.length === 3) {
                if(msgAn[1].toLowerCase() == "j") return;
                if(msgAn[1].toLowerCase() == "y") return;
                if(msgAn[1].toLowerCase() == "n") return;
                if(msgAn[1].toLowerCase() == "o") return;
                if(msgAn[1].toLowerCase() == msgAn[0].toLowerCase()) return;
                if(msgAn[0].toLowerCase() == msgAn[2].toLowerCase()) {
                    msg.reply(faces.faces[Math.floor(Math.random() * faces.faces.length)]);
                }
            }
        }
    }
});

client.login(config.token);