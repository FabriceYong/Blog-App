import express from 'express'
import { verifyToken } from '../middleware/jwt_middleware.js'
import { create, deletePost, getPosts, updatePost } from '../controllers/postsController.js'

const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/get-posts', getPosts)
router.delete('/delete-post/:postId/:userId', verifyToken, deletePost)
router.put('/update-post/:postId/:userId', verifyToken, updatePost)

export default router