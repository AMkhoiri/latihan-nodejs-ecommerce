import {param, body} from 'express-validator'

import {Product, CartItem} from '../models/index.js'



const checkCartItemIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Cart Item wajib diisi').bail()
		.isInt({ min: 0 }).withMessage('Parameter Cart Item harus berupa angka').bail()
		.custom(async (value) => {
			const cartItem = await CartItem.findByPk(value)
			if (!cartItem) throw new Error('Data Cart Item tidak ditemukan')
			return true
		}),
]

const addToCartValidator = [
	body('productId')
		.notEmpty().withMessage('Product wajib diisi').bail()
		.isInt({ min: 0 }).withMessage('ID Product harus berupa angka').bail()
		.custom(async (value) => {
			const product = await Product.findByPk(value)
			if (!product) throw new Error('Data Product tidak ditemukan')
			return true
		}),
	body('quantity')
		.notEmpty().withMessage('Quantity wajib diisi').bail()
		.isInt({ min: 0 }).withMessage('Quantity harus berupa angka').bail()
		.custom(async (value) => {
			const product = await Product.findByPk(value)
			if (product) {
				if (product.stock < parseInt(value)) throw new Error('Stok tidak mencukupi')
			}
			return true
		}),
]

const addNoteToCartItemValidator = [
	body('note')
		.notEmpty().withMessage('Catatan wajib diisi')
]

const updateQuantityValidator = [
	body('newQuantity')
		.notEmpty().withMessage('Quantity wajib diisi').bail() 
		.isInt({ min: 0 }).withMessage('Quantity harus berupa angka').bail()
		.custom(async (value) => {
			const product = await Product.findByPk(value)
			if (product) {
				if (product.stock < parseInt(value)) throw new Error('Stok tidak mencukupi')
			}
			return true
		}),
]


export {
	checkCartItemIdValidator,
	addToCartValidator,
	addNoteToCartItemValidator,
	updateQuantityValidator,
}