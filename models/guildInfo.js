module.exports = (sequelize, DataTypes) => {
	return sequelize.define('gInfo', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		description: DataTypes.TEXT,
		antiswear: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		usage_count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	});
};
