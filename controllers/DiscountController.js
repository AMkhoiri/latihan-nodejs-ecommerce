import {Sequelize, Op} from 'sequelize'
import {validationResult} from 'express-validator'

import {sequelize} from '../models/index.js' /*untuk db transaction*/
import {Product, Discount, DiscountItem} from '../models/index.js'
import BaseController from './BaseController.js'

class DiscountController extends BaseController {

	async getAllDiscounts(req, res) {
		try {
			const { date, search } = req.query

			let whereQuery = {}

			if (date) {
				whereQuery[Op.and] = [
	              	{ startDate: { [Op.lte]: date } },
	              	{ endDate: { [Op.gte]: date } }
	            ]
			}

			if (search) {
				whereQuery.name = { [Op.iLike]: `%${search}%` }
			}

			const discounts = await Discount.findAll({
				// include: {
				// 	model: DiscountItem,
				// 	include: {
				// 		model: Product
				// 	}
				// },
				where: whereQuery
			})

			super.sendResponse(res, 200, "Data Discount berhasil ditampilkan", discounts)
		}
		catch(error) {
			super.handleServerError(req, res, error)
		}
	}

	async getDiscountById(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			try {
				const discount = await Discount.findByPk(req.params.id, {
					include: {
						model: DiscountItem,
						include: {
							model: Product,
							attributes: ['name', 'description', 'price']
						}
					}
				})

				super.sendResponse(res, 200, "Data Discount berhasil ditampilkan", discount)
			}
			catch(error) {
				super.handleServerError(req, res, error)
			}
		}
	}

	async createDiscount(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			const transaction = await sequelize.transaction() 

			try {
				let discount = await Discount.create({
					name: req.body.name,
					description: req.body.description,
					startDate: req.body.startDate,
					endDate: req.body.endDate,
					type: req.body.type
				}, {
					transaction
				})

				for(let item of req.body.discountItems) {

					const percentage = req.body.type == Discount.PERCENTAGE ? item.discountPercentage : null
					const idr = req.body.type == Discount.IDR ? item.discountIdr : null

					await DiscountItem.create({
						productId: item.productId,
						discountId: discount.id,
						discountPercentage: percentage,
						discountIdr: idr
					}, {
						transaction
					})
				}

				await transaction.commit()

				super.sendResponse(res, 200, "Data Discount berhasil disimpan", null)
			}
			catch(error) {
				await transaction.rollback()

				if (error instanceof Sequelize.ValidationError) {
				    super.handleValidationError(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}

	async updateDiscount(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			const transaction = await sequelize.transaction() 

			try {
				let discount = await Discount.findByPk(req.params.id)
					discount.name = req.body.name
					discount.description = req.body.description
					discount.startDate = req.body.startDate
					discount.endDate = req.body.endDate
					discount.type = req.body.type
				await discount.save({transaction})

				for(let item of req.body.discountItems) {

					const percentage = req.body.type == Discount.PERCENTAGE ? item.discountPercentage : null
					const idr = req.body.type == Discount.IDR ? item.discountIdr : null

					if (!item.id) {
						await DiscountItem.create({
							productId: item.productId,
							discountId: discount.id,
							discountPercentage: percentage,
							discountIdr: idr
						}, {
							transaction
						})
					}
					else {
						await DiscountItem.update({
							productId: item.productId,
							discountPercentage: percentage,
							discountIdr: idr
						}, {
							where: {
								id: item.id
							},
							transaction
						})
					}
				}

				await transaction.commit()

				super.sendResponse(res, 200, "Data Discount berhasil disimpan", null)
			}
			catch(error) {
				await transaction.rollback()

				if (error instanceof Sequelize.ValidationError) {
				    super.handleValidationError(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}

	async changeStatusDiscount(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			try {
				const discount = await Discount.findByPk(req.params.id)
				const newStatus = !discount.isActive

				await Discount.update({
					isActive: newStatus,
				}, {
					where: {
						id: req.params.id
					}
				})

				super.sendResponse(res, 200, "Status Discount berhasil diubah", null)
			}
			catch (error) {
				if (error instanceof Sequelize.ValidationError) {
				    super.handleValidationError(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}
}

export default DiscountController