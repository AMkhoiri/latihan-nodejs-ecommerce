import express from 'express'

import {Role} from '../models/index.js'
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js'
import {
	checkProductIdValidator,
	checkProductImageIdValidator,
	createProductValidator,
	updateProductValidator,
	stockAdjustmentProductValidator,
	priceAdjustmentProductValidator,
	productFileValidator
} from '../validators/productValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import ProductController from '../controllers/ProductController.js'



const productRouter = express.Router()
const productController = new ProductController();

productRouter.get('/', 
	checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]), 
	productController.getAllProducts
)
productRouter.get('/:id', 
	checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]), 
	checkProductIdValidator, 
	checkValidationMiddleware,
	productController.getProductById
)

productRouter.post('/', 
	checkRoleMiddleware([Role.ADMIN]), 
	createProductValidator, 
	checkValidationMiddleware,
	productController.createProduct
)
productRouter.put('/:id', 
	checkRoleMiddleware([Role.ADMIN]), 
	checkProductIdValidator, 
	updateProductValidator, 
	checkValidationMiddleware,
	productController.updateProduct
)
productRouter.patch('/:id/change-status', 
	checkRoleMiddleware([Role.ADMIN]), 
	checkProductIdValidator, 
	checkValidationMiddleware,
	productController.changeStatusProduct
)
productRouter.patch('/:id/adjustment/stock', 
	checkRoleMiddleware([Role.ADMIN]), 
	checkProductIdValidator, 
	stockAdjustmentProductValidator, 
	checkValidationMiddleware,
	productController.stockAdjustment
)
productRouter.patch('/:id/adjustment/price', 
	checkRoleMiddleware([Role.ADMIN]), 
	checkProductIdValidator, 
	priceAdjustmentProductValidator, 
	checkValidationMiddleware,
	productController.priceAdjustment
)

productRouter.post('/:id/files', 
	checkRoleMiddleware([Role.ADMIN]), 
	checkProductIdValidator, 
	productFileValidator, 
	checkValidationMiddleware,
	productController.uploadProductFile
)
productRouter.delete('/:id/files/:fileId', 
	checkRoleMiddleware([Role.ADMIN]), 
	checkProductIdValidator, 
	checkProductImageIdValidator, 
	checkValidationMiddleware,
	productController.deleteProductFile
)


export default productRouter