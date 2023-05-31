import express from 'express'

import UtilityController from '../controllers/UtilityController.js'

/* Router */

const utilityRouter = express.Router()
const utilityController = new UtilityController();

utilityRouter.get('/show-file/:type/:id', utilityController.showFile);


export default utilityRouter