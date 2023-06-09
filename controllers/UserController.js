import {Sequelize, Op} from 'sequelize'
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'

import {Role, User} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'

class UserController extends BaseController {
	
	async getAllUsers(req, res) {
		try {
			const {roleId, search, page, perPage} = req.query

			let whereCondition = {}

			if (search) {
				whereCondition[Op.or] = [
				    {
					    name: { [Op.iLike]: `%${search}%` }
				    },
				    {
				      	username: { [Op.iLike]: `%${search}%` }
				    }
				]
			}

			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let users = await User.findAll({
			  	include: [Role],
			  	where: whereCondition,
  				limit,
  				offset
			})

			Response.send(res, 200, "Data User berhasil ditampilkan", users)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async getUserById(req, res) {
		try {
			let user = await User.findByPk(req.params.id, {
			  include: [Role]
			})
			
			Response.send(res, 200, "Data User berhasil ditampilkan", user)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}	
	}

	async createUser(req, res) {
		try {
			await User.create({
				name: req.body.name,
				username: req.body.username,
				password: await bcrypt.hash(req.body.password, 10),
				roleId: req.body.roleId,
			}, {
				fields: ['name', 'username', 'password', 'roleId']
			})

			Response.send(res, 200, "Data User berhasil disimpan", null)
		}
		catch (error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async updateUser(req, res) {
		try {
			await User.update({
				name: req.body.name,
				username: req.body.username,
				roleId: req.body.roleId,
			}, {
				where: {
					id: req.params.id
				}
			})

			Response.send(res, 200, "Data User berhasil diubah", null)
		}
		catch (error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async changeStatusUser(req, res) {
		try {
			const user = await User.findByPk(req.params.id)
			const newStatus = !user.isActive

			await User.update({
				isActive: newStatus,
			}, {
				where: {
					id: req.params.id
				}
			})

			Response.send(res, 200, "Status User berhasil diubah", null)
		}
		catch (error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}
}

export default UserController