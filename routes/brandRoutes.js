import express from 'express'

import { 
	checkBrandIdValidator, 
	createBrandValidator, 
	updateBrandValidator
} from '../validators/brandValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import BrandController from '../controllers/BrandController.js'



const brandRouter = express.Router()
const brandController = new BrandController();

brandRouter.get('/', 
	brandController.getAllBrands
)
brandRouter.get('/:id', 
	checkBrandIdValidator,
	checkValidationMiddleware,
	brandController.getBrandById
)
brandRouter.post('/', 
	createBrandValidator,
	checkValidationMiddleware,
	brandController.createBrand
)
brandRouter.put('/:id', 
	checkBrandIdValidator,
	updateBrandValidator,
	checkValidationMiddleware,
	brandController.updateBrand
)
brandRouter.patch('/:id/change-status', 
	checkBrandIdValidator,
	checkValidationMiddleware, 
	brandController.changeStatusBrand
)


export default brandRouter