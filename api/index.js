import express from 'express'
import connectDB from './utils/db.js'
import 'dotenv/config.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'


const app = express()
const port = process.env.PORT || 8000

// connection function
connectDB()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//routes
app.use('/api/auth', authRoutes)


//cors
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// error status handler
app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    const message = err.message || 'Sorry! something went wrong'

    return res.status(statusCode).json({ message: message })
})

app.listen(port, () => console.log(`Listing on port ${port}`))
