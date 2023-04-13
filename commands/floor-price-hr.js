const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const Fuse = require('fuse.js');


async function getJSONResponse(body) {
    let fullBody = '';
    try {
        for await (const data of body) {
            fullBody += data.toString();
        }
        return JSON.parse(fullBody);
    } catch (error) {
        console.error(error);
        return {};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hr-fp')
        .setDescription('Check the floor price of a collection')
        .addStringOption(option =>
            option.setName('collection')
                .setDescription('Which collection ?')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const collec = interaction.options.getString('collection').replace("-", "").replace(" ", "").replace("/", "").replace("_", "");
            const apiFloor = await request(`https://api.howrare.is/v0.1/floor`);
            const { result } = await getJSONResponse(apiFloor.body);

            const listFiltered = result.data; 
            const collectionFloor = listFiltered.filter(element => {
                return (
                  element.url.toLowerCase().replace(/\//g, "") ===
                    collec.toLowerCase().replace(/\s/g, "") ||
                  element.name.toLowerCase().replace(/\s/g, "") ===
                    collec.toLowerCase().replace(/\s/g, "")
                );
            });
            const options = {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 60,
                minMatchCharLength: 1,
                keys: [
                    "name",
                    "url"
                ]
            };
            const fuse = new Fuse(listFiltered, options);
            const suggestions = fuse.search(collec);

            if(collectionFloor.length > 0){
                await interaction.reply({ content: `The floor price of ${collectionFloor[0].name} is ${collectionFloor[0].floor_sol} ◎  (${collectionFloor[0].floor_usd} $)`});
            }else if(suggestions.length > 0){
                let message = "Did you mean: \n";
                for (let i = 0; i < suggestions.length; i++) {
                    message += `- ${suggestions[i].item.name}  (${suggestions[i].item.url}) \n`;
                }
                await interaction.reply({ content: message });
            }else{
                await interaction.reply({ content: `No collection found with this name `});
            }
            
        }
        catch(err) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred, please try again later..' });
        }
    }
}
