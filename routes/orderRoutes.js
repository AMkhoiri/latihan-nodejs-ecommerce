import express from 'express'

import {Role} from '../models/index.js'
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js'
import { 
	getAllOrdersValidator,
	getOrderValidator,
	getShippingCostValidator,
	checkoutValidator,
	payValidator,
	paymentConfirmationValidator,
	receiptConfirmationValidator,
	cancelValidator
} from '../validators/orderValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import OrderController from '../controllers/OrderController.js'



const orderRouter = express.Router()
const orderController = new OrderController()

orderRouter.get('/',
	checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]),
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
orderRouter.get('/:id', 
	checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]),
	getOrderValidator,
	checkValidationMiddleware,
	orderController.getOrderById
)
orderRouter.post('/:id/cancel', 
	checkRoleMiddleware([Role.CUSTOMER]),
	cancelValidator,
	checkValidationMiddleware,
	orderController.cancel
)
orderRouter.post('/:id/pay', 
	checkRoleMiddleware([Role.CUSTOMER]), 
	payValidator,
	checkValidationMiddleware,
	orderController.pay
)
orderRouter.post('/:id/payment-confirmation', 
	checkRoleMiddleware([Role.ADMIN]),
	paymentConfirmationValidator,
	checkValidationMiddleware,
	orderController.paymentConfirmation
)
orderRouter.post('/:id/receipt-confirmation', 
	checkRoleMiddleware([Role.CUSTOMER]),
	receiptConfirmationValidator,
	checkValidationMiddleware,
	orderController.receiptConfirmation
)


export default orderRouter