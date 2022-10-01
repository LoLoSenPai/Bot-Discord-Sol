const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder() 
		.setName('8ball')
		.setDescription('Let Destiny choose')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('What do you want to ask ?')
                .setRequired(true)),

                
    async execute(interaction) {
        
        let answers = [`Hell Yeah MFers`, `Oublie frérot !`, `Ummmmmmm... Je ne sais pas trop...`];
        
        await interaction.reply(data.option[0] `\n` + answers[Math.floor(Math.random() * answers.length)]);
	},
};