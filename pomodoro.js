const Discord = require("discord.js");
const delay = require('delay');

const messageStart = new Discord.RichEmbed()
    .setTitle('Start 🍅')
    .setDescription('Démarrage du timer pomodoro')
    .setColor('#33cc33');

const messageFocus = new Discord.RichEmbed()
    .setTitle('Focus')
    .setDescription('Session de focus : 25 minutes')
    .setColor('#ffff00');

const messageBreak = new Discord.RichEmbed()
    .setTitle('Break')
    .setDescription('Session de pause : 5 minutes')
    .setColor('#ffff00');

const messageStop = new Discord.RichEmbed()
    .setTitle('Stop 🍅')
    .setDescription('Fin du timer pomodoro')
    .setColor('#cc0000');

class Teamodoro {
    constructor(bot, user) {
        this.lastState = null;
        this.started = false;
        this.bot = bot;
        this.user = user;
    }

    async start() {
        await this.user.createDM();
        this.user.dmChannel.send(messageStart);
        this.started = true;
        while(this.started){
            await this.focus();
            await this.break();
        }
    }

    stop() {
        this.started = false;
        this.user.dmChannel.send(messageStop);
    }

    async break(){
        if (this.started){
            this.user.dmChannel.send(messageBreak);
            this.lastState = 'break';
            await delay(300000);
        }
    }

    async focus(){
        if (this.started) {
            this.user.dmChannel.send(messageFocus);
            this.lastState = 'focus';
            await delay(1500000);
        }
    }

    isStarted() {
        return this.started;
    }

    getLastState(){
        return this.lastState;
    }
}

module.exports = (bot, user) => new Teamodoro(bot, user);
