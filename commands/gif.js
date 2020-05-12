const Discord = require('discord.js');
const config = require('../config.json');
const https = require('https');

module.exports.run = async(bot, message, args) => {
    fullargs = args.join(" ");
    console.log(fullargs);
    if(!fullargs) {
        message.channel.send("Error I/O: No se pudo encontrar texto de entrada");
        return;
    }
    https.get("https://api.tenor.com/v1/search?q=" + fullargs + "&key=" +
    config.tenorapi + "&limit=" + 8, res => {
        res.setEncoding("utf8");
        let data = '';
        res.on('data', (chunk) => {
            data += chunk
        });
        res.on('end', () => {
            let gif = JSON.parse(data);
            if(!gif.results) {
                message.channel.send("No he encontrado nada con ese término de búsqueda sorry :/");
                return;
            }
            message.channel.send(gif.results[Math.floor(Math.random() * gif.results.length)].url);
        });
    });
}

module.exports.help = {
    name: "gif"
};