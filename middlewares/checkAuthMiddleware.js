import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function checkAuthMiddleware(req, res, next) {
	const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.substring(7);
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedPayload) => {
		    if (error) {
		        return res.status(401).json({ message: 'Token tidak valid' });
		    } else {
		        req.userData = decodedPayload	/* push data ke request (untuk bisa digunakan kemudian) */

		        next()
		    }
	    });
	}
	else {
	    return res.status(401).json({ message: 'Token tidak valid' });
	}
}

export default checkAuthMiddleware