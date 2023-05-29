import express from 'express'
import {param, body} from 'express-validator'

import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js'

import {Role, Category, Brand, Product} from '../models/index.js'
import ProductController from '../controllers/ProductController.js'


/* Validator */

const getProductValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Product wajib diisi')
		.isInt().withMessage('Parameter ID harus berupa angka').bail()
		.custom(async(value) => {
			const product = await Product.findByPk(value)
			if (!product) throw new Error('Data Product tidak ditemukan')
			return true
		})
]

const createProductValidator = [
	body('categoryId')
		.notEmpty().withMessage('Kategori Product wajib diisi')
		.isInt().withMessage('Kategori harus berupa angka').bail()
		.custom(async(value) => {
			const category = await Category.findByPk(value)
			if (!category) throw new Error('Data Kategori tidak ditemukan')
			return true
		}),
	body('brandId')
		.notEmpty().withMessage('Brand Product wajib diisi')
		.isInt().withMessage('Brand harus berupa angka').bail()
		.custom(async(value) => {
			const brand = await Brand.findByPk(value)
			if (!brand) throw new Error('Data Brand tidak ditemukan')
			return true
		}),
	body('name')
		.notEmpty().withMessage('Nama Product wajib diisi'),
	body('description')
		.notEmpty().withMessage('Deskripsi Product wajib diisi'),
	body('stock')
		.notEmpty().withMessage('Stok awal Product wajib diisi')
		.isInt({ min: 0 }).withMessage('Stok harus berupa angka'),
	body('price')
		.notEmpty().withMessage('Harga Product wajib diisi')
		.isNumeric().withMessage('Harga harus berupa angka')
    	.isFloat({ min: 0 }).withMessage('Harga harus lebih besar dari 0')
]

const updateProductValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Product wajib diisi')
		.isInt().withMessage('Brand harus berupa angka').bail()
		.custom(async(value) => {
			const productToUpdate = await Product.findByPk(value)
			if (!productToUpdate) throw new Error('Data Product tidak ditemukan')
			return true
		}),
	body('name')
		.notEmpty().withMessage('Nama Product wajib diisi'),
	body('description')
		.notEmpty().withMessage('Deskripsi Product wajib diisi')
]

const stockAdjustmentProductValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Product wajib diisi')
		.isInt().withMessage('Parameter ID harus berupa angka').bail()
		.custom(async(value) => {
			const productToUpdate = await Product.findByPk(value)
			if (!productToUpdate) throw new Error('Data Product tidak ditemukan')
			return true
		}),
	body('operationType')
		.notEmpty().withMessage('Tipe Adjustment wajib diisi').bail()
		.custom((value) => {
			let allowedValues = [Product.STOCK_INCREASE, Product.STOCK_DECREASE]
			if (!allowedValues.includes(value)) throw new Error('Tipe Adjustment salah')
			return true
		}),
	body('stock')
		.notEmpty().withMessage('Stok adjusment Product wajib diisi')
		.isInt({ min: 0 }).withMessage('Stok harus berupa angka')
]

const priceAdjustmentProductValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Product wajib diisi')
		.isInt().withMessage('Parameter ID harus berupa angka').bail()
		.custom(async(value) => {
			const productToUpdate = await Product.findByPk(value)
			if (!productToUpdate) throw new Error('Data Product tidak ditemukan')
			return true
		}),
	body('operationType')
		.notEmpty().withMessage('Tipe Adjustment wajib diisi').bail()
		.custom((value) => {
			let allowedValues = [Product.PRICE_INCREASE, Product.PRICE_DECREASE]
			if (!allowedValues.includes(value)) throw new Error('Tipe Adjustment salah')
			return true
		}),
	body('newPrice')
		.notEmpty().withMessage('Harga Product wajib diisi')
		.isNumeric().withMessage('Harga harus berupa angka').bail()
    	.isFloat({ min: 0 }).withMessage('Harga harus lebih besar dari 0')
]

const changeStatusProductValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Product wajib diisi')
		.isInt().withMessage('Parameter ID harus berupa angka').bail()
		.custom(async(value) => {
			const productToChange = await Product.findByPk(value)
			if (!productToChange) throw new Error('Data Product tidak ditemukan')
			return true
		})
]


/* Router */

const productRouter = express.Router()
const productController = new ProductController();

productRouter.get('/', checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]), productController.getAllProducts)
productRouter.get('/:id', checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]), getProductValidator, productController.getProductById)

productRouter.post('/', checkRoleMiddleware([Role.ADMIN]), createProductValidator, productController.createProduct)
productRouter.put('/:id', checkRoleMiddleware([Role.ADMIN]), updateProductValidator, productController.updateProduct)
productRouter.put('/:id/change-status', checkRoleMiddleware([Role.ADMIN]), changeStatusProductValidator, productController.changeStatusProduct)
productRouter.put('/:id/adjustment/stock', checkRoleMiddleware([Role.ADMIN]), stockAdjustmentProductValidator, productController.stockAdjustment)
productRouter.put('/:id/adjustment/price', checkRoleMiddleware([Role.ADMIN]), priceAdjustmentProductValidator, productController.priceAdjustment)

export default productRouter