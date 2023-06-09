import validator from 'validator';

function sanitizerMiddleware(req, res, next) {
	for (let key in req.body) {
		if (typeof req.body[key] === 'string') {
			req.body[key] = validator.escape(validator.trim(req.body[key]))
		}
	}

	next()
}

export default sanitizerMiddleware