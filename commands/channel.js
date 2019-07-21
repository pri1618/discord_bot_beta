const client = require('./../index.js');
const moment = require('moment');

module.exports = {
	name: 'channel',
	description: 'Channel Name.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		const chEmbed = {
			color: 0x006699,
			title: 'Channel Information:',
			timestamp: new Date(),
			footer: {
				text: 'Prime: The All Purpose Bot.',
				icon_url: client.user.displayAvatarURL,
			},
		};

		if (!message.mentions.channels.size) {
			// eslint-disable-next-line prefer-const
			let ch = message.channel;
			chEmbed.fields = [{ name: 'Name', value: `${ch.name}`, inline: true }, { name: 'ID', value: `${ch.id}`, inline: true }, { name: 'Created On', value: `${moment(ch.createdAt).format('DD MMMM YYYY')}` }];
			ch.send({ embed: chEmbed }).catch(error => {
				console.error(error);
			});
		}
		else {
			// eslint-disable-next-line prefer-const
			let chMention = message.mentions.channels.first();
			chEmbed.fields = chEmbed.fields = [{ name: 'Name', value: `${chMention.name}`, inline: true }, { name: 'ID', value: `${chMention.id}`, inline: true }, { name: 'Created On', value: `${moment(chMention.createdAt).format('DD MMMM YYYY')}` }];
			message.channel.send({ embed: chEmbed }).catch(error => {
				console.error(error);
			});
		}
	},
};
