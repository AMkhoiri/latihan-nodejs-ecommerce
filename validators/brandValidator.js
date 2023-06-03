import {param, body} from 'express-validator'

import {Brand} from '../models/index.js'



const checkBrandIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Brand wajib diisi')
		.custom(async (value) => {
			const brand = await Brand.findByPk(value)
			if (!brand) throw new Error('Data Brand tidak ditemukan')
			return true
		})
]

const createBrandValidator = [
	body('name')
		.notEmpty().withMessage('Nama Brand wajib diisi')
]

const updateBrandValidator = [
	body('name')
		.notEmpty().withMessage('Nama Brand wajib diisi')
]


export {
	checkBrandIdValidator,
	createBrandValidator,
	updateBrandValidator
}