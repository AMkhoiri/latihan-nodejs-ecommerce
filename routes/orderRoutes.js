import express from 'express'

import { 
	checkOrderIdValidator,
	checkoutValidator,
} from '../validators/orderValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import OrderController from '../controllers/OrderController.js'



const orderRouter = express.Router()
const orderController = new OrderController()

// orderRouter.get('/', 
// 	orderController.
// )
orderRouter.post('/', 
	checkoutValidator,
	checkValidationMiddleware,
	orderController.checkout
)


export default orderRouter