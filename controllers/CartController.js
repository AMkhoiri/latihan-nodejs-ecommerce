import {Sequelize, Op} from 'sequelize'

import {User, Category, Brand, Product, ProductImage, Discount, DiscountItem, CartItem} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'

class CartController extends BaseController {
	
	async showMyCart(req, res) {
		try {
			const today = new Date()

			const cartItems = await CartItem.findAll({
				include: [
					{
						model: Product,
						attributes: ['id', 'name', 'price', 'stock' , 'isActive'],
						include: [
							Category,
							Brand,
							ProductImage,
							{
								model: DiscountItem,
								include: {
									model: Discount,
									where: {
										startDate: { [Op.lte]: today },
										endDate: { [Op.gte]: today },
										isActive: true
									},
								},
							}
						]
					}
				],
				where: {
					userId: req.userData.id
				}
			})

			const formattedCartItems = cartItems.map((cartItem) => {
				const isReadyProduct = cartItem.Product.isActive
			    const isSufficientStock = cartItem.Product.stock >= cartItem.quantity
			    return {
			      	...cartItem.toJSON(),
			      	isReadyProduct,
			      	isSufficientStock,
			    }
			})

			Response.send(res, 200, "Data Cart berhasil ditampilkan", formattedCartItems)
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async addToCart(req, res) {
		try {
			let cartItem = await CartItem.findOne({
				where: {
					productId: req.body.productId,
					userId: req.userData.id
				}
			})

			if (cartItem) {
				cartItem.quantity += parseInt(req.body.quantity)
				await cartItem.save()
			}
			else{
				let cartItem = await CartItem.create({
					productId: req.body.productId,
					userId: req.userData.id,
					quantity: req.body.quantity
				})
			}

			Response.send(res, 200, "Berhasil menambahkan Product ke Cart", null)
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

	async addNote(req, res) {
		try {
			let cartItem = await CartItem.update({
				note:  req.body.note
			}, {
				where: {
					id: req.params.id
				}
			})

			Response.send(res, 200, "Berhasil menyimpan Note", null)
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

	async updateQuantity(req, res) {
		try {
			let cartItem = await CartItem.update({
				quantity:  req.body.newQuantity
			}, {
				where: {
					id: req.params.id
				}
			})

			Response.send(res, 200, "Berhasil memperbarui Quantity", null)
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

	async deleteCartItem(req, res) {
		try {
			let cartItem = await CartItem.destroy({
				where: {
					id: req.params.id
				}
			})

			Response.send(res, 200, "Item berhasil dihapus", null)
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


export default CartController