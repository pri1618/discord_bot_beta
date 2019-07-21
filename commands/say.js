// eslint-disable-next-line no-unused-vars
const { bot, maker } = require('./../config.json');
const console = require('chalk-console');

module.exports = {
	name: 'say',
	description: 'Restricted Access.',
	execute(message, args) {
		const rem = args.join('\xa0');
		// if (message.author.id !== `${maker}`) {
		// 	message.channel.send('You **thought** you could? LOL!');
		// 	return;
		// }
		if(!message.guild.me.hasPermission('MANAGE_MESSAGES') || !message.guild.me.hasPermission('SEND_MESSAGES')) {
			console.green(`${bot}I lack certain permissions in the ${message.guild.name}. :(`);
			message.channel.send('Cannot manage messages on this server.').catch(error => {
				console.log(error);
			});
			return;
		}
		if (!args.length) {
			message.channel.send('Give me something to say first.');
			message.delete();
			return;
		}
		else {
			message.channel.send(`${rem}`);
			message.delete();
		}
	},
};
