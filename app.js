import express from 'express'
import multer from 'multer'

import authRouter from './routes/authRoutes.js'
import referenceRouter from './routes/referenceRoutes.js'
import userRouter from './routes/userRoutes.js'

import checkAuthMiddleware from './middlewares/checkAuthMiddleware.js'
import checkRoleMiddleware from './middlewares/checkRoleMiddleware.js'

const app = express()

/* set middleware for parsing HTTP content */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().any('file'))


/* auth routes */
app.use('/auth', authRouter)

/* set middleware for all main & utility routes */
app.use(checkAuthMiddleware)

/* main routes */
app.use('/users', checkRoleMiddleware([1]), userRouter)

/* utility routes */
app.use('/references', checkRoleMiddleware([1,2]), referenceRouter)




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