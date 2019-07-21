const client = require('./../index.js');

module.exports = {
	name: 'invite',
	description: 'Invite Details.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		const invEmbed = {
			color: 0x006699,
			author: {
				name: 'Invite Links and Stuff:',
			},
			thumbnail: {
				url: client.user.displayAvatarURL,
			},
			fields: [
				{
					name: 'Bot Invite:',
					value: '[CLick To Invite](https://discordapp.com/oauth2/authorize?client_id=543797507642228739&scope=bot)',
				},
				{
					name: 'Support Server Invite:',
					value: '*Coming Soon*',
				},
			],
			timestamp: new Date(),
			footer: {
				text: 'Prime: The All Purpose Bot.',
				icon_url: client.user.displayAvatarURL,
			},
		};
		message.channel.send({ embed: invEmbed });
	},
};
