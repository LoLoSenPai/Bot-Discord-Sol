/* eslint-disable no-undef */
const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raaree')
        .setDescription('Check the rarity of your OG Teddies')
        .addIntegerOption((option) =>
            option
                .setName('number')
                .setDescription('Which number ?')
                .setRequired(true),
        ),

    async execute(interaction) {
        const numb = interaction.options.getInteger('number');

        const collection = require('../rarity-check/sorted_collection-og-teddies.json');
        const TOTAL_NFTS = collection.length;
        const collectionImage = 'https://i.seadn.io/gcs/files/9432088663f13b4549e1a382705c6f5c.png?auto=format&dpr=1&w=1920';

        const nft_rank = collection.findIndex(
            (nft) => {
                const match = nft.name.match(/#(\d+)/);
                return match ? parseInt(match[1]) === numb : false;
            }
        );
        // Utilisez maintenant la variable "nft_rank" pour afficher les informations correspondantes à la rareté demandée.

        if (nft_rank != -1) {
            let rarity;

            // Attribute a rarity rank
            if (nft_rank + 1 >= 0.6 * TOTAL_NFTS) {
                rarity = {
                    value: 'common',
                    image:
                        '<:common1:1024082214926942288><:common2:1024082217309306951><:common3:1024082219507142757>',
                    color: '#D1D1D1',
                };
            }
            else if (
                nft_rank + 1 >= 0.35 * TOTAL_NFTS && nft_rank + 1 < 0.6 * TOTAL_NFTS
            ) {
                rarity = {
                    value: 'uncommon',
                    image:
                        '<:uncommon1:1024082248879849522><:uncommon2:1024082250993774652><:uncommon3:1024082253489393705>',
                    color: '#0BF54E',
                };
            }
            else if (
                nft_rank + 1 >= 0.15 * TOTAL_NFTS && nft_rank + 1 < 0.35 * TOTAL_NFTS
            ) {
                rarity = {
                    value: 'rare',
                    image:
                        '<:rare1:1024082242345111642><:rare2:1024082244698132570><:rare3:1024082246824644708>',
                    color: '#0B8EF5',
                };
            }
            else if (
                nft_rank + 1 >= 0.05 * TOTAL_NFTS &&
                nft_rank + 1 < 0.15 * TOTAL_NFTS
            ) {
                rarity = {
                    value: 'epic',
                    image:
                        '<:epic1:1024082222103416874><:epic2:1024082224150220892><:epic3:1024082226767474739>',
                    color: '#B20BF5',
                };
            }
            else if (
                nft_rank + 1 >= 0.01 * TOTAL_NFTS &&
                nft_rank + 1 < 0.05 * TOTAL_NFTS
            ) {
                rarity = {
                    value: 'legendary',
                    image:
                        '<:legendary1:1024082228839448647><:legendary2:1024082231267963030><:legendary3:1024082233625170062>',
                    color: '#FF9900',
                };
            }
            else if (nft_rank + 1 >= 0 && nft_rank + 1 < 0.01 * TOTAL_NFTS) {
                rarity = {
                    value: 'mythic',
                    image:
                        '<:mythik1:1099501852334239815><:mythik2:1099501854175539261><:mythik3:1099501855278645350>',
                    color: '#F5340B',
                };
            }
            else {
                rarity = {
                    value: 'Unregistred',
                    image: '❌',
                    color: '#FFFF',
                };
            }

            const ipfsToHttpUrl = (ipfsUrl) => {
                return `https://ipfs.io/ipfs/${ipfsUrl.replace('ipfs://', '')}`;
            };
            console.log(ipfsToHttpUrl(collection[nft_rank].image));

            const rarityEmbed = new EmbedBuilder()
                .setColor(`${rarity.color}`)
                .setTitle(`${collection[nft_rank].name}`)
                .setURL(`https://opensea.io/assets/matic/0x5e82c890a9531784f5c2730c16c76361670d0429/${numb}`)
                .setAuthor({
                    name: 'Rarity checker',
                    iconURL: 'https://pbs.twimg.com/profile_images/1654933314132664323/XKp8j3o1_400x400.jpg',
                    url: 'https://twitter.com/Ogronex',
                })
                .setThumbnail(
                    `${collectionImage}`,
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    {
                        name: `<a:winner:1099475849864040518>・Rank: ${nft_rank + 1}    ${rarity.image}`,
                        value: '\u200B',
                    },
                )
                .addFields({ name: `<a:rightarrow:1099475418400161823>・Supply: ${TOTAL_NFTS}`, value: '\u200B' })
                .setImage(ipfsToHttpUrl(collection[nft_rank].image))
                .setFooter({
                    text: 'Tool powered by Ogronex',
                    iconURL:
                        'https://cdn3d.iconscout.com/3d/premium/thumb/polygon-matic-coin-6445027-5326787.png',
                });

            await interaction.reply({ embeds: [rarityEmbed] });
        }
        else {
            await interaction.reply({ content: `We can't find your NFT #${numb}` });
            console.log(`There is a problem with your NFT #${numb}`);
        }
    },
};
