const { getTime } = global.utils;

module.exports = {
	config: {
		name: "bank",
		version: "4.0",
		author: "Christus",
		countDown: 0,
		role: 0,
		description: {
			vi: "Hệ thống ngân hàng toàn diện với 50+ tính năng",
			en: "Comprehensive banking system"
		},
		category: "game",
		guide: {
			vi: "Sử dụng {pn} help để xem tất cả lệnh",
			en: "Use {pn} help to see all commands"
		}
	},

	langs: {
		vi: {
			help: "Danh sách lệnh ngân hàng",
			success: "Thành công",
			error: "Lỗi",
			insufficientFunds: "Không đủ tiền",
			invalidAmount: "Số tiền không hợp lệ"
		},
		en: {
			help: "Banking commands list",
			success: "Success",
			error: "Error",
			insufficientFunds: "Insufficient funds",
			invalidAmount: "Invalid amount"
		}
	},

	marketData: {
		stocks: {
			"AAPL": { price: 150.25, change: 2.1, name: "Apple Inc." },
			"GOOGL": { price: 2800.50, change: 1.8, name: "Alphabet Inc." },
			"TSLA": { price: 800.75, change: -0.5, name: "Tesla Inc." },
			"MSFT": { price: 320.40, change: 1.2, name: "Microsoft Corp." },
			"AMZN": { price: 3200.00, change: 0.8, name: "Amazon.com Inc." },
			"META": { price: 330.00, change: 2.5, name: "Meta Platforms Inc." },
			"NVDA": { price: 450.00, change: 3.2, name: "NVIDIA Corp." },
			"NFLX": { price: 380.00, change: -1.1, name: "Netflix Inc." }
		},
		crypto: {
			"BTC": { price: 45000, change: 3.2, name: "Bitcoin" },
			"ETH": { price: 3200, change: 2.8, name: "Ethereum" },
			"BNB": { price: 400, change: 1.5, name: "Binance Coin" },
			"ADA": { price: 1.20, change: 4.1, name: "Cardano" },
			"DOT": { price: 25.50, change: 2.3, name: "Polkadot" },
			"LINK": { price: 28.00, change: 1.9, name: "Chainlink" },
			"MATIC": { price: 0.85, change: 5.1, name: "Polygon" },
			"SOL": { price: 120.00, change: 3.8, name: "Solana" }
		},
		bonds: {
			"US_TREASURY": { yield: 2.5, risk: "Low", term: "10 Year" },
			"CORPORATE": { yield: 3.8, risk: "Medium", term: "5 Year" },
			"MUNICIPAL": { yield: 2.1, risk: "Low", term: "7 Year" },
			"HIGH_YIELD": { yield: 6.2, risk: "High", term: "3 Year" }
		},
		properties: {
			"APARTMENT": { price: 250000, income: 2500, name: "City Apartment" },
			"HOUSE": { price: 500000, income: 4000, name: "Suburban House" },
			"MANSION": { price: 2000000, income: 15000, name: "Luxury Mansion" },
			"OFFICE": { price: 1000000, income: 8000, name: "Commercial Office" },
			"WAREHOUSE": { price: 750000, income: 6000, name: "Industrial Warehouse" },
			"MALL": { price: 5000000, income: 40000, name: "Shopping Mall" }
		},
		vehicles: {
			"TOYOTA": { price: 25000, depreciation: 0.85, name: "Toyota Camry" },
			"BMW": { price: 60000, depreciation: 0.70, name: "BMW M3" },
			"FERRARI": { price: 300000, depreciation: 0.90, name: "Ferrari 488" },
			"LAMBORGHINI": { price: 400000, depreciation: 0.85, name: "Lamborghini Huracan" },
			"ROLLS_ROYCE": { price: 500000, depreciation: 0.80, name: "Rolls-Royce Phantom" },
			"BUGATTI": { price: 3000000, depreciation: 0.75, name: "Bugatti Chiron" }
		},
		businesses: {
			"COFFEE_SHOP": { cost: 50000, income: 5000, employees: 3, name: "Coffee Shop" },
			"RESTAURANT": { cost: 150000, income: 12000, employees: 8, name: "Restaurant" },
			"TECH_STARTUP": { cost: 500000, income: 50000, employees: 20, name: "Tech Startup" },
			"HOTEL": { cost: 2000000, income: 150000, employees: 50, name: "Hotel Chain" },
			"BANK": { cost: 10000000, income: 800000, employees: 200, name: "Regional Bank" },
			"AIRLINE": { cost: 50000000, income: 3000000, employees: 1000, name: "Airline Company" }
		},
		luxury: {
			"ROLEX": { price: 15000, name: "Rolex Submariner" },
			"PAINTING": { price: 100000, name: "Van Gogh Replica" },
			"DIAMOND": { price: 50000, name: "5 Carat Diamond" },
			"YACHT": { price: 2000000, name: "Luxury Yacht" },
			"PRIVATE_JET": { price: 25000000, name: "Private Jet" },
			"ISLAND": { price: 100000000, name: "Private Island" }
		}
	},

	onStart: async function ({ message, args, event, usersData, threadsData, getLang, api }) {
		const { senderID, threadID } = event;
		const command = args[0]?.toLowerCase();
		

		const bankData = global.db.bankData;

		let bank = await bankData.get(senderID);
		if (!bank) {
			bank = await bankData.create(senderID);
		}

		const userData = await usersData.get(senderID);
		const walletBalance = userData.money || 0;

		switch (command) {
			case "help":
			case undefined:
				return this.showHelp(message, fonts);

			case "balance":
			case "bal":
				return this.showBalance(message, bank, walletBalance, fonts);

			case "deposit":
			case "dep":
				return this.deposit(message, args, userData, usersData, bank, bankData, senderID, fonts);

			case "withdraw":
			case "wd":
				return this.withdraw(message, args, userData, usersData, bank, bankData, senderID, fonts);

			case "transfer":
			case "send":
				return this.transfer(message, args, bank, bankData, senderID, event, fonts);

			case "loan":
				return this.loan(message, args, bank, bankData, senderID, fonts);

			case "repay":
				return this.repayLoan(message, args, bank, bankData, senderID, fonts);

			case "savings":
			case "save":
				return this.savings(message, args, bank, bankData, senderID, fonts);

			case "interest":
				return this.calculateInterest(message, bank, bankData, senderID, fonts);

			case "collect":
				return this.collectInterest(message, bank, bankData, senderID, fonts);

			case "history":
				return this.showHistory(message, bank, fonts);

			case "freeze":
				return this.freezeAccount(message, bank, bankData, senderID, fonts);

			case "daily":
				return this.dailyReward(message, bank, bankData, senderID, fonts);

			case "work":
				return this.work(message, bank, bankData, senderID, fonts);

			// === INVESTMENT SYSTEM ===
			case "invest":
				return this.invest(message, fonts);

			case "stocks":
				return this.stocks(message, args, bank, bankData, senderID, fonts);

			case "bonds":
				return this.bonds(message, args, bank, bankData, senderID, fonts);

			case "crypto":
				return this.crypto(message, args, bank, bankData, senderID, fonts);

			case "portfolio":
				return this.showPortfolio(message, bank, fonts);

			case "market":
				return this.showMarket(message, fonts);

			case "dividend":
				return this.collectDividend(message, bank, bankData, senderID, fonts);

			// === BUSINESS SYSTEM ===
			case "business":
				return this.business(message, args, bank, bankData, senderID, fonts);

			case "shop":
				return this.shop(message, args, bank, bankData, senderID, fonts);

			// === REAL ESTATE ===
			case "property":
			case "realestate":
				return this.realEstate(message, args, bank, bankData, senderID, fonts);

			case "house":
				return this.buyHouse(message, args, bank, bankData, senderID, fonts);

			case "rent":
				return this.rentProperty(message, bank, bankData, senderID, fonts);

			// === LUXURY & COLLECTIBLES ===
			case "luxury":
				return this.luxury(message, args, bank, bankData, senderID, fonts);

			case "car":
				return this.buyCar(message, args, bank, bankData, senderID, fonts);

			// === GAMING & FUN ===
			case "gamble":
				return this.gamble(message, args, bank, bankData, senderID, fonts);

			case "lottery":
				return this.lottery(message, args, bank, bankData, senderID, fonts);

			case "slots":
				return this.slots(message, args, bank, bankData, senderID, fonts);

			case "blackjack":
				return this.blackjack(message, args, bank, bankData, senderID, fonts);

			case "roulette":
				return this.roulette(message, args, bank, bankData, senderID, fonts);

			// === PREMIUM FEATURES ===
			case "premium":
				return this.premium(message, args, bank, bankData, senderID, fonts);

			case "vault":
				return this.vault(message, args, bank, bankData, senderID, fonts);

			case "insurance":
				return this.insurance(message, args, bank, bankData, senderID, fonts);

			case "credit":
				return this.creditScore(message, bank, fonts);

			case "achievements":
				return this.achievements(message, bank, fonts);

			case "leaderboard":
				return this.leaderboard(message, bankData, fonts, api);

			case "rob":
				return this.rob(message, args, bank, bankData, senderID, event, fonts);

			default:
				return message.reply(fonts.bold("❌ Unknown command. Use 'bank help' to see all commands."));
		}
	},

	// === HELPER FUNCTIONS ===
	showHelp: function (message, fonts) {
		const helpText = `
${fonts.bold("🏦 BANKING SYSTEM")}
━━━━━━━━━━━━━━━━
${fonts.bold("💎 The Ultimate Financial Experience 💎")}

${fonts.bold("💰 BASIC BANKING")} ${fonts.bold("━━━━━━━━━━━━━")}
🏦 bank balance - Check your complete financial overview
💵 bank deposit <amount> - Secure your money in the bank
💸 bank withdraw <amount> - Access your funds instantly
📤 bank transfer <@user> <amount> - Send money to friends
💳 bank loan <amount> - Get financing for your dreams
🔄 bank repay <amount> - Build your credit score
🏛️ bank savings <amount> - Grow your wealth safely
📊 bank interest - Calculate your earnings
💰 bank collect - Claim your interest rewards
📋 bank history - View your transaction timeline
🎁 bank daily - Claim daily bonuses (24h cooldown)
💼 bank work - Earn money through various jobs

${fonts.bold("📈 INVESTMENTS")} ${fonts.bold("━━━━━━━━━━━━━")}
🚀 bank invest - Explore investment opportunities
📊 bank stocks [list/buy/sell] - Trade blue-chip stocks
₿ bank crypto [list/buy/sell] - Cryptocurrency trading
🏛️ bank bonds [list/buy/sell] - Stable government bonds
📊 bank portfolio - View your investment portfolio
📈 bank market - Live market prices & trends
💰 bank dividend - Collect investment dividends

${fonts.bold("🏢 BUSINESS EMPIRE")} ${fonts.bold("━━━━━━━━━━━━━")}
🏢 bank business [list/buy/upgrade] - Build your empire
🛒 bank shop [list/buy] - Exclusive items & upgrades

${fonts.bold("🏠 REAL ESTATE")} ${fonts.bold("━━━━━━━━━━━━━")}
🏠 bank property [list/buy/sell] - Premium properties
🏘️ bank house [list/buy/sell] - Luxury homes
💰 bank rent - Collect passive rental income

${fonts.bold("💎 LUXURY LIFESTYLE")} ${fonts.bold("━━━━━━━━━━━━━")}
💎 bank luxury [list/buy] - Exclusive collectibles
🚗 bank car [list/buy/sell] - Luxury vehicle collection

${fonts.bold("🎰 GAMING & ENTERTAINMENT")} ${fonts.bold("━━━━━━━━━━━━━")}
🎲 bank gamble <amount> - High-risk, high-reward games
🎫 bank lottery [buy/check] - Weekly lottery draws
🎰 bank slots <amount> - Vegas-style slot machines
🃏 bank blackjack <amount> - Classic card game
🎯 bank roulette <amount> <bet> - European roulette

${fonts.bold("⭐ PREMIUM & SOCIAL")} ${fonts.bold("━━━━━━━━━━━━━")}
💎 bank premium [buy] - 2x earnings & exclusive perks
🔐 bank vault [deposit/withdraw] - Ultra-secure storage
🛡️ bank insurance [list/buy/claim] - Protect your assets
📊 bank credit - Monitor your credit score
🏆 bank achievements - Unlock rewards & titles
🏆 bank leaderboard - Compete with top users
🏴‍☠️ bank rob <@user> - Risky robbery attempts
`;
		return message.reply(helpText);
	},

	showBalance: function (message, bank, walletBalance, fonts) {
		const portfolioValue = this.calculatePortfolioValue(bank);
		const realEstateValue = this.calculateRealEstateValue(bank);
		const businessValue = this.calculateBusinessValue(bank);
		const vehicleValue = this.calculateVehicleValue(bank);
		const luxuryValue = this.calculateLuxuryValue(bank);

		const totalLiquid = bank.balance + bank.savings + bank.vault + walletBalance;
		const totalAssets = portfolioValue + realEstateValue + businessValue + vehicleValue + luxuryValue;
		const totalWealth = totalLiquid + totalAssets;

		// Determine wealth tier
		let wealthTier = "👤 Beginner";
		let tierEmoji = "🔰";
		if (totalWealth >= 1000000000) {
			wealthTier = "💎 Billionaire";
			tierEmoji = "👑";
		} else if (totalWealth >= 1000000) {
			wealthTier = "🏆 Millionaire";
			tierEmoji = "⭐";
		} else if (totalWealth >= 100000) {
			wealthTier = "💰 Wealthy";
			tierEmoji = "✨";
		} else if (totalWealth >= 10000) {
			wealthTier = "📈 Rising";
			tierEmoji = "🚀";
		}

		// Credit score rating
		let creditRating = "Poor";
		let creditEmoji = "🔴";
		if (bank.creditScore >= 800) {
			creditRating = "Excellent";
			creditEmoji = "🟢";
		} else if (bank.creditScore >= 740) {
			creditRating = "Very Good";
			creditEmoji = "🟢";
		} else if (bank.creditScore >= 670) {
			creditRating = "Good";
			creditEmoji = "🟡";
		} else if (bank.creditScore >= 580) {
			creditRating = "Fair";
			creditEmoji = "🟠";
		}

		const balanceText = `
${fonts.bold("💳 FINANCIAL DASHBOARD")} ${tierEmoji}
━━━━━━━━━━━━━
${fonts.bold(wealthTier)} • ${fonts.bold("Level " + bank.bankLevel)}${bank.premium ? " • 💎 Premium" : ""}

${fonts.bold("💰 LIQUID ASSETS")} ${fonts.bold("━━━━━━━━━━━━━")}
💵 Wallet: ${fonts.bold("$" + walletBalance.toLocaleString())}
🏦 Bank: ${fonts.bold("$" + bank.balance.toLocaleString())}
🏛️ Savings: ${fonts.bold("$" + bank.savings.toLocaleString())} ${bank.savings > 0 ? "(+3% monthly)" : ""}
🔐 Vault: ${fonts.bold("$" + bank.vault.toLocaleString())} ${bank.vault > 0 ? "(+1% monthly)" : ""}
├─ ${fonts.bold("Total Liquid: $" + totalLiquid.toLocaleString())}

${fonts.bold("📊 ASSET PORTFOLIO")} ${fonts.bold("━━━━━━━━━━━━━")}
📈 Investments: ${fonts.bold("$" + portfolioValue.toLocaleString())}
🏠 Real Estate: ${fonts.bold("$" + realEstateValue.toLocaleString())}
🏢 Businesses: ${fonts.bold("$" + businessValue.toLocaleString())}
🚗 Vehicles: ${fonts.bold("$" + vehicleValue.toLocaleString())}
💎 Luxury: ${fonts.bold("$" + luxuryValue.toLocaleString())}
├─ ${fonts.bold("Total Assets: $" + totalAssets.toLocaleString())}

${fonts.bold("🏆 WEALTH SUMMARY")} ${fonts.bold("━━━━━━━━━━━━━")}
💎 ${fonts.bold("Net Worth: $" + totalWealth.toLocaleString())}
${creditEmoji} Credit Score: ${fonts.bold(bank.creditScore + "/850")} (${creditRating})
🎯 Max Loan: ${fonts.bold("$" + (bank.creditScore * 1000).toLocaleString())}
⚡ Earnings Multiplier: ${fonts.bold(bank.multiplier + "x")}${bank.premium ? " (Premium Boost!)" : ""}

${fonts.bold("📈 PERFORMANCE METRICS")} ${fonts.bold("━━━━━━━━━━━━━")}
🔥 Daily Streak: ${fonts.bold(bank.streak + " days")} ${bank.streak >= 7 ? "🎉" : ""}
🏆 Achievements: ${fonts.bold((bank.achievements?.length || 0) + "/100")} ${bank.achievements?.length >= 10 ? "⭐" : ""}
⭐ Reputation: ${fonts.bold(bank.reputation)} ${bank.reputation >= 100 ? "👑" : ""}
💸 Active Loan: ${fonts.bold(bank.loan > 0 ? "$" + bank.loan.toLocaleString() : "None ✅")}

${fonts.bold("🎲 GAMING STATS")} ${fonts.bold("━━━━━━━━━━━━━")}
🎰 Gambling Skill: ${fonts.bold(bank.skills?.gambling || 0)}
📊 Trading Skill: ${fonts.bold(bank.skills?.trading || 0)}
🏢 Business Skill: ${fonts.bold(bank.skills?.business || 0)}
📈 Investing Skill: ${fonts.bold(bank.skills?.investing || 0)}`;
		return message.reply(balanceText);
	},

	deposit: async function (message, args, userData, usersData, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
💰 DEPOSIT HELP
━━━━━━━━━━━━━

Usage: bank deposit <amount>
Example: bank deposit 5000

Your current wallet: $${(userData.money || 0).toLocaleString()}
			`));
		}

		const userMoney = userData.money || 0;
		if (userMoney < amount) {
			return message.reply(fonts.bold(`
❌ INSUFFICIENT FUNDS
━━━━━━━━━━━

Wallet Balance: $${userMoney.toLocaleString()}
Required Amount: $${amount.toLocaleString()}
Shortfall: $${(amount - userMoney).toLocaleString()}

💡 Tip: Use 'bank work' to earn more money!
			`));
		}

		// Transfer money from user balance to bank balance
		userData.money = userMoney - amount;
		bank.balance += amount;
		bank.transactions.push({
			type: "deposit",
			amount: amount,
			date: Date.now(),
			description: "Cash deposit"
		});

		// Add achievement for first deposit
		if (!bank.achievements.includes("First Deposit")) {
			bank.achievements.push("First Deposit");
		}

		// Add achievement for large deposits
		if (amount >= 1000000 && !bank.achievements.includes("Million Dollar Deposit")) {
			bank.achievements.push("Million Dollar Deposit");
		}

		await usersData.set(senderID, userData);
		await bankData.set(senderID, bank);

		const newAchievements = bank.achievements.includes("First Deposit") ? "\n🏆 Achievement unlocked: First Deposit!" : "";
		const millionAchievement = bank.achievements.includes("Million Dollar Deposit") ? "\n🏆 Achievement unlocked: Million Dollar Deposit!" : "";

		return message.reply(fonts.bold(`
💰 DEPOSIT SUCCESSFUL! 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Amount Deposited: $${amount.toLocaleString()}
🏦 New Bank Balance: $${bank.balance.toLocaleString()}
💳 Remaining Wallet: $${userData.money.toLocaleString()}

📊 Transaction recorded successfully!
${newAchievements}${millionAchievement}

💡 Your money is now earning interest in the bank!
		`));
	},

	withdraw: async function (message, args, userData, usersData, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
💸 WITHDRAWAL HELP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: bank withdraw <amount>
Example: bank withdraw 5000

Your current bank balance: $${bank.balance.toLocaleString()}
			`));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold(`
❌ INSUFFICIENT BANK FUNDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bank Balance: $${bank.balance.toLocaleString()}
Required Amount: $${amount.toLocaleString()}
Shortfall: $${(amount - bank.balance).toLocaleString()}

💡 Tips:
• Use 'bank collect' to claim interest
• Transfer from savings if available
• Work or invest to earn more money
			`));
		}

		// Transfer money from bank balance to user balance
		userData.money = (userData.money || 0) + amount;
		bank.balance -= amount;
		bank.transactions.push({
			type: "withdrawal",
			amount: amount,
			date: Date.now(),
			description: "Cash withdrawal"
		});

		await usersData.set(senderID, userData);
		await bankData.set(senderID, bank);

		return message.reply(fonts.bold(`
💸 WITHDRAWAL SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Amount Withdrawn: $${amount.toLocaleString()}
💳 New Wallet Balance: $${userData.money.toLocaleString()}
🏦 Remaining Bank Balance: $${bank.balance.toLocaleString()}

📊 Transaction recorded successfully!

💡 Remember: Money in your wallet can be stolen!
Consider keeping funds in your vault for security.
		`));
	},

	transfer: async function (message, args, bank, bankData, senderID, event, fonts) {
		const targetUID = Object.keys(event.mentions)[0];
		const amount = parseInt(args[2]);

		if (!targetUID) {
			return message.reply(fonts.bold("❌ Please mention a user to transfer money to.\nUsage: bank transfer @user <amount>"));
		}

		if (targetUID === senderID) {
			return message.reply(fonts.bold("❌ You cannot transfer money to yourself."));
		}

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount to transfer."));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold(`❌ Insufficient funds in your bank account. You have $${bank.balance.toLocaleString()}, but need $${amount.toLocaleString()}.`));
		}

		try {
			let targetBank = await bankData.get(targetUID);
			if (!targetBank) {
				targetBank = await bankData.create(targetUID);
			}

			// Perform transfer
			bank.balance -= amount;
			targetBank.balance += amount;

			// Record transactions
			bank.transactions.push({
				type: "transfer_out",
				amount: amount,
				date: Date.now(),
				description: `Transfer to user ${targetUID}`
			});

			targetBank.transactions.push({
				type: "transfer_in",
				amount: amount,
				date: Date.now(),
				description: `Transfer from user ${senderID}`
			});

			await bankData.set(senderID, bank);
			await bankData.set(targetUID, targetBank);

			return message.reply(fonts.bold(`✅ Successfully transferred $${amount.toLocaleString()} to the user.\nYour new balance: $${bank.balance.toLocaleString()}`));
		} catch (error) {
			console.error('Transfer error:', error);
			return message.reply(fonts.bold("❌ An error occurred during the transfer. Please try again."));
		}
	},

	loan: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);

		if (!amount || amount <= 0) {
			const maxLoan = Math.floor(bank.creditScore * 1000);
			return message.reply(fonts.bold(`
💳 LOAN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Credit Score: ${bank.creditScore}
Maximum Loan Amount: $${maxLoan.toLocaleString()}
Interest Rate: 5% per week
Current Loan: ${bank.loan > 0 ? "$" + bank.loan.toLocaleString() : "None"}
${bank.loanDate ? `Loan Date: ${new Date(bank.loanDate).toLocaleDateString()}` : ""}

Usage: bank loan <amount>
Example: bank loan 50000
			`));
		}

		if (bank.loan > 0) {
			return message.reply(fonts.bold(`❌ You already have an active loan of $${bank.loan.toLocaleString()}. Please repay it first using 'bank repay <amount>'.`));
		}

		const maxLoan = Math.floor(bank.creditScore * 1000);
		if (amount > maxLoan) {
			return message.reply(fonts.bold(`❌ Maximum loan amount based on your credit score (${bank.creditScore}): $${maxLoan.toLocaleString()}\nRequested: $${amount.toLocaleString()}`));
		}

		if (amount < 1000) {
			return message.reply(fonts.bold("❌ Minimum loan amount is $1,000."));
		}

		bank.balance += amount;
		bank.loan = amount;
		bank.loanDate = new Date();
		bank.transactions.push({
			type: "loan",
			amount: amount,
			date: Date.now(),
			description: "Bank loan approved"
		});

		await bankData.set(senderID, bank);
		return message.reply(fonts.bold(`✅ Loan approved! $${amount.toLocaleString()} has been added to your bank account.\nInterest rate: 5% per week\nCurrent balance: $${bank.balance.toLocaleString()}\nPlease repay responsibly to maintain your credit score.`));
	},

	repayLoan: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);

		if (bank.loan <= 0) {
			return message.reply(fonts.bold("❌ You don't have any active loans."));
		}

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
💳 LOAN REPAYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Outstanding Loan: $${bank.loan.toLocaleString()}
Your Balance: $${bank.balance.toLocaleString()}

