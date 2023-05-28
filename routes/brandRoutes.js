import express from 'express'
import {param, body} from 'express-validator'

import {Brand} from '../models/index.js'
import BrandController from '../controllers/BrandController.js'


/* Validator */

const getBrandValidator = [
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
	param('id')
		.notEmpty().withMessage('Parameter ID Brand wajib diisi')
		.custom(async (value) => {
			const brandToUpdate = await Brand.findByPk(value)
			if (!brandToUpdate) throw new Error('Data Brand tidak ditemukan')
			return true
		}),
	body('name')
		.notEmpty().withMessage('Nama Brand wajib diisi')
]

const changeStatusBrandValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Brand wajib diisi')
		.custom(async (value) => {
			const brandToChange = await Brand.findByPk(value)
			if (!brandToChange) throw new Error('Data Brand tidak ditemukan')
			return true
		})
]


/* Router */

const brandRouter = express.Router()
const brandController = new BrandController();

brandRouter.get('/', brandController.getAllBrands)
brandRouter.get('/:id', getBrandValidator, brandController.getBrandById)
brandRouter.post('/', createBrandValidator, brandController.createBrand)
brandRouter.put('/:id', updateBrandValidator, brandController.updateBrand)
brandRouter.put('/:id/change-status', changeStatusBrandValidator, brandController.changeStatusBrand)

export default brandRouter