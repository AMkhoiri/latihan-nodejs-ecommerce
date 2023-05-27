import {Sequelize, Op} from 'sequelize'

import {Role, User, Category, Brand, Product} from '../models/index.js'
import BaseController from './BaseController.js'

class DataReferenceController extends BaseController {

	async role(req, res) {
		try {
			const {search, page, perPage} = req.query

			let whereCondition = {}
			if (search) {
				whereCondition['username'] = {
		          	[Op.like]: `%${search}%`
		        }
			}

			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let roles = await Role.findAll({
				attributes: ['id', 'name'],
				where: whereCondition,
  				limit,
  				offset
			})

			super.sendResponse(res, 200, "Data Role berhasil ditampilkan", roles)
		} 
		catch(error) {
			super.handleServerError(req, res, error)
		}
	}

	async user(req, res) {
		try {
			const {roleId, search, page, perPage} = req.query

			let whereCondition = {}
			if (roleId) {
				whereCondition['roleId'] = {
		          	[Op.eq]: roleId
		        }
			}

			if (search) {
				whereCondition[Op.or] = [
				    {
					    name: { [Op.like]: `%${search}%` }
				    },
				    {
				      	username: { [Op.like]: `%${search}%` }
				    }
				]
			}

			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let users = await User.findAll({
				attributes: ['id', 'name', 'username'],
				where: whereCondition,
  				limit,
  				offset
			})

			super.sendResponse(res, 200, "Data User berhasil ditampilkan", users)
		}
		catch(error) {
			super.handleServerError(req, res, error)
		}
	}
}

export default DataReferenceController

