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
		.setName('statsme')
		.setDescription('Check stats of a collection')
        .addStringOption(option =>
            option.setName('collection')
                .setDescription('Which collection ?')
                .setRequired(true)),
    async execute(interaction) {
        const collec = interaction.options.getString('collection');
        const floor = await request(`https://api-mainnet.magiceden.dev/v2/collections/${collec}/stats`);
        const { floorPrice, symbol, listedCount, volumeAll } = await getJSONResponse(floor.body);

        const statsEmbed = new EmbedBuilder()
        .setTitle(`${symbol}`)
        .setAuthor({ name: 'Stats checker', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://magiceden.io' })
        .addFields(
            { name: 'Listed', value: `${listedCount} ◎` , inline: true },
            { name: `Floor price:`, value: `${floorPrice / 1000000000}`, inline: true },
            { name: `Total volume: `, value: `${volumeAll / 1000000000}`, inline: true },
        )
        .setFooter({ text: 'Tools powered by LoLo Labs', iconURL: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png' });

        return interaction.reply({ embeds: [statsEmbed] });



    },
};
