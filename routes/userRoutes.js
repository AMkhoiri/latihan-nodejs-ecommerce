import express from 'express'
import {param, body} from 'express-validator'
import {Op} from 'sequelize'

import {Role, User} from '../models/index.js'
import UserController from '../controllers/UserController.js'


/* params Validator */

const checkUserIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID User wajib diisi')
		.custom(async (value) => {
			const user = await User.findByPk(value)
			if (!user) throw new Error('Data User tidak ditemukan')
			return true
		})
]

/* body Validator */

const createUserValidator = [
	body('name')
		.notEmpty().withMessage('Nama wajib diisi'),
	body('username')
		.notEmpty().withMessage('Username wajib diisi')
		.custom(async (value) => {
			const existsUsername = await User.findOne({where : {username: value}})
			if (existsUsername) throw new Error('Username sudah digunakan')
			return true
		}),
	body('password')
		.notEmpty().withMessage('Password wajib diisi')
		.isLength({min: 6}).withMessage('Password minimal berisi 6 karakter'),
	body('roleId')
		.notEmpty().withMessage('Role wajib dipilih')
		.custom(async (value) => {
			const existsRole = await Role.findByPk(value)
			if (!existsRole) throw new Error('Role tidak ditemukan')
			return true
		})
]

const updateUserValidator = [
	body('name')
		.notEmpty().withMessage('Nama wajib diisi'),
	body('username')
		.notEmpty().withMessage('Username wajib diisi')
		.custom(async (value, { req }) => {
			const existsUsername = await User.findOne({where : {
				username: value,
				id: {
					[Op.ne]: req.params.id
				}
			}})
			if (existsUsername) throw new Error('Username sudah digunakan')
			return true
		}),
	body('roleId')
		.notEmpty().withMessage('Role wajib dipilih')
		.custom(async (value) => {
			const existsRole = await Role.findByPk(value)
			if (!existsRole) throw new Error('Role tidak ditemukan')
			return true
		})
]



/* Router */

const userRouter = express.Router()
const userController = new UserController();

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', checkUserIdValidator, userController.getUserById)
userRouter.post('/', createUserValidator, userController.createUser)
userRouter.put('/:id', checkUserIdValidator, updateUserValidator, userController.updateUser)
userRouter.put('/:id/change-status', checkUserIdValidator, userController.changeStatusUser)

export default userRouter 