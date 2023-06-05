import {param, body} from 'express-validator'

import {Category} from '../models/index.js'



const checkCategoryIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Category wajib diisi').bail()
		.isInt({ min: 0 }).withMessage('Parameter ID Category harus berupa angka').bail()
		.custom(async (value) => {
			const category = await Category.findByPk(value)
			if (!category) throw new Error('Data Category tidak ditemukan')
			return true
		})
]

const createCategoryValidator = [
	body('name')
		.notEmpty().withMessage('Nama Category wajib diisi')
]

const updateCategoryValidator = [
	body('name')
		.notEmpty().withMessage('Nama Category wajib diisi')
]


export {
	checkCategoryIdValidator,
	createCategoryValidator,
	updateCategoryValidator
}