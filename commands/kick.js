module.exports = {
	name: 'kick',
	description: 'Kicks Member.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if(!message.member.hasPermission('KICK_MEMBERS')) {
			return message.reply('Sorry, you don\'t have permissions to use this!');
		}

		// eslint-disable-next-line prefer-const
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);

		if(!member) {
			return message.reply('Please mention a valid member of this server');
		}
		if(!member.kickable || !message.guild.me.hasPermission('KICK_MEMBERS')) {
			return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
		}

		let reason = args.slice(1).join(' ');
		if(!reason) reason = 'For Reasons Unknown.';

		member.kick(reason).catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`)).then(message.channel.send(`${member.user.tag} has been kicked by ${message.author} because: ${reason}`));

	},
};
