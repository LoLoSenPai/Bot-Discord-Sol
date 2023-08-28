const { SlashCommandBuilder } = require("discord.js");
const sharp = require('sharp');
const fs = require('fs'); // N'oubliez pas d'ajouter cette ligne pour lire les fichiers locaux
const { Readable } = require('stream');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("localprofilepic")
        .setDescription("Récupérez une image NFT locale retouchée pour être une meilleure photo de profil.")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("L'ID de votre NFT.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const id = interaction.options.getString("id");

        // Chemin vers l'image locale
        const localImagePath = path.join(__dirname, '..', 'assets', 'images', `${id}.png`);


        try {
            // Étape 2: Lisez l'image locale
            const imageBuffer = fs.readFileSync(localImagePath);

            // La suite du traitement de l'image reste la même...

            const zoomFactor = 2.24; // 224%
            const targetWidth = 1080;
            const targetHeight = 1080;

            const zoomedImageBuffer = await sharp(imageBuffer)
                .resize(Math.round(targetWidth * zoomFactor), Math.round(targetHeight * zoomFactor))
                .toBuffer();

            const metadata = await sharp(zoomedImageBuffer).metadata();
            const left = (metadata.width - targetWidth) / 2 + 35;
            const top = (metadata.height - targetHeight) / 2 - 59;

            const adjustedImageBuffer = await sharp(zoomedImageBuffer)
                .extract({
                    left: Math.round(left),
                    top: Math.round(top),
                    width: targetWidth,
                    height: targetHeight
                })
                .toBuffer();

            const stream = new Readable({
                read() {
                    this.push(adjustedImageBuffer);
                    this.push(null);
                }
            });

            await interaction.reply({ files: [{ attachment: stream, name: `${id}_profile.png` }] });

        } catch (err) {
            console.log(err);
            interaction.reply('Il y a eu une erreur lors du traitement de l\'image.');
        }
    }
};
