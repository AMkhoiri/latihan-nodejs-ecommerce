import express from 'express'

import { 
	checkCartItemIdValidator,
	addToCartValidator, 
	addNoteToCartItemValidator, 
	updateQuantityValidator
} from '../validators/cartValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import CartController from '../controllers/CartController.js'



const cartRouter = express.Router()
const cartController = new CartController()

cartRouter.get('/', 
	cartController.showMyCart
)
cartRouter.post('/', 
	addToCartValidator,
	checkValidationMiddleware,
	cartController.addToCart
)
cartRouter.patch('/:id/note',
	checkCartItemIdValidator,
	addNoteToCartItemValidator,
	checkValidationMiddleware,
	cartController.addNote
)
cartRouter.patch('/:id/quantity',
	checkCartItemIdValidator,
	updateQuantityValidator,
	checkValidationMiddleware,
	cartController.updateQuantity
)
cartRouter.delete('/:id',
	checkCartItemIdValidator,
	checkValidationMiddleware,
	cartController.deleteCartItem
)


export default cartRouter