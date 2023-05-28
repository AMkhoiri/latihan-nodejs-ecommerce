import express from 'express'
import {param, body} from 'express-validator'

import {Category} from '../models/index.js'
import CategoryController from '../controllers/CategoryController.js'


/* Validator */

const getCategoryValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Category wajib diisi')
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
	param('id')
		.notEmpty().withMessage('Parameter ID Category wajib diisi')
		.custom(async (value) => {
			const categoryToUpdate = await Category.findByPk(value)
			if (!categoryToUpdate) throw new Error('Data Category tidak ditemukan')
			return true
		}),
	body('name')
		.notEmpty().withMessage('Nama Category wajib diisi')
]

const changeStatusCategoryValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Category wajib diisi')
		.custom(async (value) => {
			const categoryToChange = await Category.findByPk(value)
			if (!categoryToChange) throw new Error('Data Category tidak ditemukan')
			return true
		})
]


/* Router */

const categoryRouter = express.Router()
const categoryController = new CategoryController();

categoryRouter.get('/', categoryController.getAllCategories)
categoryRouter.get('/:id', getCategoryValidator, categoryController.getCategoryById)
categoryRouter.post('/', createCategoryValidator, categoryController.createCategory)
categoryRouter.put('/:id', updateCategoryValidator, categoryController.updateCategory)
categoryRouter.put('/:id/change-status', changeStatusCategoryValidator, categoryController.changeStatusCategory)

export default categoryRouter