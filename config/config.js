const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')

dotenv.config({ path: path.join(__dirname, '../.env') })

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test'),
		PORT: Joi.number().default(3000),
		BOT_TOKEN: Joi.string().description('Telegram bot token'),
		RAPID_API_KEY: Joi.string(),
	})
	.unknown()

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: 'key' } })
	.validate(process.env)

if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	bot_token: envVars.BOT_TOKEN,
	rapid_api_key: envVars.RAPID_API_KEY,
}
