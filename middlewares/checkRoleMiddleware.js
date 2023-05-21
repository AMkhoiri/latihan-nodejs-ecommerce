import jwt from 'jsonwebtoken'

function checkRoleMiddleware(roleId) {
  return function(req, res, next) {

    const userRoleId = req.userData.roleId 	/* req.userData ini di set dari middleware "checkAuthMiddleware" */

    if (userRoleId === roleId) {
      next()
    } 
    else {
      return res.status(403).json({ message: 'Anda tidak diizinkan mengakses rute ini' });
    }
  }
}

export default checkRoleMiddleware