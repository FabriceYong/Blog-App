import express from 'express'
import { verifyToken } from '../middleware/jwt_middleware.js'
import { createComment, getPostComments, likeComment, editComment, deleteComment, getComments } from '../controllers/commentController.js'

const router = express.Router()

router.post('/create-comment', verifyToken, createComment)
router.get('/get-comments/:postId', getPostComments)
router.put('/like-comment/:commentId', verifyToken, likeComment)
router.put('/edit-comment/:commentId', verifyToken, editComment)
router.delete('/delete-comment/:commentId', verifyToken, deleteComment)
router.get('/get-comments', verifyToken, getComments)


export default router