Usage: bank repay <amount>
Example: bank repay ${Math.min(bank.loan, bank.balance)}
			`));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold("❌ Insufficient funds in your bank account."));
		}

		const repayAmount = Math.min(amount, bank.loan);
		bank.balance -= repayAmount;
		bank.loan -= repayAmount;

		if (bank.loan <= 0) {
			bank.loanDate = null;
			bank.creditScore += 10;
		}

		bank.transactions.push({
			type: "loan_repayment",
			amount: repayAmount,
			date: Date.now(),
			description: "Loan repayment"
		});

		await bankData.set(senderID, bank);

		const message_text = bank.loan <= 0 
			? `✅ Loan fully repaid! Your credit score increased by 10 points.` 
			: `✅ Successfully repaid $${repayAmount.toLocaleString()}.\nRemaining loan: $${bank.loan.toLocaleString()}`;

		return message.reply(fonts.bold(message_text));
	},

	savings: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
💰 SAVINGS ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Savings: $${bank.savings.toLocaleString()}
Bank Balance: $${bank.balance.toLocaleString()}
Interest Rate: 3% monthly

Savings earn interest every month automatically!

Usage: bank savings <amount>
Example: bank savings 10000
			`));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold("❌ Insufficient funds in your bank account."));
		}

		bank.balance -= amount;
		bank.savings += amount;
		bank.transactions.push({
			type: "savings_deposit",
			amount: amount,
			date: Date.now(),
			description: "Savings deposit"
		});

		await bankData.set(senderID, bank);
		return message.reply(fonts.bold(`✅ Successfully saved $${amount.toLocaleString()}.\nSavings earn 3% interest monthly.\nNew savings balance: $${bank.savings.toLocaleString()}`));
	},

	calculateInterest: async function (message, bank, bankData, senderID, fonts) {
		const now = Date.now();
		const lastInterest = bank.lastInterest ? new Date(bank.lastInterest).getTime() : now;
		const timeDiff = now - lastInterest;
		const hoursPassed = timeDiff / (1000 * 60 * 60);

		// Calculate interest based on time passed
		const savingsRate = 0.03 / (30 * 24); // 3% monthly divided by hours in a month
		const loanRate = 0.05 / (7 * 24); // 5% weekly divided by hours in a week

		const savingsInterest = Math.floor(bank.savings * savingsRate * hoursPassed);
		const loanInterest = Math.floor(bank.loan * loanRate * hoursPassed);

		// Don't apply interest if less than 1 hour has passed
		if (hoursPassed < 1) {
			return message.reply(fonts.bold(`
📊 INTEREST PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time since last calculation: ${Math.floor(hoursPassed * 60)} minutes
Minimum time required: 1 hour

${fonts.bold("💰 Potential Savings Interest:")} +$${savingsInterest.toLocaleString()}
${fonts.bold("💸 Potential Loan Interest:")} +$${loanInterest.toLocaleString()}

Wait ${60 - Math.floor(hoursPassed * 60)} more minutes to collect interest.
			`));
		}

		bank.savings += savingsInterest;
		bank.loan += loanInterest;
		bank.lastInterest = new Date();

		if (savingsInterest > 0) {
			bank.transactions.push({
				type: "interest_earned",
				amount: savingsInterest,
				date: Date.now(),
				description: `Savings interest (${Math.floor(hoursPassed)}h)`
			});
		}

		if (loanInterest > 0) {
			bank.transactions.push({
				type: "interest_charged",
				amount: loanInterest,
				date: Date.now(),
				description: `Loan interest (${Math.floor(hoursPassed)}h)`
			});
		}

		await bankData.set(senderID, bank);

		const interestText = `
${fonts.bold("📊 INTEREST CALCULATION")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fonts.bold("⏰ Time Period:")} ${Math.floor(hoursPassed)} hours
${fonts.bold("💰 Savings Interest Earned:")} +$${savingsInterest.toLocaleString()}
${fonts.bold("💸 Loan Interest Accrued:")} +$${loanInterest.toLocaleString()}

${fonts.bold("📈 Updated Balances:")}
• Savings: $${bank.savings.toLocaleString()}
• Loan: $${bank.loan.toLocaleString()}
• Net Change: ${savingsInterest - loanInterest >= 0 ? '+' : ''}$${(savingsInterest - loanInterest).toLocaleString()}
`;
		return message.reply(interestText);
	},

	collectInterest: async function (message, bank, bankData, senderID, fonts) {
		const now = Date.now();
		const lastInterest = bank.lastInterest ? new Date(bank.lastInterest).getTime() : 0;
		const timeDiff = now - lastInterest;
		const hoursPassed = timeDiff / (1000 * 60 * 60);

		// If user never collected before, allow them to collect
		if (bank.lastInterest && hoursPassed < 1) {
			const minutesLeft = 60 - Math.floor(hoursPassed * 60);
			return message.reply(fonts.bold(`⏰ Interest can only be collected once per hour.\nWait ${minutesLeft} more minutes.`));
		}

		// Calculate all types of interest
		const savingsRate = 0.03 / (30 * 24); // 3% monthly
		const vaultRate = 0.01 / (30 * 24); // 1% monthly for vault
		const loanRate = 0.05 / (7 * 24); // 5% weekly for loans

		const savingsInterest = Math.floor(bank.savings * savingsRate * hoursPassed);
		const vaultInterest = Math.floor(bank.vault * vaultRate * hoursPassed);
		const loanInterest = Math.floor(bank.loan * loanRate * hoursPassed);
		const netInterest = savingsInterest + vaultInterest - loanInterest;

		// Apply interest
		bank.savings += savingsInterest;
		bank.vault += vaultInterest;
		bank.loan += loanInterest;
		bank.lastInterest = new Date();

		// Record transactions
		if (savingsInterest > 0) {
			bank.transactions.push({
				type: "interest_earned",
				amount: savingsInterest,
				date: Date.now(),
				description: `Savings interest (${Math.floor(hoursPassed)}h)`
			});
		}

		if (vaultInterest > 0) {
			bank.transactions.push({
				type: "interest_earned",
				amount: vaultInterest,
				date: Date.now(),
				description: `Vault interest (${Math.floor(hoursPassed)}h)`
			});
		}

		if (loanInterest > 0) {
			bank.transactions.push({
				type: "interest_charged",
				amount: loanInterest,
				date: Date.now(),
				description: `Loan interest (${Math.floor(hoursPassed)}h)`
			});
		}

		await bankData.set(senderID, bank);

		const interestText = `
${fonts.bold("💰 INTEREST COLLECTED")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fonts.bold("⏰ Time Period:")} ${Math.floor(hoursPassed)} hours

${fonts.bold("💰 EARNINGS:")}
• Savings Interest: +$${savingsInterest.toLocaleString()}
• Vault Interest: +$${vaultInterest.toLocaleString()}

${fonts.bold("💸 CHARGES:")}
• Loan Interest: -$${loanInterest.toLocaleString()}

${fonts.bold("📊 NET RESULT:")} ${netInterest >= 0 ? '+' : ''}$${netInterest.toLocaleString()}

${fonts.bold("📈 Current Balances:")}
• Savings: $${bank.savings.toLocaleString()}
• Vault: $${bank.vault.toLocaleString()}
• Outstanding Loan: $${bank.loan.toLocaleString()}
`;
		return message.reply(interestText);
	},

	showHistory: function (message, bank, fonts) {
		const transactions = bank.transactions.slice(-15);
		if (transactions.length === 0) {
			return message.reply(fonts.bold("📋 No transaction history available."));
		}

		let historyText = `${fonts.bold("📋 TRANSACTION HISTORY (Last 15)")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

		transactions.reverse().forEach((tx, index) => {
			const date = new Date(tx.date).toLocaleDateString();
			const type = tx.type.replace(/_/g, ' ').toUpperCase();
			const amount = tx.amount.toLocaleString();
			const emoji = this.getTransactionEmoji(tx.type);
			historyText += `${emoji} ${type}: $${amount} (${date})\n`;
		});

		return message.reply(historyText);
	},

	getTransactionEmoji: function (type) {
		const emojis = {
			deposit: "💰",
			withdrawal: "💸",
			transfer_in: "📥",
			transfer_out: "📤",
			loan: "🏦",
			loan_repayment: "💳",
			savings_deposit: "🏛️",
			interest_earned: "📈",
			interest_charged: "📉",
			investment: "📊",
			dividend: "💰",
			salary: "💼",
			business_income: "🏢",
			rental_income: "🏠",
			gambling_win: "🎰",
			gambling_loss: "💸"
		};
		return emojis[type] || "💼";
	},

	freezeAccount: async function (message, bank, bankData, senderID, fonts) {
		bank.frozen = !bank.frozen;
		await bankData.set(senderID, bank);

		const status = bank.frozen ? "frozen" : "unfrozen";
		const emoji = bank.frozen ? "🔒" : "🔓";
		return message.reply(fonts.bold(`${emoji} Account has been ${status}.${bank.frozen ? " All transactions are now blocked." : " You can now make transactions again."}`));
	},

	dailyReward: async function (message, bank, bankData, senderID, fonts) {
		const now = Date.now();
		const lastDaily = bank.lastDaily ? new Date(bank.lastDaily).getTime() : 0;
		const oneDayMs = 24 * 60 * 60 * 1000;

		if (now - lastDaily < oneDayMs) {
			const timeLeft = oneDayMs - (now - lastDaily);
			const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
			const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
			return message.reply(fonts.bold(`⏰ Daily reward already claimed!\nNext reward in: ${hoursLeft}h ${minutesLeft}m`));
		}

		// Calculate streak
		if (now - lastDaily < oneDayMs * 2) {
			bank.streak++;
		} else {
			bank.streak = 1;
		}

		// Calculate reward based on streak and level
		const baseReward = 1000;
		const streakBonus = Math.min(bank.streak * 100, 2000);
		const levelBonus = bank.bankLevel * 500;
		const premiumMultiplier = bank.premium ? 2 : 1;
		const totalReward = Math.floor((baseReward + streakBonus + levelBonus) * premiumMultiplier);

		bank.balance += totalReward;
		bank.lastDaily = new Date();
		bank.transactions.push({
			type: "daily_reward",
			amount: totalReward,
			date: Date.now(),
			description: `Daily reward (${bank.streak} day streak)`
		});

		await bankData.set(senderID, bank);

		return message.reply(fonts.bold(`
🎁 DAILY REWARD CLAIMED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Reward: $${totalReward.toLocaleString()}
🔥 Streak: ${bank.streak} days
📈 Level: ${bank.bankLevel}
⭐ Premium: ${bank.premium ? "2x Bonus!" : "None"}

Keep your streak alive for bigger rewards!
		`));
	},

	work: async function (message, bank, bankData, senderID, fonts) {
		const now = Date.now();
		const lastWork = bank.lastWork ? new Date(bank.lastWork).getTime() : 0;
		const workCooldown = 4 * 60 * 60 * 1000; // 4 hours

		if (now - lastWork < workCooldown) {
			const timeLeft = workCooldown - (now - lastWork);
			const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
			const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
			return message.reply(fonts.bold(`⏰ You're too tired to work!\nRest for: ${hoursLeft}h ${minutesLeft}m`));
		}

		const jobs = [
			{ name: "Delivery Driver", min: 500, max: 1500 },
			{ name: "Data Entry", min: 300, max: 800 },
			{ name: "Freelancer", min: 1000, max: 3000 },
			{ name: "Consultant", min: 2000, max: 5000 },
			{ name: "Manager", min: 3000, max: 7000 }
		];

		const job = jobs[Math.floor(Math.random() * jobs.length)];
		const salary = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
		const skillBonus = bank.skills.business * 100;
		const totalEarnings = Math.floor((salary + skillBonus) * bank.multiplier);

		bank.balance += totalEarnings;
		bank.lastWork = new Date();
		bank.skills.business += 1;
		bank.transactions.push({
			type: "salary",
			amount: totalEarnings,
			date: Date.now(),
			description: `Work: ${job.name}`
		});

		await bankData.set(senderID, bank);

		return message.reply(fonts.bold(`
💼 WORK COMPLETED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: ${job.name}
Base Salary: $${salary.toLocaleString()}
Skill Bonus: $${skillBonus.toLocaleString()}
Total Earned: $${totalEarnings.toLocaleString()}

Business Skill increased! (${bank.skills.business})
		`));
	},

	// Investment functions
	invest: function (message, fonts) {
		return message.reply(fonts.bold(`
📊 INVESTMENT MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Investment Options:
• bank stocks - Stock market trading
• bank crypto - Cryptocurrency trading  
• bank bonds - Government & corporate bonds
• bank business - Business investments
• bank property - Real estate investments

Use 'bank <option> list' to see available items!
Example: bank stocks list
		`));
	},

	stocks: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let stockList = `${fonts.bold("📈 STOCK MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.stocks).forEach(([symbol, data]) => {
				const changeEmoji = data.change >= 0 ? "📈" : "📉";
				const changeColor = data.change >= 0 ? "+" : "";
				stockList += `${changeEmoji} ${symbol} - $${data.price.toLocaleString()} (${changeColor}${data.change}%)\n`;
				stockList += `   ${data.name}\n\n`;
			});

			stockList += `${fonts.bold("Your Holdings:")}\n`;
			if (Object.keys(bank.stocks).length === 0) {
				stockList += "None owned\n\n";
			} else {
				Object.entries(bank.stocks).forEach(([symbol, shares]) => {
					const currentPrice = this.marketData.stocks[symbol]?.price || 0;
					const value = shares * currentPrice;
					stockList += `• ${symbol}: ${shares} shares ($${value.toLocaleString()})\n`;
				});
				stockList += "\n";
			}

			stockList += `${fonts.bold("Usage:")}\n`;
			stockList += `• bank stocks buy <symbol> <shares>\n`;
			stockList += `• bank stocks sell <symbol> <shares>`;

			return message.reply(stockList);
		}

		const symbol = args[2]?.toUpperCase();
		const shares = parseInt(args[3]);

		if (!symbol || !this.marketData.stocks[symbol]) {
			return message.reply(fonts.bold("❌ Invalid stock symbol. Use 'bank stocks list' to see available stocks."));
		}

		if (action === "buy") {
			if (!shares || shares <= 0) {
				return message.reply(fonts.bold("❌ Please specify the number of shares to buy."));
			}

			const stockPrice = this.marketData.stocks[symbol].price;
			const totalCost = stockPrice * shares;

			if (bank.balance < totalCost) {
				return message.reply(fonts.bold("❌ Insufficient funds. You need $" + totalCost.toLocaleString()));
			}

			bank.balance -= totalCost;
			if (!bank.stocks[symbol]) {
				bank.stocks[symbol] = 0;
			}
			bank.stocks[symbol] += shares;

			bank.transactions.push({
				type: "stock_purchase",
				amount: totalCost,
				date: Date.now(),
				description: `Bought ${shares} shares of ${symbol}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Bought ${shares} shares of ${symbol} for $${totalCost.toLocaleString()}.`));
		}

		if (action === "sell") {
			if (!shares || shares <= 0) {
				return message.reply(fonts.bold("❌ Please specify the number of shares to sell."));
			}

			if (!bank.stocks[symbol] || bank.stocks[symbol] < shares) {
				return message.reply(fonts.bold("❌ You don't own enough shares."));
			}

			const stockPrice = this.marketData.stocks[symbol].price;
			const totalValue = stockPrice * shares;

			bank.balance += totalValue;
			bank.stocks[symbol] -= shares;

			if (bank.stocks[symbol] === 0) {
				delete bank.stocks[symbol];
			}

			bank.transactions.push({
				type: "stock_sale",
				amount: totalValue,
				date: Date.now(),
				description: `Sold ${shares} shares of ${symbol}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Sold ${shares} shares of ${symbol} for $${totalValue.toLocaleString()}.`));
		}
	},

	crypto: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let cryptoList = `${fonts.bold("₿ CRYPTOCURRENCY MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.crypto).forEach(([symbol, data]) => {
				const changeEmoji = data.change >= 0 ? "📈" : "📉";
				const changeColor = data.change >= 0 ? "+" : "";
				cryptoList += `${changeEmoji} ${symbol} - $${data.price.toLocaleString()} (${changeColor}${data.change}%)\n`;
				cryptoList += `   ${data.name}\n\n`;
			});

			cryptoList += `${fonts.bold("Your Holdings:")}\n`;
			if (Object.keys(bank.crypto).length === 0) {
				cryptoList += "None owned\n\n";
			} else {
				Object.entries(bank.crypto).forEach(([symbol, amount]) => {
					const currentPrice = this.marketData.crypto[symbol]?.price || 0;
					const value = amount * currentPrice;
					cryptoList += `• ${symbol}: ${amount} coins ($${value.toLocaleString()})\n`;
				});
				cryptoList += "\n";
			}

			cryptoList += `${fonts.bold("Usage:")}\n`;
			cryptoList += `• bank crypto buy <symbol> <amount>\n`;
			cryptoList += `• bank crypto sell <symbol> <amount>`;

			return message.reply(cryptoList);
		}

		const symbol = args[2]?.toUpperCase();
		const amount = parseFloat(args[3]);

		if (!symbol || !this.marketData.crypto[symbol]) {
			return message.reply(fonts.bold("❌ Invalid crypto symbol. Use 'bank crypto list' to see available cryptos."));
		}

		if (action === "buy") {
			if (!amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Please specify the amount to buy."));
			}

			const cryptoPrice = this.marketData.crypto[symbol].price;
			const totalCost = cryptoPrice * amount;

			if (bank.balance < totalCost) {
				return message.reply(fonts.bold("❌ Insufficient funds. You need $" + totalCost.toLocaleString()));
			}

			bank.balance -= totalCost;
			if (!bank.crypto[symbol]) {
				bank.crypto[symbol] = 0;
			}
			bank.crypto[symbol] += amount;

			bank.transactions.push({
				type: "crypto_purchase",
				amount: totalCost,
				date: Date.now(),
				description: `Bought ${amount} ${symbol}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Bought ${amount} ${symbol} for $${totalCost.toLocaleString()}.`));
		}

		if (action === "sell") {
			if (!amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Please specify the amount to sell."));
			}

			if (!bank.crypto[symbol] || bank.crypto[symbol] < amount) {
				return message.reply(fonts.bold("❌ You don't own enough cryptocurrency."));
			}

			const cryptoPrice = this.marketData.crypto[symbol].price;
			const totalValue = cryptoPrice * amount;

			bank.balance += totalValue;
			bank.crypto[symbol] -= amount;

			if (bank.crypto[symbol] === 0) {
				delete bank.crypto[symbol];
			}

			bank.transactions.push({
				type: "crypto_sale",
				amount: totalValue,
				date: Date.now(),
				description: `Sold ${amount} ${symbol}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Sold ${amount} ${symbol} for $${totalValue.toLocaleString()}.`));
		}
	},

	bonds: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let bondList = `${fonts.bold("🏛️ BOND MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.bonds).forEach(([type, data]) => {
				bondList += `📊 ${type.replace(/_/g, ' ')}\n`;
				bondList += `   Yield: ${data.yield}% annually\n`;
				bondList += `   Risk: ${data.risk}\n`;
				bondList += `   Term: ${data.term}\n\n`;
			});

			bondList += `${fonts.bold("Your Holdings:")}\n`;
			if (Object.keys(bank.bonds).length === 0) {
				bondList += "None owned\n\n";
			} else {
				Object.entries(bank.bonds).forEach(([type, amount]) => {
					bondList += `• ${type.replace(/_/g, ' ')}: $${amount.toLocaleString()}\n`;
				});
				bondList += "\n";
			}

			bondList += `${fonts.bold("Usage:")}\n`;
			bondList += `• bank bonds buy <type> <amount>\n`;
			bondList += `• bank bonds sell <type> <amount>`;

			return message.reply(bondList);
		}

		const bondType = args[2]?.toUpperCase();
		const amount = parseInt(args[3]);

		if (!bondType || !this.marketData.bonds[bondType]) {
			return message.reply(fonts.bold("❌ Invalid bond type. Use 'bank bonds list' to see available bonds."));
		}

		if (action === "buy") {
			if (!amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Please specify the amount to invest."));
			}

			if (bank.balance < amount) {
				return message.reply(fonts.bold("❌ Insufficient funds."));
			}

			bank.balance -= amount;
			if (!bank.bonds[bondType]) {
				bank.bonds[bondType] = 0;
			}
			bank.bonds[bondType] += amount;

			bank.transactions.push({
				type: "bond_purchase",
				amount: amount,
				date: Date.now(),
				description: `Bought ${bondType} bonds`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Bought $${amount.toLocaleString()} in ${bondType.replace(/_/g, ' ')} bonds.`));
		}
	},

	showPortfolio: function (message, bank, fonts) {
		let portfolioText = `${fonts.bold("📊 INVESTMENT PORTFOLIO")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

		let totalValue = 0;

		// Show stocks
		if (Object.keys(bank.stocks).length > 0) {
			portfolioText += `${fonts.bold("📈 STOCKS:")}\n`;
			Object.entries(bank.stocks).forEach(([symbol, shares]) => {
				const currentPrice = this.marketData.stocks[symbol]?.price || 100;
				const value = shares * currentPrice;
				totalValue += value;
				portfolioText += `• ${symbol}: ${shares} shares ($${value.toLocaleString()})\n`;
			});
			portfolioText += "\n";
		}

		// Show crypto
		if (Object.keys(bank.crypto).length > 0) {
			portfolioText += `${fonts.bold("₿ CRYPTOCURRENCY:")}\n`;
			Object.entries(bank.crypto).forEach(([coin, amount]) => {
				const currentPrice = this.marketData.crypto[coin]?.price || 1;
				const value = amount * currentPrice;
				totalValue += value;
				portfolioText += `• ${coin}: ${amount} coins ($${value.toLocaleString()})\n`;
			});
			portfolioText += "\n";
		}

		// Show bonds
		if (Object.keys(bank.bonds).length > 0) {
			portfolioText += `${fonts.bold("🏛️ BONDS:")}\n`;
			Object.entries(bank.bonds).forEach(([type, amount]) => {
				totalValue += amount;
				portfolioText += `• ${type.replace(/_/g, ' ')}: $${amount.toLocaleString()}\n`;
			});
			portfolioText += "\n";
		}

		portfolioText += `${fonts.bold("Total Portfolio Value: $" + totalValue.toLocaleString())}`;

		if (totalValue === 0) {
			portfolioText = fonts.bold("📊 Your investment portfolio is empty.\nStart investing with 'bank stocks list' or 'bank crypto list'!");
		}

		return message.reply(portfolioText);
	},

	showMarket: function (message, fonts) {
		const marketText = `
${fonts.bold("📊 GLOBAL MARKET OVERVIEW")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fonts.bold("📈 TOP STOCKS:")}
• AAPL: $150.25 (+2.1%) - Apple Inc.
• GOOGL: $2,800.50 (+1.8%) - Alphabet Inc.
• TSLA: $800.75 (-0.5%) - Tesla Inc.
• MSFT: $320.40 (+1.2%) - Microsoft Corp.

${fonts.bold("₿ TOP CRYPTOCURRENCY:")}
• BTC: $45,000 (+3.2%) - Bitcoin
• ETH: $3,200 (+2.8%) - Ethereum
• BNB: $400 (+1.5%) - Binance Coin
• ADA: $1.20 (+4.1%) - Cardano

${fonts.bold("🏛️ BOND YIELDS:")}
• US Treasury: 2.5% (10 Year)
• Corporate: 3.8% (5 Year)
• Municipal: 2.1% (7 Year)
• High Yield: 6.2% (3 Year)

${fonts.bold("📊 MARKET SENTIMENT:")} Bullish
${fonts.bold("💹 Trading Volume:")} High
${fonts.bold("🔥 Trending:")} Tech Stocks, DeFi Tokens
`;
		return message.reply(marketText);
	},

	collectDividend: async function (message, bank, bankData, senderID, fonts) {
		let totalDividends = 0;

		// Calculate dividends from stocks
		Object.entries(bank.stocks || {}).forEach(([symbol, shares]) => {
			const dividendPerShare = 5; // $5 per share dividend
			const dividend = shares * dividendPerShare;
			totalDividends += dividend;
		});

		// Calculate dividends from bonds
		Object.entries(bank.bonds || {}).forEach(([type, amount]) => {
			const yieldRate = this.marketData.bonds[type]?.yield || 2.5;
			const dividend = amount * (yieldRate / 100) / 12; // Monthly yield
			totalDividends += dividend;
		});

		if (totalDividends === 0) {
			return message.reply(fonts.bold("💰 No dividends to collect. Invest in stocks or bonds to earn dividends!"));
		}

		bank.balance += Math.floor(totalDividends);
		bank.transactions.push({
			type: "dividend",
			amount: Math.floor(totalDividends),
			date: Date.now(),
			description: "Investment dividends"
		});

		await bankData.set(senderID, bank);
		return message.reply(fonts.bold(`💰 Collected $${Math.floor(totalDividends).toLocaleString()} in dividends from your investments!`));
	},

	// Business functions
	business: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let businessList = `${fonts.bold("🏢 BUSINESS OPPORTUNITIES")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.businesses).forEach(([type, data]) => {
				businessList += `🏢 ${data.name}\n`;
				businessList += `   Cost: $${data.cost.toLocaleString()}\n`;
				businessList += `   Monthly Income: $${data.income.toLocaleString()}\n`;
				businessList += `   Employees: ${data.employees}\n`;
				businessList += `   ROI: ${Math.round((data.income * 12 / data.cost) * 100)}% annually\n\n`;
			});

			businessList += `${fonts.bold("Your Businesses:")}\n`;
			if (bank.businesses.length === 0) {
				businessList += "None owned\n\n";
			} else {
				bank.businesses.forEach((business, index) => {
					businessList += `${index + 1}. ${business.name} (Level ${business.level})\n`;
				});
				businessList += "\n";
			}

			businessList += `${fonts.bold("Usage:")}\n`;
			businessList += `• bank business buy <type>\n`;
			businessList += `• bank business collect`;

			return message.reply(businessList);
		}

		if (action === "buy") {
			const businessType = args[2]?.toUpperCase();

			if (!businessType || !this.marketData.businesses[businessType]) {
				return message.reply(fonts.bold("❌ Invalid business type. Use 'bank business list' to see available businesses."));
			}

			const businessData = this.marketData.businesses[businessType];

			if (bank.balance < businessData.cost) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You need $${businessData.cost.toLocaleString()}`));
			}

			bank.balance -= businessData.cost;
			bank.businesses.push({
				type: businessType,
				name: businessData.name,
				level: 1,
				revenue: businessData.income,
				employees: businessData.employees,
				established: Date.now(),
				lastCollected: Date.now()
			});

			bank.transactions.push({
				type: "business_purchase",
				amount: businessData.cost,
				date: Date.now(),
				description: `Bought ${businessData.name}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Successfully purchased ${businessData.name} for $${businessData.cost.toLocaleString()}!\nMonthly income: $${businessData.income.toLocaleString()}`));
		}

		if (action === "collect") {
			let totalIncome = 0;
			const now = Date.now();

			bank.businesses.forEach(business => {
				const timeSinceCollected = now - (business.lastCollected || business.established);
				const hoursElapsed = timeSinceCollected / (1000 * 60 * 60);
				const income = Math.floor((business.revenue / 30 / 24) * hoursElapsed * business.level);

				if (income > 0) {
					totalIncome += income;
					business.lastCollected = now;
				}
			});

			if (totalIncome === 0) {
				return message.reply(fonts.bold("💼 No business income to collect yet."));
			}

			bank.balance += totalIncome;
			bank.transactions.push({
				type: "business_income",
				amount: totalIncome,
				date: Date.now(),
				description: "Business income collected"
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`💼 Collected $${totalIncome.toLocaleString()} from your businesses!`));
		}
	},

	shop: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let shopList = `${fonts.bold("🛒 BANK SHOP")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			const shopItems = {
				"CREDIT_BOOST": { price: 50000, name: "Credit Score Boost (+50)", description: "Instantly increase your credit score by 50 points" },
				"MULTIPLIER": { price: 1000000, name: "Earnings Multiplier 1.5x", description: "Increase all earnings by 50% for 7 days" },
				"INSURANCE_BUNDLE": { price: 100000, name: "Full Insurance Package", description: "Get all 5 insurance types at a discount" },
				"LOTTERY_PACK": { price: 5000, name: "Lottery Ticket Pack (100x)", description: "Get 100 lottery tickets at once" },
				"SKILL_BOOST": { price: 25000, name: "Skill Training", description: "Increase all skills by 10 levels" },
				"PREMIUM_TRIAL": { price: 100000, name: "Premium Trial (30 days)", description: "Try premium features for 30 days" }
			};

			Object.entries(shopItems).forEach(([type, data]) => {
				shopList += `🛍️ ${data.name}\n`;
				shopList += `   Price: $${data.price.toLocaleString()}\n`;
				shopList += `   ${data.description}\n\n`;
			});

			shopList += `${fonts.bold("Usage:")}\n`;
			shopList += `• bank shop buy <item_type>\n`;
			shopList += `Example: bank shop buy CREDIT_BOOST`;

			return message.reply(shopList);
		}

		if (action === "buy") {
			const itemType = args[2]?.toUpperCase();

			const shopItems = {
				"CREDIT_BOOST": { price: 50000, name: "Credit Score Boost (+50)" },
				"MULTIPLIER": { price: 1000000, name: "Earnings Multiplier 1.5x" },
				"INSURANCE_BUNDLE": { price: 100000, name: "Full Insurance Package" },
				"LOTTERY_PACK": { price: 5000, name: "Lottery Ticket Pack (100x)" },
				"SKILL_BOOST": { price: 25000, name: "Skill Training" },
				"PREMIUM_TRIAL": { price: 100000, name: "Premium Trial (30 days)" }
			};

			if (!itemType || !shopItems[itemType]) {
				return message.reply(fonts.bold("❌ Invalid item. Use 'bank shop list' to see available items."));
			}

			const item = shopItems[itemType];

			if (bank.balance < item.price) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You need $${item.price.toLocaleString()}`));
			}

			bank.balance -= item.price;

			// Apply item effects
			switch (itemType) {
				case "CREDIT_BOOST":
					bank.creditScore = Math.min(850, bank.creditScore + 50);
					break;
				case "MULTIPLIER":
					bank.multiplier = 1.5;
					// You could add expiry date logic here
					break;
				case "INSURANCE_BUNDLE":
					bank.insurance = {
						LIFE: { active: true, coverage: 100000, purchased: Date.now() },
						HEALTH: { active: true, coverage: 50000, purchased: Date.now() },
						PROPERTY: { active: true, coverage: 200000, purchased: Date.now() },
						BUSINESS: { active: true, coverage: 500000, purchased: Date.now() },
						THEFT: { active: true, coverage: 75000, purchased: Date.now() }
					};
					break;
				case "LOTTERY_PACK":
					bank.lotteryTickets += 100;
					break;
				case "SKILL_BOOST":
					bank.skills.trading += 10;
					bank.skills.business += 10;
					bank.skills.investing += 10;
					bank.skills.gambling += 10;
					break;
				case "PREMIUM_TRIAL":
					bank.premium = true;
					bank.multiplier = 2.0;
					// You could add expiry date logic here
					break;
			}

			bank.transactions.push({
				type: "shop_purchase",
				amount: item.price,
				date: Date.now(),
				description: `Bought ${item.name}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Successfully purchased ${item.name} for $${item.price.toLocaleString()}!`));
		}
	},

	// Real Estate functions
	realEstate: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let propertyList = `${fonts.bold("🏠 REAL ESTATE MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.properties).forEach(([type, data]) => {
				propertyList += `🏠 ${data.name}\n`;
				propertyList += `   Price: $${data.price.toLocaleString()}\n`;
				propertyList += `   Monthly Rent: $${data.income.toLocaleString()}\n`;
				propertyList += `   Annual ROI: ${Math.round((data.income * 12 / data.price) * 100)}%\n\n`;
			});

			propertyList += `${fonts.bold("Your Properties:")}\n`;
			if (bank.realEstate.length === 0) {
				propertyList += "None owned\n\n";
			} else {
				bank.realEstate.forEach((property, index) => {
					propertyList += `${index + 1}. ${property.name} - $${property.value.toLocaleString()}\n`;
				});
				propertyList += "\n";
			}

			propertyList += `${fonts.bold("Usage:")}\n`;
			propertyList += `• bank property buy <type>\n`;
			propertyList += `• bank rent collect`;

			return message.reply(propertyList);
		}

		if (action === "buy") {
			const propertyType = args[2]?.toUpperCase();

			if (!propertyType || !this.marketData.properties[propertyType]) {
				return message.reply(fonts.bold("❌ Invalid property type. Use 'bank property list' to see available properties."));
			}

			const propertyData = this.marketData.properties[propertyType];

			if (bank.balance < propertyData.price) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You need $${propertyData.price.toLocaleString()}`));
			}

			bank.balance -= propertyData.price;
			bank.realEstate.push({
				type: propertyType,
				name: propertyData.name,
				value: propertyData.price,
				income: propertyData.income,
				purchased: Date.now(),
				lastRentCollected: Date.now()
			});

			bank.transactions.push({
				type: "property_purchase",
				amount: propertyData.price,
				date: Date.now(),
				description: `Bought ${propertyData.name}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Successfully purchased ${propertyData.name} for $${propertyData.price.toLocaleString()}!\nMonthly rent: $${propertyData.income.toLocaleString()}`));
		}
	},

	buyHouse: async function (message, args, bank, bankData, senderID, fonts) {
		return this.realEstate(message, args, bank, bankData, senderID, fonts);
	},

	rentProperty: async function (message, bank, bankData, senderID, fonts) {
		if (bank.realEstate.length === 0) {
			return message.reply(fonts.bold("🏠 You don't own any properties to collect rent from."));
		}

		let totalRent = 0;
		const now = Date.now();

		bank.realEstate.forEach(property => {
			const timeSinceCollected = now - (property.lastRentCollected || property.purchased);
			const hoursElapsed = timeSinceCollected / (1000 * 60 * 60);
			const rent = Math.floor((property.income / 30 / 24) * hoursElapsed);

			if (rent > 0) {
				totalRent += rent;
				property.lastRentCollected = now;
			}
		});

		if (totalRent === 0) {
			return message.reply(fonts.bold("🏠 No rent to collect yet."));
		}

		bank.balance += totalRent;
		bank.transactions.push({
			type: "rental_income",
			amount: totalRent,
			date: Date.now(),
			description: "Rental income collected"
		});

		await bankData.set(senderID, bank);
		return message.reply(fonts.bold(`🏠 Collected $${totalRent.toLocaleString()} in rental income!`));
	},

	// Luxury functions
	luxury: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let luxuryList = `${fonts.bold("💎 LUXURY COLLECTION")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.luxury).forEach(([type, data]) => {
				luxuryList += `💎 ${data.name}\n`;
				luxuryList += `   Price: $${data.price.toLocaleString()}\n\n`;
			});

			luxuryList += `${fonts.bold("Your Collection:")}\n`;
			if (bank.luxury.length === 0) {
				luxuryList += "None owned\n\n";
			} else {
				bank.luxury.forEach((item, index) => {
					luxuryList += `${index + 1}. ${item.name} - $${item.value.toLocaleString()}\n`;
				});
				luxuryList += "\n";
			}

			luxuryList += `${fonts.bold("Usage:")}\n`;
			luxuryList += `• bank luxury buy <type>`;

			return message.reply(luxuryList);
		}

		if (action === "buy") {
			const luxuryType = args[2]?.toUpperCase();

			if (!luxuryType || !this.marketData.luxury[luxuryType]) {
				return message.reply(fonts.bold("❌ Invalid luxury item. Use 'bank luxury list' to see available items."));
			}

			const luxuryData = this.marketData.luxury[luxuryType];

			if (bank.balance < luxuryData.price) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You need $${luxuryData.price.toLocaleString()}`));
			}

			bank.balance -= luxuryData.price;
			bank.luxury.push({
				type: luxuryType,
				name: luxuryData.name,
				value: luxuryData.price,
				purchased: Date.now()
			});

			bank.transactions.push({
				type: "luxury_purchase",
				amount: luxuryData.price,
				date: Date.now(),
				description: `Bought ${luxuryData.name}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Successfully purchased ${luxuryData.name} for $${luxuryData.price.toLocaleString()}!`));
		}
	},

	buyCar: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let carList = `${fonts.bold("🚗 LUXURY VEHICLES")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.vehicles).forEach(([type, data]) => {
				carList += `🚗 ${data.name}\n`;
				carList += `   Price: $${data.price.toLocaleString()}\n`;
				carList += `   Annual Depreciation: ${Math.round((1 - data.depreciation) * 100)}%\n\n`;
			});

			carList += `${fonts.bold("Your Vehicles:")}\n`;
			if (bank.vehicles.length === 0) {
				carList += "None owned\n\n";
			} else {
				bank.vehicles.forEach((vehicle, index) => {
					carList += `${index + 1}. ${vehicle.name} - $${vehicle.currentValue.toLocaleString()}\n`;
				});
				carList += "\n";
			}

			carList += `${fonts.bold("Usage:")}\n`;
			carList += `• bank car buy <type>`;

			return message.reply(carList);
		}

		if (action === "buy") {
			const carType = args[2]?.toUpperCase();

			if (!carType || !this.marketData.vehicles[carType]) {
				return message.reply(fonts.bold("❌ Invalid vehicle type. Use 'bank car list' to see available vehicles."));
			}

			const carData = this.marketData.vehicles[carType];

			if (bank.balance < carData.price) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You need $${carData.price.toLocaleString()}`));
			}

			bank.balance -= carData.price;
			bank.vehicles.push({
				type: carType,
				name: carData.name,
				purchasePrice: carData.price,
				currentValue: carData.price,
				depreciation: carData.depreciation,
				purchased: Date.now()
			});

			bank.transactions.push({
				type: "vehicle_purchase",
				amount: carData.price,
				date: Date.now(),
				description: `Bought ${carData.name}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Successfully purchased ${carData.name} for $${carData.price.toLocaleString()}!`));
		}
	},

	// Gaming functions
	gamble: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
🎰 GAMBLING GAMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Games:
• bank gamble <amount> - Classic risk/reward
• bank slots <amount> - Slot machine
• bank blackjack <amount> - Card game
• bank roulette <amount> <bet> - Roulette wheel

Your Balance: $${bank.balance.toLocaleString()}
Gambling Skill: ${bank.skills.gambling}
			`));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold("❌ Insufficient funds."));
		}

		const random = Math.random();
		const skillBonus = bank.skills.gambling * 0.01; // 1% per skill level
		const winChance = 0.45 + skillBonus;

		let result, winnings = 0;

		if (random < winChance) {
			const multiplier = Math.random() < 0.1 ? 3 : 2; // 10% chance for 3x
			result = "🎉 WIN!";
			winnings = amount * multiplier;
			bank.balance += winnings - amount;
			bank.skills.gambling += 1;
		} else {
			result = "💸 LOSE!";
			bank.balance -= amount;
		}

		bank.transactions.push({
			type: winnings > 0 ? "gambling_win" : "gambling_loss",
			amount: winnings > 0 ? winnings - amount : amount,
			date: Date.now(),
			description: `Gambling: ${result}`
		});

		await bankData.set(senderID, bank);

		const resultText = winnings > 0 
			? `${result} You won $${(winnings - amount).toLocaleString()}! (${winnings/amount}x multiplier)` 
			: `${result} You lost $${amount.toLocaleString()}!`;

		return message.reply(fonts.bold(`🎰 ${resultText}\nGambling skill increased! (${bank.skills.gambling})`));
	},

	slots: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount to play slots."));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold("❌ Insufficient funds."));
		}

		const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "💎", "7️⃣", "⭐"];
		const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
		const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
		const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

		let winnings = 0;
		let multiplier = 0;

		if (slot1 === slot2 && slot2 === slot3) {
			// Jackpot
			if (slot1 === "7️⃣") {
				multiplier = 50; // Mega jackpot
			} else if (slot1 === "💎") {
				multiplier = 25;
			} else if (slot1 === "⭐") {
				multiplier = 15;
			} else {
				multiplier = 10;
			}
		} else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
			multiplier = 2;
		}

		if (multiplier > 0) {
			winnings = amount * multiplier;
			bank.balance += winnings - amount;
		} else {
			bank.balance -= amount;
		}

		bank.transactions.push({
			type: winnings > 0 ? "gambling_win" : "gambling_loss",
			amount: winnings > 0 ? winnings - amount : amount,
			date: Date.now(),
			description: `Slots: ${slot1}${slot2}${slot3}`
		});

		await bankData.set(senderID, bank);

		const slotText = `
🎰 SLOT MACHINE 🎰
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────┐
│ ${slot1} │ ${slot2} │ ${slot3} │
└─────────────┘

${winnings > 0 ? `🎉 JACKPOT! You won $${(winnings - amount).toLocaleString()}! (${multiplier}x)` : `💸 No match! You lost $${amount.toLocaleString()}!`}

Balance: $${bank.balance.toLocaleString()}
`;
		return message.reply(slotText);
	},

	blackjack: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount to play blackjack."));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold("❌ Insufficient funds."));
		}

		// Simple blackjack simulation
		const getCard = () => Math.min(Math.floor(Math.random() * 13) + 1, 10);
		const playerCard1 = getCard();
		const playerCard2 = getCard();
		const dealerCard1 = getCard();
		const dealerCard2 = getCard();

		const playerTotal = playerCard1 + playerCard2;
		const dealerTotal = dealerCard1 + dealerCard2;

		let result, winnings = 0;

		if (playerTotal === 21) {
			result = "🎉 BLACKJACK!";
			winnings = amount * 2.5;
		} else if (playerTotal > 21) {
			result = "💸 BUST!";
		} else if (dealerTotal > 21) {
			result = "🎉 DEALER BUST!";
			winnings = amount * 2;
		} else if (playerTotal > dealerTotal) {
			result = "🎉 WIN!";
			winnings = amount * 2;
		} else if (playerTotal === dealerTotal) {
			result = "🤝 PUSH!";
			winnings = amount;
		} else {
			result = "💸 LOSE!";
		}

		if (winnings > 0) {
			bank.balance += winnings - amount;
		} else {
			bank.balance -= amount;
		}

		bank.transactions.push({
			type: winnings > amount ? "gambling_win" : winnings === amount ? "gambling_push" : "gambling_loss",
			amount: Math.abs(winnings - amount),
			date: Date.now(),
			description: `Blackjack: ${result}`
		});

		await bankData.set(senderID, bank);

		const blackjackText = `
🃏 BLACKJACK 🃏
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Cards: ${playerCard1} + ${playerCard2} = ${playerTotal}
Dealer Cards: ${dealerCard1} + ${dealerCard2} = ${dealerTotal}

${result}
${winnings > amount ? `You won $${(winnings - amount).toLocaleString()}!` : 
	winnings === amount ? `It's a tie!` : 
	`You lost $${amount.toLocaleString()}!`}

