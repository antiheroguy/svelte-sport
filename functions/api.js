const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const v2Paths = ['/api/livescore.php']

exports.handler = async ({ path, queryStringParameters: params }) => {
	let baseURL = `https://www.thesportsdb.com/api/v1/json/${process.env.API_KEY}`
	if (v2Paths.includes(path)) {
		baseURL = baseURL.replace('v1', 'v2')
	}

	try {
		const response = await axios.get(`${path.replace('/api', '')}`, { params, baseURL })
		return {
			statusCode: 200,
			body: JSON.stringify(response.data)
		}
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: e.message
			})
		}
	}
}
