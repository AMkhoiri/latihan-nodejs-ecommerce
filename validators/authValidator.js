import {param, body} from 'express-validator'
import {Op} from 'sequelize'

import {Role, User} from '../models/index.js'


const registerValidator = [
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
		.isLength({min: 6}).withMessage('Password minimal berisi 6 karakter')
]

const loginValidator = [
	body('username')
		.notEmpty().withMessage('Username wajib diisi')
		.custom(async (value) => {
			const existsUser = await User.findOne({where : {
				username: value,
			}})
			if (!existsUser) throw new Error('User tidak ditemukan')
			return true
		}),
	body('password')
		.notEmpty().withMessage('Password wajib diisi')
]


export {
	registerValidator,
	loginValidator
}