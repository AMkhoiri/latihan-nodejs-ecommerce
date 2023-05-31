import dotenv from 'dotenv'
dotenv.config()


class Utility {
	static generateFileLink = (type, fileId) => {
		return process.env.BASE_URL + `/utility/show-file/${type}/${fileId}`
	}
}

export default Utility