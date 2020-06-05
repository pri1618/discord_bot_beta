const client = require('./../index.js');

module.exports = {
	name: 'support',
	description: 'Sends a support embed to support server.',
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		const rem = args.join('\xa0');
	    if (!args.length) return message.channel.send('Correct usage: `p!support {message}`.');
		const embed2 = {
			author: {
				name: 'Feedback',
				icon_url: message.author.displayAvatarURL,
			},
			color: 0x006699,
			description: `**Message:** ${rem}\n**Author:** ${message.author.tag}\n**Server:** ${message.guild.name} - ${message.guild.id}`,
			footer: {
				text: 'Prime: The All Purpose Bot.',
				icon_url: client.user.displayAvatarURL,
			},
		};
		client.channels.get('663701069234176000').send({ embed: embed2 });
	},
};
