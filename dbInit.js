const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	storage: 'database.sqlite',
});

const guildInfo = sequelize.import('models/guildInfo');

module.exports = { guildInfo };
