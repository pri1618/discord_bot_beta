const { bot } = require('./../config.json');
const console = require('chalk-console');

module.exports = {
	name: 'purge',
	description: 'Prunes Chat.',
	execute(message, args) {
		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			message.reply('sorry but you do not have the permission to manage messages on this server.');
			return;
		}
		if(!message.guild.me.hasPermission('MANAGE_MESSAGES') || !message.guild.me.hasPermission('SEND_MESSAGES')) {
			console.green(`${bot}I lack certain permissions in ${message.guild.name}. :(`);
			message.channel.send('Cannot manage messages on this server.').catch(error => {
				console.log(error);
			});
			return;
		}
		const del = (parseInt(args[0]));
		if ((del > 99 || del < 1) || (isNaN(del))) {
			message.reply('this command only accepts a whole number between 1 and 100.');
		}
		else {
			const delCount = del + 1;
			// eslint-disable-next-line no-lonely-if
			if (!message.mentions.channels.size) {
				message.channel.bulkDelete(delCount, true).catch(err => {
					console.error(err);
					message.channel.send('There was an error deleting the message(s).');
				});
			}
			else {
				const delInChannel = message.mentions.channels.first();
				delInChannel.bulkDelete(delCount, true).catch(err => {
					console.error(err);
					message.channel.send('There was an error deleting the message(s).');
					return;
				});
			}
		}
	},
};

// .then(message.channel.send(`Deleting ${del} message(s)...`))
