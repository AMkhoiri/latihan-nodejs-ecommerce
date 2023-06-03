import {Sequelize, Op} from 'sequelize'
import {validationResult} from 'express-validator'
import path from 'path'
import fs from 'fs/promises'

import {sequelize} from '../models/index.js' /*untuk db transaction*/
import {User, Category, Brand, Product, ProductImage, ProductHistory, Discount, DiscountItem} from '../models/index.js'
import BaseController from './BaseController.js'

class ProductController extends BaseController {

	async getAllProducts(req, res) {
		try {
			const { page, perPage, search, categoryId, brandId, minPrice, maxPrice, orderBy } = req.query
			const limit = perPage ? perPage : 10
			const offset = page ? (page - 1) * limit : 0

			const today = new Date()

			let includeQuery = [
				Category,
				Brand,
				{
					model: ProductImage,
					// required: true
				},
				{
					model: DiscountItem,
					include: {
						model: Discount,
						where: {
							startDate: { [Op.lte]: today},
							endDate: { [Op.gte]: today}
						}
					}
				}
			]

			let whereQuery = {}

			if (categoryId) {
				whereQuery["categoryId"] = categoryId
			}
			if (brandId) {
				whereQuery["brandId"] = brandId
			}
			if (minPrice) {
				whereQuery["price"] = { [Op.gte]: minPrice }
			}
			if (maxPrice) {
				whereQuery["price"] = { [Op.lte]: minPrice }
			}
			if (search) {
		        whereQuery[Op.or] = [
		         	{
		            	name: { [Op.iLike]: `%${search}%` },
		          	},
		          	{
		          		'$Category.name$': { [Op.iLike]: `%${search}%` }
		          	},
		          	{
		          		'$Brand.name$': { [Op.iLike]: `%${search}%` }
		          	}
		        ]
		    }

		    let orderQuery = []

		    if (orderBy === Product.HIGHER_PRICE) {
		    	orderQuery.push(['price', 'DESC'])
		    }
		    else if (orderBy === Product.LOWER_PRICE) {
		    	orderQuery.push(['price', 'ASC'])
		    }

		    orderQuery.push(['createdAt', 'DESC'])	/* default: product terbaru */

			const products = await Product.findAll({
				attributes: ['id', 'name', 'price', 'createdAt'],
				where: whereQuery,
				include: includeQuery,
				order: orderQuery,
				limit,
				offset
			})

			super.sendResponse(res, 200, "Data Product berhasil ditampilkan", products)
		}
		catch (error) {
			super.handleServerError(req, res, error)
		}
	}

	async getProductById(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			try {
				const today = new Date()

				let product = await Product.findByPk(req.params.id, {
					include: [
						Category,
						Brand,
						ProductImage,
						{
							model: DiscountItem,
							include: {
								model: Discount,
								where: {
									startDate: { [Op.lte]: today},
									endDate: { [Op.gte]: today}
								}
							}
						},
						{
							model: ProductHistory,
							include: [
								{
									model: User,
									attributes: ['name', 'username']
								}
							]
						}
					]
				})
				super.sendResponse(res, 200, "Data Product berhasil ditampilkan", product)
			}
			catch (error) {
				super.handleServerError(req, res, error)
			}
		}
	}

	async createProduct(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			const transaction = await sequelize.transaction() 

			try {
				const product = await Product.create({
					categoryId: req.body.categoryId,
					brandId: req.body.brandId,
					name: req.body.name,
					description: req.body.description,
					stock: req.body.stock,
					price: req.body.price,
				}, {
					transaction
				})

				await ProductHistory.record(null, product, Product.CREATE, "Produk baru", req.userData.id, transaction)

				await transaction.commit()

				super.sendResponse(res, 200, "Data Product berhasil disimpan", null)
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

	async updateProduct(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			try {
				await Product.update({
					name: req.body.name,
					description: req.body.description
				}, {
					where: {
						id: req.params.id
					}
				})

				const updatedProduct = await Product.findByPk(req.params.id)

				super.sendResponse(res, 200, "Data Product berhasil diubah", updatedProduct)
			}
			catch(error) {
				if (error instanceof Sequelize.ValidationError) {
				    super.handleValidationError(res, error.errors)
			    }
			    else {
			      	super.handleServerError(req, res, error)
			    }
			}
		}
	}

	async changeStatusProduct(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			try {
				const product = await Product.findByPk(req.params.id)
				const newStatus = !product.isActive

				await Product.update({
					isActive: newStatus,
				}, {
					where: {
						id: req.params.id
					}
				})

				super.sendResponse(res, 200, "Status Product berhasil diubah", null)
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

	async stockAdjustment(req, res) {
		const errors = validationResult(req) 

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else {
			const transaction = await sequelize.transaction() 

			try {
				let oldProduct = await Product.findByPk(req.params.id)
				
				let product = await Product.findByPk(req.params.id)

				if (req.body.operationType == Product.STOCK_INCREASE) {
					product.stock += parseInt(req.body.stock)
				}
				else if (req.body.operationType == Product.STOCK_DECREASE) {
					product.stock -= parseInt(req.body.stock)
				}

				await product.save({ transaction })

				await ProductHistory.record(oldProduct, product, req.body.operationType, req.body.description, req.userData.id, transaction)

				await transaction.commit()

				super.sendResponse(res, 200, "Data Product berhasil diubah", null)
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

	async priceAdjustment(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else{
			const transaction = await sequelize.transaction()

			try {
				let oldProduct = await Product.findByPk(req.params.id)

				let product = await Product.findByPk(req.params.id)

				let adjustmentType = null 
				if (parseFloat(req.body.newPrice) > product.price) {
					adjustmentType = Product.PRICE_INCREASE
				}
				else if (parseFloat(req.body.newPrice) < product.price) {
					adjustmentType = Product.PRICE_DECREASE
				}

				product.price = req.body.newPrice

				await product.save({ transaction })

				await ProductHistory.record(oldProduct, product, adjustmentType, req.body.description, req.userData.id, transaction)

				await transaction.commit()

				super.sendResponse(res, 200, "Data Product berhasil diubah", null)
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

	async uploadProductFile(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else{
			try{
				const uploadPath = `storage/productImages/${req.params.id}`

				/*check is directory exists*/
			    try {
			      	await fs.access(uploadPath);
			    } catch (error) {
			      	await fs.mkdir(uploadPath, { recursive: true });
			    }

				for (let file of req.files) {

					let name = file.originalname
					let extension = path.extname(name)
					let filePath = path.join(uploadPath, `${Date.now()}${extension}`)
					let size = file.size
					let mimetype = file.mimetype

					await fs.writeFile(filePath, file.buffer)

					await ProductImage.create({
						productId: req.params.id,
						name,
						path: filePath,
						extension,
						size,
						mimetype
					})
				}

				super.sendResponse(res, 200, "Gambar product berhasil disimpan", null)
			}
			catch(error) {
			    super.handleServerError(req, res, error)
			}
		}
	}

	async deleteProductFile(req, res) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			super.handleValidationError(res, errors.array())
		}
		else{
			try{
				let productImage = await ProductImage.findByPk(req.params.fileId)
				await fs.unlink(productImage.path)
				await productImage.destroy()

				super.sendResponse(res, 200, "Gambar product berhasil dihapus", null)
			}
			catch(error) {
			    super.handleServerError(req, res, error)
			}
		}
	}
}

export default ProductController


