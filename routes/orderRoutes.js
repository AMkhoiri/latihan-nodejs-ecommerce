import express from 'express'

import { 
	checkOrderIdValidator,
	getAllOrdersValidator,
	getShippingCostValidator,
	checkoutValidator,
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
	getShippingCostValidator,
	checkValidationMiddleware,
	orderController.getShippingCost
)
orderRouter.post('/', 
	checkoutValidator,
	checkValidationMiddleware,
	orderController.checkout
)


export default orderRouter