import express from 'express'
import {param, body} from 'express-validator'
import {Op} from 'sequelize'

import {Role, User} from '../models/index.js'
import UserController from '../controllers/UserController.js'


/* Validator */

const getUserValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID User wajib diisi')
		.custom(async (value) => {
			const user = await User.findByPk(value)
			if (!user) throw new Error('Data User tidak ditemukan')
			return true
		})
]

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
	param('id')
		.notEmpty().withMessage('Parameter ID User wajib diisi')
		.custom(async (value) => {
			const userToUpdate = await User.findByPk(value)
			if (!userToUpdate) throw new Error('Data User tidak ditemukan')
			return true
		}),
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

const changeStatusUserValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID User wajib diisi')
		.custom(async (value) => {
			const userToChange = await User.findByPk(value)
			if (!userToChange) throw new Error('Data User tidak ditemukan')
			return true
		})
]


const additionalMiddleware = (req, res, next) => {
	console.log('asdasdasda')
	next()
}
/* Router */

const userRouter = express.Router()
const userController = new UserController();

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', getUserValidator, userController.getUserById)
userRouter.post('/', createUserValidator, userController.createUser)
userRouter.put('/:id', updateUserValidator, userController.updateUser)
userRouter.put('/:id/change-status', changeStatusUserValidator, userController.changeStatusUser)

export default userRouter 