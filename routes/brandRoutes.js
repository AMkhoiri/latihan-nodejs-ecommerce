import express from 'express'
import {param, body} from 'express-validator'

import {Brand} from '../models/index.js'
import BrandController from '../controllers/BrandController.js'


/* params Validator */

const checkBrandIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Brand wajib diisi')
		.custom(async (value) => {
			const brand = await Brand.findByPk(value)
			if (!brand) throw new Error('Data Brand tidak ditemukan')
			return true
		})
]

/* body validator */

const createBrandValidator = [
	body('name')
		.notEmpty().withMessage('Nama Brand wajib diisi')
]

const updateBrandValidator = [
	body('name')
		.notEmpty().withMessage('Nama Brand wajib diisi')
]


/* Router */

const brandRouter = express.Router()
const brandController = new BrandController();

brandRouter.get('/', brandController.getAllBrands)
brandRouter.get('/:id', checkBrandIdValidator, brandController.getBrandById)
brandRouter.post('/', createBrandValidator, brandController.createBrand)
brandRouter.put('/:id', checkBrandIdValidator, updateBrandValidator, brandController.updateBrand)
brandRouter.put('/:id/change-status', checkBrandIdValidator, brandController.changeStatusBrand)

export default brandRouter