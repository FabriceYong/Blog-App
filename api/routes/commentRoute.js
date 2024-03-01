import express from 'express'
import { verifyToken } from '../middleware/jwt_middleware.js'
import { createComment, getComments, likeComment } from '../controllers/commentController.js'

const router = express.Router()

router.post('/create-comment', verifyToken, createComment)
router.get('/get-comments/:postId', getComments)
router.put('/like-comment/:commentId', verifyToken, likeComment)


export default router