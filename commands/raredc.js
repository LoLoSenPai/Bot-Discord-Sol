/* eslint-disable no-undef */
const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raredc')
        .setDescription('Check the rarity of your Drill Club NFT')
        .addIntegerOption((option) =>
            option
                .setName('number')
                .setDescription('Which number ?')
                .setRequired(true),
        ),

    async execute(interaction) {
        const numb = interaction.options.getInteger('number');
        const collectionAddress = '0x39cd103414106b922eb09c7d45df89608b59e887';

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-API-KEY': 'chapela02yt_sk_945e9bc5-4a3f-49d4-a165-64c99c43b014_auv4ip6vxnp6imy1',
            },
        };


        try {
            const response = await fetch(
                `https://api.simplehash.com/api/v0/nfts/polygon/${collectionAddress}/${numb}`,
                options
            );
            const data = await response.json();

            const supplyValue = 6969;

            const rarityValue = data.rarity.rank;

            const name = data.name;
            const imageNft = data.extra_metadata.image_original_url;
            console.log(imageNft);

            // Calculer le pourcentage de rareté
            const rarityPercent = (rarityValue / supplyValue) * 100;

            // Déterminer la rareté basée sur le pourcentage
            let rarity;
            if (rarityPercent <= 1) {
                rarity = {
                    value: 'mythic',
                    image:
                        '<:mythik1:1099501852334239815><:mythik2:1099501854175539261><:mythik3:1099501855278645350>',
                    color: '#F5340B',
                };
            }
            else if (rarityPercent <= 5) {
                rarity = {
                    value: 'legendary',
                    image:
                        '<:legendary1:1024082228839448647><:legendary2:1024082231267963030><:legendary3:1024082233625170062>',
                    color: '#FF9900',
                };
            }
            else if (rarityPercent <= 15) {
                rarity = {
                    value: 'epic',
                    image:
                        '<:epic1:1024082222103416874><:epic2:1024082224150220892><:epic3:1024082226767474739>',
                    color: '#B20BF5',
                };
            }
            else if (rarityPercent <= 35) {
                rarity = {
                    value: 'rare',
                    image:
                        '<:rare1:1024082242345111642><:rare2:1024082244698132570><:rare3:1024082246824644708>',
                    color: '#0B8EF5',
                };
            }
            else if (rarityPercent <= 60) {
                rarity = {
                    value: 'uncommon',
                    image:
                        '<:uncommon1:1024082248879849522><:uncommon2:1024082250993774652><:uncommon3:1024082253489393705>',
                    color: '#0BF54E',
                };
            }
            else {
                rarity = {
                    value: 'common',
                    image:
                        '<:common1:1024082214926942288><:common2:1024082217309306951><:common3:1024082219507142757>',
                    color: '#D1D1D1',
                };
            }

            const rarityEmbed = new EmbedBuilder()
                .setColor(`${rarity.color}`)
                .setTitle(`${name}`)
                .setURL(`https://magiceden.io/item-details/polygon/0x39cd103414106b922eb09c7d45df89608b59e887/${numb}`)
                .setAuthor({
                    name: 'Rarity checker',
                    iconURL: 'https://pbs.twimg.com/profile_images/1654933314132664323/XKp8j3o1_400x400.jpg',
                    url: 'https://twitter.com/Ogronex',
                })
                .setThumbnail(
                    `https://i.seadn.io/gcs/files/0f13d65eef9c527cd9ec380e66efa162.png?auto=format&dpr=1&w=1920`,
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    {
                        name: `<a:winner:1099475849864040518>・Rank: ${rarityValue}    ${rarity.image}`,
                        value: '\u200B',
                    },
                )
                .addFields({ name: `<a:rightarrow:1099475418400161823>・Supply: ${supplyValue}`, value: '\u200B' })
                .setImage(`${imageNft}`)
                .setFooter({
                    text: 'Tool powered by Ogronex',
                    iconURL:
                        'https://cdn3d.iconscout.com/3d/premium/thumb/polygon-matic-coin-6445027-5326787.png',
                });

            await interaction.reply({ embeds: [rarityEmbed] });
        }
        catch (error) {
            console.log(error);
        }
    },
};
