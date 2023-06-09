import {validationResult} from 'express-validator'

import Response from '../helpers/Response.js'

function checkValidationMiddleware(req, res, next) {
  
    const errors = validationResult(req)

	if (!errors.isEmpty()) {
		Response.validationError(res, errors.array())
	}
	else {
		next()
	}
}

export default checkValidationMiddleware