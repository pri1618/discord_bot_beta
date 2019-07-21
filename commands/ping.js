const client = require('./../index.js');

module.exports = {
	name: 'ping',
	description: 'Returns Bot\'s ping.',
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		const msg = await message.channel.send('Ping?');
		msg.edit(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	},
};
