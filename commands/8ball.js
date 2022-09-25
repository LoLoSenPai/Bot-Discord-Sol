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
        
        let answers = [`Hell Yeah MFers`, `Forgot it dude !`, `Ummmmmmm... I don't really know...`];
        
        await interaction.reply(answers[Math.floor(Math.random() * answers.length)]);
	},
};