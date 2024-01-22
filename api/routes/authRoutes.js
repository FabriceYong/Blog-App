import express from 'express'
import { logout, login, register, google } from '../controllers/authControllers.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/google', google)
router.post('/logout', logout)

export default router