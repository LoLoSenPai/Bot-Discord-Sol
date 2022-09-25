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
            image : 'https://raw.githubusercontent.com/LoLoSenPai/Bot-Discord-Sol/main/assets/un1.webp?token=GHSAT0AAAAAABYMG434GZMBZJG62GQERI4SYZPMYDQ',
            description : 'ton message de description'
        }
        } else if (nftNumber[0].rank >= 0.4*supply && nftNumber[0].rank < 0.6*supply) {
        rarity = {
            value :'uncommon',
            image : 'https://raw.githubusercontent.com/LoLoSenPai/Bot-Discord-Sol/main/assets/un1.webp?token=GHSAT0AAAAAABYMG434GZMBZJG62GQERI4SYZPMYDQ',
            description : 'ton message de description'
        }
        } else if (nftNumber[0].rank >= 0.35*supply && nftNumber[0].rank < 0.4*supply) {
        rarity = {
            value :'rare',
            image : 'https://raw.githubusercontent.com/LoLoSenPai/Bot-Discord-Sol/main/assets/ra1.webp?token=GHSAT0AAAAAABYMG434FKW6WXWF7KH66WOGYZPMYDA',
        }
        } else if (nftNumber[0].rank >= 0.15*supply && nftNumber[0].rank < 0.35*supply) {
        rarity = {
            value :'epic',
            image : 'https://raw.githubusercontent.com/LoLoSenPai/Bot-Discord-Sol/main/assets/ep1.webp?token=GHSAT0AAAAAABYMG435C7RDWYR3H4MAQRBWYZPMYBQ',
        }
        } else if (nftNumber[0].rank >= 0.05*supply && nftNumber[0].rank > 0.15*supply) {
        rarity = {
            value :'legendary',
            image : 'https://raw.githubusercontent.com/LoLoSenPai/Bot-Discord-Sol/main/assets/leg1.webp?token=GHSAT0AAAAAABYMG434MJGLPJGI32AILM4KYZPMYCQ',
        }
        } else if (nftNumber[0].rank >= 1 && nftNumber[0].rank < 0.05*supply) {
        rarity = {
            value :'mythic',
            image : 'https://i.pinimg.com/736x/d2/25/20/d2252040acb315e14b5cd35860294b9a--heart-emoji-emojis.jpg'
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
            { name: `🥇・Rank: ${nftNumber[0].rank} `, value: `|` },
        )
        .setImage(`${rarity.image}`)
        .addFields(
            { name: `💼・Pieces: ${supply}`, value: `|` },
        )
        .setImage(`${nftNumber[0].image}`)
        .setFooter({ text: 'Tools powered by LoLo Labs', iconURL: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png' });

        return interaction.reply({ embeds: [rarityEmbed] });
        
    },
};









