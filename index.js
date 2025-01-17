require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { findWord, cardTranslate } = require('./functions/utility.js');
const { translate, pfp, doGoogle } = require('./functions/command.js');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	] 
});

const fredericaPresent = "<:FredericaPresent:1086311817812398090>";
const fredercaBetsuni = "<:FredericaBetsuni:900373902088355870>";
const ainurID = 790416033471004702;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
}


client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) {
		return false;
	}

	const command = interaction.client.commands.get(interaction.commandName);

	await command.execute(interaction);
});

client.on('messageCreate',async message => {

	if (message.author.username == client.user.username){
    return
  }

  if (message.content.toLowerCase() == 'frederica'){

		if(message.author.id == ainurID){
      await message.channel.send('Ada apa Ainur-sama?')
      await message.channel.sendTyping()
      await message.channel.send("Saya siap membantu kapanpun")
      await message.channel.send(fredericaPresent)

    }else{
      await message.channel.sendTyping()
      await message.channel.sendTyping()
      await message.channel.sendTyping()
      await message.channel.send('ada keperluan apa')
      await message.channel.send(fredercaBetsuni)

    }
	}
});

client.on(Events.MessageCreate, async (interaction) => {
	if (interaction.mentions.has(client.user)) {
		const messages = interaction.content.split('> ')[1];
		const mentions = interaction.mentions;

		if (findWord('pfp', messages)) {
			const results = await pfp(mentions.repliedUser);
			await interaction.channel.send(results);

		} else if (findWord('google', messages)) {
			const repliedMessage = await interaction.fetchReference();

			await doGoogle(interaction, repliedMessage.content, null, false);
		} else if (findWord('translate', messages)) {
			const repliedMessage = await interaction.fetchReference();

			const response = await translate(repliedMessage.content);
			const embed = cardTranslate(response);

			await interaction.reply({ embeds: embed });
		}
	}
});

client.once(Events.ClientReady, (interaction) => {
	console.log(`${interaction.user.tag} is online, put the lights on!`);

	client.user.setPresence({
		activities: [{ name: `Ainur-sama`, type: ActivityType.Listening }],
		status: 'online',
	});
});



client.login(process.env.CLIENT_TOKEN);
