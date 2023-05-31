import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function checkAuthMiddleware(req, res, next) {
	
	/*jika token dikirim lewat header*/
    if (req.headers.authorization) {
    	const authorizationHeader = req.headers.authorization
    	if (authorizationHeader.startsWith('Bearer ')) {
    		const token = authorizationHeader.substring(7);
	        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedPayload) => {
			    if (error) {
			        res.status(401).json({ 
			        	code: 401,
	      				success: false,
			        	message: 'Token tidak valid' 
			        })
			    } else {
			        req.userData = decodedPayload	/* push data ke request (untuk bisa digunakan kemudian) */

			        next()
			    }
		    })
    	}
    	else {
    		res.status(401).json({ 
	        	code: 401,
				success: false,
	        	message: 'Token tidak valid' 
	        })
    	}
	}

	/*jika token dikirim lewat query param (untuk api show file) */
	else if(req.query.token) {
		const token = req.query.token
		jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedPayload) => {
		    if (error) {
		        res.status(401).json({ 
		        	code: 401,
      				success: false,
		        	message: 'Token tidak valid' 
		        })
		    } else {
		        req.userData = decodedPayload

		        next()
		    }
	    })
	}


	else {
	    return res.status(401).json({ 
        	code: 401,
			success: false,
        	message: 'Unauthorized'
        })
	}
}

export default checkAuthMiddleware