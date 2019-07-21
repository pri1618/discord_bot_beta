module.exports = {
	name: 'user-info',
	description: 'User Details.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if (!message.mentions.users.size) {
			message.channel.send(`Your Username: ${message.author.username}\nID: ${message.author.id}`);
		}
		else {
			message.channel.send(`${message.mentions.members.first().displayName}'s username: ${message.mentions.users.first().username}\nID: ${message.mentions.members.first().id}`);
		}
	},
};
