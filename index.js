const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config");

const userInfoFocus = new Discord.RichEmbed()
    .setTitle('Info ⛔')
    .setDescription('En période de focus, ne pas déranger.')
    .setColor('#cc0000');

const userInfoBreak = new Discord.RichEmbed()
    .setTitle('Info ✅')
    .setDescription('En période de pause, libre.')
    .setColor('#33cc33');
let instances = [];

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('guildeCreate', guild => {
    guild.createChannel('Pomodoro', 'text')
        .then(console.log)
        .catch(console.error);
});

bot.on('message', message => {
    // ignore messages from bots
    if (message.author.bot) {
        return;
    }

    if (message.content.startsWith(`<@${bot.user.id}>`)) {
        const args = message.content.split(' ');
        const cmd = args[1];
        const pomodoroUserFound = instances.find(x => x.id === message.author.id);

        switch (cmd) {
            case 'help':
                const helpEmbed = new Discord.RichEmbed()
                    .setTitle('Mentionnez ce bot avec ces commandes :')
                    .addField('start', 'Démarrer le timer pomodoro')
                    .addField('stop', 'Stopper le timer pomodoro')
                    .addField('info + @User', 'Retourne le status de l\'utilisateur mentionné')
                    .setColor('#F52C28');
                message.channel.send(helpEmbed);
                break;
            case 'start':
                if (!pomodoroUserFound || !pomodoroUserFound.pomodoro.isStarted()) {
                    var pomodoro = require('./pomodoro')(bot, message.author);
                    pomodoro.start();
                    instances.push({id: message.author.id, pomodoro});
                    const startEmbed = new Discord.RichEmbed()
                        .setTitle('Start')
                        .setDescription(`Début du timer pomodoro pour l'utilisateur ${message.author} ...`)
                        .setColor('#00cc00');
                    message.channel.send(startEmbed);
                }else{
                    const pomodoroStarted = new Discord.RichEmbed()
                        .setTitle('Erreur')
                        .setDescription(`Le timer pomodoro fonctionne déjà pour l'utilisateur ${ message.author } ...`)
                        .setColor('#cc0000');
                    message.channel.send(pomodoroStarted);
                }
                break;
            case 'stop':
                if (pomodoroUserFound && pomodoroUserFound.pomodoro.isStarted()) {
                    pomodoroUserFound.pomodoro.stop();
                    instances = instances.filter(x => x.id !== message.author.id);
                    const stopEmbed = new Discord.RichEmbed()
                        .setTitle('Stop')
                        .setDescription('Fin du timer pomodoro ...')
                        .setColor('#F52C28');
                    message.channel.send(stopEmbed);
                }else{
                    const pomodoroStarted = new Discord.RichEmbed()
                        .setTitle('Erreur')
                        .setDescription(`Le timer pomodoro n'a pas été lancé pour l'utilisateur ${message.author} ...`)
                        .setColor('#cc0000');
                    message.channel.send(pomodoroStarted);
                }
                break;
            case 'info':
                let userMentionned = message.mentions.members.first();
                if (userMentionned != null)
                    pomodoroUserMentionned = instances.find(x => x.id === userMentionned.id);
                if (pomodoroUserMentionned && pomodoroUserMentionned.pomodoro.isStarted()) {
                    returnState(userMentionned, message.member, pomodoroUserMentionned.pomodoro.getLastState());
                }else{
                    returnState(userMentionned,message.member,null);
                }
                break;
            default:
                message.reply(`Bonjour ! Pour commencer, utilisez la commande \`@${bot.user.tag} help\``);
                break;
        }
    }
});

async function returnState(user,member,state){
    await member.createDM();
    if(state === 'break'){
        member.user.dmChannel.send(userInfoBreak);
    }else if (state === 'focus'){
        member.user.dmChannel.send(userInfoFocus);
    }else{
        const pomodoroStarted = new Discord.RichEmbed()
            .setTitle('Erreur')
            .setDescription(`Le timer pomodoro n'a pas été lancé pour l'utilisateur ${user} ...`)
            .setColor('#cc0000');
        member.user.dmChannel.send(pomodoroStarted);
    }
}

bot.login(config.token);