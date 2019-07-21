module.exports = {
	name: 'ban',
	description: 'Bans Member.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if(!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply('Sorry, you don\'t have permissions to use this!');
		}

		// eslint-disable-next-line prefer-const
		let member = message.mentions.members.first();

		if(!member) {
			return message.reply('Please mention a valid member of this server');
		}
		if(!member.bannable) {
			return message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
		}

		let reason = args.slice(1).join(' ');
		if(!reason) reason = 'For Reasons Unknown.';

		member.ban(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`)).then(message.reply(`${member.user.tag} has been banned by ${message.author} because: ${reason}`));

	},
};
