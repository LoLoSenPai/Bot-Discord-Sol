const { SlashCommandBuilder } = require('discord.js');
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
		.setName('fp')
		.setDescription('Check the floor price of a collection')
        .addStringOption(option =>
            option.setName('collection')
                .setDescription('Which collection ?')
                .setRequired(true)),
    async execute(interaction) {
        const collec = interaction.options.getString('collection');
        const floor = await request(`https://api-mainnet.magiceden.dev/v2/collections/${collec}/stats`);
        const { floorPrice, symbol } = await getJSONResponse(floor.body);
        return interaction.reply({ content: `The floor price of ${symbol} is ${floorPrice / 1000000000} SOL`});
    },
};
