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
    // Create a new slash command
	data: new SlashCommandBuilder()
        // 1st option 
		.setName('rarity')
		.setDescription('Check the rarity of NFTs')
        .addStringOption(option =>
            option.setName('collection')
                .setDescription('Which collection ?')
                .setRequired(true))
        // 2nd option
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Which mint address ?')
                .setRequired(true)),
    
    async execute(interaction) {
        
        const collec = interaction.options.getString('collection'); // 1st option's value
        const numb = interaction.options.getInteger('number'); // 2nd option's value
        const rarity = await request(`https://api.howrare.is/v0.1/collections/${collec}`); //API filtered by 1st option
        const { result } = await getJSONResponse(rarity.body); // API results

        const listNft = result.data.items; // Path to useful data

        listNft.forEach(nft => {
            if (nft.id == numb){
                // console.log(nft.rank)
                let value = ""
                switch (nft.rank) {
                    case 2:
                        value = "mythic"
                        break;
                    
                    case 30:
                        value = "epic"
                        break;
                
                    default:
                        value = "common"
                        break;
                }
                return interaction.reply({ content: `The rank of your ${result.data.collection} is rank N° ${nft.rank} !! It's ${value}`});
            }
        });

    
    },
};
