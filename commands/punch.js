module.exports = {
	name: 'punch',
	description: 'Punches. Real Hard.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if (!message.mentions.users.size) {
			message.channel.send('Well who should i punch? Tag someone.');
		}
		else {
			message.channel.send(`${message.author} punched ${message.mentions.users.first()} super hard. ${message.mentions.users.first().username} was knocked out and ${message.author.username} is now super-satisfied.`);
		}
	},
};
