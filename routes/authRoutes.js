import express from 'express'

import { 
	registerValidator, 
	loginValidator 
} from '../validators/authValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import AuthController from '../controllers/AuthController.js'



const authRouter = express.Router()
const authController = new AuthController();

authRouter.post('/register', 
	registerValidator, 
	checkValidationMiddleware, 
	authController.register
)
authRouter.post('/login', 
	loginValidator, 
	checkValidationMiddleware, 
	authController.login
)


export default authRouter