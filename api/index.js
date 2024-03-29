import express from 'express'
import connectDB from './utils/db.js'
import 'dotenv/config.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'

//routes
import authRoutes from './routes/authRoutes.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import commentRoute from './routes/commentRoute.js'


const app = express()
const port = process.env.PORT || 8000

// connection function
connectDB()

const __dirname = path.resolve()
//cors
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "http://localhost:5173", credentials: true})
    next()
})


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', index.html))
})

// error status handler
app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    const message = err.message || 'Sorry! something went wrong'

    return res.status(statusCode).json({ success: false, message: message, statusCode })
})

app.listen(port, () => console.log(`Listing on port ${port}`))
