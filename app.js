import express from 'express'
import multer from 'multer'

import {Role} from './models/index.js'

import authRouter from './routes/authRoutes.js'
import referenceRouter from './routes/referenceRoutes.js'
import userRouter from './routes/userRoutes.js'
import brandRouter from './routes/brandRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'

import utilityRouter from './routes/utilityRoutes.js'

import checkAuthMiddleware from './middlewares/checkAuthMiddleware.js'
import checkRoleMiddleware from './middlewares/checkRoleMiddleware.js'
import sanitizerMiddleware from './middlewares/sanitizerMiddleware.js'


const app = express()

/* set middleware for parsing HTTP content */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().any('file'))

/* set middleware for all routes */
app.use(sanitizerMiddleware)

/* auth routes */
app.use('/auth', authRouter)

/* set middleware for all main & utility routes */
app.use(checkAuthMiddleware)

/* main routes */
app.use('/users', checkRoleMiddleware([Role.ADMIN]), userRouter)
app.use('/brands', checkRoleMiddleware([Role.ADMIN]), brandRouter)
app.use('/categories', checkRoleMiddleware([Role.ADMIN]), categoryRouter)
app.use('/products', productRouter)
app.use('/utility', utilityRouter)

/* utility routes */
app.use('/references', checkRoleMiddleware([Role.ADMIN, Role.CUSTOMER]), referenceRouter)




app.use("/", (req, res) => {
    res.status(404).json({
    	code: 404,
      	success: false,
      	message: "Route tidak ditemukan"
    });
})




app.listen(3000, () => {
  console.log('Server started on port 3000');
});