import express from 'express'
import { verifyToken } from '../middleware/jwt_middleware.js'
import { createComment, getComments, likeComment, editComment } from '../controllers/commentController.js'

const router = express.Router()

router.post('/create-comment', verifyToken, createComment)
router.get('/get-comments/:postId', getComments)
router.put('/like-comment/:commentId', verifyToken, likeComment)
router.put('/edit-comment/:commentId', verifyToken, editComment)


export default router