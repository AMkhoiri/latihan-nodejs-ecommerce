import express from 'express'

import {Role} from '../models/index.js'
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js'
import { 
	getAllOrdersValidator,
	getShippingCostValidator,
	checkoutValidator,
	orderPaymentEvidenceValidator
} from '../validators/orderValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import OrderController from '../controllers/OrderController.js'



const orderRouter = express.Router()
const orderController = new OrderController()

orderRouter.get('/', 
	getAllOrdersValidator,
	checkValidationMiddleware,
	orderController.getAllOrders
)
orderRouter.post('/shipping-cost', 
	checkRoleMiddleware([Role.CUSTOMER]), 
	getShippingCostValidator,
	checkValidationMiddleware,
	orderController.getShippingCost
)
orderRouter.post('/', 
	checkRoleMiddleware([Role.CUSTOMER]), 
	checkoutValidator,
	checkValidationMiddleware,
	orderController.checkout
)
orderRouter.post('/:id/pay', 
	checkRoleMiddleware([Role.CUSTOMER]), 
	orderPaymentEvidenceValidator,
	checkValidationMiddleware,
	orderController.pay
)


export default orderRouter