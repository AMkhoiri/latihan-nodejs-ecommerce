import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'

import {Role, User} from '../models/index.js'
import BaseController from './BaseController.js'

class UserController extends BaseController {
	
	async getAllUsers(req, res) {
		try {
			let users = await User.findAll({
			  include: [Rolse]
			})

			super.sendResponse(res, 200, "Data User berhasil ditampilkan", users)
		} 
		catch(error) {
			super.handleServerError(req, res, error)
		}
	}

	async getUserById(req, res) {
		try {
			const id = req.params.id;

			let user = await User.findByPk(id, {
			  include: [Role]
			})
			super.sendResponse(res, 200, "Data User berhasil ditampilkan", user)
		}
		catch(error) {
			super.handleServerError(req, res, error)
		}
	}

	async createUser(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.sendErrorValidationResponse(res, errors.array())
		}
		else{
			try {
				await User.create({
					name: req.body.name,
					username: req.body.username,
					password: await bcrypt.hash(req.body.password, 10),
					roleId: req.body.roleId,
				}, {
					fields: ['name', 'username', 'password', 'roleId']
				})

				super.sendResponse(res, 200, "Data User berhasil disimpan", null)
			}
			catch (error) {
				if (error instanceof Sequelize.ValidationError) {
				    super.sendErrorValidationResponse(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}

	async updateUser(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.sendErrorValidationResponse(res, errors.array())
		}
		else{
			try {
				const id = req.params.id

				await User.update({
					name: req.body.name,
					username: req.body.username,
					roleId: req.body.roleId,
				}, {
					where: {
						id: id
					}
				})

				super.sendResponse(res, 200, "Data User berhasil diubah", null)
			}
			catch (error) {
				if (error instanceof Sequelize.ValidationError) {
				    super.sendErrorValidationResponse(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}

	async changeStatusUser(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.sendErrorValidationResponse(res, errors.array())
		}
		else{
			try {
				const id = req.params.id
				const user = await User.findByPk(id)
				const newStatus = !user.isActive

				await User.update({
					isActive: newStatus,
				}, {
					where: {
						id: id
					}
				})

				super.sendResponse(res, 200, "Status User berhasil diubah", null)
			}
			catch (error) {
				if (error instanceof Sequelize.ValidationError) {
				    super.sendErrorValidationResponse(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}
}

export default UserController