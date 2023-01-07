const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hr-fp')
		.setDescription('Check the floor price of a collection')
        .addStringOption(option =>
            option.setName('collection')
                .setDescription('Which collection ?')
                .setRequired(true)),
    async execute(interaction) {
        const collec = interaction.options.getString('collection');
        const apiFloor = await request(`https://api.howrare.is/v0.1/floor`);
        const { result } = await getJSONResponse(apiFloor.body);

        const listFiltered = result.data; // Path to useful data -> All collections
        
        const collectionFloor = listFiltered.filter(element => {
            return (element.url || element.name == collec);
        })
        console.log(collectionFloor);
        
        await interaction.reply({ content: `The floor price of ${collectionFloor.name} is ${collectionFloor.floor_sol} ◎  (${collectionFloor.floor_usd} $)`});
    },
};
