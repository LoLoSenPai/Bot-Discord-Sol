const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rare")
        .setDescription("Check the rarity of your Hodlins")
        .addIntegerOption((option) =>
            option
                .setName("number")
                .setDescription("Which number ?")
                .setRequired(true)
        ),

    async execute(interaction) {
        const numb = interaction.options.getInteger('number');
        const collection = require('../rarity-check/sorted_collection.json');
        const TOTAL_NFTS = collection.length;
                
        let nft_rank = collection.findIndex(nft => nft.name === `Clerk #${numb}`||nft.name === `Branch #${numb}`||nft.name === `Analyst #${numb}`||nft.name === `Calculoner #${numb}`);
        
        if (nft_rank != -1) {
        
            let rarity;

            // Attribute a rarity rank
            if (nft_rank + 1 >= 0.6 * TOTAL_NFTS) {
                rarity = {
                    value: "common",
                    image:
                        "<:common1:1024082214926942288><:common2:1024082217309306951><:common3:1024082219507142757>",
                    color: "#D1D1D1",
                };
            } else if (
                nft_rank + 1 >= 0.35 * TOTAL_NFTS &&
                nft_rank + 1 < 0.6 * TOTAL_NFTS
            ) {
                rarity = {
                    value: "uncommon",
                    image:
                        "<:uncommon1:1024082248879849522><:uncommon2:1024082250993774652><:uncommon3:1024082253489393705>",
                    color: "#0BF54E",
                };
            } else if (
                nft_rank + 1 >= 0.15 * TOTAL_NFTS &&
                nft_rank + 1 < 0.35 * TOTAL_NFTS
            ) {
                rarity = {
                    value: "rare",
                    image:
                        "<:rare1:1024082242345111642><:rare2:1024082244698132570><:rare3:1024082246824644708>",
                    color: "#0B8EF5",
                };
            } else if (
                nft_rank + 1 >= 0.05 * TOTAL_NFTS &&
                nft_rank + 1 < 0.15 * TOTAL_NFTS
            ) {
                rarity = {
                    value: "epic",
                    image:
                        "<:epic1:1024082222103416874><:epic2:1024082224150220892><:epic3:1024082226767474739>",
                    color: "#B20BF5",
                };
            } else if (
                nft_rank + 1 >= 0.01 * TOTAL_NFTS &&
                nft_rank + 1 < 0.05 * TOTAL_NFTS
            ) {
                rarity = {
                    value: "legendary",
                    image:
                        "<:legendary1:1024082228839448647><:legendary2:1024082231267963030><:legendary3:1024082233625170062>",
                    color: "#FF9900",
                };
            } else if (nft_rank + 1 >= 0 && nft_rank + 1 < 0.01 * TOTAL_NFTS) {
                rarity = {
                    value: "mythic",
                    image:
                        "<:mythic1:1024082235751665684><:mythic2:1024082237815279716><:mythic3:1024082240029868152>",
                    color: "#F5340B",
                };
            } else {
                rarity = {
                    value: "Unregistred",
                    image: "❌",
                    color: "#FFFF",
                };
            }

            
            const rarityEmbed = new EmbedBuilder()
                .setColor(`${rarity.color}`)
                .setTitle(`${collection[nft_rank].name}`)
                .setAuthor({
                    name: "Rarity checker",
                    iconURL: "https://www.creativeuncut.com/gallery-04/art/gs-djinn-mercury.jpg",
                    url: "https://lolo-labs.io",
                })
                .setThumbnail(`https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/hodlins_pfp_1672083334693.gif`)
                .addFields(
                    {   name: "\u200B", value: "\u200B" },
                    {
                        name: `🥇・Rank: ${nft_rank + 1}    ${rarity.image}`,
                        value: `\u200B`,
                    }
                )
                .addFields({ name: `💼・Supply: ${TOTAL_NFTS}`, value: `\u200B` })
                .setImage(`${collection[nft_rank].image}`)
                .setFooter({
                    text: "Tools powered by LoLo Labs",
                    iconURL:
                        "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
                });
        
        await interaction.reply({ embeds: [rarityEmbed] })
        }
        else {
        await interaction.reply({ content: `We can't find your NFT #${numb}` });
        console.log(`There is a problem with your NFT #${numb}`);
        }
    }
};