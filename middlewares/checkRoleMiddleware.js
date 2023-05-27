import jwt from 'jsonwebtoken'

function checkRoleMiddleware(roleIds) {
  return function(req, res, next) {

    const userRoleId = req.userData.roleId 	/* req.userData ini di set dari middleware "checkAuthMiddleware" */

    if (roleIds.includes(userRoleId)) {
      next()
    } 
    else {
       res.status(403).json({ message: 'Anda tidak diizinkan mengakses rute ini' });
    }
  }
}

export default checkRoleMiddleware