module.exports = {
  name: "priceStat",
  async execute(client) {
    console.log("priceStat event fired");
    const tokenList = [
      { name: "ATLAS", id: "star-atlas", channelId: "1102375250378891294" },
      { name: "BTC", id: "bitcoin", channelId: "1102375293517320272" },
      { name: "ETH", id: "ethereum", channelId: "1102375324857155634" },
      { name: "MATIC", id: "matic-network", channelId: "1102375387897548860" },
      { name: "SOL", id: "solana", channelId: "1102375410479669328" },
      { name: "SFL", id: "sunflower-land", channelId: "1102376575061721138" },
    ];

    setInterval(async () => {
      for (let i = 0; i < tokenList.length; i++) {
        const token = tokenList[i];
        try {
          const channel = await client.channels.fetch(token.channelId);
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${token.id}&vs_currencies=usd`
          );
          const data = await response.json();
          if (data[token.id] && data[token.id]["usd"]) {
            const price = data[token.id]["usd"];
            let priceStr = "";
            if (price < 0.01) {
              priceStr = price.toFixed(5);
            } else if (price < 0.5) {
              priceStr = price.toFixed(4);
            } else if (price < 1000) {
              priceStr = price.toFixed(2);
            } else {
              priceStr = price.toFixed(0);
              let index = priceStr.indexOf(".");
              if (index !== -1) {
                let lastZero = priceStr.lastIndexOf("0");
                if (lastZero !== -1 && lastZero > index) {
                  priceStr = priceStr.substring(0, lastZero);
                }
              }
            }
            channel.setName(`${token.name}: ${priceStr} USD`);
            console.log(
              `Updated price for token ${token.name} to ${priceStr} USD`
            );
          } else {
            console.log(`Could not get price for token ${token.name}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);
  },
};
