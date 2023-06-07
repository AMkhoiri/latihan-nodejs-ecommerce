import dotenv from 'dotenv'
dotenv.config()
import fetch from 'node-fetch'


class Utility {
	static generateFileLink = (type, fileId) => {
		return process.env.BASE_URL + `/utility/show-file/${type}/${fileId}`
	}

	static fetchData = (url, method, headers, body) => {
		return new Promise((resolve, reject) => {
			let requestBody = body ? JSON.stringify(body) : null

			fetch(url, {
				method: method,
				headers: headers,
				body: requestBody
			})
			.then((response) => response.json())
			.then((response) => {
				resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
	}
}

export default Utility