import express from 'express'

import {
	checkUserIdValidator,
	createUserValidator,
	updateUserValidator
} from '../validators/userValidator.js'
import checkValidationMiddleware from '../middlewares/checkValidationMiddleware.js'
import UserController from '../controllers/UserController.js'



const userRouter = express.Router()
const userController = new UserController();

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', checkUserIdValidator, checkValidationMiddleware, userController.getUserById)
userRouter.post('/', createUserValidator, checkValidationMiddleware, userController.createUser)
userRouter.put('/:id', checkUserIdValidator, checkValidationMiddleware, updateUserValidator, userController.updateUser)
userRouter.patch('/:id/change-status', checkUserIdValidator, checkValidationMiddleware, userController.changeStatusUser)


export default userRouter 