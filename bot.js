const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    //client.user.setActivity(`Serving ${client.guilds.size} servers`);
    //console.log('I am ready!');
});

client.on('message', async message => {
    if (message.content === 'asshole') {
    	message.reply('Right back at ya!!');
  	}
    
  // If the message is "what is my avatar"
  if (message.content === 'what is my avatar') {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
    
  if (message.content === 'created') {
    //message.channel.send(message.channel.CreatedAt);
     message.reply('Response: '+message.channel.CreatedAt);
     console.log('Message created at: '+message.channel.CreatedAt);
  }
    
  if (message.content === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    //m.edit('Pong!');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

});

client.on('guildMemberAdd', GuildMember => {
    
});

// Get the Token from the server configuration
client.login(process.env.BOT_TOKEN);
