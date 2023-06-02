import express from 'express'
import {param, body} from 'express-validator'

import {Category} from '../models/index.js'
import CategoryController from '../controllers/CategoryController.js'


/* params Validator */

const checkCategoryIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Category wajib diisi')
		.custom(async (value) => {
			const category = await Category.findByPk(value)
			if (!category) throw new Error('Data Category tidak ditemukan')
			return true
		})
]

/*body validator*/

const createCategoryValidator = [
	body('name')
		.notEmpty().withMessage('Nama Category wajib diisi')
]

const updateCategoryValidator = [
	body('name')
		.notEmpty().withMessage('Nama Category wajib diisi')
]


/* Router */

const categoryRouter = express.Router()
const categoryController = new CategoryController();

categoryRouter.get('/', categoryController.getAllCategories)
categoryRouter.get('/:id', checkCategoryIdValidator, categoryController.getCategoryById)
categoryRouter.post('/', createCategoryValidator, categoryController.createCategory)
categoryRouter.put('/:id', checkCategoryIdValidator, updateCategoryValidator, categoryController.updateCategory)
categoryRouter.patch('/:id/change-status', checkCategoryIdValidator, categoryController.changeStatusCategory)

export default categoryRouter