import express from 'express'

import { 
	checkCategoryIdValidator, 
	createCategoryValidator, 
	updateCategoryValidator 
} from '../validators/categoryValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import CategoryController from '../controllers/CategoryController.js'



const categoryRouter = express.Router()
const categoryController = new CategoryController();

categoryRouter.get('/', 
	categoryController.getAllCategories
)
categoryRouter.get('/:id', 
	checkCategoryIdValidator,
	checkValidationMiddleware, 
	categoryController.getCategoryById
)
categoryRouter.post('/', 
	createCategoryValidator,
	checkValidationMiddleware, 
	categoryController.createCategory
)
categoryRouter.put('/:id',
	checkCategoryIdValidator,
	updateCategoryValidator,
	checkValidationMiddleware,
	categoryController.updateCategory
)
categoryRouter.patch('/:id/change-status', 
	checkCategoryIdValidator,
	checkValidationMiddleware, 
	categoryController.changeStatusCategory
)


export default categoryRouter