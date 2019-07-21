const client = require('./../index.js');

module.exports = {
	name: 'avatar',
	description: 'Displays Avatar.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const showAvatar = {
			color: 0x006699,
			title: 'Avatar',
			author: {
				name: `${target.tag}`,
				icon_url: client.user.displayAvatarURL,
			},
			image: {
				url: target.displayAvatarURL,
			},
			timestamp: new Date(),
		};
		message.channel.send({ embed: showAvatar });
	},
};
