const { PublicKey } = require('@solana/web3.js');
const fetch = require('node-fetch');
const ALCHEMY_API_KEY = '3hyuKxcOxEeLoBMuHWdHgi-u5uavmb3L';
const MONITORED_ADDRESS = 'EC5rbR7jFCwGvVjkscDB5tD1ctPcjyWuatTarTY3DnQX';
const monitoredPublicKey = new PublicKey(MONITORED_ADDRESS);
const DISCORD_CHANNEL_ID = '795007593259991053';
const POLLING_INTERVAL = 1 * 60 * 1000;
const ALCHEMY_ENDPOINT = `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

let lastSeenSignature = null;

async function getTransactionDetail(signature) {
    const response = await fetch(`${ALCHEMY_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTransaction",
            params: [signature, { encoding: 'json' }]
        })
    });

    const data = await response.json();
    return data.result;
}

async function getRecentTransactions() {
    const response = await fetch(`${ALCHEMY_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getSignaturesForAddress",
            params: [MONITORED_ADDRESS, { limit: 10 }]
        })
    });

    const data = await response.json();
    return data.result;
}

async function checkNewTransactions(client) {
    const targetChannel = client.channels.cache.get(DISCORD_CHANNEL_ID);
    const signatures = await getRecentTransactions();

    if (signatures.length === 0) return;

    for (const transactionInfo of signatures) {
        if (transactionInfo.signature === lastSeenSignature) {
            break;
        }

        const transactionDetail = await getTransactionDetail(transactionInfo.signature);
        const messageDetails = transactionDetail.transaction.message;

        let type = "";
        let otherWallet = "";
        for (const instruction of messageDetails.instructions) {
            if (instruction.accounts.includes(monitoredPublicKey.toString())) {
                if (instruction.accounts[0] === monitoredPublicKey.toString()) {
                    type = "Sortie";
                    otherWallet = instruction.accounts[1];
                } else {
                    type = "Entrée";
                    otherWallet = instruction.accounts[0];
                }
                break;
            }
        }

        const solscanLink = `https://solscan.io/tx/${transactionInfo.signature}`;

        const formattedMessage = `
${type} de 1.23 SOL vers/depuis ${otherWallet}
[Voir la transaction](${solscanLink})
        `;

        targetChannel.send(formattedMessage);

        lastSeenSignature = transactionInfo.signature;
    }
}

function startMonitoring(client) {
    setInterval(() => checkNewTransactions(client), POLLING_INTERVAL);
}

module.exports = {
    startMonitoring
};