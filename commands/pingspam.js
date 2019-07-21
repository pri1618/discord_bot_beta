// eslint-disable-next-line no-unused-vars
const { maker } = require('./../config.json');

module.exports = {
	name: 'pingspam',
	description: 'Restricted Access.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === `${maker}`) {
			if (!message.mentions.users.size) {
				message.channel.send('Correct Usage: ``p!pingspam (*your victim*)``');
				return;
			}
			else {

				message.delete();
				// eslint-disable-next-line no-var
				var m;
				for (m = 0; m < 5; m++) {
					message.channel.send(`${message.mentions.users.first()}`);
				}
			}
		}
		else {
			message.reply('sorry but you do not have the necessary permissions.');
		}
	},
};

// if (message.author.id !== `${maker}`) {
// 	message.channel.send('You **thought** you could? HA!');
// 	return;
// }
