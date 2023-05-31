import {Sequelize} from 'sequelize'	

import {Role, User, ProductImage} from '../models/index.js'
import BaseController from './BaseController.js'

import path from "path"
import { fileURLToPath } from 'url'
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..') /*mendapatkan path 1 tingkat diatas ini*/

class UtilityController extends BaseController {

	async showFile(req, res) {
		try {

			if (req.params.type == "productImage") {
				const image = await ProductImage.findByPk(req.params.id)
			    if (!image) {
			     	super.sendResponse(res, 404, "Data Gambar tidak ditemukan", null)
			    }
			    else{
			    	res.type(image.mimetype).sendFile(__dirname + '/' + image.path)
			    }
			}
			else {
				super.sendResponse(res, 404, "Tipe File tidak dikenali", null)
			}
		} 
		catch(error) {
		    super.handleServerError(req, res, error)
		}
	}
}

export default UtilityController