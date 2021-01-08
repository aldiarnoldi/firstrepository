const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NzM3MjIzOTMzODA3NDI3NjU1.Xx6PSg.duuGMd4B1_NHo0BnvXgsFmVTo7Q';

const PREFIX = '!';
const All = '100';
const ytdl = require("ytdl-core");
var servers = {};

bot.on('ready', () =>{
    console.log('The bot is online');
    bot.user.setActivity('Celenk Crew', {type: 'STREAMING', url:'https://www.twitch.tv/seraphimx777'}).catch(console.error);
})

bot.on('guildMemberAdd', member=>{
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;

    channel.send(`Welcome to our server, ${member}!`)
})

bot.on('message', message=> {
    if(message.content === 'Hello'){
        message.channel.send('Hello, ' + message.author.username + '!');
    }
})

bot.on('message', message=>{
    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            message.reply('pong');
        break;
        case 'info':
            if(args[1] === 'author'){
                message.reply('SOME AUTHOR DESCRIPTION')
            }
            else{
                message.reply('I dont understand your question. Please use some more word')
            }
        break;
        case 'clear':
            if(!args[1]) return message.channel.bulkDelete(All)
            message.channel.bulkDelete(args[1]);
            console.log(args[1] + ' messages deleted ' + message.author.username);
        break;
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];
                
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }
                    else{
                        connection.disconnect();
                    }
                });
            }

            if(!args[1]){
            message.reply('You need to provide a Link!');
            return;
            }
            if(!message.member.voice.channel){
                message.reply('You must be in a voice channel to use the bot!');
                return;
            }if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            })

        break;

        case 'skip':
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song!")
            break;

        case 'stop':
            var server = servers[message.guild.id];
            if (message.guild.voice.connection) {
                for (var i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 2);
                }

                server.dispatcher.end();
                console.log('stopped the queue')
            }

        }
        if (message.guild.connection) message.guild.voice.connection.disconnect();
    }
)

bot.login(token);