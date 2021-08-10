const { Telegraf } = require('telegraf')
const rateLimit = require('telegraf-ratelimit')
const axios = require('axios').default
const config = require('./config/config')
const logger = require('./utils/logger')

const limit = {
	window: 3000,
	limit: 1,
	onLimitExceeded: (ctx, next) => ctx.reply('Limit exceeded'),
}
const bot = new Telegraf(config.bot_token)
bot.use(rateLimit(limit))

bot.start((ctx) =>
	ctx.reply(
		'Hello there! Welcome to Phraser the paraphrasing bot :). Paste your document and i will reply with the paraphrased version'
	)
)
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.on('text', (ctx) => {
	const options = {
		method: 'POST',
		url: 'https://rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com/rewrite',
		headers: {
			'content-type': 'application/json',
			'x-rapidapi-key': config.rapid_api_key,
			'x-rapidapi-host':
				'rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com',
		},
		data: {
			language: 'en',
			strength: 3,
			text: ctx.message.text,
		},
	}

	axios
		.request(options)
		.then(async (res) => {
			await ctx.telegram.sendMessage(
				ctx.message.chat.id,
				`${res.data.rewrite}\n Remaining characters: ${
					Object.entries(res.headers)[13][1]
				}`
			)
		})
		.catch((error) => {
			logger.log(error)
		})
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
