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

        const question = interaction.options.getString('question');

        let answers = [`Hell Yeah MFers`, `Oublie frérot !`, `Ummmmmmm... Je ne sais pas trop...`];

        await interaction.reply({ content: `${question} \n ` + ` ${answers[Math.floor(Math.random() * answers.length)]}}`, ephemeral: false });
    },
};