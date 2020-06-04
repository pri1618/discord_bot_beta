const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const { prefix, token, bot } = require('./config.json');

// const antispam = require('discord-anti-spam');
const console = require('chalk-console');
const client = new Discord.Client();
client.commands = new Discord.Collection();
module.exports = client;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// SQLite only
	storage: 'database.sqlite',
});

// const guildInfo = sequelize.import('models/guildInfo');

const guildInfo = sequelize.define('gInfo', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	antiswear: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});


const wlcmTable = sequelize.define('wlcm-tbl', {
	guildID: {
		type: Sequelize.STRING,
		unique: true,
	},
	wlcmMsg: Sequelize.TEXT,
	channelID: {
		type: Sequelize.STRING,
	},
	status: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
});


module.exports = guildInfo;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('ready', () => {
	console.green(`${bot}Ready!\n${bot}Watching ${client.users.size} users and ${client.guilds.size} servers.`);

	client.user.setPresence({
		game: {
			name: 'p!help',
		},
		status: 'online',
	});

	const ex = client.guilds.get('264445053596991498');

	setInterval(() => {
		client.user.presence.game.name = client.user.presence.game.name == 'p!help' ? client.user.setActivity(`${ex.memberCount} Users`, { type: 'WATCHING' }) : client.user.setActivity('p!help');
	}, 20000);

	guildInfo.sync();
	wlcmTable.sync();
});

client.on('error', console.error);

