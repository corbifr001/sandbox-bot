const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    //client.user.setActivity(`Serving ${client.guilds.size} servers`);
    //console.log('I am ready!');
});

client.on('message', async message => {
    // MAke sure bots can't call bots...
    if(message.author.bot) return;
    
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if (command === 'asshole') {
    	message.reply('Right back at ya!!');
  	}
    
  // If the message is "what is my avatar"
  if (command === 'what is my avatar') {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
    
  if (command === 'created') {
    //message.channel.send(message.channel.CreatedAt);
     message.reply('Response: '+message.channel.CreatedAt);
     console.log('Message created at: '+message.channel.CreatedAt);
  }
    
  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    //m.edit('Pong!');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
    
  if (command === "admin") {
      
      
      if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) ) {
        return message.reply("Sorry, you are not an admin!");
      } else {
          return message.reply("You are an admin or moderator.");
      }
  }
    
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
    
    if (command === 'test') {
        return message.reply('Testing the GuildMemberAdd method.');
        client.emit("guildMemberAdd", message.member);
    }

});

client.on('guildMemberAdd', GuildMember => {
    //GuildMember.guild.channels.find("name", "general").send('A new member joined. Say hi!');
    GuildMember.guild.channels.find("name", "general").send(`"${GuildMember.user.username}" has joined this server`);
});

client.on('guildMemberRemove', GuildMember => {
    //GuildMember.guild.channels.find("name", "general").send('A new member joined. Say hi!');
    GuildMember.guild.channels.find("name", "general").send(`"${GuildMember.user.username}" we're sad to see you go`);
});

// Get the Token from the server configuration
client.login(process.env.BOT_TOKEN);
