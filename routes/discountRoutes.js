import express from 'express'

import {
	checkDiscountIdValidator,
	createDiscountValidator,
	updateDiscountValidator
} from '../validators/discountValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import DiscountController from '../controllers/DiscountController.js'



const discountRouter = express.Router()
const discountController = new DiscountController();

discountRouter.get('/', 
	discountController.getAllDiscounts
)
discountRouter.get('/:id', 
	checkDiscountIdValidator, 
	checkValidationMiddleware,
	discountController.getDiscountById
)
discountRouter.post('/', 
	createDiscountValidator, 
	checkValidationMiddleware,
	discountController.createDiscount
)
discountRouter.put('/:id', 
	checkDiscountIdValidator, 
	updateDiscountValidator, 
	checkValidationMiddleware,
	discountController.updateDiscount
)
discountRouter.patch('/:id/change-status', 
	checkDiscountIdValidator, 
	checkValidationMiddleware,
	discountController.changeStatusDiscount
)


export default discountRouter