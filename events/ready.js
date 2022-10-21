const mongoose = require("mongoose");
const config = require("../config.json");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await mongoose.connect(config.databaseToken || '', {
			keepAlive: true,
		});
		if (mongoose.connect) {
			console.log('MongoDB connected succesfully');
		}
		else console.log('MongoDB not connected');
		
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};