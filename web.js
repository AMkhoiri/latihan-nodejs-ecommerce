import express from 'express'
import path from "path"
import { fileURLToPath } from 'url'

const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.get("/landing-page", (req, res) => {
  	res.sendFile('./landing-page.html', {root: __dirname})
})


app.listen(3001, () => console.log('Server started on port 3001'))