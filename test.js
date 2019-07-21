// Support system template

// if (command === 'support') {
// 	const rem = args.join('\xa0');
// 	if (!args.length) {
// 		const embed2 = {
// 			author: {
// 				name: `${message.author.tag}`,
// 				icon_url: message.author.displayAvatarURL,
// 			},
// 			color: 0xff0000,
// 			description: 'test',
// 		};
// 		client.channels.get('547386402627911691').send({ embed: embed2 });
// 	}
// 	else {
// 		const embed2 = {
// 			author: {
// 				name: `${message.author.tag}`,
// 				icon_url: message.author.displayAvatarURL,
// 			},
// 			color: 0xff0000,
// 			description: `${rem}`,
// 			footer: {
// 				text: 'Prime: The All Purpose Bot.',
// 				icon_url: client.user.displayAvatarURL,
// 			},
// 		};
// 		client.channels.get('547386402627911691').send({ embed: embed2 });
// 	}
// }


// Preferential Welcome-Message base template

// // eslint-disable-next-line
// if (commandName === 'wlcm-msg' && message.member.hasPermission('ADMINISTRATOR')) {
//   if (!args.length) {
//     message.channel.send('Enter the welcome text after command. Be sure to put ``(here)`` where you want the member\'s name to be.');
//   }
//   else if (!args.includes('(here)')) {
//     message.channel.send('Please include ``(here)`` in your message to specify where the new member\'s name should appear.');
//   }
//   else {
//     const wlcmmsg = args.join('\xa0');
//     const affectedRows = await MODguilds.update({ welcomeMessage: wlcmmsg }, { where: { guildID: message.guild.id } });
//   }
// }
//
// const gld = await MODguilds.findOne({ where: { guildID: member.guild.id } });
//
// if (!gld) {
//   channel.send(`Welcome to the server, ${member}`);
// }
// else {
//   const welArgs = gld.welcomeMessage.split(' ');
//   const indexHere = welArgs.indexOf('(here)');
//   welArgs[indexHere] = `${member}`;
//   const msg = welArgs.join('\xa0');
//   channel.send(msg)
// }


// Currency System for MOD

const MODmon = sequelize.define('MODmoney', {
	name: {
		type: Sequelize.STRING,
	},
	userID: {
		type: Sequelize.STRING,
		unique: true,
	},
	balance: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

const pID = await MODmon.findOne({ where: { userID: message.author.id } });
if (commandName === 'bal') {
  if (!pTD) {
    const MODmoney = await MODmon.create({
      userID: message.author.id,
      name: message.author.tag,
  	});
    message.channel.send(`${message.author.username}'s Balance: 0 Պ'`);
  }
  else {
    message.channel.send(`${message.author.username}'s Balance: ${pID.balance} Պ'`);
  }
}

else if (commandName === 'work') {
  const rndmBal = Math.round(Math.random() * (150 - 100) + 100);

  if (!pID) {
    const MODmoney = await MODmon.create({
      userID: message.author.id,
      name: message.author.tag,
  	});
    await MODmon.update({ balance: rndmBal }, { where: { userID: message.author.id } }).catch(error => {
      console.error(error);
    });
  }
  else {
    const newBal = pID.balance + rndmBal;
    await MODmon.update({ balance: newBal }, { where: { userID: message.author.id } }).catch(error => {
      console.error(error);
    });
  }
}

else if (commandName === 'gamble') {
	if (!args[0]) return message.reply('gamble how much? Provide a valid number the next time.');
	if (!pID) return message.reply('sorry but you need mingots to gamble.');
	if (!parseInt(args[0])) return message.reply(`I can't gamble ${args[0]}. Try using a number next time.`);
	if (pID.balance < parseInt(args[0])) return message.reply('you cant gamble more mingots than you currenctly have.');
	const bool = Math.random() > 0.5;
	if (bool === false) {
		pID.balance -= parseInt(args[0]);
		await pID.save();
		return message.reply(`you lost the gamble and your ${args[0]} Պ. You are now left with ${pID.balance} Պ.`);
	}
	else {
		const wGamb = (Math.round(Math.random()*100))*(parseInt(args[0]));
		pID.balance += wGamb;
		await pID.save();
		return message.reply(`congrats. You won ${wGamb} Պ. You now have ${pID.balance} Պ.`);
	}
}
