const client = require('./../index.js');
const { prefix } = require('./../config.json');

module.exports = {
	name: 'help',
	description: 'Lists Commands And Their Uses.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		const helpEmbed = {
			color: 0x006699,
			title: 'Commands and Functions:',
			author: {
				name: 'Prime',
				icon_url: client.user.displayAvatarURL,
			},
			description: `A concise list of all the commands recognised by Prime and their uses and usage.\nPrefix: **${prefix}**`,
			fields: [
				{
					name: 'ping',
					value: 'Test command to check if Prime is online and serviceable.',
				},
				{
					name: 'server',
					value: 'Returns server related information.',
				},
				{
					name: 'channel',
					value: 'Returns current channel\'s information or the tagged channel\'s information.\nCorrect Usage: `p!channel (*optional channel tag*)`',
				},
				{
					name: 'user-info',
					value: 'Returns the tagged user\'s information or your own if no user-tags are found.\nCorrect Usage: `p!user-info (*optional user tag*)`',
				},
				{
					name: 'avatar',
					value: 'Returns your avatar or the tagged user\'s avatar.\nCorrect Usage: `p!avatar (*optional user tag*)`',
				},
				{
					name: 'purge',
					value: 'Purges 1 to 99 messages in the current channel or the tagged channel.\nCorrect Usage: `p!purge (*whole number b/w 1-99*)`',
				},
				{
					name: 'say',
					value: 'Makes Prime say whatever you type after !say.\nCorrect Usage: `p!say (*whatever you want it to say*)`',
				},
				{
					name: 'help',
					value: 'No Explanation Required.',
				},
				{
					name: 'invite',
					value: 'Get the Bot Invite and Support Server Invite from here.',
				},
				{
					name: 'anti-swear',
					value: 'Special antiswear feature which lets no one say the `\'f\'` word. Enabled by default.\nCorrect Usage: `p!anti-swear (*yes/no*)`',
				},
			],
			timestamp: new Date(),
			footer: {
				text: 'Prime: The All Purpose Bot.',
				icon_url: client.user.displayAvatarURL,
			},
		};

		message.channel.send({ embed: helpEmbed });

	},
};
