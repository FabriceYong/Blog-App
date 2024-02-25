import handleError from "../config/errorHandler.js"
import bcrypt from 'bcrypt'
import User from "../models/userModel.js"

export const updateUser = async (req, res, next) => {

    if(req.user.id !== req.params.userId) return next(handleError(403, 'You are not allowed to update this user'))



    if(req.body.password?.length < 6) return next(handleError(400, 'Password must be at least 6 characters'))

    if(req.body.password) {
        const salt = bcrypt.genSaltSync(10)
        req.body.password = bcrypt.hashSync(req.body.password, salt)
    }

    if(req.body.username?.includes(' ')) return next(handleError(400, 'Username must not contain spaces'))

    if(req.body.username?.length < 7 || req.body.username?.length > 25) return next(handleError(400, 'Username must be between 7 and 20 characters'))

    if(req.body.username !== req.body.username?.toLowerCase()) return next(handleError(403, 'Username must be in lowercase'))

    if(!req.body.username?.match(/^[a-zA-Z0-9]+$/)) return next(handleError(400, 'Username must not contain special characters & must be in lowercase'))

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                photo: req.body.photo
            },
        }, { new: true })
        const { password: pass, rest } = updatedUser._doc
        res.status(200).json(rest)

    }catch(error) {
        next(error)
    }
} 

// delete user controller
export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId) return next(handleError(403,'You are not allowed to delete this account' ))

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User account deleted')
    } catch (error) {
        next(error)
    }
}

// get users controller
export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin) return next(handleError(403, 'You are not allowed to view users'))

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit)

        // remove password from the rest of the user doc
        const userWithoutPassword = users.map((user) => {
            const { password, ...rest} = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        // get last months users
        const lastMonthsUsers = await User.countDocuments({
            createdAt: {$gt: oneMonthAgo}
        })

        res.status(200).json({
            users: userWithoutPassword,
            totalUsers,
            lastMonthsUsers
        })
    } catch (error) {
        next(error)
    }
}
