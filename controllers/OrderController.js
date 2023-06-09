import {Sequelize, Op} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import fs from 'fs/promises'

import {sequelize} from '../models/index.js' /*untuk db transaction*/
import {Role, User, Category, Brand, Product, ProductImage, ProductHistory, Discount, DiscountItem, CartItem, Order, OrderItem, OrderShipping, OrderHistory, OrderPaymentEvidence} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'
import Utility from '../helpers/utility.js'

class OrderController extends BaseController {

	async getShippingCost(req, res) {
		try {
			let totalWeight = 0
			for (const cartItemId of req.body.cartItemIds) {
				const cartItem = await CartItem.findByPk(cartItemId, {
				    include: [Product]
				})

			  	totalWeight += cartItem.Product.weight * cartItem.quantity;
			}
			
			const url = process.env.RAJAONGKIR_API_URL + "cost"
			const headers = {
				key: process.env.RAJAONGKIR_API_KEY,
				"Content-Type": "application/x-www-form-urlencoded"
			}
			let body = {
				origin: process.env.RAJAONGKIR_ORIGIN_CITY_ID,
				destination: req.body.destinationCityId,
				weight: totalWeight,
				courier: req.body.courierCode
			}

			const params = new URLSearchParams()

  			Object.keys(body).forEach((key) => params.append(key, body[key]))

			const data = await Utility.fetchData(url, "POST", headers, params)

			if (data.rajaongkir.status.code == 200) {
				Response.send(res, 200, "Opsi Pengiriman berhasil ditampilkan", data.rajaongkir)
			}
			else{
				let err = new Error('Gagal mendapatkan data')
				Response.serverError(req, res, err)
			}
		}
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async getAllOrders(req, res) {
		try {
			const { status, startDate, endDate } = req.query

			let whereQuery = {}

			if (req.userData.roleId === Role.CUSTOMER) {
				whereQuery.userId = req.userData.id
			}

			const statusList = [
				Order.PENDING, 
				Order.PAID,
				Order.PAYMENT_REJECTED, 
				Order.SENT, 
				Order.DONE, 
				Order.FAIL, 
				Order.CANCELED
			]
			
			if (statusList.includes(status)) {
				whereQuery.status = status
			}
			
			if (startDate && endDate) {
			  	whereQuery.createdAt = { [Op.between]: [startDate, endDate] }
			} else if (startDate) {
			  	whereQuery.createdAt = { [Op.gte]: startDate }
			} else if (endDate) {
			  	whereQuery.createdAt = { [Op.lte]: endDate }
			}

			const orders = await Order.findAll({
				attributes: ['id', 'userId', 'status', 'totalAmount', 'totalWeight', 'createdAt'],
				include: [
					{
						model: OrderItem,
						include: [
							{
								model: Product,
								attributes: ['name']
							}
						]
					},
				],
				where: whereQuery
			})

			Response.send(res, 200, "Data Order berhasil ditampilkan", orders)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async getOrderById(req, res) {
		try {
			const order = await Order.findByPk(req.params.id, {
				attributes: ['id', 'userId', 'status', 'totalAmount', 'totalWeight', 'createdAt'],
				include: [
					{
						model: OrderItem,
						include: [
							{
								model: Product,
								include: [Category, Brand]
							},
							{
								model: DiscountItem,
								include: [Discount]
							}
						]
					},
					OrderPaymentEvidence,
					OrderShipping,
					OrderHistory
				]
			})

			Response.send(res, 200, "Data Order berhasil ditampilkan", order)
		} 
		catch(error) {
			Response.serverError(req, res, error)
		}
	}

	async checkout(req, res) {
		const transaction = await sequelize.transaction() 

		try {
			const today = new Date()

			let order = await Order.create({
				userId: req.userData.id,
				orderDate: today,
				status: Order.PENDING
			}, {
				transaction
			})

			let totalAmount = 0

			for (let cartItemId of req.body.cartItemIds) {
				const cartItem = await CartItem.findByPk(cartItemId, {
					include: [Product]
				})

				/* check is this product has discount today */
				const discountItem = await DiscountItem.findOne({
					where: {
						productId: cartItem.productId
					},
					include: {
						model: Discount,
						where: {
							startDate: { [Op.lte]: today },
							endDate: { [Op.gte]: today },
							isActive: true
						}
					}
				})

				let discountItemId = discountItem ? discountItem.id : null

				/* determine the price if the product is on discount */
				let price = cartItem.Product.price
				if (discountItem) {
					if (discountItem.Discount.type == Discount.PERCENTAGE) {
						price = cartItem.Product.price * (discountItem.discountPercentage / 100)
					}
					else if (discountItem.Discount.type == Discount.IDR) {
						price = cartItem.Product.price - discountItem.discountIdr
					}
				}
				totalAmount += (price * cartItem.quantity)

				/* store item to order*/
				const orderItem = await OrderItem.create({
					orderId: order.id,
					productId: cartItem.productId,
					discountItemId,
					quantity: cartItem.quantity,
					price,
					note: cartItem.note
				}, {
					transaction
				})

				/* temporarily freeze the stock */
				let product = await Product.findByPk(cartItem.productId)
				product.frozenStock += orderItem.quantity
				product.stock -= orderItem.quantity
				await product.save({transaction})

				/* delete item from cart */
				await cartItem.destroy({transaction})
			}

			order.totalWeight = req.body.orderShipping.weight
			order.totalAmount = totalAmount
        	await order.save({ transaction })

        	/* store order shipping */
        	const orderShippingData = req.body.orderShipping
        	await OrderShipping.create({
        		orderId: order.id,
        		provinceId: orderShippingData.provinceId,
		        cityId: orderShippingData.cityId,
		        address: orderShippingData.address,
		        weight: orderShippingData.weight,
		        courierCode: orderShippingData.courierCode,
		        serviceCode: orderShippingData.serviceCode,
		        cost: orderShippingData.cost,
		        estimatedInDay: orderShippingData.estimatedInDay,
        	}, {
				transaction
			})

        	/* store order history */
			await OrderHistory.record(order.id, Order.PENDING, req.userData.id, transaction)

			await transaction.commit()

			Response.send(res, 200, "Berhasil checkout Product", null)
		}
		catch (error) {
			await transaction.rollback()

			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async cancel(req, res) {
		const transaction = await sequelize.transaction() 

		try {
			await Order.update({
				status: Order.CANCELED
			}, {
				where: {
					id: req.params.id
				},
				transaction
			})

			await OrderHistory.record(req.params.id, Order.CANCELED, req.userData.id, transaction)

			await transaction.commit()

			Response.send(res, 200, "Order dibatalkan", null)
		} 
		catch (error) {
			await transaction.rollback()

			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async pay(req, res) {
		const transaction = await sequelize.transaction() 

		try {
			const uploadPath = `storage/orderPaymenEvidences/${req.params.id}`

			/*check is directory exists*/
		    try {
		      	await fs.access(uploadPath);
		    } catch (error) {
		      	await fs.mkdir(uploadPath, { recursive: true });
		    }

		    /* delete (to replace) if already has evidence */
		    const orderPaymentEvidence = await OrderPaymentEvidence.findOne({
		    	where: {
		    		orderId: req.params.id
		    	}
		    })
		    if (orderPaymentEvidence) {
		    	await fs.unlink(orderPaymentEvidence.path)
				await orderPaymentEvidence.destroy()
		    }

		    /* save evidence file */
			for (let file of req.files) {

				let name = file.originalname
				let extension = path.extname(name)
				let filePath = path.join(uploadPath, `${Date.now()}${extension}`)
				let size = file.size
				let mimetype = file.mimetype

				await fs.writeFile(filePath, file.buffer)

				await OrderPaymentEvidence.create({
					orderId: req.params.id,
					name,
					path: filePath,
					extension,
					size,
					mimetype
				}, {
					transaction
				})
			}

			/* update order status */
			await Order.update({
				status: Order.PAID
			}, {
				where: {
					id: req.params.id
				},
				transaction
			})

			/* record history */
			await OrderHistory.record(req.params.id, Order.PAID, req.userData.id, transaction)

			await transaction.commit()

			Response.send(res, 200, "Pembayaran berhasil", null)
		} 
		catch (error) {
			await transaction.rollback()

			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async paymentConfirmation(req, res) {
		const transaction = await sequelize.transaction() 

		try {
			const newStatus = req.body.confirmationType == Order.REJECT_PAYMENT ? Order.PAYMENT_REJECTED : Order.SENT
			const note = newStatus == Order.PAYMENT_REJECTED ? req.body.note : null

			await Order.update({
				status: newStatus,
				note: note
			}, {
				where: {
					id: req.params.id
				},
				transaction
			})

			await OrderHistory.record(req.params.id, newStatus, req.userData.id, transaction)

			await transaction.commit()

			let txt = ""
			if (newStatus == Order.PAYMENT_REJECTED) {
				txt = "Pembayaran ditolak"
			} else if (newStatus == Order.SENT) {
				txt = "Pembayaran diterima"
			}

			Response.send(res, 200, txt, null)
		} 
		catch (error) {
			await transaction.rollback()

			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}

	async receiptConfirmation(req, res) {
		const transaction = await sequelize.transaction() 

		try {
			await Order.update({
				status: Order.DONE
			}, {
				where: {
					id: req.params.id
				},
				transaction
			})

			await OrderHistory.record(req.params.id, Order.DONE, req.userData.id, transaction)

			await transaction.commit()

			Response.send(res, 200, "Order selesai", null)
		} 
		catch (error) {
			await transaction.rollback()

			if (error instanceof Sequelize.ValidationError) {
			    Response.validationError(res, error.errors)
		    }
		    else {
		      	Response.serverError(req, res, error)
		    }
		}
	}
}


export default OrderController