Balance: $${bank.balance.toLocaleString()}
`;
		return message.reply(blackjackText);
	},

	roulette: async function (message, args, bank, bankData, senderID, fonts) {
		const amount = parseInt(args[1]);
		const bet = args[2]?.toLowerCase();

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
🎯 ROULETTE WHEEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Betting Options:
• red/black - 2x payout
• odd/even - 2x payout
• high (19-36)/low (1-18) - 2x payout
• number (0-36) - 36x payout

Usage: bank roulette <amount> <bet>
Example: bank roulette 1000 red
			`));
		}

		if (!bet) {
			return message.reply(fonts.bold("❌ Please specify your bet (red/black/odd/even/high/low/number)."));
		}

		if (bank.balance < amount) {
			return message.reply(fonts.bold("❌ Insufficient funds."));
		}

		const winningNumber = Math.floor(Math.random() * 37); // 0-36
		const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber);
		const isBlack = winningNumber !== 0 && !isRed;
		const isOdd = winningNumber > 0 && winningNumber % 2 === 1;
		const isEven = winningNumber > 0 && winningNumber % 2 === 0;
		const isHigh = winningNumber >= 19 && winningNumber <= 36;
		const isLow = winningNumber >= 1 && winningNumber <= 18;

		let won = false;
		let multiplier = 0;

		// Check if bet wins
		if (bet === "red" && isRed) { won = true; multiplier = 2; }
		else if (bet === "black" && isBlack) { won = true; multiplier = 2; }
		else if (bet === "odd" && isOdd) { won = true; multiplier = 2; }
		else if (bet === "even" && isEven) { won = true; multiplier = 2; }
		else if (bet === "high" && isHigh) { won = true; multiplier = 2; }
		else if (bet === "low" && isLow) { won = true; multiplier = 2; }
		else if (bet === winningNumber.toString()) { won = true; multiplier = 36; }

		let winnings = 0;
		if (won) {
			winnings = amount * multiplier;
			bank.balance += winnings - amount;
		} else {
			bank.balance -= amount;
		}

		bank.transactions.push({
			type: won ? "gambling_win" : "gambling_loss",
			amount: won ? winnings - amount : amount,
			date: Date.now(),
			description: `Roulette: ${winningNumber} (${bet})`
		});

		await bankData.set(senderID, bank);

		const color = winningNumber === 0 ? "🟢" : isRed ? "🔴" : "⚫";
		const rouletteText = `
🎯 ROULETTE RESULT 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Winning Number: ${color} ${winningNumber}
Your Bet: ${bet}

${won ? `🎉 WIN! You won $${(winnings - amount).toLocaleString()}! (${multiplier}x)` : `💸 You lost $${amount.toLocaleString()}!`}

Balance: $${bank.balance.toLocaleString()}
`;
		return message.reply(rouletteText);
	},

	lottery: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "buy") {
			const ticketPrice = 100;
			const tickets = parseInt(args[2]) || 1;
			const totalCost = ticketPrice * tickets;

			if (bank.balance < totalCost) {
				return message.reply(fonts.bold(`❌ Insufficient funds. Need $${totalCost.toLocaleString()}`));
			}

			bank.balance -= totalCost;
			bank.lotteryTickets += tickets;

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`🎫 Bought ${tickets} lottery ticket(s) for $${totalCost.toLocaleString()}!\nTotal tickets: ${bank.lotteryTickets}`));
		}

		if (action === "check") {
			if (!bank.lotteryTickets || bank.lotteryTickets === 0) {
				return message.reply(fonts.bold("🎫 You don't have any lottery tickets."));
			}

			// Simple lottery check - small chance to win
			const winChance = 0.01; // 1% chance per ticket
			const totalChance = Math.min(bank.lotteryTickets * winChance, 0.5); // Max 50% chance

			if (Math.random() < totalChance) {
				const prize = Math.floor(Math.random() * 1000000) + 50000; // $50k to $1M
				bank.balance += prize;
				bank.lotteryTickets = 0;

				bank.transactions.push({
					type: "lottery_win",
					amount: prize,
					date: Date.now(),
					description: "Lottery jackpot!"
				});

				await bankData.set(senderID, bank);
				return message.reply(fonts.bold(`🎊 LOTTERY WINNER! You won $${prize.toLocaleString()}!`));
			} else {
				return message.reply(fonts.bold(`🎫 No winning tickets this time. Keep trying!\nTickets remaining: ${bank.lotteryTickets}`));
			}
		}
	},

	// Premium and utility functions
	premium: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "buy") {
			const premiumCost = 1000000; // $1M for premium
			if (bank.balance < premiumCost) {
				return message.reply(fonts.bold("❌ Premium membership costs $1,000,000."));
			}

			bank.balance -= premiumCost;
			bank.premium = true;
			bank.multiplier = 2.0;

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`
💎 WELCOME TO PREMIUM!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Premium Benefits:
✅ 2x earnings on all activities
✅ Exclusive investment opportunities
✅ Higher daily rewards
✅ Priority customer support
✅ Advanced portfolio tools

You now earn 2x on all activities!
			`));
		}

		const premiumText = `
💎 PREMIUM MEMBERSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${bank.premium ? "✅ Active" : "❌ Inactive"}
Multiplier: ${bank.multiplier}x
Cost: $1,000,000

Benefits:
• 2x earnings on all activities
• Exclusive investment opportunities
• Higher daily rewards
• Priority customer support
• Advanced portfolio tools

${!bank.premium ? "Use 'bank premium buy' to upgrade!" : ""}
`;
		return message.reply(premiumText);
	},

	vault: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();
		const amount = parseInt(args[2]);

		if (!action) {
			return message.reply(fonts.bold(`
🔐 SECURE VAULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vault Balance: $${bank.vault.toLocaleString()}
Bank Balance: $${bank.balance.toLocaleString()}

The vault provides:
• Maximum security for your money
• Protection from theft/robbery
• 1% monthly interest
• No withdrawal limits

Usage:
• bank vault deposit <amount>
• bank vault withdraw <amount>
			`));
		}

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount."));
		}

		if (action === "deposit") {
			if (bank.balance < amount) {
				return message.reply(fonts.bold("❌ Insufficient funds in bank account."));
			}

			bank.balance -= amount;
			bank.vault += amount;

			bank.transactions.push({
				type: "vault_deposit",
				amount: amount,
				date: Date.now(),
				description: "Vault deposit"
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`🔐 Deposited $${amount.toLocaleString()} to your secure vault.\nVault balance: $${bank.vault.toLocaleString()}`));
		}

		if (action === "withdraw") {
			if (bank.vault < amount) {
				return message.reply(fonts.bold("❌ Insufficient funds in vault."));
			}

			bank.vault -= amount;
			bank.balance += amount;

			bank.transactions.push({
				type: "vault_withdrawal",
				amount: amount,
				date: Date.now(),
				description: "Vault withdrawal"
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`🔓 Withdrew $${amount.toLocaleString()} from your secure vault.\nBank balance: $${bank.balance.toLocaleString()}`));
		}
	},

	insurance: async function (message, args, bank, bankData, senderID, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let insuranceList = `${fonts.bold("🛡️ INSURANCE POLICIES")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			const insuranceTypes = {
				"LIFE": { cost: 10000, coverage: 100000, name: "Life Insurance" },
				"HEALTH": { cost: 5000, coverage: 50000, name: "Health Insurance" },
				"PROPERTY": { cost: 15000, coverage: 200000, name: "Property Insurance" },
				"BUSINESS": { cost: 25000, coverage: 500000, name: "Business Insurance" },
				"THEFT": { cost: 8000, coverage: 75000, name: "Theft Protection" }
			};

			Object.entries(insuranceTypes).forEach(([type, data]) => {
				insuranceList += `🛡️ ${data.name}\n`;
				insuranceList += `   Cost: $${data.cost.toLocaleString()}\n`;
				insuranceList += `   Coverage: $${data.coverage.toLocaleString()}\n`;
				insuranceList += `   Owned: ${bank.insurance[type] ? "✅" : "❌"}\n\n`;
			});

			insuranceList += `${fonts.bold("Usage:")}\n`;
			insuranceList += `• bank insurance buy <type>\n`;
			insuranceList += `• bank insurance claim <type>`;

			return message.reply(insuranceList);
		}

		if (action === "buy") {
			const type = args[2]?.toUpperCase();
			const insuranceTypes = {
				"LIFE": { cost: 10000, coverage: 100000, name: "Life Insurance" },
				"HEALTH": { cost: 5000, coverage: 50000, name: "Health Insurance" },
				"PROPERTY": { cost: 15000, coverage: 200000, name: "Property Insurance" },
				"BUSINESS": { cost: 25000, coverage: 500000, name: "Business Insurance" },
				"THEFT": { cost: 8000, coverage: 75000, name: "Theft Protection" }
			};

			if (!type || !insuranceTypes[type]) {
				return message.reply(fonts.bold("❌ Invalid insurance type. Use 'bank insurance list' to see options."));
			}

			if (bank.insurance[type]) {
				return message.reply(fonts.bold("❌ You already have this insurance policy."));
			}

			const insuranceData = insuranceTypes[type];

			if (bank.balance < insuranceData.cost) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You need $${insuranceData.cost.toLocaleString()}`));
			}

			bank.balance -= insuranceData.cost;
			bank.insurance[type] = {
				active: true,
				coverage: insuranceData.coverage,
				purchased: Date.now()
			};

			bank.transactions.push({
				type: "insurance_purchase",
				amount: insuranceData.cost,
				date: Date.now(),
				description: `Bought ${insuranceData.name}`
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`✅ Purchased ${insuranceData.name} with $${insuranceData.coverage.toLocaleString()} coverage for $${insuranceData.cost.toLocaleString()}.`));
		}
	},

	creditScore: function (message, bank, fonts) {
		const score = bank.creditScore;
		let rating, color;

		if (score >= 800) { rating = "Excellent"; color = "🟢"; }
		else if (score >= 740) { rating = "Very Good"; color = "🟢"; }
		else if (score >= 670) { rating = "Good"; color = "🟡"; }
		else if (score >= 580) { rating = "Fair"; color = "🟠"; }
		else { rating = "Poor"; color = "🔴"; }

		const creditText = `
${fonts.bold("📊 CREDIT SCORE REPORT")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${color} ${fonts.bold("Score:")} ${score}/850
📊 ${fonts.bold("Rating:")} ${rating}
💳 ${fonts.bold("Max Loan:")} $${(score * 1000).toLocaleString()}
🏦 ${fonts.bold("Interest Rate:")} ${score >= 750 ? "5%" : score >= 650 ? "7%" : "10%"}

${fonts.bold("💡 Tips to improve:")}
• Pay loans on time (+10 points)
• Maintain low debt ratios
• Avoid frequent large transactions
• Build long banking history
• Keep accounts active

${fonts.bold("Score History:")}
• Starting Score: 750
• Current Score: ${score}
• Change: ${score >= 750 ? "+" : ""}${score - 750}
`;
		return message.reply(creditText);
	},

	achievements: function (message, bank, fonts) {
		const achievements = bank.achievements || [];
		const possibleAchievements = [
			"First Deposit", "First Loan", "First Investment", "First Business",
			"Millionaire", "Multi-Millionaire", "Billionaire", "Property Owner",
			"Stock Trader", "Crypto Investor", "Business Tycoon", "Gambling King",
			"Insurance Buyer", "Premium Member", "Daily Streaker", "Work Horse",
			"Loan Repayer", "Savings Master", "Portfolio Builder", "Risk Taker"
		];

		let achievementText = `${fonts.bold("🏆 ACHIEVEMENTS")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
		achievementText += `${fonts.bold("Progress:")} ${achievements.length}/${possibleAchievements.length}\n\n`;

		if (achievements.length === 0) {
			achievementText += "🎯 No achievements unlocked yet.\nStart banking to earn achievements!\n\n";
		} else {
			achievementText += `${fonts.bold("🎖️ UNLOCKED:")}\n`;
			achievements.slice(0, 10).forEach((achievement, index) => {
				achievementText += `${index + 1}. 🏆 ${achievement}\n`;
			});

			if (achievements.length > 10) {
				achievementText += `... and ${achievements.length - 10} more!\n`;
			}
			achievementText += "\n";
		}

		achievementText += `${fonts.bold("🎯 NEXT GOALS:")}\n`;
		const remaining = possibleAchievements.filter(a => !achievements.includes(a));
		remaining.slice(0, 5).forEach(achievement => {
			achievementText += `• ${achievement}\n`;
		});

		return message.reply(achievementText);
	},

	leaderboard: async function (message, bankData, fonts, api) {
		try {
			const allBanks = await bankData.getAll();
			const richestUsers = Object.entries(allBanks)
				.filter(([uid, bank]) => bank && bank.balance > 0)
				.map(([uid, bank]) => ({
					uid,
					wealth: (bank.balance || 0) + (bank.savings || 0) + (bank.vault || 0),
					level: bank.bankLevel || 1,
					premium: bank.premium || false,
					achievements: bank.achievements?.length || 0
				}))
				.sort((a, b) => b.wealth - a.wealth)
				.slice(0, 10);

			// Get user names
			const userInfoPromises = richestUsers.map(async (user) => {
				try {
					const userInfo = await api.getUserInfo(user.uid);
					user.name = userInfo[user.uid]?.name || `User ${user.uid}`;
				} catch (error) {
					user.name = `User ${user.uid}`;
				}
			});

			await Promise.all(userInfoPromises);

			let leaderboardText = `${fonts.bold("🏆 LEADERBOARD")}\n`;
			leaderboardText += `━━━━━━━━━━━\n`;
			leaderboardText += `💎 ${fonts.bold("TOP USERS")} 💎\n\n`;

			if (richestUsers.length === 0) {
				leaderboardText += `${fonts.bold("📊 No wealthy users found yet!")}\n`;
				leaderboardText += `${fonts.bold("💡 Start banking to appear on the leaderboard!")}`;
			} else {
				const totalWealth = richestUsers.reduce((sum, user) => sum + user.wealth, 0);

				leaderboardText += `${fonts.bold("📊 STATS")}\n`;
				leaderboardText += `👥 Total Users: ${richestUsers.length}`;

				richestUsers.forEach((user, index) => {
					const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${fonts.bold(`#${index + 1}`)}`;
					const crown = index === 0 ? " 👑" : index === 1 ? " ⭐" : index === 2 ? " ✨" : "";
					const premiumIcon = user.premium ? " 💎" : "";
					const levelIcon = user.level >= 10 ? " 🔥" : user.level >= 5 ? " ⚡" : "";

					leaderboardText += `${medal} ${fonts.bold(user.name)}${crown}${premiumIcon}${levelIcon}\n`;
					leaderboardText += `   💰 Wealth: $${user.wealth.toLocaleString()}\n`;
					leaderboardText += `   📈 Level: ${user.level}`;

					if (user.achievements > 0) {
						leaderboardText += ` | 🏆 ${user.achievements} achievements`;
					}

					if (user.wealth >= 1000000000) {
						leaderboardText += ` | 💎 Billionaire`;
					} else if (user.wealth >= 1000000) {
						leaderboardText += ` | 🏆 Millionaire`;
					} else if (user.wealth >= 100000) {
						leaderboardText += ` | ⭐ Wealthy`;
					}

					leaderboardText += `\n\n`;
				});

				leaderboardText += `${fonts.bold("🔥 LEADERBOARD TIERS")}\n`;
				leaderboardText += `💎 Billionaire: $1B+\n`;
				leaderboardText += `🏆 Millionaire: $1M+\n`;
				leaderboardText += `⭐ Wealthy: $100K+\n`;
				leaderboardText += `📈 Rising: $10K+\n\n`;
			}

			return message.reply(leaderboardText);
		} catch (error) {
			console.error("Leaderboard error:", error);
			return message.reply(fonts.bold("❌ Error loading leaderboard. Please try again."));
		}
	},

	rob: async function (message, args, bank, bankData, senderID, event, fonts) {
		const targetUID = Object.keys(event.mentions)[0];

		if (!targetUID) {
			return message.reply(fonts.bold("❌ Please mention a user to rob."));
		}

		if (targetUID === senderID) {
			return message.reply(fonts.bold("❌ You can't rob yourself!"));
		}

		// Cooldown check
		const now = Date.now();
		const robCooldown = 6 * 60 * 60 * 1000; // 6 hours
		const lastRob = bank.lastRob ? new Date(bank.lastRob).getTime() : 0;

		if (now - lastRob < robCooldown) {
			const timeLeft = robCooldown - (now - lastRob);
			const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
			return message.reply(fonts.bold(`⏰ You're too tired to rob someone!\nWait ${hoursLeft} more hours.`));
		}

		const targetBank = await bankData.get(targetUID);
		if (!targetBank) {
			return message.reply(fonts.bold("❌ This user doesn't have a bank account."));
		}

		// Can't rob vault money or if they have theft insurance
		const robbableAmount = targetBank.balance;
		const hasTheftInsurance = targetBank.insurance && targetBank.insurance.THEFT;

		if (robbableAmount <= 100) {
			return message.reply(fonts.bold("❌ This user doesn't have enough money to rob."));
		}

		if (hasTheftInsurance) {
			return message.reply(fonts.bold("🛡️ This user has theft protection insurance!"));
		}

		// Success chance based on levels and skills
		const robberLevel = bank.bankLevel || 1;
		const targetLevel = targetBank.bankLevel || 1;
		const successChance = Math.max(0.3, 0.6 - (targetLevel - robberLevel) * 0.1);

		const success = Math.random() < successChance;

		if (success) {
			const stolenPercent = Math.random() * 0.3 + 0.1; // 10-40%
			const stolenAmount = Math.floor(robbableAmount * stolenPercent);

			bank.balance += stolenAmount;
			targetBank.balance -= stolenAmount;
			bank.lastRob = new Date();

			bank.transactions.push({
				type: "robbery_success",
				amount: stolenAmount,
				date: Date.now(),
				description: `Robbed user ${targetUID}`
			});

			targetBank.transactions.push({
				type: "robbed",
				amount: stolenAmount,
				date: Date.now(),
				description: `Robbed by user ${senderID}`
			});

			await bankData.set(senderID, bank);
			await bankData.set(targetUID, targetBank);

			return message.reply(fonts.bold(`💰 Robbery successful! You stole $${stolenAmount.toLocaleString()} from the user!`));
		} else {
			// Failed robbery - lose money as fine
			const fine = Math.min(bank.balance * 0.1, 10000);
			bank.balance -= fine;
			bank.lastRob = new Date();

			bank.transactions.push({
				type: "robbery_failed",
				amount: fine,
				date: Date.now(),
				description: "Failed robbery fine"
			});

			await bankData.set(senderID, bank);
			return message.reply(fonts.bold(`🚔 Robbery failed! You were caught and fined $${fine.toLocaleString()}!`));
		}
	},

	// Additional utility functions for calculations
	calculatePortfolioValue: function (bank) {
		let total = 0;

		// Stocks
		Object.entries(bank.stocks || {}).forEach(([symbol, shares]) => {
			const price = this.marketData.stocks[symbol]?.price || 100;
			total += shares * price;
		});

		// Crypto
		Object.entries(bank.crypto || {}).forEach(([coin, amount]) => {
			const price = this.marketData.crypto[coin]?.price || 1;
			total += amount * price;
		});

		// Bonds
		Object.entries(bank.bonds || {}).forEach(([type, amount]) => {
			total += amount;
		});

		return total;
	},

	calculateRealEstateValue: function (bank) {
		return (bank.realEstate || []).reduce((total, property) => total + property.value, 0);
	},

	calculateBusinessValue: function (bank) {
		return (bank.businesses || []).reduce((total, business) => {
			const marketValue = this.marketData.businesses[business.type]?.cost || 100000;
			return total + (marketValue * business.level);
		}, 0);
	},

	calculateVehicleValue: function (bank) {
		return (bank.vehicles || []).reduce((total, vehicle) => total + vehicle.currentValue, 0);
	},

	calculateLuxuryValue: function (bank) {
		return (bank.luxury || []).reduce((total, item) => total + item.value, 0);
	}
};
