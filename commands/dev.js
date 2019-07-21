const client = require('./../index.js');
const { maker } = require('./../config.json');
const { guildInfo } = require('./../dbInit');

module.exports = {
	name: 'dev',
	description: 'Developer\'s Area.',
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		const guildList = await guildInfo.findAll({ attributes: ['name'] }).map(t => t.name).catch(error => {
			console.error(error);
		});

		const developers = [`${maker}`, '486191605351579658'];

		const gldInfo = await client.guilds.map(gld => `**${gld.name}**(${gld.memberCount})`);

		let m;
		let t;

		for (m in gldInfo) {
			for (t in guildList) {
				if (gldInfo[m].startsWith(`**${guildList[t]}`)) {
					gldInfo[m] = gldInfo[m].concat('[Verified]');
				}
			}
		}

		const gldString = gldInfo.join('\n');

		let k;

		for (k in developers) {
			if (message.author.id === developers[k]) {
				message.channel.send(gldString);
			}
		}
	},
};
