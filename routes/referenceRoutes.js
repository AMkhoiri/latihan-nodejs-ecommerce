import express from 'express'

import {Role, User} from '../models/index.js'
import DataReferenceController from '../controllers/dataReferenceController.js'


/* Router */

const referenceRouter = express.Router()
const dataReferenceController = new DataReferenceController;

referenceRouter.get('/role', dataReferenceController.role)
referenceRouter.get('/user', dataReferenceController.user)


export default referenceRouter 