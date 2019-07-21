const client = require('./../index.js');
const moment = require('moment');

module.exports = {
	name: 'server',
	description: 'Server Details.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		const bots = message.guild.members.filter(member => member.user.bot).size;
		const serverEmbed = {
			color: 0x006699,
			title: 'Server Information:',
			fields: [
				{
					name: 'Name',
					value: `${message.guild.name}`,
					inline: true,
				},
				{
					name: 'ID',
					value: `${message.guild.id}`,
					inline: true,
				},
				{
					name: 'Region',
					value: `${message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1)}`,
					inline: true,
				},
				{
					name: 'Owner',
					value: `${message.guild.owner}`,
					inline: true,
				},
				{
					name: 'Member count',
					value: `${message.guild.memberCount}`,
					inline: true,
				},
				{
					name: 'Bot Count',
					value: `${bots}`,
					inline: true,
				},
				{
					name: 'Channels',
					value: `${message.guild.channels.size}`,

					inline: true,
				},
				{
					name: 'Created On',
					value: `${moment(message.guild.createdAt).format('DD MMMM YYYY')}`,
					inline: true,
				},
			],
			timestamp: new Date(),
			footer: {
				text: 'Prime: The All Purpose Bot.',
				icon_url: client.user.displayAvatarURL,
			},
		};

		if (message.guild.iconURL) {
			serverEmbed.thumbnail = { url: `${message.guild.iconURL}` };
			message.channel.send({ embed: serverEmbed });
		}
		else {
			serverEmbed.fields.push({ name: '\u200b', value: '\u200b', inline: true });
			message.channel.send({ embed: serverEmbed });
		}
	},
};

// const client = require('./../index.js');
// const moment = require('moment');
//
// module.exports = {
// 	name: 'server',
// 	description: 'Server Details.',
// 	// eslint-disable-next-line no-unused-vars
// 	async execute(message, args) {
// 		const txtChannels = message.guild.channels.filter(ch => ch.type === 'text').size;
// 		const vocChannels = message.guild.channels.filter(ch => ch.type === 'voice').size;
//		let owner = message.guild.owner;
//		if (!owner) {
//			owner = 'None Found';
//		}
// 		let afkbool = '';
// 		if (!message.guild.afkChannel) {
// 			afkbool = 'None';
// 		}
// 		else {
// 			afkbool = `${message.guild.afkChannel.name} (ID: ${message.guild.afkChannel.id})`;
// 		}
// 		const serverEmbed = {
// 			color: 0xa8b4e8,
// 			description: `Info about **${message.guild.name}** server\n(ID: ${message.guild.id})`,
// 			fields: [
// 				{
// 					name: '❯ Channels',
// 					value: `• ${txtChannels} Text, ${vocChannels} Voice\n• AFK: ${afkbool}`,
// 				},
// 				{
// 					name: '❯ Members',
// 					value: `• ${message.guild.memberCount} Members\n• Owner: ${owner}`,
// 				},
// 				{
// 					name: '❯ Other',
// 					value: `• Roles: ${message.guild.roles.size}\n• Region: ${message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1)}\n• Created At: ${moment(message.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n• Verification Level: ${message.guild.verificationLevel}`,
// 				},
// 			],
// 		};
//
// 		if (message.guild.iconURL) {
// 			serverEmbed.thumbnail = { url: `${message.guild.iconURL}` };
// 			message.channel.send({ embed: serverEmbed });
// 		}
// 		else {
// 			serverEmbed.fields.push({ name: '\u200b', value: '\u200b', inline: true });
// 			message.channel.send({ embed: serverEmbed });
// 		}
// 	},
// };
