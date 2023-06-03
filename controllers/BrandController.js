import {Sequelize, Op} from 'sequelize'
import {validationResult} from 'express-validator'

import {Brand} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'

class BrandController extends BaseController {
	
	async getAllBrands(req, res) {
		try {
			const {page, perPage, search} = req.query

			let whereCondition = {}

			if (search) {
				whereCondition['name'] = {
		          	[Op.iLike]: `%${search}%`
		        }
			}

			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			let brands = await Brand.findAll({
				where: whereCondition,
  				limit,
  				offset
			})

			Response.send(res, 200, "Data Brand berhasil ditampilkan", brands)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async getBrandById(req, res) {
		try {
			let brand = await Brand.findByPk(req.params.id)

			Response.send(res, 200, "Data Brand berhasil ditampilkan", brand)
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

	async createBrand(req, res) {
		try {
			const brand = await Brand.create({
				name: req.body.name,
			}, {
				fields: ['name']
			})

			Response.send(res, 200, "Data Brand berhasil disimpan", brand)
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

	async updateBrand(req, res) {
		try {
			await Brand.update({
				name: req.body.name
			}, {
				where: {
					id: req.params.id
				}
			})

			const updatedBrand = await Brand.findByPk(req.params.id)

			Response.send(res, 200, "Data Brand berhasil diubah", updatedBrand)
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

	async changeStatusBrand(req, res) {
		try {
			const brand = await Brand.findByPk(req.params.id)
			const newStatus = !brand.isActive

			await Brand.update({
				isActive: newStatus,
			}, {
				where: {
					id: req.params.id
				}
			})

			const updatedBrand = await Brand.findByPk(req.params.id)

			Response.send(res, 200, "Status Brand berhasil diubah", updatedBrand)
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

export default BrandController