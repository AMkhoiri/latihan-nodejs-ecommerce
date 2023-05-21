import express from 'express'
import multer from 'multer'

import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'

import checkAuthMiddleware from './middlewares/checkAuthMiddleware.js'
import checkRoleMiddleware from './middlewares/checkRoleMiddleware.js'

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().any('file'))


/* auth routes */
app.use('/auth', authRouter)

/* middleware for main routes*/
app.use(checkAuthMiddleware)

/* main routes */
app.use('/users', checkRoleMiddleware(1), userRouter)





app.use("/", (req, res) => {
    res.send("Route tidak ditemukan")
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});