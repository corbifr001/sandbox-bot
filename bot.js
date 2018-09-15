const Discord = require('discord.js');

const client = new Discord.Client({disableEveryone: true});

// Initilalize the invites cache
const invites = {};
const wait = require('util').promisify(setTimeout);

const ladiesRole = "LADIES";
const adultRole = "ADULT";
const underageRole = "UNDERAGE";

//let role = message.guild.roles.find(r => r.name === ladiesRole);

client.on('ready', async () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
 
    try {
        //let link = await client.generateInvite(["ADMINISTRATOR"]);
        let link = await client.generateInvite(["SEND_MESSAGES"]);
        //let link = await client.generateInvite(["CREATE_INSTANT_INVITE","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","EMBED_LINKS","MANAGE_NICKNAMES","MANAGE_ROLES","MANAGE_EMOJIS"]);
        console.log(link);
    } catch(e) {
        console.log(e.stack);
    }
    
    // "ready" isn't really ready. We need to wait a spell.
    wait(1000);

    // Load all invites for all guilds and save them to the cache.
    client.guilds.forEach(g => {
      g.fetchInvites().then(guildInvites => {
        invites[g.id] = guildInvites;
      });
    });
});

client.on('guildMemberAdd', member => {
    member.guild.fetchInvites().then(async guildInvites => {
        console.log('guildMemberAdd event started!');
        console.log('---------------------------------------------');
        
        const ei = invites[member.guild.id]; // the existing invites
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses); // find the invite code for which the count has increased
        const inviter = client.users.get(invite.inviter.id);
        const logChannel = member.guild.channels.find("name", "logs");
        logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`);
    
        let roleName = '';
        let roleColor = '';

        console.log(`Invite Code: ${invite.code}`);
        

        switch (invite.code) {
            case process.env.Asshole: roleName = "Asshole"; roleColor = "RED"; break;
            case process.env.Ladies: roleName = "Ladies"; roleColor = "BLUE"; break;
            default: roleName = "Community"; roleColor = "WHITE"
        }

        console.log(`RoleName: ${roleName}`);

        member.guild.roles.forEach(r => {
            if (r.name === roleName) {
                console.log(`Role Name: ${r.name}`);
                console.log(r);
            }
        });
        
        let role = member.guild.roles.find(r => r.name === roleName);

        console.log('---------------------------------------------');

        console.log(role);
        if (!role) {
            try {
                role = await member.guild.createRole({
                    name: roleName,
                    color: roleColor
                });
            } catch(e) {
                console.log(e.stack);        
            }
        }

        if (member.roles.has(role.id)) return logChannel.send('This user already has that role.  Weird!');
        await member.addRole(role);

        return logChannel.send(`Role ${role.name} was successfully added`);

    }).catch(e => {
        console.log(e.stack);
    });
    return;
});

client.on('message', async message => {
    // Make sure bots can't call bots...
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
        console.log('Test from command.');
        return message.reply('Testing the GuildMemberAdd method.');
        client.emit("guildMemberAdd", message.member);
    }

});

client.on('guildMemberRemove', GuildMember => {
    GuildMember.guild.channels.find("name", "general").send(`"${GuildMember.user.username}" we're sad to see you go`);
});

// Get the Token from the server configuration
client.login(process.env.BOT_TOKEN);
