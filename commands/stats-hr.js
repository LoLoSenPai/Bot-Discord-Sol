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
  data: new SlashCommandBuilder()
    .setName("statshr")
    .setDescription("Check stats of a collection on HowRare")
    .addStringOption((option) =>
      option
        .setName("collection")
        .setDescription("Which collection ?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const collec = interaction.options.getString("collection"); // Get the option's value
    const listCollections = await request(
      `https://api.howrare.is/v0.1/collections`
    );
    const { result } = await getJSONResponse(listCollections.body);

    const listFiltered = result.data; // Path to useful data -> All collections
    console.log(`listFiltered: ${listFiltered}`);
    const nftCollec = listFiltered.find(
      (element) =>
        element.me_key.toLowerCase().includes(collec.toLowerCase()) ||
        element.name.toLowerCase().includes(collec.toLowerCase())
    );
    console.log(`nftCollec: ${nftCollec}`);
    console.log(`name: ${nftCollec.name}`);

    if (!nftCollec) {
      await interaction.reply(`Collection ${collec} not found.`);
      return;
    }

    const statshrEmbed = new EmbedBuilder()
      .setTitle(`${nftCollec.name}`)
      .setAuthor({
        name: "Stats checker",
        iconURL:
          "https://www.creativeuncut.com/gallery-16/art/gsdd-djinn-chill.jpg",
        url: "https://howrare.is",
      })
      .setThumbnail(`https://api.howrare.is/${nftCollec.logo}`)
      .addFields(
        { name: "\u200B", value: "\u200B" },
        { name: "Listed", value: ` ${nftCollec.on_sale}`, inline: true },
        { name: "Supply", value: ` ${nftCollec.items}`, inline: true },
        { name: "Holders", value: ` ${nftCollec.holders}`, inline: true },
        { name: "Floor price", value: ` ${nftCollec.floor}`, inline: true }
      )
      .setFooter({
        text: "Tools powered by LoLo Labs",
        iconURL:
          "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
      });

    await interaction.reply({ embeds: [statshrEmbed] });
  },
};
