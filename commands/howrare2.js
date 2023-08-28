const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rarity2')
        .setDescription('Check the rarity of Polygon NFT')
        .addIntegerOption((option) =>
            option
                .setName('number')
                .setDescription('Which NFT number ?')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('collection')
                .setDescription('Which collection ?')
                .setRequired(false)
                .setChoices(
                    {
                        name: 'Billionaire Zombies Club',
                        value: 'billionaire zombies club',
                    },
                    {
                        name: 'Brozo',
                        value: 'brozo',
                    },
                    {
                        name: 'DinoDash',
                        value: 'dinodash',
                    },
                    {
                        name: 'Drill Club',
                        value: 'drillclub',
                    },
                    {
                        name: 'Fada',
                        value: 'fada',
                    },
                    {
                        name: 'Gambulls',
                        value: 'gambulls',
                    },
                    {
                        name: 'Normies',
                        value: 'normies',
                    },
                    {
                        name: 'Owlpha',
                        value: 'owlpha',
                    },
                    {
                        name: 'PolygonMonkeys',
                        value: 'polygonmonkeys',
                    },
                    {
                        name: 'Rekt Dogs',
                        value: 'rektdog',
                    },
                    {
                        name: 'RingRunnerz',
                        value: 'ringrunnerz',
                    },
                    {
                        name: 'Rokoro',
                        value: 'rokoro',
                    },
                    {
                        name: 'Tribuzz',
                        value: 'tribuzz',
                    },
                    {
                        name: 'Y00ts',
                        value: 'y00ts',
                    },
                ),
        )
        .addStringOption((option) =>
            option
                .setName('contract')
                .setDescription('Which contract address ?')
                .setRequired(false),
        ),

    async execute(interaction) {
        const numb = interaction.options.getInteger('number');
        const collectionName = interaction.options.getString('collection');
        const contractAddress = interaction.options.getString('contract');

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-API-KEY': 'lololabsweb3_sk_c90bbfce-a11c-43f4-9f9d-a999faa923ba_hrnbdmt4pcwszc71',
            },
        };

        let collectionAddress;

        if (collectionName === 'brozo') {
            collectionAddress = '0x220fa5ccc9404802ed6db0935eb4feefc27c937e';
        }
        else if (collectionName === 'ringrunnerz') {
            collectionAddress = '0xdc901017d1c8c9e5745a0a52e3237804da32790c';
        }
        else if (collectionName === 'rektdog') {
            collectionAddress = '0xace8187b113a38f83bd9c896c6878b175c234dcc';
        }
        else if (collectionName === 'drillclub') {
            collectionAddress = '0x39cd103414106b922eb09c7d45df89608b59e887';
        }
        else if (collectionName === 'y00ts') {
            collectionAddress = '0x670fd103b1a08628e9557cd66b87ded841115190';
        }
        else if (collectionName === 'owlpha') {
            collectionAddress = '0x12aa01f646fe5c993c66c9c86eddad4e514f6cbc';
        }
        else if (collectionName === 'billionaire zombies club') {
            collectionAddress = '0xace8187b113a38f83bd9c896c6878b175c234dcc';
        }
        else if (collectionName === 'gambulls') {
            collectionAddress = '0xc1a5f386e3b2d3cb280191fcd11e76c41117197d';
        }
        else if (collectionName === 'polygonmonkeys') {
            collectionAddress = '0xe5c93b6692c03d4279d1a3098e4321254b560f47';
        }
        else if (collectionName === 'normies') {
            collectionAddress = '0x2ebe61759e916b61523ea1fda8e1c057688bd8f3';
        }
        else if (collectionName === 'dinodash') {
            collectionAddress = '0x248d6e4f9ab178bb8022c18ca25a281a53e9a047';
        }
        else if (collectionName === 'fada') {
            collectionAddress = '0x6edeb6769e308dd0936362cfdfa5e492d99cdf0c';
        }
        else if (collectionName === 'tribuzz') {
            collectionAddress = '0x7802c717b3fc4e6a32d1ae3a31a6175ebae9b164';
        }
        else if (collectionName === 'rokoro') {
            collectionAddress = '0xd67d0dd4b6e8639f8c51f60bfcb646cb6ed5e993';
        }
        else {
            collectionAddress = contractAddress;
        }

        if (!collectionName && !contractAddress) {
            return interaction.reply({
                content: 'Please specify either a collection or a contract address',
                ephemeral: true,
            });
        }

        try {
            const response = await fetch(
                `https://api.simplehash.com/api/v0/nfts/polygon/${collectionAddress}/${numb}`,
                options
            );
            const data = await response.json();

            const supplyValue = data.collection.total_quantity;

            const rarityValue = data.rarity?.rank;

            const name = data.name;
            // const description = data.description;
            const imageNft = data.image_url;
            const imageCollection = data.collection.image_url;

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
                .setAuthor({
                    name: 'Rarity checker',
                    iconURL:
                        'https://pbs.twimg.com/profile_images/1654933314132664323/XKp8j3o1_400x400.jpg',
                    url: 'https://twitter.com/OgronexNFT',
                })
                .setThumbnail(
                    `${imageCollection}`,
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
                        'https://altcoinsbox.com/wp-content/uploads/2023/03/polygon-logo-300x266.webp',
                });

            await interaction.reply({ embeds: [rarityEmbed] });
        }
        catch (error) {
            console.log(error);
        }
    },
};