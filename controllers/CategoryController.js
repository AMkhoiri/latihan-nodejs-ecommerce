import {Sequelize, Op} from 'sequelize'

import {Category} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'

class CategoryController extends BaseController {
	
	async getAllCategories(req, res) {
		try {
			const {page, perPage, search} = req.query

			let whereCondition = {}

			if (search) {
				whereCondition["name"] = {
					[Op.iLike]: `%${search}%`
				}
			}

			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let categories = await Category.findAll({
				where: whereCondition,
				limit,
				offset
			})

			Response.send(res, 200, "Data Category berhasil ditampilkan", categories)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async getCategoryById(req, res) {
		try {
			let category = await Category.findByPk(req.params.id)

			Response.send(res, 200, "Data Category berhasil ditampilkan", category)
		}
		catch(error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async createCategory(req, res) {
		try {
			const category = await Category.create({
				name: req.body.name,
			}, {
				fields: ['name']
			})

			Response.send(res, 200, "Data Category berhasil disimpan", category)
		}
		catch(error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async updateCategory(req, res) {
		try {
			await Category.update({
				name: req.body.name
			}, {
				where: {
					id: req.params.id
				}
			})

			const updatedCategory = await Category.findByPk(req.params.id)

			Response.send(res, 200, "Data Category berhasil diubah", updatedCategory)
		}
		catch(error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async changeStatusCategory(req, res) {
		try {
			const category = await Category.findByPk(req.params.id)
			const newStatus = !category.isActive

			await Category.update({
				isActive: newStatus,
			}, {
				where: {
					id: req.params.id
				}
			})

			const updatedCategory = await Category.findByPk(req.params.id)

			Response.send(res, 200, "Status Category berhasil diubah", updatedCategory)
		}
		catch(error) {
			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}
}

export default CategoryController