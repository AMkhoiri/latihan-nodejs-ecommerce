import express from 'express'
import multer from 'multer'

import userRouter from './routes/userRoutes.js'

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().any('file'))

app.use(userRouter)




app.use("/", (req, res) => {
    res.send("Route tidak ditemukan")
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});