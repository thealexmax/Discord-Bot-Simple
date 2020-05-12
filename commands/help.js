const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async(bot, message) => {
    let embed = new Discord.MessageEmbed().setColor("#0080ff")
    .setTitle("Help Menu").setAuthor("Latios", "https://cdn.discordapp.com/avatars/335853813309112321/7c4ab1af3025e9b254a03f05c0ba8e27.png")
    .addFields({name: `${config.prefix}play`, value: 'Reproduce la canción indicada', inline: true},
    {name: `${config.prefix}leave`, value: 'Latios procede a salirse del canal de voz', inline: true},
    {name: `${config.prefix}skip`, value: 'Latios salta a la siguiente canción'},
    {name: `${config.prefix}playlist <URL>`, value: 'Latios va a intentar reproducir la playlist que le has dado (De momento solo se puede con youtube)'},
    {name: `${config.prefix}gif <Gif>`, value: 'Latios te enviará un gif basado en lo que le has pedido que busque'},
    {name: `${config.prefix}8ball <Algo>`, value: 'Pregúntale algo a latios para que exprese su opinión sobre el tema'},
    {name: `${config.prefix}coin <cara/cruz>`, value: 'Ya deberías de saber como va la cosa'},
    {name: `${config.prefix}profile`, value: 'EXPERIMENTAL'})
    .setFooter('Latios Delta ~VSCODE:InDev~ ~NokiManager~');
    message.channel.send(embed);
}

module.exports.help = {
    name: "help"
};