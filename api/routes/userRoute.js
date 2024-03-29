import express from 'express'
import { updateUser, deleteUser, getUsers, getUser } from '../controllers/userController.js'
import { verifyToken } from '../middleware/jwt_middleware.js'

const router = express.Router()

router.get('/get-users', verifyToken, getUsers)
router.put('/update/:userId',verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.get('/:userId', getUser)


export default router