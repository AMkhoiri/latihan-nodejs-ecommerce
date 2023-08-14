import {Sequelize, Op} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

import {Role, User, Category, Brand, Product, OrderShipping} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'
import Utility from '../helpers/Utility.js'

class DataReferenceController extends BaseController {

	async role(req, res) {
		try {
			const {page, perPage, search} = req.query
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let whereQuery = {}
			whereQuery['isActive'] = {
	          	[Op.eq]: true
	        }

			if (search) {
				whereQuery['name'] = {
		          	[Op.iLike]: `%${search}%`
		        }
			}

			let roles = await Role.findAll({
				attributes: ['id', 'name'],
				where: whereQuery,
  				limit,
  				offset
			})

			Response.send(res, 200, "Data Role berhasil ditampilkan", roles)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async user(req, res) {
		try {
			const {page, perPage, search} = req.query
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let whereQuery = {}
			whereQuery['isActive'] = {
	          	[Op.eq]: true
	        }

			if (search) {
				whereQuery[Op.or] = [
				    {
					    name: { [Op.iLike]: `%${search}%` }
				    },
				    {
				      	username: { [Op.iLike]: `%${search}%` }
				    }
				]
			}

			let users = await User.findAll({
				attributes: ['id', 'name', 'username'],
				where: whereQuery,
  				limit,
  				offset
			})

			Response.send(res, 200, "Data User berhasil ditampilkan", users)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async category(req, res) {
		try {
			const {page, perPage, search} = req.query
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let whereQuery = {}
			whereQuery['isActive'] = {
	          	[Op.eq]: true
	        }

			if (search) {
				whereQuery['name'] = {
		          	[Op.iLike]: `%${search}%`
		        }
			}

			let categories = await Category.findAll({
				attributes: ['id', 'name'],
				where: whereQuery,
  				limit,
  				offset
			})

			Response.send(res, 200, "Data Category berhasil ditampilkan", categories)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async brand(req, res) {
		try {
			const {page, perPage, search} = req.query
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let whereQuery = {}
			whereQuery['isActive'] = {
	          	[Op.eq]: true
	        }

			if (search) {
				whereQuery['name'] = {
		          	[Op.iLike]: `%${search}%`
		        }
			}

			let brands = await Brand.findAll({
				attributes: ['id', 'name'],
				where: whereQuery,
  				limit,
  				offset
			})

			Response.send(res, 200, "Data Brand berhasil ditampilkan", brands)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async product(req, res) {
		try {
			const { page, perPage, search } = req.query
			const limit = perPage ? parseInt(perPage) : 10
			const offset = page ? (parseInt(page) - 1) * limit : 0
	
			const whereQuery = {
				isActive: true
			}
	
			const includeQuery = [
				{
					model: Category,
					where: {
						isActive: true
					},
					attributes: []
				},
				{
					model: Brand,
					where: {
						isActive: true
					},
					attributes: []
				}
			]
	
			if (search) {
				whereQuery.name = {
					[Op.iLike]: `%${search}%`
				};
			}
	
			const products = await Product.findAll({
				attributes: ['id', 'name'],
				where: whereQuery,
				include: includeQuery,
				limit,
				offset
			})
	
			Response.send(res, 200, "Data Product berhasil ditampilkan", products)
		} catch (error) {
			Response.serverError(req, res, error)
		}
	}

	async province(req, res) {
		try {
			const {page, perPage} = req.query
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			const url = process.env.RAJAONGKIR_API_URL + "province"
			const headers = {
				key: process.env.RAJAONGKIR_API_KEY
			}

			const data = await Utility.fetchData(url, "GET", headers, null)

			const limitedResults = data.rajaongkir.results.slice(offset, offset + limit)

			let provinces = []
			for (let province of limitedResults) {
				provinces.push({
					id: parseInt(province.province_id),
					name: province.province
				})
			}

			Response.send(res, 200, "Data Provinsi berhasil ditampilkan", provinces)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async city(req, res) {
		try {
			const {page, perPage} = req.query
			const provinceId = req.query.provinceId ? req.query.provinceId : ""
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			const url = process.env.RAJAONGKIR_API_URL + "city" + "?province=" + provinceId
			const headers = {
				key: process.env.RAJAONGKIR_API_KEY
			}

			const data = await Utility.fetchData(url, "GET", headers, null)

			const limitedResults = data.rajaongkir.results.slice(offset, offset + limit)

			let citys = []
			for (let city of limitedResults) {
				citys.push({
					id: parseInt(city.city_id),
					name: city.city_name,
					provinceId: parseInt(city.province_id),
					provinceName: city.province,
					postalCode: city.postal_code,
				})
			}

			Response.send(res, 200, "Data Kota berhasil ditampilkan", citys)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	courier(req, res) {
		try {
			const couriers = OrderShipping.COURIER

			Response.send(res, 200, "Data Kurir berhasil ditampilkan", couriers)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}
}

export default DataReferenceController

