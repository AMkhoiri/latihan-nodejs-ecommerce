import path from "path"
import { fileURLToPath } from 'url'

import {ProductImage, OrderPaymentEvidence} from '../models/index.js'
import BaseController from './BaseController.js'

import Response from '../helpers/Response.js'

const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..') /*mendapatkan path 1 tingkat diatas ini*/

class UtilityController extends BaseController {

	async showFile(req, res) {
		try {
			if (req.params.type == "productImage") {
				const image = await ProductImage.findByPk(req.params.id)

			    if (!image) {
			     	Response.send(res, 404, "Data Gambar tidak ditemukan", null)
			    }
			    else{
			    	res.type(image.mimetype).sendFile(__dirname + '/' + image.path)
			    }
			}
			else if (req.params.type == "orderPaymentEvidence") {
				const image = await OrderPaymentEvidence.findByPk(req.params.id)

			    if (!image) {
			     	Response.send(res, 404, "Data Gambar tidak ditemukan", null)
			    }
			    else{
			    	res.type(image.mimetype).sendFile(__dirname + '/' + image.path)
			    }
			}
			else {
				Response.send(res, 404, "Tipe File tidak dikenali", null)
			}
		} 
		catch(error) {
		    Response.serverError(req, res, error)
		}
	}
}

export default UtilityController