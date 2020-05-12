const Discord = require('discord.js');
const responses = require('../responses.json');
const fortunes = [
    "Puede ser",
    "Maybe",
    "UwU",
    "OwO",
    "O_O",
    "Sin palabras",
    "Sin comentarios",
    "Pues tengo que diferir con lo que me has comentado",
    "Ajá",
    "Interesante",
    "Pienso lo mismo",
    "Puedes callarte?",
    "Cuanto peor mejor para todos y cuanto peor para todos mejor, mejor para mí, el suyo, beneficio político."
];

module.exports.run = async(bot, message, args) => {
    if(!args[0]) {
        message.reply(responses.error.noArgs0[Math.floor(Math.random()*responses.error.noArgs0.length)]);
        return;
    }
    message.reply(fortunes[Math.floor(Math.random()*fortunes.length)]);
}

module.exports.help = {
    name: "8ball"
};