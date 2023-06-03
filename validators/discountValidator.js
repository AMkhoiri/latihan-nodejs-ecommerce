import {param, body} from 'express-validator'
import moment from "moment"

import {Product, Discount, DiscountItem} from '../models/index.js'



/* params Validator */

const checkDiscountIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Discount wajib diisi')
		.custom(async (value) => {
			const discount = await Discount.findByPk(value)
			if (!discount) throw new Error('Data Discount tidak ditemukan')
			return true
		})
]

/*body validator*/

const createDiscountValidator = [
	body('name')
		.notEmpty().withMessage('Nama Discount wajib diisi'),
	body('startDate')
		.notEmpty().withMessage('Tanggal Mulai Discount wajib diisi').bail()
		.isDate({ format: 'YYYY-MM-DD' }).withMessage('Format tanggal tidak valid'),
	body('endDate')
		.notEmpty().withMessage('Tanggal Akhir Discount wajib diisi').bail()
		.isDate({ format: 'YYYY-MM-DD' }).withMessage('Format tanggal tidak valid')
		.custom((value, { req }) => {
		    if (!moment(value).isAfter(req.body.startDate)) throw new Error('Tanggal Akhir harus setelah Tanggal Mulai')
		    return true
		}),
	body('type')
		.notEmpty().withMessage('Tipe Discount wajib diisi').bail()
		.custom((value) => {
			const allowedValues = [Discount.PERCENTAGE, Discount.IDR]
			if (!allowedValues.includes(value)) throw new Error('Tipe Discount salah')
			return true
		}),
	body('discountItems')
		.notEmpty().withMessage('Discount items wajib diisi').bail()
		.isArray().withMessage('Discount items harus berupa array').bail()
		.isLength({ min: 1 }).withMessage('Minimal 1 Discount items wajib diisi'),
	body('discountItems.*.productId')
		.notEmpty().withMessage('ID Product wajib diisi').bail()
		.custom(async(value) => {
			const product = await Product.findByPk(value)
			if (!product) throw new Error('Data Product tidak ditemukan')
			return true
		}),
	body('discountItems')
		.custom(async (values, {req}) => {
			if (values) {
				let productIds = [] /*prevent duplicate*/
				for(let value of values) {
					const product = await Product.findByPk(value.productId)

					if (productIds.includes(value.productId)) {
						throw new Error(`Terdapat duplikat data untuk Product (${product.name})`)
					}
					
					productIds.push(value.productId)

					if (req.body.type === Discount.IDR) {
						if(!value.discountIdr) {
							throw new Error(`Nominal Discount (${product.name}) wajib diisi jika type Discount: ${Discount.IDR}`)
						}
						else if (value.discountIdr && (!Number.isInteger(value.discountIdr) || value.discountIdr < 0)) {
							throw new Error(`Nominal Discount (${product.name}) harus berupa angka`)
						}
						else if (value.discountIdr > product.price) {
							throw new Error(`Nominal Discount (${product.name}) tidak boleh melebihi Harga Product`)
						}
					}
					else if (req.body.type === Discount.PERCENTAGE) {
						if (!value.discountPercentage)  {
							throw new Error(`Persentase Discount (${product.name}) wajib diisi jika type: ${Discount.PERCENTAGE}`)
						}
						else if (value.discountPercentage && (!Number.isInteger(value.discountPercentage) || value.discountPercentage < 1 || value.discountPercentage > 99)) {
							throw new Error(`Persentase Discount (${product.name}) harus berupa angka (1-99)`)
						}
					}
					
				}
			}
			return true
		})
]

const updateDiscountValidator = [
	body('name')
		.notEmpty().withMessage('Nama Discount wajib diisi'),
	body('startDate')
		.notEmpty().withMessage('Tanggal Mulai Discount wajib diisi').bail()
		.isDate({ format: 'YYYY-MM-DD' }).withMessage('Format tanggal tidak valid'),
	body('endDate')
		.notEmpty().withMessage('Tanggal Akhir Discount wajib diisi').bail()
		.isDate({ format: 'YYYY-MM-DD' }).withMessage('Format tanggal tidak valid')
		.custom((value, { req }) => {
		    if (!moment(value).isAfter(req.body.startDate)) throw new Error('Tanggal Akhir harus setelah Tanggal Mulai')
		    return true;
		}),
	body('type')
		.notEmpty().withMessage('Tipe Discount wajib diisi').bail()
		.custom((value) => {
			const allowedValues = [Discount.PERCENTAGE, Discount.IDR]
			if (!allowedValues.includes(value)) throw new Error('Tipe Discount salah')
			return true
		}),
	body('discountItems')
		.notEmpty().withMessage('Discount items wajib diisi').bail()
		.isArray().withMessage('Discount items harus berupa array').bail()
		.isLength({ min: 1 }).withMessage('Minimal 1 Discount items wajib diisi'),
	body('discountItems.*.id')
		.custom(async(value) => {
			if (value) {
				const discountItem = await DiscountItem.findByPk(value)
				if (!discountItem) throw new Error('Data Discount Item tidak ditemukan')
			}
			return true
		}),
	body('discountItems.*.productId')
		.notEmpty().withMessage('ID Product wajib diisi').bail()
		.custom(async(value) => {
			const product = await Product.findByPk(value)
			if (!product) throw new Error('Data Product tidak ditemukan')
			return true
		}),
	body('discountItems')
		.custom(async (values, {req}) => {
			if (values) {
				let productIds = [] /*prevent duplicate*/
				for(let value of values) {
					const product = await Product.findByPk(value.productId)

					if (productIds.includes(value.productId)) {
						throw new Error(`Terdapat duplikat data untuk Product (${product.name})`)
					}
					
					productIds.push(value.productId)

					if (req.body.type === Discount.IDR) {
						if(!value.discountIdr) {
							throw new Error(`Nominal Discount (${product.name}) wajib diisi jika type Discount: ${Discount.IDR}`)
						}
						else if (value.discountIdr && (!Number.isInteger(value.discountIdr) || value.discountIdr < 0)) {
							throw new Error(`Nominal Discount (${product.name}) harus berupa angka`)
						}
						else if (value.discountIdr > product.price) {
							throw new Error(`Nominal Discount (${product.name}) tidak boleh melebihi Harga Product`)
						}
					}
					else if (req.body.type === Discount.PERCENTAGE) {
						if (!value.discountPercentage)  {
							throw new Error(`Persentase Discount (${product.name}) wajib diisi jika type: ${Discount.PERCENTAGE}`)
						}
						else if (value.discountPercentage && (!Number.isInteger(value.discountPercentage) || value.discountPercentage < 1 || value.discountPercentage > 99)) {
							throw new Error(`Persentase Discount (${product.name}) harus berupa angka (1-99)`)
						}
					}
					
				}
			}
			return true
		})
]


export {
	checkDiscountIdValidator,
	createDiscountValidator,
	updateDiscountValidator
}