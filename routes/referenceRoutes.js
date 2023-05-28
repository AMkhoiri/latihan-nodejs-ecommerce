import express from 'express'

import DataReferenceController from '../controllers/DataReferenceController.js'


/* Router */

const referenceRouter = express.Router()
const dataReferenceController = new DataReferenceController;

referenceRouter.get('/role', dataReferenceController.role)
referenceRouter.get('/user', dataReferenceController.user)
referenceRouter.get('/category', dataReferenceController.category)
referenceRouter.get('/brand', dataReferenceController.brand)


export default referenceRouter 