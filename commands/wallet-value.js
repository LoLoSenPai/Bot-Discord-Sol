const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallet-value')
		.setDescription('Check the value of your wallet')
		.addStringOption((option) =>
			option
				.setName('wallet1')
				.setDescription('Your 1st wallet address')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('wallet2')
				.setDescription('Your 2nd wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet3')
				.setDescription('Your 3rd wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet4')
				.setDescription('Your 4th wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet5')
				.setDescription('Your 5th wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet6')
				.setDescription('Your 6th wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet7')
				.setDescription('Your 7th wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet8')
				.setDescription('Your 8th wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet9')
				.setDescription('Your 9th wallet address')
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName('wallet10')
				.setDescription('Your 10th wallet address')
				.setRequired(false),
		),


	async execute(interaction) {
		// Get the wallet addresses from the command options
		const wallets = [];
		for (let i = 1; i <= 10; i++) {
			const wallet = interaction.options.getString(`wallet${i}`);
			if (wallet) {
				wallets.push(wallet);
			}
		}

		// Concatenate all the wallet addresses into a single string with commas as separators
		const walletAddresses = wallets.join(',');

		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				'X-API-KEY': 'lololabsweb3_sk_c90bbfce-a11c-43f4-9f9d-a999faa923ba_hrnbdmt4pcwszc71',
			},
		};

		try {
			const response = await fetch(
				`https://api.simplehash.com/api/v0/nfts/owners/value?wallet_addresses=${walletAddresses}`,
				options,
			);
			const data = await response.json();

			let totalValue = 0;
			let walletValues = '';
			for (let i = 0; i < data.wallets.length; i++) {
				const walletValue = data.wallets[i].usd_value;
				totalValue += walletValue;
				walletValues += `The value of wallet ${i + 1} is ${walletValue} $\n`;
			}
			walletValues += `The total value of all your wallets is ${totalValue} $`;

			let rank;
			let role;
			if (totalValue > 5000) {
				rank = { value: 'THE holy whale' };
				role = interaction.guild.roles.cache.find(r => r.name === 'Whale');
			}
			else if (totalValue > 1000) {
				rank = { value: 'a giga chad' };
				role = interaction.guild.roles.cache.find(r => r.name === 'Giga Chad');
			}
			else if (totalValue > 500) {
				rank = { value: 'a chad' };
				role = interaction.guild.roles.cache.find(r => r.name === 'Chad');
			}
			else if (totalValue > 200) {
				rank = { value: 'a connoisseur' };
				role = interaction.guild.roles.cache.find(r => r.name === 'Entrepreneur');
			}
			else if (totalValue > 50) {
				rank = { value: 'ready to go to the moon' };
				role = interaction.guild.roles.cache.find(r => r.name === 'Almost Something');
			}
			else if (totalValue < 50) {
				rank = { value: 'a good person' };
				role = interaction.guild.roles.cache.find(r => r.name === 'Begginer');
			}

			if (role) {
				interaction.member.roles.add(role).catch(console.error);
			}

			await interaction.reply({ content: `${walletValues} \n You are ${rank.value}`, ephemeral: true });
		}
		catch (error) {
			console.log(error);
		}
	},
};