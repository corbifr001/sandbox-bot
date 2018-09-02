const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'asshole') {
    	message.reply('Right back at ya!!');
  	}
    
  // If the message is "what is my avatar"
  if (message.content === 'what is my avatar') {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
    
  if (message.content === 'created') {
    message.channel.send(message.channel.CreatedAt);   
  }

});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
