const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
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
		.setName('rarityzz')
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
        const rarityRequest = await request(`https://api.howrare.is/v0.1/collections/${collec}`); //API filtered by 1st option
        const { result } = await getJSONResponse(rarityRequest.body); // API results

        const listNft = result.data.items; // Path to useful data

        // Get the 2nd option's value
        const nftNumber = listNft.filter(element => {
            return (element.id == numb);
        })

        // Check how many objects to calculate the total supply
        const supply = listNft.length
        let rarity

        // Attribute a rarity rank
        if (nftNumber[0].rank >= 0.6*supply) {
        rarity = {
            value :'common',
            image : '<:com1:1023925991644598322><:com2:1023925993775300669><:com3:1023925995981508648><:com4:1023953774181621771>'
        }
        } else if (nftNumber[0].rank >= 0.4*supply && nftNumber[0].rank < 0.6*supply) {
        rarity = {
            value :'uncommon',
            image : '<:un1:1023953795639681094><:un2:1023926038008434718><:un3:1023926040294338611><:un4:1023953798026252361>'
        }
        } else if (nftNumber[0].rank >= 0.35*supply && nftNumber[0].rank < 0.4*supply) {
        rarity = {
            value :'rare',
            image : '<:ra1:1023953791290179604><:ra2:1023926029137485895><:ra3:1023926031389827122><:ra4:1023953793471234058>'
        }
        } else if (nftNumber[0].rank >= 0.15*supply && nftNumber[0].rank < 0.35*supply) {
        rarity = {
            value :'epic',
            image : '<:ep1:1023953777293807726><:ep2:1023926004957315155><:leg3:1023926016378425405><:leg4:1023953784214392853>'
        }
        } else if (nftNumber[0].rank >= 0.05*supply && nftNumber[0].rank > 0.15*supply) {
        rarity = {
            value :'legendary',
            image : '<:leg1:1023953781957873695><:leg2:1023926015174647868><:leg3:1023926016378425405><:leg4:1023953784214392853>'
        }
        } else if (nftNumber[0].rank >= 1 && nftNumber[0].rank < 0.05*supply) {
        rarity = {
            value :'mythic',
            image : '<:my1:1023953786907136100><:my2:1023926020253941842><:my3:1023926022535655515><:my4:1023953789138509824>'
        }
        } else{
        rarity = {
            value :'Unenregistred',
            image : 'https://2.bp.blogspot.com/-lvgbAev36Lo/Vcg9XL-cHWI/AAAAAAAASPw/9nYGzmg5Zaw/s640/erreur-404-2.png',
        }
        }
            

        const rarityEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${nftNumber[0].name}`)
        .setURL(`${nftNumber[0].link}`)
        .setAuthor({ name: 'Rarity checker', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription(`${nftNumber[0].description}`)
        .setThumbnail(`${result.data.logo}`)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: `🥇・Rank: ${nftNumber[0].rank}    ${rarity.image} `, value: `|` },
        )
        // .setImage(rarity.image)
        .addFields(
            { name: `💼・Pieces: ${supply}`, value: `|` },
        )
        .setImage(`${nftNumber[0].image}`)
        .setFooter({ text: 'Tools powered by LoLo Labs', iconURL: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png' });

        return interaction.reply({ embeds: [rarityEmbed] });
        
    },
};









