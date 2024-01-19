import express from 'express'
import connectDB from './utils/db.js'
import 'dotenv/config.js'
import cors from 'cors'
import bodyParser from 'body-parser'


const app = express()
const port = process.env.PORT || 8000

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/test', (req, res) => {
    res.send({ message: "Welcome to my blog-post backend"})
})


app.listen(port, () => console.log(`Listing on port ${port}`))