const { Connection, PublicKey } = require('@solana/web3.js');
const monitoredWalletAddress = 'EC5rbR7jFCwGvVjkscDB5tD1ctPcjyWuatTarTY3DnQX';
const connection = new Connection('https://api.mainnet-beta.solana.com');

let lastCheckedSlot = 0;

module.exports = {
    name: 'walletMonitor',
    once: true,
    async execute(client) {

        console.log("Démarrage de la surveillance du portefeuille...");
        client.guilds.cache.forEach(guild => {
            console.log(`Le bot est sur le serveur : ${guild.name} (id: ${guild.id})`);
        });
        const targetChannel = client.channels.cache.find(ch => ch.id === '795007593259991053');
        console.log(client.channels.cache.map(channel => channel.id));
        if (!targetChannel) {
            console.error("Canal cible non trouvé!");
            return;
        }

        setInterval(async () => {
            try {
                const currentSlot = await connection.getSlot();
                console.log(`Vérification du slot ${currentSlot}...`);

                if (currentSlot > lastCheckedSlot) {
                    const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(
                        new PublicKey(monitoredWalletAddress),
                        {
                            until: currentSlot,
                            limit: 10,
                        }
                    );

                    if (confirmedSignatures.length > 0) {
                        console.log(`Transactions détectées: ${confirmedSignatures.length}`);
                    }

                    for (const signature of confirmedSignatures) {
                        if (signature.slot > lastCheckedSlot) {
                            targetChannel.send(`Nouvelle transaction détectée! Signature: ${signature.signature}`);
                        }
                    }

                    lastCheckedSlot = currentSlot;
                }
            } catch (error) {
                console.error('Erreur lors de la surveillance du portefeuille:', error);
            }
        }, 60 * 1000);
    },
};