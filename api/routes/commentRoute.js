import express from 'express'
import { verifyToken } from '../middleware/jwt_middleware.js'
import { createComment } from '../controllers/commentController.js'

const router = express.Router()

router.post('/create-comment', verifyToken, createComment)
