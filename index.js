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

	// client.guilds.find(g => g.name === 'Champion Server').channels.find(ch => ch.name === 'general').send('Took you long enough to set me up.');

	// antispam(client, {
	// 	// Maximum ammount of messages allowed to send in the interval time before getting warned.
	// 	warnBuffer: 10,
	// 	// Maximum amount of messages allowed to send in the interval time before getting banned.
	// 	maxBuffer: 20,
	// 	// Amount of time in ms users can send the maxim amount of messages(maxBuffer) before getting banned.
	// 	interval: 2000,
	// 	// Message users receive when warned. (message starts with '@User, ' so you only need to input continue of it.)
	// 	warningMessage: ('please stop spamming!'),
	// 	// Message sent in chat when user is banned. (message starts with '@User, ' so you only need to input continue of it.)
	// 	banMessage: ('has been hit by ban hammer for spamming!'),
	// 	// Maximum amount of duplicate messages a user can send in a timespan before getting warned.
	// 	maxDuplicatesWarning: 7,
	// 	// Maximum amount of duplicate messages a user can send in a timespan before getting banned.
	// 	maxDuplicatesBan: 10,
	// 	// Deletes the message history of the banned user in x days.
	// 	deleteMessagesAfterBanForPastDays: 7,
	// 	// Name of roles (case sensitive) that are exempt from spam filter.
	// 	exemptRoles: ['Discord Owner', 'Discord Admin', 'Discord Moderator', 'Discord Assistant', 'Maker'],
	// 	// The Discord tags of the users (e.g: MrAugu#9016) (case sensitive) that are exempt from spam filter.
	// 	exemptUsers: ['priyanth#1987'],
	// });
});

client.on('error', console.error);

client.on('guildCreate', async guild => {
	console.green(`${bot}New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	// eslint-disable-next-line no-unused-vars
	const gInfo = await guildInfo.create({
		name: guild.name,
	});
});

client.on('guildDelete', async guild => {
	console.green(`${bot}I have been removed from: ${guild.name} (id: ${guild.id})`);
	const rowAffect = await guildInfo.destroy({ where: { name: guild.name } });
	if (!rowAffect) return console.green(`${bot}Was removed without being setup.`);

	return console.green(`${bot}Database Updated.`);
});

client.on('message', async message => {

	const logging = message.content;

	if (!message.author.bot) {
		if (logging.startsWith(`${prefix}`)) {
			client.channels.get('550690956228296708').send(`*${message.guild.name}(${message.channel.name}):*  ${message.content}`);
		}
	}

	const gname = await guildInfo.findOne({ where: { name: message.guild.name } });

	if (!gname) {
		if (message.content.startsWith('p!setup')) {
			// eslint-disable-next-line no-unused-vars
			const gInfo = await guildInfo.create({
				name: message.guild.name,
			});
			return message.reply('Congratulations! Prime was setup successfully. Please type p!help for more information about Prime\'s functions and commands.');
		}
	}

	if (!gname && !message.author.bot && message.content.startsWith(`${prefix}`)) {
		message.channel.send('Attention: You haven\'t set up Prime yet. Please set it up using p!setup.');
		return;
	}


	// This runs the filter on any message the bot receives in any guilds.
	// if (message.guild.name !== 'Discord Bot List') {
	// 	client.emit('checkMessage', message);
	// }

	if (message.content.startsWith('<@543797507642228739>') && !message.author.bot) {
		message.reply('type ``p!help`` to get my detailed help message.');
	}

	const pcheck = message.content.toLowerCase();

	if (!gname) return;

	const aGuild = await guildInfo.findOne({ where: { name: message.guild.name } }).catch(error =>{
		console.error(error);
	});
	if (aGuild.antiswear === true) {
		if(pcheck.includes('trebuchet')) {
			message.delete();
		}
	}

	// if (!message.author.bot && message.content.toLowerCase().startsWith('jeez')) {
	// 	message.channel.send('Jeez yourself cretin!');
	// }

	if (message.channel.type == 'dm' && message.author.id == '458919534946942986') {
		const text = message.content;
		client.channels.get('550687993938051095').send(text);
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	if (!commandName) {
		message.channel.send('Try ``p!help``.');
	}

	else if (commandName === 'anti-swear') {
		if (args[0] === 'yes') {
			await guildInfo.update({ antiswear: true }, { where: { name: message.guild.name } }).catch(error => {
				console.error(error);
			});
			message.channel.send('Anti-swear feature successfully enabled!');
		}
		else if (args[0] === 'no') {
			await guildInfo.update({ antiswear: false }, { where: { name: message.guild.name } }).catch(error => {
				console.error(error);
			});
			message.channel.send('Anti-swear feature successfully disabled!');
		}
		else {
			message.channel.send('Correct Usage: `p!anti-swear {*yes/no*}`');
		}
	}

	else if (commandName === 'spam') {
		const times = parseInt(args[0]);
		if (message.author.id !== '458919534946942986') return;
		for (let i = 0; i < times; i++) {
			message.channel.send('spam');
			await sleep(2000);
		}
	}

	// if (commandName === 'dev') {
	// 	const guildList = await guildInfo.findAll({ attributes: ['name'] }).map(t => t.name).catch(error => {
	// 		console.error(error);
	// 	});
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


// eslint-disable-next-line no-var
// var i;
// for (i = 0; i < count; i++) {
// 	const pword = pcheck[i].toLowerCase();
// 	const counter = (pcheck[i].length) - 3;
// 	// eslint-disable-next-line no-var
// 	var g = 0;
// 	const aGuild = await guildInfo.findOne({ where: { name: message.guild.name } }).catch(error =>{
// 		console.error(error);
// 	});
// 	if (aGuild.antiswear === true) {
// 		if (pword.length == 4 && pword === 'mart') {
// 			message.channel.send(`Please refrain from using profanity, ${message.author}!`);
// 			message.delete();
// 			break;
// 		}
// 		else {
// 			for (g = 0; g < counter; g++) {
// 				if (pword[g] === ('m')) {
// 					if (pword[g + 1] === ('a')) {
// 						if (pword[g + 2] === ('r')) {
// 							if (pword[g + 3] === ('t')) {
// 								message.channel.send(`Please refrain from using profanity, ${message.author}!`);
// 								message.delete();
// 								break;
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// test