client.on('guildCreate', async guild => {
	console.green(`${bot}New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	// eslint-disable-next-line no-unused-vars
	const gInfo = await guildInfo.create({
		name: guild.name,
	});
});

client.on('guildMemberAdd', async member => {
	const wlcmGuild = await wlcmTable.findOne({ where: { guildID: member.guild.id } });
	if (!wlcmGuild) return;
	if (wlcmGuild.status === false || !(wlcmGuild.wlcmMsg) || !(wlcmGuild.channelID)) return;

	const wlcmCh = member.guild.channels.get(wlcmGuild.channelID);
	const welArgs = wlcmGuild.wlcmMsg;
	const msg = welArgs.replace('(here)', `<@${member.id}>`);
	wlcmCh.send(msg);
});

client.on('guildDelete', async guild => {
	console.green(`${bot}I have been removed from: ${guild.name} (id: ${guild.id})`);
	const rowAffect = await guildInfo.destroy({ where: { name: guild.name } });
	await wlcmTable.destroy({ where: { guildID: guild.id } });
	if (!rowAffect) return console.green(`${bot}Was removed without being setup.`);

	return console.green(`${bot}Database Updated.`);
});

// client.on('messageReactionAdd', async reaction => {
// 	if (reaction.emoji.name === '⭐' && reaction.message.channel.id == '563745832487092256') {
// 		const message_r = reaction.message;
// 		const starChannel = message_r.guild.channels.find(channel => channel.id === '632921494619422725');
// 		const fetch = await starChannel.fetchMessages({ limit: 100 });
// 		const fetch_d = fetch.filter(msg => msg.embeds.length > 0);
// 		const stars = fetch_d.find(m => m.embeds[0].footer.text.endsWith(message_r.id));
// 		console.log(!stars);
// 		if (!stars === false) return;
// 		if (message_r.author.id != '365975655608745985') {
// 			return message_r.channel.send ('You can only star Pokecord spawns!');
// 		}
// 		const embed_poke = message_r.embeds[0];
// 		if (!embed_poke === false) {
// 			const image = embed_poke.image.url;
// 			const embed = new Discord.RichEmbed()
// 				.setColor(15844367)
// 				.setDescription('A new rare pokemon had spawned! It\'s a...')
// 				.setTimestamp(new Date())
// 				.setImage(image)
// 				.setFooter(`ID: ${message_r.id}`);
// 			await starChannel.send(embed);
// 		}
// 		else {
// 			if (!reaction.message.content.includes('caught a')) return;
// 			const embed = new Discord.RichEmbed()
// 				.setColor(15844367)
// 				.setTitle('A shiny pokemon had spawned!')
// 				.setDescription(reaction.message.content)
// 				.setTimestamp(new Date())
// 				.setFooter(`ID: ${message_r.id}`);
// 			await starChannel.send(embed);
// 		}
// 	}
// });
//
// client.on('messageReactionRemove', async reaction => {
// 	if (reaction.emoji.name === '⭐' && reaction.message.channel.id == '563745832487092256') {
// 		const react_t = reaction.message.reactions.find(emj => emj.name = 'star');
// 		if (!react_t && reaction.message.embeds.length < 0) {
// 			const message_r = reaction.message;
// 			const starChannel = message_r.guild.channels.find(channel => channel.id === '632921494619422725');
// 			const fetch = await starChannel.fetchMessages({ limit: 100 });
// 			const fetch_d = fetch.filter(msg => msg.embeds.length > 0);
// 			const test = fetch_d.find(m => m.embeds[0].footer.text.endsWith(message_r.id));
// 			starChannel.fetchMessage(test.id).then(msg => msg.delete());
// 		}
// 	}
// });

client.on('message', async message => {

	// const logging = message.content;
	//
	// if (!message.author.bot) {
	// 	if (logging.startsWith(`${prefix}`)) {
	// 		client.channels.get('550690956228296708').send(`*${message.guild.name}(${message.channel.name}):*  ${message.content}`);
	// 	}
	// }

	const gname = await guildInfo.findOne({ where: { name: message.guild.name } });

	// if (!gname) {
	// 	if (message.content.startsWith('p!setup')) {
	// 		// eslint-disable-next-line no-unused-vars
	// 		const gInfo = await guildInfo.create({
	// 			name: message.guild.name,
	// 		});
	// 		return message.reply('Congratulations! Prime was setup successfully. Please type p!help for more information about Prime\'s functions and commands.');
	// 	}
	// }
	//
	// if (!gname && !message.author.bot && message.content.startsWith(`${prefix}`)) {
	// 	message.channel.send('Attention: You haven\'t set up Prime yet. Please set it up using p!setup.');
	// 	return;
	// }


	// This runs the filter on any message the bot receives in any guilds.
	// if (message.guild.name !== 'Discord Bot List') {
	// 	client.emit('checkMessage', message);
	// }

	if (message.content.includes('<@543797507642228739>') && !message.author.bot) {
		message.reply('type ``p!help`` to get my detailed help message.');
	}

	const pcheck = message.content.toLowerCase();

	if (!gname) return;

	const aGuild = await guildInfo.findOne({ where: { name: message.guild.name } });
	if (aGuild.antiswear === true) {
		if(pcheck.includes('fuck')) {
			message.delete();
		}
	}

	if (!message.author.bot && message.content.toLowerCase().startsWith('jeez')) {
		message.channel.send('Jeez yourself cretin!');
	}

	// if (message.content.includes('trebuchet') && message.author.id === '458919534946942986') {
	// 	const EmoteCounter = {
	// 		color: 0x0099ff,
	// 		title: 'Emote Counter',
	// 		description: 'Test Emote Counter of 4 Emotes',
	// 		fields: [
	// 			{
	// 				name: ':star:',
	// 				value: 0,
	// 			},
	// 			{
	// 				name: ':heart:',
	// 				value: 0,
	// 			},
	// 			{
	// 				name: ':eggplant:',
	// 				value: 0,
	// 			},
	// 			{
	// 				name: ':joy:',
	// 				value: 0,
	// 			},
	// 		],
	// 		timestamp: new Date(),
	// 		footer: {
	// 			text: 'Counter #890',
	// 		},
	// 	};
	// 	const NextEmoteCounter = {
	// 		color: 0x0099ff,
	// 		title: 'Emote Counter',
	// 		description: 'Test Emote Counter of 3 Emotes',
	// 		fields: [
	// 			// {
	// 			// 	name: '\u200b',
	// 			// 	value: '\u200b',
	// 			// },
	// 			{
	// 				name: ':eyes:',
	// 				value: 0,
	// 			},
	// 			{
	// 				name: ':bone:',
	// 				value: 0,
	// 			},
	// 			{
	// 				name: ':thinking:',
	// 				value: 0,
	// 			},
	// 		],
	// 		timestamp: new Date(),
	// 		footer: {
	// 			text: 'Counter #891',
	// 		},
	// 	};
	//
	// 	message.channel.send({ embed: EmoteCounter });
	// 	message.channel.send({ embed: NextEmoteCounter });
	// }
	//
	// if (message.guild.id === '563745832487092254') {
	// 	const emoteList = ['⭐', '❤️', '🍆', '😂'];
	// 	const msgList = message.content.split(' ');
	// 	const emoteUsed = [];
	// 	let counter_e = false;
	// 	// eslint-disable-next-line
	// 	for (var i in emoteList) {
	// 		// eslint-disable-next-line
	// 		for (var b in msgList) {
	// 			if (emoteList[i] === msgList[b]) {
	// 				emoteUsed.push(i);
	// 				counter_e = true;
	// 				// console.log(i);
	// 			}
	// 		}
	// 	}
	//
	// 	if (counter_e == true) {
	// 		const uniqueEmote = [...new Set(emoteUsed)];
	// 		const emoteChannel = message.guild.channels.find(channel => channel.id === '647381395970326560');
	// 		const fetch_e = await emoteChannel.fetchMessages({ limit: 30 });
	// 		const fetch_ed = fetch_e.filter(msg => msg.embeds.length > 0);
	// 		const test_e = fetch_ed.find(m => m.id == '649282980338204724');
	// 		// console.log(test_e.embeds[0]);
	// 		// eslint-disable-next-line
	// 		for (var t in uniqueEmote) {
	// 			test_e.embeds[0].fields[uniqueEmote[t]].value = parseInt(test_e.embeds[0].fields[uniqueEmote[t]].value) + 1;
	// 		}
	//
	// 		const NewEmoteCounter = {
	// 			color: 0x0099ff,
	// 			title: 'Emote Counter',
	// 			description: 'Test Emote Counter of 4 Emotes',
	// 			fields: [
	// 				{
	// 					name: ':star:',
	// 					value: test_e.embeds[0].fields[0].value,
	// 				},
	// 				{
	// 					name: ':heart:',
	// 					value: test_e.embeds[0].fields[1].value,
	// 				},
	// 				{
	// 					name: ':eggplant:',
	// 					value: test_e.embeds[0].fields[2].value,
	// 				},
	// 				{
	// 					name: ':joy:',
	// 					value: test_e.embeds[0].fields[3].value,
	// 				},
	// 			],
	// 			timestamp: new Date(),
	// 			footer: {
	// 				text: 'Counter #890',
	// 			},
	// 		};
	// 		test_e.edit({ embed: NewEmoteCounter });
	// 	}
	// }
	//
	// if (message.guild.id === '563745832487092254') {
	// 	const emoteList = ['👀', '🦴', '🤔'];
	// 	const msgList = message.content.split(' ');
	// 	const emoteUsed = [];
	// 	let counter_e = false;
	// 	// eslint-disable-next-line
	// 	for (var i in emoteList) {
	// 		// eslint-disable-next-line
	// 		for (var b in msgList) {
	// 			if (emoteList[i] === msgList[b]) {
	// 				emoteUsed.push(i);
	// 				counter_e = true;
	// 				// console.log(i);
	// 			}
	// 		}
	// 	}
	//
	// 	if (counter_e == true) {
	// 		const uniqueEmote = [...new Set(emoteUsed)];
	// 		const emoteChannel = message.guild.channels.find(channel => channel.id === '647381395970326560');
	// 		const fetch_e = await emoteChannel.fetchMessages({ limit: 30 });
	// 		const fetch_ed = fetch_e.filter(msg => msg.embeds.length > 0);
	// 		const test_e = fetch_ed.find(m => m.id == '649282983978598401');
	// 		// eslint-disable-next-line
	// 		for (var t in uniqueEmote) {
	// 			test_e.embeds[0].fields[uniqueEmote[t]].value = parseInt(test_e.embeds[0].fields[uniqueEmote[t]].value) + 1;
	// 		}
	//
	// 		const NewNextEmoteCounter = {
	// 			color: 0x0099ff,
	// 			title: 'Emote Counter',
	// 			description: 'Test Emote Counter of 3 Emotes',
	// 			fields: [
	// 				{
	// 					name: ':eyes:',
	// 					value: test_e.embeds[0].fields[0].value,
	// 				},
	// 				{
	// 					name: ':bone:',
	// 					value: test_e.embeds[0].fields[1].value,
	// 				},
	// 				{
	// 					name: ':thinking:',
	// 					value: test_e.embeds[0].fields[2].value,
	// 				},
	// 			],
	// 			timestamp: new Date(),
	// 			footer: {
	// 				text: 'Counter #891',
	// 			},
	// 		};
	// 		test_e.edit({ embed: NewNextEmoteCounter });
	// 	}
	// }

	if (message.channel.type == 'dm' && message.author.id == '458919534946942986') {
		const text = message.content;
		client.channels.get('563745832487092256').send(text);
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	// if (!commandName) {
	// 	message.channel.send('Try ``p!help``.');
	// }

	if (commandName === 'anti-swear') {
		if (args[0] === 'yes') {
			await guildInfo.update({ antiswear: true }, { where: { name: message.guild.name } });
			message.channel.send('Anti-swear feature successfully enabled!');
		}
		else if (args[0] === 'no') {
			await guildInfo.update({ antiswear: false }, { where: { name: message.guild.name } });
			message.channel.send('Anti-swear feature successfully disabled!');
		}
		else {
			message.channel.send('Correct Usage: `p!anti-swear {*yes/no*}`');
		}
	}

	else if (commandName === 'spam') {
		const times = parseInt(args[0]);
		if (message.author.id !== '458919534946942986') return;
		for (let m = 0; m < times; m++) {
			message.pin();
			message.unpin();
			await sleep(2000);
		}
	}

	else if (commandName === 'wlcm-msg') {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;
		let wlcmGuild = await wlcmTable.findOne({ where: { guildID: message.guild.id } });
		if (!wlcmGuild) {
			wlcmGuild = await wlcmTable.create({
				guildID: `${message.guild.id}`,
			});
		}
		if (!args) {
			message.channel.send('Type the welcome message for your server after the command. Be sure the set up the welcome channel of your choice using `p!wlcm-ch {channel-mention}` to make this feature work properly.');
			return;
		}
		if (!message.content.includes('(here)')) {
			message.channel.send('Please mark the place where you want the new member\'s mention to be inserted in the welcome message with (here).');
			return;
		}
		const msg = args.join('\xa0');
		await wlcmTable.update({ wlcmMsg: msg }, { where: { guildID: message.guild.id } });
		message.channel.send('Welcome message updated.');
		if (!wlcmGuild.channelID) {
			message.channel.send('Please specify channel using `p!wlcm-ch {channel-mention}`');
		}
		else {
			await wlcmTable.update({ status: true }, { where: { guildID: message.guild.id } });
		}
	}

	else if (commandName === 'wlcm-ch') {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;
		let wlcmGuild = await wlcmTable.findOne({ where: { guildID: message.guild.id } });
		if (!wlcmGuild) {
			wlcmGuild = await wlcmTable.create({
				guildID: `${message.guild.id}`,
			});
		}
		const channel = message.mentions.channels.first();
		if (!channel) {
			message.channel.send('Please mention a proper channel after the command.');
			return;
		}
		await wlcmTable.update({ channelID: channel.id }, { where: { guildID: message.guild.id } });
		message.channel.send('Welcome message channel updated.');
		if (!wlcmGuild.wlcmMsg) {
			message.channel.send('Please specify the welcome message using `p!wlcm-msg {message}`');
		}
		else {
			await wlcmTable.update({ status: true }, { where: { guildID: message.guild.id } });
		}
	}

	else if (commandName === 'wlcm-status') {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;
		let wlcmGuild = await wlcmTable.findOne({ where: { guildID: message.guild.id } });
		if (!wlcmGuild) {
			wlcmGuild = await wlcmTable.create({
				guildID: `${message.guild.id}`,
			});
		}
		if (!args) {
			message.channel.send('To enable/disable welcome messages, use `p!wlcm-status enable/disable`');
			return;
		}
		if (args[0] == 'enable') {
			if (!wlcmGuild.channelID || !wlcmGuild.wlcmMsg) {
				message.channel.send('Please make sure that welcome channel and/or welcome message are set to enable this feature.');
				return;
			}
			else {
				await wlcmTable.update({ status: true }, { where: { guildID: message.guild.id } });
				message.channel.send('Welcome messages are enabled.');
			}
		}
		else if (args[0] == 'disable') {
			await wlcmTable.update({ status: false }, { where: { guildID: message.guild.id } });
			message.channel.send('Welcome messages are disabled.');
		}
		else {
			message.channel.send('To enable/disable welcome messages, use `p!wlcm-status enable/disable`');
		}
	}

	// if (commandName === 'dev') {
	// 	const guildList = await guildInfo.findAll({ attributes: ['name'] }).map(t => t.name);
	//
	// 	const developers = ['458919534946942986'];
	//
	// 	const gldInfo = await client.guilds.map(gld => `**${gld.name}**(${gld.memberCount})`);
	//
	// 	let m;
	// 	let t;
	//
	// 	for (m in gldInfo) {
	// 		for (t in guildList) {
	// 			if (gldInfo[m].startsWith(`**${guildList[t]}`)) {
	// 				gldInfo[m] = gldInfo[m].concat('[Verified]');
	// 			}
	// 		}
	// 	}
	//
	// 	const gldString = gldInfo.join('\n');
	//
	// 	let k;
	//
	// 	for (k in developers) {
	// 		if (message.author.id === developers[k]) {
	// 			message.channel.send(gldString);
	// 		}
	// 	}
	// }

	else if (commandName === 'dev') {
		const gldInfo = await client.guilds.map(gld => `**ID**: \`\`${gld.id}\`\`, **Name**: ${gld.name}, **Members**: ${gld.memberCount}`);
		let counter = 0;
		let msg_box = '';
		// eslint-disable-next-line
		for (var m in gldInfo) {
			counter += 1;
			msg_box = msg_box.concat(`${counter}. ${gldInfo[m]}\n`);
			if (counter % 20 == 0) {
				// message.channel.send(msg_box);
				const devEmbed = {
					color: 0x0099ff,
					title: 'Servers',
					description: `${msg_box}`,
					timestamp: new Date(),
					footer: {
						text: `Embed ${counter / 20}`,
					},
				};
				message.channel.send({ embed: devEmbed });
				msg_box = '';
			}
		}
		if (msg_box) {
			const devEmbed = {
				color: 0x0099ff,
				title: 'Servers',
				description: `${msg_box}`,
				timestamp: new Date(),
				footer: {
					text: `Embed ${Math.floor(counter / 20) + 1}`,
				},
			};
			message.channel.send({ embed: devEmbed });
		}
	}

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.login(token);
