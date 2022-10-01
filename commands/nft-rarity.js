const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { request } = require("undici");

async function getJSONResponse(body) {
  let fullBody = "";

  for await (const data of body) {
    fullBody += data.toString();
  }

  return JSON.parse(fullBody);
}

module.exports = {
  // Create a new slash command
  data: new SlashCommandBuilder()
    // 1st option
    .setName("rarity")
    .setDescription("Check the rarity of NFTs")
    .addStringOption((option) =>
      option
        .setName("collection")
        .setDescription("Which collection ?")
        .setRequired(true)
    )
    // 2nd option
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Which mint address ?")
        .setRequired(true)
    ),

  async execute(interaction) {
    const collec = interaction.options.getString("collection"); // 1st option's value
    const numb = interaction.options.getInteger("number"); // 2nd option's value
    console.log(`https://api.howrare.is/v0.1/collections/${collec.split(' ').join('')}`);
    const rarityRequest = await request(
      `https://api.howrare.is/v0.1/collections/${collec.split(' ').join('')}`
    ); //API filtered by 1st option
    const { result } = await getJSONResponse(rarityRequest.body); // API results

    if (result.api_code != 404) {
      const listNft = result.data.items; // Path to useful data -> all NFTs of a collection

      // Get the 2nd option's value
      const nftNumber = listNft.filter(element => {
        return element.id == numb;
      });

      // Check how many objects to calculate the total supply
      const supply = listNft.length;
      let rarity;

      // Attribute a rarity rank
      if (nftNumber[0].rank >= 0.6 * supply) {
        rarity = {
          value: "common",
          image:
            "<:common1:1024082214926942288><:common2:1024082217309306951><:common3:1024082219507142757>",
          color: "#D1D1D1",
        };
      } else if (
        nftNumber[0].rank >= 0.35 * supply &&
        nftNumber[0].rank < 0.6 * supply
      ) {
        rarity = {
          value: "uncommon",
          image:
            "<:uncommon1:1024082248879849522><:uncommon2:1024082250993774652><:uncommon3:1024082253489393705>",
          color: "#0BF54E",
        };
      } else if (
        nftNumber[0].rank >= 0.15 * supply &&
        nftNumber[0].rank < 0.35 * supply
      ) {
        rarity = {
          value: "rare",
          image:
            "<:rare1:1024082242345111642><:rare2:1024082244698132570><:rare3:1024082246824644708>",
          color: "#0B8EF5",
        };
      } else if (
        nftNumber[0].rank >= 0.05 * supply &&
        nftNumber[0].rank < 0.15 * supply
      ) {
        rarity = {
          value: "epic",
          image:
            "<:epic1:1024082222103416874><:epic2:1024082224150220892><:epic3:1024082226767474739>",
          color: "#B20BF5",
        };
      } else if (
        nftNumber[0].rank >= 0.01 * supply &&
        nftNumber[0].rank < 0.05 * supply
      ) {
        rarity = {
          value: "legendary",
          image:
            "<:legendary1:1024082228839448647><:legendary2:1024082231267963030><:legendary3:1024082233625170062>",
          color: "#FF9900",
        };
      } else if (nftNumber[0].rank >= 1 && nftNumber[0].rank < 0.01 * supply) {
        rarity = {
          value: "mythic",
          image:
            "<:mythic1:1024082235751665684><:mythic2:1024082237815279716><:mythic3:1024082240029868152>",
          color: "#F5340B",
        };
      } else {
        rarity = {
          value: "Unenregistred",
          image: "❌",
        };
      }

      const rarityEmbed = new EmbedBuilder()
        .setColor(`${rarity.color}`)
        .setTitle(`${nftNumber[0].name}`)
        .setURL(`${nftNumber[0].link}`)
        .setAuthor({
          name: "Rarity checker",
          iconURL: "https://i.imgur.com/AfFp7pu.png",
          url: "https://howrare.is",
        })
        .setDescription(`${result.data.description}`)
        .setThumbnail(`${result.data.logo}`)
        .addFields(
          { name: "\u200B", value: "\u200B" },
          {
            name: `🥇・Rank: ${nftNumber[0].rank}    ${rarity.image} `,
            value: `\u200B`,
          }
        )
        .addFields({ name: `💼・Pieces: ${supply}`, value: `\u200B` })
        .setImage(`${nftNumber[0].image}`)
        .setFooter({
          text: "Tools powered by LoLo Labs",
          iconURL:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
        });

      return interaction.reply({ embeds: [rarityEmbed] });
    }
    else {
        return interaction.reply({ content: 'Your collection doesn\'t exist' });
    }
  },
};
