import {Sequelize, Op} from 'sequelize'

import {Role, User, Category, Brand, Product} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'

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

			const products = await Product.findAll({
				attributes: ['id', 'name'],
				where: whereQuery,
				limit,
				offset
			})

			Response.send(res, 200, "Data Producr berhasil ditampilkan", products)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}
}

export default DataReferenceController

