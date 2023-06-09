import {param, query, body} from 'express-validator'
import moment from "moment"

import {CartItem, Order, OrderShipping} from '../models/index.js'



const checkOrderIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Order wajib diisi').bail()
		.isInt({ min: 0 }).withMessage('Parameter ID Order harus berupa angka').bail()
		.custom(async (value) => {
			const order = await Order.findByPk(value)
			if (!order) throw new Error('Data Order tidak ditemukan')
			return true
		})
]

const getAllOrdersValidator = [
	query('startDate')
		.optional()
		.isDate({ format: 'YYYY-MM-DD' }).withMessage('Format Filter Tanggal tidak valid'),
	query('endDate')
		.optional()
		.isDate({ format: 'YYYY-MM-DD' }).withMessage('Format Filter Tanggal tidak valid')
		.custom((value, { req }) => {
		    if (!moment(value).isAfter(req.body.startDate)) throw new Error('Filter Tanggal Akhir harus setelah Tanggal Mulai')
		    return true
		}),
	query('status')
		.optional()
		.custom((value) => {
			const allowedValues = [Order.PENDING, Order.PAID, Order.SENT, Order.DONE, Order.FAIL, Order.CANCELED]
			if (!allowedValues.includes(value)) throw new Error('Filter Status Order salah')
			return true
		}),
]

const getShippingCostValidator = [
	body('cartItemIds')
		.notEmpty().withMessage('ID Item wajib diisi').bail()
		.isArray().withMessage('ID Item harus berupa array').bail()
		.custom(async (values, {req}) => {
			if (values) {
				for(let value of values) {
					const cartItem = await CartItem.findByPk(value)
					if (!cartItem || cartItem.userId !== req.userData.id) throw new Error('Data Cart Item tidak ditemukan')
				}
			}
			return true
		}),
	body('destinationCityId')
		.notEmpty().withMessage('ID Kota Tujuan wajib diisi').bail()
		.isInt().withMessage('ID Kota Tujuan harus berupa angka'),
	body('courierCode')
		.notEmpty().withMessage('Kode Kurir wajib diisi').bail()
		.custom((value) => {
			let allowedValues = []
			for (const courier of OrderShipping.COURIER) {
				allowedValues.push(courier.code)
			}
			if (!allowedValues.includes(value)) throw new Error('Kurir tidak ditemukan')
			return true
		})
]

const checkoutValidator = [
	body('cartItemIds')
		.notEmpty().withMessage('ID Item wajib diisi').bail()
		.isArray().withMessage('ID Item harus berupa array').bail()
		.custom(async (values, {req}) => {
			if (values) {
				for(let value of values) {
					const cartItem = await CartItem.findByPk(value)
					if (!cartItem || cartItem.userId !== req.userData.id) throw new Error('Data Cart Item tidak ditemukan')
				}
			}
			return true
		}),
	body('orderShipping')
		.notEmpty().withMessage('Data Pengiriman wajib diisi').bail()
		.isObject().withMessage('Data Pengiriman harus berupa objek'),
	body('orderShipping.provinceId')
		.notEmpty().withMessage('ID Provinsi wajib diisi').bail()
		.isInt().withMessage('ID Provinsi harus berupa angka'),
	body('orderShipping.cityId')
		.notEmpty().withMessage('ID Kota wajib diisi').bail()
		.isInt().withMessage('ID Kota harus berupa angka'),
	body('orderShipping.address')
		.notEmpty().withMessage('Alamat wajib diisi'),
	body('orderShipping.weight')
		.notEmpty().withMessage('Berat wajib diisi')
		.isInt({ min: 1 }).withMessage('Berat harus berupa angka'),
	body('orderShipping.courierCode')
		.notEmpty().withMessage('Kode Kurir wajib diisi'),
	body('orderShipping.serviceCode')
		.notEmpty().withMessage('Kode Service wajib diisi'),
	body('orderShipping.cost')
		.notEmpty().withMessage('Kode Service wajib diisi').bail()
		.isInt({ min: 1 }).withMessage('Ongkos Pengiriman harus berupa angka'),
	body('orderShipping.estimatedInDay')
		.notEmpty().withMessage('Estimasi Pengiriman wajib diisi'),

]


export {
	checkOrderIdValidator,
	getAllOrdersValidator,
	getShippingCostValidator,
	checkoutValidator
}