const { SlashCommandBuilder } = require("discord.js");
const sharp = require('sharp');
const axios = require('axios');
const { Readable } = require('stream');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profilepic")
        .setDescription("Récupérez une image NFT retouchée pour être une meilleure photo de profil.")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("L'ID de votre NFT.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const id = interaction.options.getString("id");

        // Étape 1: Obtenir l'URL de l'image à partir de l'ID
        const ipfsBaseUrl = "https://bafybeia4hjaoiw66ypyyl4btah2jozk55mt26gdsmv4rj4zg54mxbs2gfu.ipfs.dweb.link/";
        const imageUrl = `${ipfsBaseUrl}${id}.png`;

        try {
            // Étape 2: Téléchargez l'image
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Étape 3: Traitement de l'image
            const zoomFactor = 2.24; // 224%
            const targetWidth = 2000;
            const targetHeight = 2000;

            // Redimensionner (zoom) l'image
            const zoomedImageBuffer = await sharp(imageBuffer)
                .resize(Math.round(targetWidth * zoomFactor), Math.round(targetHeight * zoomFactor))
                .toBuffer();

            // Obtenez les métadonnées de l'image zoomée
            const metadata = await sharp(zoomedImageBuffer).metadata();

            // Calculer les coordonnées pour centrer le visage
            const left = (metadata.width - targetWidth) / 2 + 35;  // Déplacement à droite
            const top = (metadata.height - targetHeight) / 2 - 59;  // Déplacement vers le haut            

            // Extrayez la zone centrée
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

            // Étape 4: Renvoyez l'image traitée à l'utilisateur
            await interaction.reply({ files: [{ attachment: stream, name: `${id}_profile.png` }] });

        } catch (err) {
            console.log(err);
            interaction.reply('Il y a eu une erreur lors du traitement de l\'image.');
        }
    }
};
